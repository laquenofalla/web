/**
 * Configuración Oficial de "La Que No Falla"
 * Datos sincronizados con el folleto e identidad de marca oficial.
 */

const CONFIG = {
  brand: {
    name: "La Que No Falla",
    hook: "¡Solucioná tus cenas con mis pre-pizzas caseras!",
    tagline: "Pre-pizzas artesanales con masa madre, estilo media masa y cocidas a la piedra",
    subtagline: "Elaboradas frescas en el día con harina especial con masa madre. Livianas, con salsa casera abundante y piso bien crocante.",
    whatsappNumber: "5491168406277",
    displayPhone: "11-6840-6277",
    instagram: "@laquenofalla.ok",
    instagramUrl: "https://instagram.com/laquenofalla.ok",
    location: "Santos Lugares, Tres de Febrero (Bs. As.)",
    pickupPoint: "Santos Lugares (a coordinar tras la compra)",
    businessHours: "Pedidos y reservas toda la semana",
    deliveryZone: "Envíos en Santos Lugares, Caseros, Sáenz Peña, Devoto, San Martín y alrededores",
    monthPromo: "OCTUBRE",
    singlePrice: 4000
  },

  // Catálogo de Productos Oficiales
  products: [
    {
      id: "prepizza-tomate",
      name: "Pre-pizza de Tomate 🍅",
      badge: "Fresca del Día",
      category: "prepizzas",
      description: "Elaborada fresca con harina especial con masa madre y cocida a la piedra estilo media masa. Cubierta con abundante salsa pomodoro casera a base de tomates seleccionados, orégano y un toque de oliva. Apta para congelar en casa.",
      price: 4000,
      image: "assets/images/tomate.jpg",
      realImage: "assets/images/real_tomate.jpg",
      highlight: "Harina con Masa Madre · Cocción a la piedra · Salsa casera",
      yield: "Rinde 8 porciones abundantes",
      stock: true
    },
    {
      id: "prepizza-fugazza",
      name: "Pre-pizza Fugazza 🧅",
      badge: "Fresca del Día",
      category: "prepizzas",
      description: "Nuestra clásica de cebolla. Masa aireada con piso crocante a la piedra, cubierta de generosa cebolla caramelizada suave con orégano y aceite de oliva. Hecha en el día, lista para gratinar con muzzarella.",
      price: 4000,
      image: "assets/images/cebolla.jpg",
      realImage: "assets/images/real_fugazza.jpg",
      highlight: "Harina con Masa Madre · Abundante cebolla dorada · Oliva",
      yield: "Rinde 8 porciones abundantes",
      stock: true
    }
  ],

  // Combos & Promociones Estratégicas (Aumento de ticket promedio)
  combos: [
    {
      id: "combo-duo",
      name: "Promo Dúo (Tomate + Fugazza)",
      category: "combos",
      badge: "PROBÁ AMBAS",
      subtitle: "1 de Tomate + 1 Fugazza",
      description: "La pareja perfecta para una cena de dos o para armar mitad y mitad a tu gusto.",
      price: 7800,
      originalPrice: 8000,
      itemsIncluded: ["1x Pre-pizza Tomate", "1x Pre-pizza Fugazza", "Aptas freezer hasta 60 días"],
      popular: false
    },
    {
      id: "combo-juntada",
      name: "Combo Juntada con Amigos",
      category: "combos",
      badge: "MÁS VENDIDO ⭐",
      subtitle: "4 Pre-pizzas (2 Tomate + 2 Fugazza)",
      description: "Ideal para 4 a 6 personas. Solucioná la cena de la juntada sin pasarte la noche cocinando. En 10 minutos tenés pizza de pizzería en la mesa.",
      price: 15200,
      originalPrice: 16000,
      itemsIncluded: ["2x Pre-pizza Tomate", "2x Pre-pizza Fugazza", "Guía de horneado crocante incluida"],
      popular: true
    },
    {
      id: "combo-stock",
      name: "Pack Familiar Stockeate",
      category: "combos",
      badge: "MEJOR PRECIO UNITARIO",
      subtitle: "6 Pre-pizzas (3 Tomate + 3 Fugazza)",
      description: "El as bajo la manga para los días de semana. Las guardás en el freezer y las mandás directo al horno cuando las necesitás.",
      price: 22000,
      originalPrice: 24000,
      itemsIncluded: ["3x Pre-pizza Tomate", "3x Pre-pizza Fugazza", "Aptas freezer hasta 60 días"],
      popular: false
    }
  ],

  // Futuros Lanzamientos (Escalabilidad del Negocio)
  upcoming: [
    {
      name: "Pre-pizzas con Muzzarella Listas",
      tag: "Próximamente",
      desc: "Con queso muzzarella artesanal derretible de primera calidad, listas para gratinar."
    },
    {
      name: "Variedad Integral con Semillas",
      tag: "En Desarrollo",
      desc: "Masa madre 100% harina integral y mix de 5 semillas activadas."
    },
    {
      name: "Empanadas Caseras",
      tag: "Muy Pronto",
      desc: "Masa casera y rellenos tradicionales abundantes cocidos al horno."
    }
  ],

  // Preguntas Frecuentes orientadas a la realidad operativa
  faqs: [
    {
      q: "¿Cómo vienen presentadas y cómo se conservan?",
      a: "Te las entregamos frescas en bolsa de polipropileno apta para alimentos. En heladera duran hasta 5 días en perfecto estado. Si querés stockearte para tener siempre a mano, podés colocarlas en el freezer en su misma bolsa por hasta 60 días y mandarlas directo al horno sin descongelar previamente."
    },
    {
      q: "¿De dónde son y cómo son las entregas?",
      a: "Nuestra cocina está en Santos Lugares (Tres de Febrero). Podés retirar tu pedido sin costo en punto coordinado en Santos Lugares, o coordinamos envíos en la zona: Santos Lugares, Caseros, Sáenz Peña, Villa Raffo, San Martín, Villa Devoto y alrededores."
    },
    {
      q: "¿Cómo es la preparación en casa?",
      a: "¡Súper fácil! Calentás el horno a fuego fuerte (220°C a 250°C) durante 10 minutos. Le ponés muzzarella u otros ingredientes arriba y la mandás a la rejilla o pizzera entre 8 y 12 minutos hasta que el queso esté bien fundido y el piso crocante."
    },
    {
      q: "¿Tienen venta mayorista para comercios o eventos?",
      a: "¡Sí! Abastecemos a almacenes, kioscos, fiambrerías y eventos con precios especiales a partir de 15 unidades. Escribinos por WhatsApp seleccionando la opción Mayorista y coordinamos entregas programadas."
    },
    {
      q: "¿Cómo hago mi pedido?",
      a: "Armás tu pedido acá en la web y al presionar 'Confirmar Pedido por WhatsApp' se abrirá el chat con el detalle exacto. Aceptamos transferencias, Mercado Pago y efectivo contra entrega."
    }
  ]
};
