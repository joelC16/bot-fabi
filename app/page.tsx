"use client"

import { useState, useEffect, useRef, SetStateAction } from "react"
import { flows, type Question } from "@/lib/flows"
// import { flows, type Question } from "@/lib/flows copy"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { Avatar } from "@radix-ui/react-avatar"

export default function Chat() {
  const [messages, setMessages] = useState<{ id: string; text: string; isUser: boolean }[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [flow, setFlow] = useState(flows.general)
  const [stepIndex, setStepIndex] = useState(0)
  const [errorInput, setErrorInput] = useState("")

  const [formData, setFormData] = useState<Record<string, any>>({})
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const currentQuestion: Question | undefined = flow.questions[stepIndex]

  useEffect(() => {
    // Mensaje inicial personalizado
    setMessages([
      {
        id: `bot-welcome`,
        text: "Hola! 😊 Completa este breve form para conocer mejor tu caso y negocio, y aplicar para que te ayudemos a posicionar y escalar tu Marca Personal🚀   Si vemos que podemos ayudarte, mi equipo te contactará para contarte los próximos pasos.✨   PD: Sólo podremos plantear tu plan de acción, si llegas hasta el final. Por ello, no abandones esta ventana hasta completar el proceso.  ",
        isUser: false,
      },
    ])
  }, [])


  useEffect(() => {
    if (currentQuestion) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${crypto.randomUUID()}`,
          text: currentQuestion.question,
          isUser: false,
        },
      ])
    }
  }, [stepIndex, flow])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleAnswer = async (answer: string) => {
    const userMsg = {
      id: `user-${crypto.randomUUID()}`,
      text: answer,
      isUser: true,
    }
  
    setMessages((prev) => [...prev, userMsg])
    const updatedFormData = { ...formData, [currentQuestion?.field || `field${stepIndex}`]: answer }
    setFormData(updatedFormData)
  
    let nextStep = ""
  
    if (typeof currentQuestion?.next === "function") {
      nextStep = currentQuestion.next(answer, formData)
    } else {
      nextStep = currentQuestion?.next || ""
    }
  
    // Verificamos si la siguiente pregunta es la del tipo "end"
    const nextFlow = flows[nextStep] || flow
    const nextIndex = nextFlow === flow
      ? nextFlow.questions.findIndex((q) => q.step === nextStep)
      : 0
  
    const nextQuestion = nextFlow.questions[nextIndex]

    const WEBHOOK_URL = "https://neuralgeniusai.com/webhook-test/fabiData"
  
    if (nextQuestion?.type === "end") {
      // Enviamos los datos a n8n
      try {
        await fetch(WEBHOOK_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedFormData),
          mode: "no-cors",
        })
        console.log("Datos enviados a n8n correctamente.")
      } catch (error) {
        console.error("Error al enviar datos a n8n:", error)
      }
    }
  
    if (nextFlow !== flow) {
      setFlow(nextFlow)
    }
    setStepIndex(nextIndex)
  }


  // Validando y enviando mensajes
  const isValidInput = (
    value: string,
    type: string,
    customRegex?: RegExp
  ): boolean => {
    if (customRegex) return customRegex.test(value)

    switch (type) {
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      case "tel":
        return /^\+?[1-9]\d{6,14}$/.test(value) // Básico: 7-15 números, opcional "+"
      case "text":
      default:
        return true // por defecto, cualquier texto es válido si no hay regex
    }
  }

  // Mensajes personalizados por campo
  const getErrorMessage = (question: Question): string => {
    const messages: Record<string, string> = {
      email: "Por favor, ingresá un email válido.",
      whatsapp: "Ingresá un número válido.",
      nombre: "Tu nombre debe tener al menos 3 letras.",
      ciudad: "Ingresá una ciudad válida.",
    }

    return messages[question.field ?? ""] || "Este campo no es válido."
  }

  const handleSubmit = () => {
    const value = inputValue.trim()
    if (!value) return

    if (!isValidInput(value, currentQuestion.type || "text", currentQuestion.validation)) {
      setErrorInput(getErrorMessage(currentQuestion))
      return
    }
    handleAnswer(inputValue.trim())
    setInputValue("")
  }

  const renderInput = () => {
    switch (currentQuestion.type) {
      case "multipleChoice":
        return (
          <div className="px-4 pb-2 z-10 bg-white flex flex-wrap items-center gap-2">
            {currentQuestion?.multipleChoice?.map((option, i) => (
              <button
                key={i}
                className="px-4 py-2 bg-[#2383A2] text-white rounded-md hover:bg-[#b4dbd7] transition text-left"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )
      case "tel":
        return (
          <PhoneInput
            containerClass="phone-dropdown-up flex-1"
            inputClass="rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-primary"
            value={inputValue}
            onChange={(e: SetStateAction<string>) => {
              setInputValue(e)
              setErrorInput("")
            }}
            placeholder={currentQuestion?.placeholder}
            disabled={isLoading}
            country={'ar'}
            enableSearch={true}
          />
        )
      case "email":
        return (
          <input
            key={currentQuestion?.id}
            type="email"
            className="w-full flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={currentQuestion?.placeholder || "Escribe tu respuesta..."}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setErrorInput("")
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            disabled={isLoading}
          />
        )
      case "end":
        return (
          <div className="absolute z-10 bg-white flex flex-col w-32 h-16">

          </div>
        )
      default:
        return (
          <input
            key={currentQuestion?.id}
            type="text"
            className="w-full flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={currentQuestion?.placeholder || "Escribe tu respuesta..."}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setErrorInput("")
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            disabled={isLoading}
          />
        )
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fdf4f2]">
      <div className=" p-4 m-auto flex flex-col max-w-3xl">
        <div className="bg-white rounded-xl shadow-md">
          <Image src={"logo.jfif"} alt="" width={200} height={200} className="w-full p-4 rounded-xl"></Image>
        </div>
      </div>


      <div className="flex-1 max-w-3xl w-full mx-auto p-4">
        <Card className="relative bg-white rounded-xl shadow-md p-6 mb-4 h-[60vh] flex flex-col overflow-y-auto">
          <div className="space-y-4 mb-4 flex-grow overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
              >
                {!msg.isUser && (
                  <Avatar className="rounded-full h-8 w-8 mr-2 bg-[#6D4C41] overflow-hidden">
                    <img src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                  </Avatar>
                )}
                <Card className={`max-w-[80%] p-3 rounded-lg ${msg.isUser ? "bg-[#FFC969] text-[#545454]" : "bg-[#F89082] "
                  }`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </Card>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <Avatar className="h-8 w-8 mr-2 bg-[#6D4C41]">
                  <img src="/placeholder.svg?height=32&width=32" alt="Avatar" />
                </Avatar>
                <div className="max-w-[80%] p-3 rounded-lg bg-muted">
                  <div className="flex space-x-2">
                    <div
                      className="w-2 h-2 rounded-full bg-[#6D4C41] animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-[#6D4C41] animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full bg-[#6D4C41] animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="w-full flex flex-col items-center gap-2">
            <div className="w-full flex items-center gap-2">
              {renderInput()}
              <Button onClick={handleSubmit} disabled={isLoading || !inputValue.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {errorInput && (
              <p className="text-red-500 text-sm mt-1 ml-2">{errorInput}</p>
            )}

          </form>
        </Card>

      </div>


    </div>

  )
}
