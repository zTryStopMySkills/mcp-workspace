// =========================================================
// SIDERAL BAR — Menu Data
// =========================================================
// Datos por defecto. El admin panel guarda en localStorage
// para sobrescribir estos valores.
// =========================================================

const DEFAULT_MENU_DATA = {
  categorias: [
    {
      id: "entrantes",
      nombre: "Clásicos de Entrantes",
      emoji: "✦",
      descripcion: "Nuestros imprescindibles para comenzar",
      platos: [
        {
          id: "e1",
          nombre: "Empanada Argentina de Carne",
          descripcion: "Con salsa criolla artesanal de la casa",
          precio: "3,80",
          unidad: "ud.",
          imagen: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&h=380&fit=crop&q=80",
          rating: 4.8,
          numResenas: 42,
          badge: null,
          disponible: true
        },
        {
          id: "e2",
          nombre: "Pinchitos de Criollitos con Chimichurri",
          descripcion: "Choricitos criollos con nuestra salsa chimichurri casera",
          precio: "8,50",
          unidad: "2x3 uds.",
          imagen: "https://images.unsplash.com/photo-1544025162-d76538670ef5?w=500&h=380&fit=crop&q=80",
          rating: 4.9,
          numResenas: 58,
          badge: "Más pedido",
          disponible: true
        },
        {
          id: "e3",
          nombre: "Canastitas de Tartar de Salmón",
          descripcion: "Con delicada salsa de mango y crujiente canastita",
          precio: "12,00",
          unidad: "plato",
          imagen: "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=500&h=380&fit=crop&q=80",
          rating: 4.7,
          numResenas: 35,
          badge: null,
          disponible: true
        },
        {
          id: "e4",
          nombre: "Mollejas de Ternera al Limón",
          descripcion: "Tostadas al limón sobre patatas panaderas y provenzal",
          precio: "14,00",
          unidad: "plato",
          imagen: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=380&fit=crop&q=80",
          rating: 4.6,
          numResenas: 28,
          badge: null,
          disponible: true
        },
        {
          id: "e5",
          nombre: "Mini Pan Bao de Verduras",
          descripcion: "Con guacamole casero, fresco y ligero",
          precio: "8,00",
          unidad: "2 uds.",
          imagen: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=500&h=380&fit=crop&q=80",
          rating: 4.5,
          numResenas: 22,
          badge: "Vegano",
          disponible: true
        },
        {
          id: "e6",
          nombre: "Ensaladilla de Langostinos con Atún",
          descripcion: "Versión premium de un clásico andaluz",
          precio: "4,80 / 10,00",
          unidad: "tapa / plato",
          imagen: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=380&fit=crop&q=80",
          rating: 4.7,
          numResenas: 48,
          badge: null,
          disponible: true
        }
      ]
    },
    {
      id: "manos",
      nombre: "Con las Manos…",
      emoji: "✧",
      descripcion: "Para comer sin ceremonias, con sabor máximo",
      platos: [
        {
          id: "m1",
          nombre: "Tacos de Maíz Crujiente con Atún",
          descripcion: "Atún fresco marinado en soja, guacamole casero y cebolla morada",
          precio: "9,00",
          unidad: "2 uds.",
          imagen: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&h=380&fit=crop&q=80",
          rating: 4.9,
          numResenas: 67,
          badge: "Top Chef",
          disponible: true
        },
        {
          id: "m2",
          nombre: "Bagel Casero de Pastrami 'La Finca'",
          descripcion: "Salsa ponzu, pepinillos encurtidos y rúcula fresca",
          precio: "9,80",
          unidad: "ud.",
          imagen: "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&h=380&fit=crop&q=80",
          rating: 4.8,
          numResenas: 44,
          badge: null,
          disponible: true
        },
        {
          id: "m3",
          nombre: "Croquetas Caseras",
          descripcion: "Boletus & trufa · Espinaca & queso · Pollo al curry (a elegir)",
          precio: "4,50 / 9,00 / 14,50",
          unidad: "tapa / media / ración",
          imagen: "https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=500&h=380&fit=crop&q=80",
          rating: 5.0,
          numResenas: 112,
          badge: "Fan Favorito",
          disponible: true
        },
        {
          id: "m4",
          nombre: "Pizzetas de Cecina de León",
          descripcion: "Masa artesana, queso de cabra y cebolla caramelizada",
          precio: "11,50",
          unidad: "2 uds.",
          imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=380&fit=crop&q=80",
          rating: 4.8,
          numResenas: 55,
          badge: null,
          disponible: true
        },
        {
          id: "m5",
          nombre: "Tabla de Quesos Nacionales",
          descripcion: "Selección de quesos artesanos españoles de temporada",
          precio: "8,00 / 17,00 / 21,00",
          unidad: "tapa / media / ración",
          imagen: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=500&h=380&fit=crop&q=80",
          rating: 4.7,
          numResenas: 38,
          badge: null,
          disponible: true
        },
        {
          id: "m6",
          nombre: "Tabla de Chacinas",
          descripcion: "De León: chorizo de buey ibérico, chorizo picante, lomo y pastrami",
          precio: "8,50 / 19,00",
          unidad: "tapa / ración",
          imagen: "https://images.unsplash.com/photo-1626780075980-6a6a1b80b58a?w=500&h=380&fit=crop&q=80",
          rating: 4.9,
          numResenas: 61,
          badge: "Ibérico",
          disponible: true
        },
        {
          id: "m7",
          nombre: "Tabla Mixta",
          descripcion: "Selección combinada de quesos y chacinas de la casa",
          precio: "22,00",
          unidad: "ración",
          imagen: "https://images.unsplash.com/photo-1559847844-5315695dadae?w=500&h=380&fit=crop&q=80",
          rating: 4.8,
          numResenas: 49,
          badge: "Para compartir",
          disponible: true
        }
      ]
    },
    {
      id: "compartir",
      nombre: "Para Compartir Entre 2",
      emoji: "⋆",
      descripcion: "Platos de autor pensados para vivir juntos",
      platos: [
        {
          id: "c1",
          nombre: "Ensalada Tibia de Quinoa & Atún en Tataki",
          descripcion: "Pimientos, alga wakame, pasas, granada y cebolla encurtida. Vinagreta de naranja y especias",
          precio: "17,00",
          unidad: "plato",
          imagen: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=380&fit=crop&q=80",
          rating: 4.7,
          numResenas: 32,
          badge: null,
          disponible: true
        },
        {
          id: "c2",
          nombre: "Flor de Alcachofa Confitada",
          descripcion: "Huevo de codorniz frito, virutas de cecina y alboronía",
          precio: "12,00",
          unidad: "2 uds.",
          imagen: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=500&h=380&fit=crop&q=80",
          rating: 4.6,
          numResenas: 25,
          badge: null,
          disponible: true
        },
        {
          id: "c3",
          nombre: "Pinchos de Cordero con Pan de Pita",
          descripcion: "Pita y humus caseros. Salsas tzatziki y harissa",
          precio: "20,00",
          unidad: "plato",
          imagen: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=500&h=380&fit=crop&q=80",
          rating: 4.9,
          numResenas: 73,
          badge: "Recomendado",
          disponible: true
        },
        {
          id: "c4",
          nombre: "Arroz al Curry con Gambas & Verduras",
          descripcion: "Con anacardos y uvas pasas negras, sabor thai cremoso",
          precio: "14,00",
          unidad: "plato",
          imagen: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=500&h=380&fit=crop&q=80",
          rating: 4.7,
          numResenas: 41,
          badge: null,
          disponible: true
        },
        {
          id: "c5",
          nombre: "Sashimi de Salmón Flambeado",
          descripcion: "Aguacate, brócoli y coliflor al ajillo, salsa Nikkei, sobre crujientes de arroz",
          precio: "18,00",
          unidad: "plato",
          imagen: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=500&h=380&fit=crop&q=80",
          rating: 4.9,
          numResenas: 85,
          badge: "Estrella de la Carta",
          disponible: true
        },
        {
          id: "c6",
          nombre: "Yakisoba Especial del Chef",
          descripcion: "Mixto: gambas y pollo con fideos japoneses salteados",
          precio: "15,00",
          unidad: "plato",
          imagen: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=500&h=380&fit=crop&q=80",
          rating: 4.8,
          numResenas: 52,
          badge: "Especial Chef",
          disponible: true
        }
      ]
    },
    {
      id: "carnes",
      nombre: "Pescados & Carnes",
      emoji: "◈",
      descripcion: "Producto de primera, cocina con alma",
      platos: [
        {
          id: "p1",
          nombre: "Ceviche Especial del Chef",
          descripcion: "Receta personal del chef, fresca y cítrica",
          precio: "15,00",
          unidad: "plato",
          imagen: "https://images.unsplash.com/photo-1535400255456-984b48978f01?w=500&h=380&fit=crop&q=80",
          rating: 4.8,
          numResenas: 47,
          badge: "Especial Chef",
          disponible: true
        },
        {
          id: "p2",
          nombre: "Lomo de Merluza sobre Parmentier",
          descripcion: "Sobre parmentier de boniato y salsa verde de la casa",
          precio: "13,50",
          unidad: "plato",
          imagen: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&h=380&fit=crop&q=80",
          rating: 4.7,
          numResenas: 36,
          badge: null,
          disponible: true
        },
        {
          id: "p3",
          nombre: "Milanesa Napolitana XL",
          descripcion: "Con patatas fritas — sabor porteño en el corazón de Sevilla",
          precio: "14,00",
          unidad: "plato",
          imagen: "https://images.unsplash.com/photo-1595854341625-f33ee10dbf54?w=500&h=380&fit=crop&q=80",
          rating: 4.6,
          numResenas: 43,
          badge: null,
          disponible: true
        },
        {
          id: "p4",
          nombre: "Burger 100g+100g en Pan Brioche",
          descripcion: "Doble carne ternera casera, cecina crujiente, Havarti, huevo frito y salsa burger",
          precio: "13,50",
          unidad: "ud.",
          imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=380&fit=crop&q=80",
          rating: 4.9,
          numResenas: 88,
          badge: "Best Seller",
          disponible: true
        },
        {
          id: "p5",
          nombre: "Presa Ibérica a la Plancha",
          descripcion: "Con setas a la plancha o patatas fritas (a elegir) y chutney de ciruelas",
          precio: "16,00 / 15,00",
          unidad: "setas / patatas",
          imagen: "https://images.unsplash.com/photo-1558030006-450675393462?w=500&h=380&fit=crop&q=80",
          rating: 4.8,
          numResenas: 60,
          badge: "Ibérico",
          disponible: true
        },
        {
          id: "p6",
          nombre: "Solomillo de Vaca",
          descripcion: "Con patatas y verduritas de temporada",
          precio: "18,00",
          unidad: "plato",
          imagen: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=380&fit=crop&q=80",
          rating: 4.9,
          numResenas: 74,
          badge: "Premium",
          disponible: true
        }
      ]
    },
    {
      id: "ninos",
      nombre: "Para los Peques",
      emoji: "★",
      descripcion: "Los más pequeños también merecen lo mejor",
      platos: [
        {
          id: "n1",
          nombre: "Croquetas Caseras de Pollo y Jamón",
          descripcion: "Receta tradicional, hechas con cariño en Sideral",
          precio: "3,90 / 7,50 / 12,50",
          unidad: "tapa(3) / media(6) / ración(10)",
          imagen: "https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=500&h=380&fit=crop&q=80",
          rating: 4.9,
          numResenas: 56,
          badge: null,
          disponible: true
        },
        {
          id: "n2",
          nombre: "Mini Burger Casera en Pan Brioche",
          descripcion: "100g de ternera casera, queso Cheddar y patatas fritas",
          precio: "8,50",
          unidad: "ud.",
          imagen: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=380&fit=crop&q=80",
          rating: 4.8,
          numResenas: 48,
          badge: null,
          disponible: true
        },
        {
          id: "n3",
          nombre: "Tiritas de Pollo con Panko",
          descripcion: "Rebozado crujiente de panko japonés",
          precio: "7,50",
          unidad: "ración",
          imagen: "https://images.unsplash.com/photo-1565299624496-9ae1c8e5e2ec?w=500&h=380&fit=crop&q=80",
          rating: 4.7,
          numResenas: 33,
          badge: null,
          disponible: true
        },
        {
          id: "n4",
          nombre: "Hot Dog XL en Pan Brioche",
          descripcion: "Con patatas paja crujientes",
          precio: "6,50",
          unidad: "ud.",
          imagen: "https://images.unsplash.com/photo-1619740455993-9d7bf82c0f55?w=500&h=380&fit=crop&q=80",
          rating: 4.6,
          numResenas: 28,
          badge: null,
          disponible: true
        },
        {
          id: "n5",
          nombre: "Pizzetas Caseras para Peques",
          descripcion: "Masa artesana: solo queso · jamón york y queso · o una de cada",
          precio: "8,50",
          unidad: "2 uds.",
          imagen: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=380&fit=crop&q=80",
          rating: 4.8,
          numResenas: 40,
          badge: null,
          disponible: true
        }
      ]
    }
  ]
};

// Reseñas reales de Google (verificadas)
const RESENAS_GOOGLE = [
  {
    autor: "María Izquierdo",
    avatar: "MI",
    rating: 5,
    fecha: "enero 2026",
    texto: "Es la primera vez que vamos y no será la última... todo formidable. Una experiencia gastronómica única, con sabores que no esperabas y una atención que te hace sentir en casa. Sideral es un descubrimiento que hay que compartir.",
    likes: 18
  },
  {
    autor: "Silvia Romero",
    avatar: "SR",
    rating: 5,
    fecha: "enero 2026",
    texto: "La casualidad ha sido maravillosa… sabores nuevos, tapas exquisitas. El servicio es excelente, Salva se desvivió con la atención. Nunca pensé que en Mairena habría un sitio así de especial. ¡Volveremos seguro!",
    likes: 22
  },
  {
    autor: "Rocío Molina Ortega",
    avatar: "RO",
    rating: 5,
    fecha: "enero 2026",
    texto: "Muy buen servicio, excelente recomendación de cada plato por parte del equipo. Muy buena calidad de los ingredientes, se nota que todo está hecho con cariño. Las croquetas caseras están de otro nivel.",
    likes: 14
  },
  {
    autor: "Raquel Romero Ruiz",
    avatar: "RR",
    rating: 5,
    fecha: "enero 2026",
    texto: "Grato descubrimiento. La comida, el servicio... todo perfecto. Empezamos con las empanadas argentinas y terminamos con el sashimi flambeado. Una experiencia que supera cualquier expectativa. De los mejores de Sevilla.",
    likes: 19
  },
  {
    autor: "Oscar Rubio",
    avatar: "OR",
    rating: 5,
    fecha: "diciembre 2025",
    texto: "Atención tan amable y divertida, la comida está muy rica. Silvana y su equipo hacen que te sientas como en casa. La decoración del local es preciosa, muy cuidada y con mucha personalidad. Sitio 10/10.",
    likes: 16
  },
  {
    autor: "Ricardo Mejias",
    avatar: "RM",
    rating: 5,
    fecha: "noviembre 2025",
    texto: "Las croquetas 100% recomendables, las mejores que he probado en mucho tiempo. Trato exquisito por parte de todo el equipo. La carta tiene platos muy originales que no encuentras en ningún otro sitio. Imprescindible.",
    likes: 25
  },
  {
    autor: "Elena Roncero",
    avatar: "ER",
    rating: 5,
    fecha: "noviembre 2025",
    texto: "Buena comida a buen precio. Ingredientes frescos y de primera calidad. Los pinchos de cordero con humus casero son espectaculares. La carta tiene mucha variedad y todo está cuidado al detalle.",
    likes: 11
  },
  {
    autor: "Álvaro Rueda Moreno",
    avatar: "AM",
    rating: 5,
    fecha: "noviembre 2025",
    texto: "Buena cocina, muy elaborada... todo muy cuidado. Se nota el mimo en cada plato. El ambiente es muy acogedor y la decoración tiene mucho encanto. Sin duda repetiremos. Sideral es un must en Mairena del Aljarafe.",
    likes: 13
  }
];

// Fotos de galería (simulando Instagram)
const GALERIA_FOTOS = [
  { id: 1, imagen: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500&h=500&fit=crop&q=80", tipo: "ambiente", alt: "Ambiente Sideral Bar" },
  { id: 2, imagen: "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500&h=500&fit=crop&q=80", tipo: "plato", alt: "Tacos especiales" },
  { id: 3, imagen: "https://images.unsplash.com/photo-1484980972926-edee96e0960d?w=500&h=500&fit=crop&q=80", tipo: "plato", alt: "Croquetas caseras" },
  { id: 4, imagen: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=500&h=500&fit=crop&q=80", tipo: "cocktail", alt: "Cócteles de autor" },
  { id: 5, imagen: "https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=500&h=500&fit=crop&q=80", tipo: "plato", alt: "Sashimi flambeado" },
  { id: 6, imagen: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=500&h=500&fit=crop&q=80", tipo: "ambiente", alt: "Interior del local" },
  { id: 7, imagen: "https://images.unsplash.com/photo-1452195100486-9cc805987862?w=500&h=500&fit=crop&q=80", tipo: "plato", alt: "Tabla de quesos" },
  { id: 8, imagen: "https://images.unsplash.com/photo-1560472355-536de3962603?w=500&h=500&fit=crop&q=80", tipo: "cocktail", alt: "Gin tonic especial" },
  { id: 9, imagen: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&h=500&fit=crop&q=80", tipo: "plato", alt: "Solomillo de vaca" }
];

// Función para obtener datos del menú (localStorage o por defecto)
function getMenuData() {
  try {
    const stored = localStorage.getItem('sideral_menu');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch(e) {
    console.error('Error loading menu data:', e);
  }
  return DEFAULT_MENU_DATA;
}

// Función para guardar datos del menú
function saveMenuData(data) {
  try {
    localStorage.setItem('sideral_menu', JSON.stringify(data));
    return true;
  } catch(e) {
    console.error('Error saving menu data:', e);
    return false;
  }
}

// Función para resetear datos al original
function resetMenuData() {
  localStorage.removeItem('sideral_menu');
}
