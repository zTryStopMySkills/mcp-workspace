import type { Category, MenuItem, DailyMenu, BusinessInfo, GalleryImage, Review } from './types'

export const defaultCategories: Category[] = [
  { id: 'entrantes', name: 'Entrantes', icon: '🥗', description: 'Aperitivos y entrantes para compartir', order: 1, active: true },
  { id: 'ensaladas', name: 'Ensaladas', icon: '🥬', description: 'Ensaladas frescas y variadas', order: 2, active: true },
  { id: 'carnes', name: 'Carnes', icon: '🥩', description: 'Carnes a la brasa y guisos tradicionales', order: 3, active: true },
  { id: 'pescados', name: 'Pescados', icon: '🐟', description: 'Pescados frescos y mariscos', order: 4, active: true },
  { id: 'tapas', name: 'Tapas', icon: '🍢', description: 'Tapas y pinchos típicos españoles', order: 5, active: true },
  { id: 'bocadillos', name: 'Bocadillos', icon: '🥖', description: 'Bocadillos y sandwiches artesanales', order: 6, active: true },
  { id: 'postres', name: 'Postres', icon: '🍮', description: 'Dulces y postres caseros', order: 7, active: true },
  { id: 'bebidas', name: 'Bebidas', icon: '🍺', description: 'Bebidas frías y calientes', order: 8, active: true },
  { id: 'combinados', name: 'Combinados', icon: '🍹', description: 'Cócteles y combinados de autor', order: 9, active: true },
]

export const defaultMenuItems: MenuItem[] = [
  // Entrantes
  { id: 'ent-001', name: 'Croquetas de Jamón Ibérico', description: 'Croquetas caseras de jamón ibérico con bechamel cremosa. Crujientes por fuera y melosas por dentro.', price: 9.5, category: 'entrantes', image: 'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7?w=800', rating: 4.9, isRecommended: true, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['gluten', 'lacteos', 'huevos'] },
  { id: 'ent-002', name: 'Patatas Bravas Hakuna', description: 'Patatas fritas con salsa brava picante de elaboración propia y alioli.', price: 7.0, category: 'entrantes', image: 'https://images.unsplash.com/photo-1568569350062-ebfa3debb8c7?w=800', rating: 4.7, isRecommended: false, spicy: 2, isNew: false, active: true, soldOut: false, allergens: ['huevos', 'mostaza'] },
  { id: 'ent-003', name: 'Tabla de Ibéricos', description: 'Selección de embutidos ibéricos: jamón, lomo, chorizo y salchichón con pan de cristal.', price: 18.5, category: 'entrantes', image: 'https://images.unsplash.com/photo-1544025162-d76594e8bb5c?w=800', rating: 4.8, isRecommended: true, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['gluten', 'sulfitos'] },
  { id: 'ent-004', name: 'Gambas al Ajillo', description: 'Gambas salteadas con ajo, guindilla y aceite de oliva virgen extra. Servidas en cazuela de barro.', price: 14.0, category: 'entrantes', image: 'https://images.unsplash.com/photo-1655491946556-9ed3f2a93f74?w=800', rating: 4.8, isRecommended: true, spicy: 1, isNew: false, active: true, soldOut: false, allergens: ['crustaceos', 'sulfitos'] },
  { id: 'ent-005', name: 'Pimientos de Padrón', description: 'Pimientos de padrón fritos en aceite de oliva con sal gruesa.', price: 8.0, category: 'entrantes', image: 'https://images.unsplash.com/photo-1506280754576-f6fa8a873550?w=800', rating: 4.6, isRecommended: false, spicy: 1, isNew: false, active: true, soldOut: false, allergens: [] },
  { id: 'ent-006', name: 'Burrata con Tomate', description: 'Burrata fresca italiana sobre cama de tomates cherry, albahaca fresca y reducción de balsámico.', price: 12.5, category: 'entrantes', image: 'https://images.unsplash.com/photo-1562802378-063ec186a863?w=800', rating: 4.7, isRecommended: false, spicy: 0, isNew: true, active: true, soldOut: false, allergens: ['lacteos'] },

  // Ensaladas
  { id: 'ens-001', name: 'Ensalada César', description: 'Lechuga romana, pollo a la plancha, crutones caseros, queso parmesano y salsa César.', price: 12.0, category: 'ensaladas', image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800', rating: 4.5, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['gluten', 'huevos', 'lacteos', 'pescado'] },
  { id: 'ens-002', name: 'Ensalada Hakuna', description: 'Mix de lechugas, aguacate, mango, langostinos, nueces caramelizadas y vinagreta de maracuyá.', price: 14.5, category: 'ensaladas', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800', rating: 4.8, isRecommended: true, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['crustaceos', 'frutos_cascara'] },
  { id: 'ens-003', name: 'Ensalada de Queso de Cabra', description: 'Mix de lechugas, queso de cabra gratinado, nueces, manzana y vinagreta de miel y mostaza.', price: 11.5, category: 'ensaladas', image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800', rating: 4.6, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['lacteos', 'frutos_cascara', 'mostaza'] },
  { id: 'ens-004', name: 'Ensalada Mediterránea', description: 'Tomate, pepino, aceitunas kalamata, queso feta, cebolla roja y orégano con aceite de oliva.', price: 10.5, category: 'ensaladas', image: 'https://images.unsplash.com/photo-1544025162-d76594e8bb5c?w=800', rating: 4.4, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['lacteos', 'sulfitos'] },

  // Carnes
  { id: 'car-001', name: 'Chuletón de Vaca Madurada', description: 'Chuletón de vaca gallega madurada 30 días, 600g. Acompañado de patatas al horno y ensalada.', price: 34.0, category: 'carnes', image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800', rating: 4.9, isRecommended: true, spicy: 0, isNew: false, active: true, soldOut: false, allergens: [] },
  { id: 'car-002', name: 'Secreto Ibérico a la Brasa', description: 'Secreto ibérico de bellota a la brasa de carbón vegetal. Con chimichurri casero y patatas fritas.', price: 22.0, category: 'carnes', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800', rating: 4.8, isRecommended: true, spicy: 0, isNew: false, active: true, soldOut: false, allergens: [] },
  { id: 'car-003', name: 'Pollo de Corral Asado', description: 'Medio pollo de corral asado lentamente con hierbas aromáticas, limón y ajo.', price: 16.5, category: 'carnes', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c7?w=800', rating: 4.6, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: [] },
  { id: 'car-004', name: 'Carrilleras al Vino Tinto', description: 'Carrilleras de cerdo estofadas en vino tinto con verduras. Servidas con puré de patata trufado.', price: 19.5, category: 'carnes', image: 'https://images.unsplash.com/photo-1624300629298-e9de39c13be5?w=800', rating: 4.9, isRecommended: true, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['sulfitos', 'lacteos'] },
  { id: 'car-005', name: 'Hamburguesa Hakuna Premium', description: 'Burger de 200g wagyu, queso cheddar madurado, bacon crujiente, cebolla caramelizada y salsa especial.', price: 17.5, category: 'carnes', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800', rating: 4.7, isRecommended: false, spicy: 0, isNew: true, active: true, soldOut: false, allergens: ['gluten', 'lacteos', 'huevos', 'sesamo'] },

  // Pescados
  { id: 'pes-001', name: 'Merluza a la Romana', description: 'Lomos de merluza fresca rebozados, crujientes por fuera y jugosos por dentro. Con salsa tártara.', price: 18.0, category: 'pescados', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800', rating: 4.6, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['gluten', 'huevos', 'pescado'] },
  { id: 'pes-002', name: 'Pulpo a la Gallega', description: 'Pulpo cocido a la perfección sobre cama de puré de patata, pimentón de La Vera y aceite de oliva.', price: 22.0, category: 'pescados', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800', rating: 4.9, isRecommended: true, spicy: 1, isNew: false, active: true, soldOut: false, allergens: ['moluscos'] },
  { id: 'pes-003', name: 'Bacalao al Pil Pil', description: 'Bacalao desalado cocinado en aceite de oliva con ajo y guindilla. Salsa pil pil tradicional vasca.', price: 21.0, category: 'pescados', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800', rating: 4.7, isRecommended: true, spicy: 1, isNew: false, active: true, soldOut: false, allergens: ['pescado'] },
  { id: 'pes-004', name: 'Dorada a la Sal', description: 'Dorada entera cocinada en costra de sal. Pescado del día procedente de la lonja. Para dos personas.', price: 28.0, category: 'pescados', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', rating: 4.8, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['pescado'] },
  { id: 'pes-005', name: 'Calamares a la Andaluza', description: 'Calamares frescos rebozados al estilo andaluz con harina de garbanzo. Limón y alioli.', price: 13.5, category: 'pescados', image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800', rating: 4.5, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['moluscos', 'gluten', 'huevos'] },

  // Tapas
  { id: 'tap-001', name: 'Pintxos Variados', description: 'Selección de 6 pintxos tradicionales vascos: gilda, anchoa, txistorra, queso y más.', price: 12.0, category: 'tapas', image: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=800', rating: 4.7, isRecommended: true, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['gluten', 'pescado', 'lacteos'] },
  { id: 'tap-002', name: 'Tortilla Española', description: 'Tortilla de patatas tradicional. Disponible jugosa o cuajada según preferencia.', price: 8.5, category: 'tapas', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', rating: 4.8, isRecommended: true, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['huevos'] },
  { id: 'tap-003', name: 'Champiñones al Ajillo', description: 'Champiñones salteados con ajo, perejil y vino blanco. Tapa clásica irresistible.', price: 7.5, category: 'tapas', image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800', rating: 4.5, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['sulfitos'] },
  { id: 'tap-004', name: 'Tostas de Jamón y Tomate', description: 'Pan de cristal tostado con tomate rallado, aceite de oliva virgen extra y jamón ibérico.', price: 9.0, category: 'tapas', image: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?w=800', rating: 4.6, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['gluten'] },
  { id: 'tap-005', name: 'Boquerones en Vinagre', description: 'Boquerones marinados en vinagre de manzana con ajo y perejil fresco.', price: 8.0, category: 'tapas', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800', rating: 4.4, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['pescado'] },

  // Bocadillos
  { id: 'boc-001', name: 'Bocadillo de Calamares', description: 'Bocadillo clásico madrileño con calamares a la romana en barra de pan crujiente.', price: 8.0, category: 'bocadillos', image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800', rating: 4.6, isRecommended: true, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['gluten', 'moluscos', 'huevos'] },
  { id: 'boc-002', name: 'Bocadillo de Jamón Ibérico', description: 'Jamón ibérico de bellota en pan de cristal con tomate y aceite de oliva virgen extra.', price: 11.0, category: 'bocadillos', image: 'https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=800', rating: 4.8, isRecommended: true, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['gluten'] },
  { id: 'boc-003', name: 'Sandwich Club', description: 'Sandwich triple con pollo, bacon, lechuga, tomate, huevo y mayonesa. Con patatas chips.', price: 9.5, category: 'bocadillos', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800', rating: 4.5, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['gluten', 'huevos', 'lacteos'] },
  { id: 'boc-004', name: 'Montado de Lomo', description: 'Montado de lomo de cerdo a la plancha con pimientos del piquillo en pan de chapata.', price: 7.5, category: 'bocadillos', image: 'https://images.unsplash.com/photo-1481070414801-51fd732d7184?w=800', rating: 4.4, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['gluten'] },

  // Postres
  { id: 'pos-001', name: 'Crema Catalana', description: 'Crema catalana tradicional con azúcar caramelizado. Receta de la abuela.', price: 6.5, category: 'postres', image: 'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=800', rating: 4.8, isRecommended: true, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['lacteos', 'huevos'] },
  { id: 'pos-002', name: 'Coulant de Chocolate', description: 'Bizcocho caliente de chocolate con corazón fundente. Servido con helado de vainilla.', price: 7.5, category: 'postres', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800', rating: 4.9, isRecommended: true, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['gluten', 'lacteos', 'huevos', 'soja'] },
  { id: 'pos-003', name: 'Tarta de Queso', description: 'Tarta de queso al horno estilo vasco, cremosa y con base crujiente. Con mermelada de frutos rojos.', price: 7.0, category: 'postres', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800', rating: 4.9, isRecommended: true, spicy: 0, isNew: true, active: true, soldOut: false, allergens: ['gluten', 'lacteos', 'huevos'] },
  { id: 'pos-004', name: 'Helados Artesanos', description: 'Selección de 2 bolas de helado artesano. Consulta los sabores del día.', price: 5.5, category: 'postres', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=800', rating: 4.6, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['lacteos'] },

  // Bebidas
  { id: 'beb-001', name: 'Caña de Cerveza', description: 'Cerveza de barril bien fría. Variedad del día según temporada.', price: 2.5, category: 'bebidas', image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=800', rating: 4.7, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['gluten'] },
  { id: 'beb-002', name: 'Vino de la Casa', description: 'Copa de vino tinto, blanco o rosado de la bodega de la casa.', price: 3.5, category: 'bebidas', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800', rating: 4.5, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['sulfitos'] },
  { id: 'beb-003', name: 'Agua Mineral', description: 'Agua mineral natural o con gas. Botella de 50cl.', price: 2.0, category: 'bebidas', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=800', rating: 4.0, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: [] },
  { id: 'beb-004', name: 'Refresco', description: 'Coca-Cola, Fanta Naranja, Fanta Limón, Sprite o agua con gas.', price: 2.5, category: 'bebidas', image: 'https://images.unsplash.com/photo-1561758033-7e924f619b47?w=800', rating: 4.2, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: [] },
  { id: 'beb-005', name: 'Café Espresso', description: 'Café espresso de especialidad. Solo, cortado, con leche o americano.', price: 1.8, category: 'bebidas', image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800', rating: 4.6, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: [] },

  // Combinados
  { id: 'com-001', name: 'Gin Tonic Hakuna', description: 'Gin premium con tónica artesanal, pimienta rosa, cardamomo y piel de lima.', price: 9.5, category: 'combinados', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800', rating: 4.8, isRecommended: true, spicy: 0, isNew: false, active: true, soldOut: false, allergens: [] },
  { id: 'com-002', name: 'Mojito Clásico', description: 'Ron blanco, menta fresca, lima, azúcar moreno y soda.', price: 8.5, category: 'combinados', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=800', rating: 4.7, isRecommended: true, spicy: 0, isNew: false, active: true, soldOut: false, allergens: [] },
  { id: 'com-003', name: 'Aperol Spritz', description: 'Aperol, prosecco y soda con naranja fresca.', price: 8.0, category: 'combinados', image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=800', rating: 4.6, isRecommended: false, spicy: 0, isNew: true, active: true, soldOut: false, allergens: ['sulfitos'] },
  { id: 'com-004', name: 'Daiquiri de Fresa', description: 'Ron blanco, zumo de lima fresco, fresas naturales y azúcar.', price: 8.5, category: 'combinados', image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=800', rating: 4.5, isRecommended: false, spicy: 0, isNew: false, active: true, soldOut: false, allergens: [] },
  { id: 'com-005', name: 'Sangría de la Casa', description: 'Sangría artesanal con vino tinto, brandy, frutas de temporada y un toque secreto. Por jarra.', price: 14.0, category: 'combinados', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800', rating: 4.8, isRecommended: true, spicy: 0, isNew: false, active: true, soldOut: false, allergens: ['sulfitos'] },
]

export const defaultBusinessInfo: BusinessInfo = {
  name: 'Hakuna Bar',
  tagline: 'Tu rincón favorito en Mairena del Aljarafe',
  description: 'En Hakuna Bar creemos que los mejores momentos se viven alrededor de una buena mesa. Cocina casera con productos de primera calidad, un ambiente acogedor y el mejor servicio.',
  address: 'Mairena del Aljarafe, Sevilla',
  phone: '+34 XXX XXX XXX',
  email: 'info@hakunabar.es',
  instagram: 'https://www.instagram.com/hakuna_mairena_aljarafe/',
  facebook: 'https://www.facebook.com/HakunaBarr/',
  googleMaps: 'https://www.google.es/maps/?cid=8326573138277151285',
  whatsapp: '+34XXXXXXXXX',
  googleRating: 4.7,
  totalReviews: 156,
  schedule: [
    { day: 'Lunes', hours: 'Cerrado' },
    { day: 'Martes', hours: '12:00 - 00:00' },
    { day: 'Miércoles', hours: '12:00 - 00:00' },
    { day: 'Jueves', hours: '12:00 - 00:00' },
    { day: 'Viernes', hours: '12:00 - 01:00' },
    { day: 'Sábado', hours: '12:00 - 01:00' },
    { day: 'Domingo', hours: '12:00 - 00:00' },
  ],
}

export const defaultGalleryImages: GalleryImage[] = [
  { id: 'g1', src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800', alt: 'Interior del bar', order: 1, active: true },
  { id: 'g2', src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', alt: 'Terraza exterior', order: 2, active: true },
  { id: 'g3', src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', alt: 'Zona de barra', order: 3, active: true },
  { id: 'g4', src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', alt: 'Detalle decoración', order: 4, active: true },
  { id: 'g5', src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800', alt: 'Eventos y celebraciones', order: 5, active: true },
  { id: 'g6', src: 'https://images.unsplash.com/photo-1485686531765-ba63b07845a7?w=800', alt: 'Tapas variadas', order: 6, active: true },
  { id: 'g7', src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', alt: 'Platos principales', order: 7, active: true },
  { id: 'g8', src: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800', alt: 'Cócteles', order: 8, active: true },
]

export const defaultReviews: Review[] = [
  { id: 'r1', author: 'María García', rating: 5, text: 'El mejor bar de Mairena sin duda. Las croquetas de jamón están espectaculares y el trato es inmejorable.', date: '2024-11-15', avatar: 'MG', visible: true, featured: true },
  { id: 'r2', author: 'Antonio López', rating: 5, text: 'Fuimos a cenar un sábado y quedamos encantados. El secreto ibérico estaba en su punto perfecto.', date: '2024-10-28', avatar: 'AL', visible: true, featured: false },
  { id: 'r3', author: 'Carmen Ruiz', rating: 4, text: 'Muy buen ambiente y comida casera de calidad. La tarta de queso es adictiva.', date: '2024-12-03', avatar: 'CR', visible: true, featured: false },
  { id: 'r4', author: 'Javier Moreno', rating: 5, text: 'Celebramos un cumpleaños aquí y fue todo perfecto. El personal super atento y la comida riquísima.', date: '2024-09-20', avatar: 'JM', visible: true, featured: true },
  { id: 'r5', author: 'Laura Fernández', rating: 5, text: 'Descubrimos este bar por casualidad y ahora es nuestro sitio favorito. Los montaditos de pringá son los mejores.', date: '2024-11-05', avatar: 'LF', visible: true, featured: false },
  { id: 'r6', author: 'Pablo Sánchez', rating: 4, text: 'Buen sitio para ir de tapas con amigos. Precios razonables y buena relación calidad-precio.', date: '2024-08-18', avatar: 'PS', visible: true, featured: false },
  { id: 'r7', author: 'Elena Martín', rating: 5, text: 'Un bar con encanto en Mairena. La decoración es muy acogedora y la carta tiene mucha variedad.', date: '2024-12-10', avatar: 'EM', visible: true, featured: true },
  { id: 'r8', author: 'Francisco Jiménez', rating: 5, text: 'Vengo todos los fines de semana. El tinto de verano y las tapas son perfectos.', date: '2024-10-12', avatar: 'FJ', visible: true, featured: false },
]

export const defaultDailyMenu: DailyMenu = {
  id: 'dm-default',
  date: new Date().toISOString().split('T')[0],
  active: true,
  price: 12.50,
  firstCourses: [
    { id: 'fc1', name: 'Sopa de cocido', description: 'Sopa de fideos con caldo casero de cocido' },
    { id: 'fc2', name: 'Ensalada mixta', description: 'Lechuga, tomate, cebolla, atún y aceitunas' },
    { id: 'fc3', name: 'Crema de verduras', description: 'Crema de calabacín, puerro y zanahoria' },
  ],
  secondCourses: [
    { id: 'sc1', name: 'Pollo al horno', description: 'Pollo asado con patatas panaderas' },
    { id: 'sc2', name: 'Merluza a la plancha', description: 'Con ensalada y limón' },
    { id: 'sc3', name: 'Albóndigas caseras', description: 'En salsa de tomate con patatas fritas' },
  ],
  desserts: [
    { id: 'd1', name: 'Fruta del tiempo', description: '' },
    { id: 'd2', name: 'Flan casero', description: '' },
    { id: 'd3', name: 'Helado', description: '' },
  ],
  includesDrink: true,
  includesBread: true,
  notes: 'Menú disponible de lunes a viernes, de 13:00 a 16:00',
}
