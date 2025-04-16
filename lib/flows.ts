export type Question = {
  id: number;
  step: string;
  question: string;
  multipleChoice?: string[];
  placeholder?: string;
  field?: string;
  type?: string;
  validation?: RegExp;
  next: string | ((answer: string, formData: Record<string, any>) => string);
};

type Flow = {
  name: string;
  questions: Question[];
};

export const flows: Record<string, Flow> = {
  general: {
    name: "general",
    questions: [
      {
        id: 0,
        step: "inicio",
        question: "¿Lista? Primero, cuéntame tu nombre👇🏼",
        field: "nombre",
        placeholder: "Escribí tu nombre",
        type: "nombre",
        next: "telefono",
      },
      {
        id: 1,
        step: "telefono",
        question: `Genial {{nombre}} 🤩 ¿Cuál es tu número de WhatsApp?\nEste se usará solo para confirmar la sesión. Si el número es inválido o no responde, se cancelará.`,
        field: "whatsapp",
        placeholder: "Escribí tu número",
        type: "tel",
        next: "correo",
      },
      {
        id: 2,
        step: "correo",
        question: "Cuéntame tu mejor correo electrónico 👇🏼",
        field: "email",
        placeholder: "Escribí tu correo",
        // validation: /^[a-zA-Z0-9](\.?[a-zA-Z0-9_+-])*@gmail\.com$/,
        type: "email",
        next: "situacion",
      },
      {
        id: 3,
        step: "situacion",
        question: "¿Cuál de estas opciones describe mejor tu situación?👇🏼",
        field: "situacion",
        type: "multipleChoice",
        multipleChoice: [
          "Soy experta con experiencia hace varios años y me interesa crecer en ingresos. Estoy considerando un modelo de mentoría/programa grupal.",
          "Estoy iniciando en mi rubro, vendo servicios 1 a 1, me interesa saber cómo posicionarme y crecer.",
          "Estoy iniciando en mi rubro, me quiero lanzar con mi Marca Personal.",
          "Vendo productos y me interesa crecer en ventas.",
        ],
        next: (answer: string) => {
          if (answer.includes("experta")) return "flow_experta";
          if (answer.includes("servicios 1 a 1")) return "flow_impulso";
          if (answer.includes("Marca Personal")) return "flow_despegue";
          if (answer.includes("productos")) return "flow_ventas";
          return "";
        },
      },
    ],
  },

  flow_experta: {
    name: "flow_experta",
    questions: [
      {
        id: 0,
        step: "rubro",
        question: "¿En qué rubro estás? 📌Ejemplo: Soy Health Coach.",
        field: "rubro",
        placeholder: "Escribí tu rubro",
        type: "rubro",
        next: "instagram",
      },
      {
        id: 1,
        step: "instagram",
        question:
          "¿Cuál es tu Instagram? 📲 📌Ejemplo: @fabimersan\nSe usará para auditar tu cuenta.",
        field: "instagram",
        placeholder: "@usuario",
        type: "instagram",
        next: "facturacion",
      },
      {
        id: 2,
        step: "facturacion",
        question:
          "¿En qué rango de facturación se encuentra tu negocio? (Promedio de los últimos 2 meses) Selecciona una opción:",
        field: "facturacion",
        type: "multipleChoice",
        multipleChoice: [
          "Menos de $1000usd por mes",
          "Entre $1000usd y $3000usd por mes",
          "Entre $3000usd y $5000usd por mes",
          "Arriba de los $5000usd por mes",
        ],
        next: "prioridad",
      },
      {
        id: 3,
        step: "prioridad",
        question:
          "¿Qué tan prioritario es para ti lanzar tu programa de alto impacto con tu marca personal? selecciona una opción:",
        field: "prioridad",
        type: "multipleChoice",
        multipleChoice: [
          "Quiero hacerlo en los próximos 3 meses",
          "Quiero hacerlo en los próximos 6 meses",
          "Me interesa solo explorar la idea para implementarla al año",
        ],
        next: "idea",
      },
      {
        id: 4,
        step: "idea",
        question:
          "¿Ya tienes idea del tipo de programa o mentoría que quieres lanzar? Selecciona una opción:",
        field: "idea_programa",
        type: "multipleChoice",
        multipleChoice: [
          "No, quiero mentoría para poder descifrar eso y lanzar con éxito",
          "Sí, tengo una vaga idea de lo que quiero pero quiero que me guíen para aterrizarlo y lanzarlo con éxito",
        ],
        next: "implementacion",
      },
      {
        id: 5,
        step: "implementacion",
        question:
          "Genial! 💪🏼 Nuestro proceso de trabajo es  a través de formación y mentoría donde recibes acompañamiento guiado personalizado para que tú o tu equipo aprendan y puedan implementar la metodología probado para lograr el lanzamiento del programa grupal con éxito. ¿Estás dispuesto/a a poner el trabajo para implementar lo que aprendes y así ver los resultados?",
        field: "disposicion",
        type: "multipleChoice",
        multipleChoice: [
          "Sí, me interesa aprender con ustedes y recibir la guía para que lo ponga en práctica",
          "No, en este momento quiero que alguien lo implemente por mi",
        ],
        next: "inversion",
      },
      {
        id: 6,
        step: "inversion",
        question:
          "Nuestra mentoría no es barata, pero GARANTIZAMOS 100% (POR CONTRATO) a nuestras alumnas que sus resultados CRECERÁN. Habiendo mencionado eso, en caso de que el plan propuesto te encante... ¿Podrías disponer de al menos $1000usd para invertir y comenzar? Este no es el valor total del programa, es sólo un valor de referencia para iniciar con el proceso de mentoría. (No te preocupes que no se te cobrará nada en este momento. Nos aseguraremos de que estés seguro/a antes de tu inversión).",
        field: "inversion",
        type: "multipleChoice",
        multipleChoice: [
          "Sí, dispongo de al menos $1000usd para invertir en mi futuro",
          "No dispongo pero puedo conseguir/pedir prestado al menos $1000usd para invertir en mi futuro",
          "En este momento no dispongo ni puedo conseguirlo en el corto plazo",
        ],
        next: (answer: string) => {
          if (
            answer.includes(
              "Sí, dispongo de al menos $1000usd para invertir en mi futuro"
            ) ||
            answer.includes(
              "No dispongo pero puedo conseguir/pedir prestado al menos $1000usd para invertir en mi futuro"
            )
          ) {
            return "booking_page";
          } else {
            return "alternativa";
          }
        },
      },
      {
        id: 7,
        step: "booking_page",
        question: "booking page",
        field: "booking_page",
        type: "end",
        next: "",
      },
      {
        id: 8,
        step: "alternativa",
        question:
          "Entiendo, en este momento eso es lo mínimo que se requiere para empezar con el trabajo. Pero, no te preocupes! Tenemos otra opción...\n¿Querés trabajar en tu Marca Personal y posicionamiento en redes sociales?",
        field: "opcion_alternativa",
        type: "multipleChoice",
        multipleChoice: ["Sí, claro!", "En este momento no"],
        next: (answer: string) => {
          if (answer.includes("Sí")) return "vsl_club";
          return "free_resource";
        },
      },
      {
        id: 9,
        step: "vsl_club",
        question: "VSL CLUB",
        field: "vsl_club",
        type: "end",
        next: "",
      },
      {
        id: 10,
        step: "free_resource",
        question:
          "Súper válida tu respuesta ☺️ En ese caso te recomiendo que aproveches este recursos gratuito 🥳 (link)",
        field: "free_resource",
        type: "end",
        next: "",
      },
    ],
  },

  flow_impulso: {
    name: "flow_impulso",
    questions: [
      {
        id: 0,
        step: "rubro",
        question: "¿En qué rubro estás? 📌Ejemplo: Soy Health Coach.",
        field: "rubro",
        placeholder: "Escribí tu rubro",
        type: "rubro",
        next: "instagram_1",
      },
      {
        id: 1,
        step: "instagram_1",
        question: "¿Ya tienes un Instagram profesional?",
        field: "instagram_1",
        type: "multipleChoice",
        multipleChoice: [
          "Sí, ya lo tengo pero quiero que me ayuden a mejorarlo.",
          "No, es donde más apoyo necesito.",
        ],
        next: (answer: string) => {
          if (
            answer.includes(
              "Sí, ya lo tengo pero quiero que me ayuden a mejorarlo."
            )
          ) {
            return "instagram_2";
          } else {
            return "objetivo_prioritario";
          }
        },
      },
      {
        id: 2,
        step: "instagram_2",
        question:
          "¿Cuál es tu Instagram? 📲   📌Ejemplo: @fabimersan   Esto nos permitirá poder auditar brevemente tu cuenta y posicionamiento.  ",
        field: "instagram_2",
        type: "instagram",
        placeholder: "@usuario",
        next: "objetivo_prioritario",
      },
      {
        id: 3,
        step: "objetivo_prioritario",
        question:
          "¿Cuál es tu objetivo prioritario e inmediato en este momento?",
        field: "objetivo_prioridad",
        type: "multipleChoice",
        multipleChoice: [
          "Quiero explorar el modelo grupal para crecer en ingresos.",
          "Quiero posicionar mejor mi Marca Personal y aprender a moverme en redes para captar clientes allí.",
        ],
        next: (answer: string) => {
          if (
            answer.includes(
              "Quiero explorar el modelo grupal para crecer en ingresos."
            )
          ) {
            return "facturacion_experta";
          } else {
            return "facturación_impulso";
          }
        },
      },
      {
        id: 4,
        step: "facturacion_experta",
        question:
          "¿En qué rango de facturación se encuentra tu negocio? (Promedio de los últimos 2 meses) Selecciona una opción:",
        field: "facturacion",
        type: "multipleChoice",
        multipleChoice: [
          "Menos de $1000usd por mes",
          "Entre $1000usd y $3000usd por mes",
          "Entre $3000usd y $5000usd por mes",
          "Arriba de los $5000usd por mes",
        ],
        next: "prioridad",
      },
      {
        id: 5,
        step: "prioridad",
        question:
          "¿Qué tan prioritario es para ti lanzar tu programa de alto impacto con tu marca personal? selecciona una opción:",
        field: "prioridad",
        type: "multipleChoice",
        multipleChoice: [
          "Quiero hacerlo en los próximos 3 meses",
          "Quiero hacerlo en los próximos 6 meses",
          "Me interesa solo explorar la idea para implementarla al año",
        ],
        next: "idea",
      },
      {
        id: 6,
        step: "idea",
        question:
          "¿Ya tienes idea del tipo de programa o mentoría que quieres lanzar? Selecciona una opción:",
        field: "idea_programa",
        type: "multipleChoice",
        multipleChoice: [
          "No, quiero mentoría para poder descifrar eso y lanzar con éxito",
          "Sí, tengo una vaga idea de lo que quiero pero quiero que me guíen para aterrizarlo y lanzarlo con éxito",
        ],
        next: "implementacion",
      },
      {
        id: 7,
        step: "implementacion",
        question:
          "Genial! 💪🏼 Nuestro proceso de trabajo es  a través de formación y mentoría donde recibes acompañamiento guiado personalizado para que tú o tu equipo aprendan y puedan implementar la metodología probado para lograr el lanzamiento del programa grupal con éxito. ¿Estás dispuesto/a a poner el trabajo para implementar lo que aprendes y así ver los resultados?",
        field: "disposicion",
        type: "multipleChoice",
        multipleChoice: [
          "Sí, me interesa aprender con ustedes y recibir la guía para que lo ponga en práctica",
          "No, en este momento quiero que alguien lo implemente por mi",
        ],
        next: "inversion",
      },
      {
        id: 8,
        step: "inversion",
        question:
          "Nuestra mentoría no es barata, pero GARANTIZAMOS 100% (POR CONTRATO) a nuestras alumnas que sus resultados CRECERÁN. Habiendo mencionado eso, en caso de que el plan propuesto te encante... ¿Podrías disponer de al menos $1000usd para invertir y comenzar? Este no es el valor total del programa, es sólo un valor de referencia para iniciar con el proceso de mentoría. (No te preocupes que no se te cobrará nada en este momento. Nos aseguraremos de que estés seguro/a antes de tu inversión).",
        field: "inversion",
        type: "multipleChoice",
        multipleChoice: [
          "Sí, dispongo de al menos $1000usd para invertir en mi futuro",
          "No dispongo pero puedo conseguir/pedir prestado al menos $1000usd para invertir en mi futuro",
          "En este momento no dispongo ni puedo conseguirlo en el corto plazo",
        ],
        next: (answer: string) => {
          if (
            answer.includes(
              "Sí, dispongo de al menos $1000usd para invertir en mi futuro"
            ) ||
            answer.includes(
              "No dispongo pero puedo conseguir/pedir prestado al menos $1000usd para invertir en mi futuro"
            )
          ) {
            return "booking_page";
          } else {
            return "alternativa";
          }
        },
      },
      {
        id: 9,
        step: "booking_page",
        question: "booking page",
        field: "booking_page",
        type: "end",
        next: "",
      },
      {
        id: 10,
        step: "alternativa",
        question:
          "Entiendo, en este momento eso es lo mínimo que se requiere para empezar con el trabajo. Pero, no te preocupes! Tenemos otra opción...\n¿Querés trabajar en tu Marca Personal y posicionamiento en redes sociales?",
        field: "opcion_alternativa",
        type: "multipleChoice",
        multipleChoice: ["Sí, claro!", "En este momento no"],
        next: (answer: string) => {
          if (answer.includes("Sí")) return "vsl_club";
          return "free_resource";
        },
      },
      {
        id: 11,
        step: "vsl_club",
        question: "VSL CLUB",
        field: "vsl_club",
        type: "end",
        next: "",
      },
      {
        id: 12,
        step: "free_resource",
        question:
          "Súper válida tu respuesta ☺️ En ese caso te recomiendo que aproveches este recursos gratuito 🥳 (link)",
        field: "free_resource",
        type: "end",
        next: "",
      },
      {
        id: 13,
        step: "facturación_impulso",
        question:
          "¿En qué rango de facturación se encuentra tu negocio? (El promedio de los últimos 2 meses)    A partir de aquí definiremos tu plan de acción personalizado.",
        field: "disposicion",
        type: "multipleChoice",
        multipleChoice: [
          "Menos de $1,000 por mes.",
          "Entre $1,000 y $3,000 por mes.",
          "Entre $3,000 y $5,000 por mes.",
          "Arriba de los $5,000 por mes.",
        ],
        next: "cliente_ideal",
      },
      {
        id: 14,
        step: "cliente_ideal",
        question:
          "¿Ya tienes claro quién es tu cliente ideal, tus diferenciales de Marca Personal y tus ofertas?",
        field: "cliente_ideal",
        type: "multipleChoice",
        multipleChoice: [
          "No, pero quiero que me guíen con ello.",
          "Sí, pero todavía le falta trabajo por ello quiero su ayuda.",
        ],
        next: "acompanamiento",
      },
      {
        id: 15,
        step: "acompanamiento",
        question:
          "Genial! 💪🏼 Nuestro proceso de trabajo es principalmente a través de programas de formación y mentoría donde recibes acompañamiento guiado para que tú o tu equipo se formen y puedan implementar las estrategias de posicionamiento y crecimiento.   ¿Estás dispuesto/a a poner el trabajo para implementar lo que aprendes y así ver cambios en tu negocio?",
        field: "acompanamiento",
        type: "multipleChoice",
        multipleChoice: [
          "Sí, me interesa aprender con ustedes y recibir la guía para que lo ponga en práctica.",
          "No, en este momento quiero que alguien lo implemente por mi.",
        ],
        next: "inversion_presupuesto",
      },
      {
        id: 16,
        step: "inversion_presupuesto",
        question:
          "En caso de que el plan propuesto te encante y te ayuda a llegar a tus metas... ¿Podrías disponer de al menos $100usd para invertir y comenzar? Este no es el precio, es sólo un valor de referencia para iniciar con el proceso de mentoría. (No te preocupes que no se te cobrará nada en este momento. Nos aseguraremos de que estés seguro/a antes de tu inversión).",
        field: "opcion_alternativa",
        type: "multipleChoice",
        multipleChoice: [
          "Sí, dispongo de al menos $100usd para invertir.",
          "No dispongo pero podría conseguirlo en caso de que sea el camino indicado para mi.",
          "En este momento no dispongo ni tampoco puedo conseguirlo en el corto plazo.",
        ],
        next: (answer: string) => {
          if (
            answer.includes(
              "Sí, dispongo de al menos $100usd para invertir."
            ) ||
            answer.includes(
              "No dispongo pero podría conseguirlo en caso de que sea el camino indicado para mi."
            )
          ) {
            return "vsl_club";
          } else {
            return "free_resource";
          }
        },
      },
      {
        id: 17,
        step: "vsl_club",
        question: "VSL CLUB",
        field: "vsl_club",
        type: "end",
        next: "",
      },
      {
        id: 18,
        step: "free_resource",
        question:
          "Súper válida tu respuesta ☺️ En ese caso te recomiendo que aproveches este recursos gratuito 🥳 (link)",
        field: "free_resource",
        type: "end",
        next: "",
      },
    ],
  },
  flow_despegue: {
    name: "flow_despegue",
    questions: [
      {
        id: 0,
        step: "rubro",
        question: "¿En qué rubro estás? 📌Ejemplo: Soy Health Coach.",
        field: "rubro",
        type: "rubro",
        placeholder: "Escribí tu rubro",
        next: "instagram_1",
      },
      {
        id: 1,
        step: "instagram_1",
        question: "¿Ya tienes un Instagram profesional?",
        field: "instagram_1",
        type: "multipleChoice",
        multipleChoice: [
          "Sí, ya lo tengo pero quiero que me ayuden a mejorarlo.",
          "No, es donde más apoyo necesito.",
        ],
        next: (answer: string) => {
          if (
            answer.includes(
              "Sí, ya lo tengo pero quiero que me ayuden a mejorarlo."
            )
          ) {
            return "instagram_2";
          } else {
            return "cliente_ideal";
          }
        },
      },
      {
        id: 2,
        step: "instagram_2",
        question:
          "¿Cuál es tu Instagram? 📲   📌Ejemplo: @fabimersan   Esto nos permitirá poder auditar brevemente tu cuenta y posicionamiento.  ",
        field: "instagram_2",
        type: "instagram",
        placeholder: "@usuario",
        next: "cliente_ideal",
      },
      {
        id: 3,
        step: "cliente_ideal",
        question:
          "¿Ya tienes claro quién es tu cliente ideal, tus diferenciales de Marca Personal y tus ofertas?",
        field: "cliente_ideal",
        type: "multipleChoice",
        multipleChoice: [
          "No, pero quiero que me guíen con ello.",
          "Sí, pero todavía le falta trabajo por ello quiero su ayuda.",
        ],
        next: "acompanamiento",
      },
      {
        id: 4,
        step: "acompanamiento",
        question:
          "Genial! 💪🏼 Nuestro proceso de trabajo es principalmente a través de programas de formación y mentoría donde recibes acompañamiento guiado para que tú o tu equipo se formen y puedan implementar las estrategias de posicionamiento y crecimiento.   ¿Estás dispuesto/a a poner el trabajo para implementar lo que aprendes y así ver cambios en tu negocio?",
        field: "acompanamiento",
        type: "multipleChoice",
        multipleChoice: [
          "Sí, me interesa aprender con ustedes y recibir la guía para que lo ponga en práctica.",
          "No, en este momento quiero que alguien lo implemente por mi.",
        ],
        next: "inversion_presupuesto",
      },
      {
        id: 5,
        step: "inversion_presupuesto",
        question:
          "En caso de que el plan propuesto te encante y te ayuda a llegar a tus metas... ¿Podrías disponer de al menos $100usd para invertir y comenzar? Este no es el precio, es sólo un valor de referencia para iniciar con el proceso de mentoría. (No te preocupes que no se te cobrará nada en este momento. Nos aseguraremos de que estés seguro/a antes de tu inversión).",
        field: "opcion_alternativa",
        type: "multipleChoice",
        multipleChoice: [
          "Sí, dispongo de al menos $100usd para invertir.",
          "No dispongo pero podría conseguirlo en caso de que sea el camino indicado para mi.",
          "En este momento no dispongo ni tampoco puedo conseguirlo en el corto plazo.",
        ],
        next: (answer: string) => {
          if (
            answer.includes(
              "Sí, dispongo de al menos $100usd para invertir."
            ) ||
            answer.includes(
              "No dispongo pero podría conseguirlo en caso de que sea el camino indicado para mi."
            )
          ) {
            return "vsl_club";
          } else {
            return "free_resource";
          }
        },
      },
      {
        id: 6,
        step: "vsl_club",
        question: "VSL CLUB",
        field: "vsl_club",
        type: "end",
        next: "",
      },
      {
        id: 7,
        step: "free_resource",
        question:
          "Súper válida tu respuesta ☺️ En ese caso te recomiendo que aproveches este recursos gratuito 🥳 (link)",
        field: "free_resource",
        type: "end",
        next: "",
      },
    ],
  },
  flow_ventas: {
    name: "flow_ventas",
    questions: [
      {
        id: 0,
        step: "fin",
        question:
          "Entiendo. En este momento nuestro foco y metodología está enfocada en ayudar a profesionales que venden servicios y quieren escalar su Marca Personal y su negocio.   Actualmente no ayudamos a personas que venden únicamente productos. Por lo tanto, no seríamos los indicados para apoyarte.   Si alguna vez buscas el otro camino, no dudes en volver a contactarnos! ☺️  ",
        field: "fin",
        type: "end",
        next: "",
      },
    ],
  },
};
