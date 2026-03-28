export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  rating: number;
  isRecommended: boolean;
  spicy?: number; // 0-3
  isNew?: boolean;
  soldOut: boolean;
  allergens: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  avatar: string;
}

export const ALLERGENS: Record<string, { name: string; icon: string }> = {
  gluten: { name: 'Gluten', icon: '🌾' },
  crustaceos: { name: 'Crustáceos', icon: '🦐' },
  huevos: { name: 'Huevos', icon: '🥚' },
  pescado: { name: 'Pescado', icon: '🐟' },
  cacahuetes: { name: 'Cacahuetes', icon: '🥜' },
  soja: { name: 'Soja', icon: '🫘' },
  lacteos: { name: 'Lácteos', icon: '🥛' },
  frutos_cascara: { name: 'Frutos de cáscara', icon: '🌰' },
  apio: { name: 'Apio', icon: '🥬' },
  mostaza: { name: 'Mostaza', icon: '🟡' },
  sesamo: { name: 'Sésamo', icon: '⚪' },
  sulfitos: { name: 'Sulfitos', icon: '🍷' },
  altramuces: { name: 'Altramuces', icon: '🫛' },
  moluscos: { name: 'Moluscos', icon: '🦑' },
};

export const categories: Category[] = [
  { id: 'tapas', name: 'Tapas y Entrantes', icon: '🍢', description: 'Nuestras tapas tradicionales' },
  { id: 'montaditos', name: 'Montaditos y Tostas', icon: '🥖', description: 'Pan artesano con los mejores ingredientes' },
  { id: 'raciones', name: 'Raciones', icon: '🍽️', description: 'Para compartir en buena compañía' },
  { id: 'carnes', name: 'Carnes a la Brasa', icon: '🥩', description: 'Cortes selectos a la parrilla' },
  { id: 'pescados', name: 'Pescados', icon: '🐟', description: 'Frescura del mar a tu mesa' },
  { id: 'hamburguesas', name: 'Hamburguesas', icon: '🍔', description: 'Nuestras burgers artesanales' },
  { id: 'postres', name: 'Postres', icon: '🍰', description: 'El broche perfecto' },
  { id: 'bebidas', name: 'Bebidas', icon: '🍺', description: 'Refréscate' },
  { id: 'cocteles', name: 'Cócteles', icon: '🍹', description: 'Preparados con alma' },
];

export const menuItems: MenuItem[] = [
  // TAPAS
  {
    id: '1', name: 'Salmorejo Cordobés', description: 'Crema fría de tomate con jamón ibérico y huevo duro',
    price: 4.50, category: 'tapas', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=600',
    rating: 4.8, isRecommended: true,
    soldOut: false, allergens: ['huevos'],
  },
  {
    id: '2', name: 'Croquetas Caseras de Jamón', description: '6 unidades de croquetas cremosas de jamón ibérico',
    price: 7.00, category: 'tapas', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600',
    rating: 4.9, isRecommended: true, isNew: false,
    soldOut: false, allergens: ['gluten', 'lacteos', 'huevos'],
  },
  {
    id: '3', name: 'Patatas Bravas con Alioli', description: 'Patatas fritas crujientes con salsa brava y alioli casero',
    price: 5.50, category: 'tapas', image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600',
    rating: 4.6, isRecommended: false,
    soldOut: false, allergens: ['huevos'],
  },
  {
    id: '4', name: 'Ensaladilla Rusa', description: 'Receta tradicional con atún, patata y mayonesa casera',
    price: 5.00, category: 'tapas', image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=600',
    rating: 4.5, isRecommended: false,
    soldOut: false, allergens: ['pescado', 'huevos'],
  },
  {
    id: '5', name: 'Gambas al Ajillo', description: 'Gambas salteadas en aceite de oliva con ajo y guindilla',
    price: 9.50, category: 'tapas', image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600',
    rating: 4.9, isRecommended: true, spicy: 1,
    soldOut: false, allergens: ['crustaceos'],
  },
  {
    id: '6', name: 'Tortilla Española', description: 'Jugosa tortilla de patatas con cebolla caramelizada',
    price: 5.50, category: 'tapas', image: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600',
    rating: 4.7, isRecommended: true,
    soldOut: false, allergens: ['huevos'],
  },
  {
    id: '7', name: 'Flamenquín Cordobés', description: 'Rollito de lomo relleno de jamón empanado y frito',
    price: 7.50, category: 'tapas', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600',
    rating: 4.6, isRecommended: false,
    soldOut: false, allergens: ['gluten', 'huevos'],
  },
  {
    id: '8', name: 'Chicharrones', description: 'Crujientes chicharrones de cerdo con limón',
    price: 6.00, category: 'tapas', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600',
    rating: 4.4, isRecommended: false,
    soldOut: false, allergens: [],
  },
  // MONTADITOS
  {
    id: '9', name: 'Montadito de Pringá', description: 'Pan crujiente con pringá tradicional sevillana',
    price: 3.50, category: 'montaditos', image: 'https://images.unsplash.com/photo-1481070555726-e2fe8357b3e3?w=600',
    rating: 4.7, isRecommended: true,
    soldOut: false, allergens: ['gluten'],
  },
  {
    id: '10', name: 'Tosta de Salmón Ahumado', description: 'Con queso crema, alcaparras y eneldo',
    price: 5.50, category: 'montaditos', image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=600',
    rating: 4.5, isRecommended: false,
    soldOut: false, allergens: ['gluten', 'pescado', 'lacteos'],
  },
  {
    id: '11', name: 'Montadito de Lomo con Queso', description: 'Lomo adobado a la plancha con queso fundido',
    price: 4.00, category: 'montaditos', image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600',
    rating: 4.6, isRecommended: false,
    soldOut: false, allergens: ['gluten', 'lacteos'],
  },
  {
    id: '12', name: 'Tosta de Jamón Ibérico', description: 'Pan de cristal con tomate rallado y jamón de bellota',
    price: 6.00, category: 'montaditos', image: 'https://images.unsplash.com/photo-1432139509613-5c4255a1d197?w=600',
    rating: 4.9, isRecommended: true,
    soldOut: false, allergens: ['gluten'],
  },
  // RACIONES
  {
    id: '13', name: 'Jamón Ibérico de Bellota', description: 'Cortado a cuchillo, curación mínima 36 meses',
    price: 19.00, category: 'raciones', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600',
    rating: 5.0, isRecommended: true,
    soldOut: false, allergens: [],
  },
  {
    id: '14', name: 'Queso Curado con Mermelada', description: 'Queso manchego curado con mermelada de higos',
    price: 12.00, category: 'raciones', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600',
    rating: 4.7, isRecommended: false,
    soldOut: false, allergens: ['lacteos'],
  },
  {
    id: '15', name: 'Tabla de Ibéricos', description: 'Selección de jamón, lomo, chorizo y salchichón ibéricos',
    price: 16.00, category: 'raciones', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600',
    rating: 4.8, isRecommended: true,
    soldOut: false, allergens: [],
  },
  {
    id: '16', name: 'Chopitos Fritos', description: 'Tiernos chopitos rebozados con limón',
    price: 10.00, category: 'raciones', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600',
    rating: 4.5, isRecommended: false,
    soldOut: false, allergens: ['gluten', 'moluscos'],
  },
  {
    id: '17', name: 'Calamares a la Andaluza', description: 'Anillas crujientes con alioli y limón',
    price: 11.00, category: 'raciones', image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600',
    rating: 4.6, isRecommended: false,
    soldOut: false, allergens: ['gluten', 'huevos', 'moluscos'],
  },
  // CARNES
  {
    id: '18', name: 'Secreto Ibérico', description: 'A la brasa con patatas panaderas y pimientos del piquillo',
    price: 14.00, category: 'carnes', image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=600',
    rating: 4.9, isRecommended: true,
    soldOut: false, allergens: [],
  },
  {
    id: '19', name: 'Presa Ibérica', description: 'Jugosa presa a la parrilla con reducción de Pedro Ximénez',
    price: 13.50, category: 'carnes', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600',
    rating: 4.8, isRecommended: true,
    soldOut: false, allergens: ['sulfitos'],
  },
  {
    id: '20', name: 'Solomillo de Ternera', description: 'Corte premium con salsa de setas y patatas',
    price: 16.00, category: 'carnes', image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=600',
    rating: 4.9, isRecommended: true,
    soldOut: false, allergens: [],
  },
  {
    id: '21', name: 'Pollo de Corral a la Brasa', description: 'Medio pollo marinado con hierbas provenzales',
    price: 12.00, category: 'carnes', image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=600',
    rating: 4.5, isRecommended: false,
    soldOut: false, allergens: [],
  },
  // PESCADOS
  {
    id: '22', name: 'Atún Rojo a la Plancha', description: 'Corte grueso de atún con verduras salteadas y soja',
    price: 15.00, category: 'pescados', image: 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600',
    rating: 4.8, isRecommended: true,
    soldOut: false, allergens: ['pescado', 'soja'],
  },
  {
    id: '23', name: 'Bacalao Gratinado', description: 'Con alioli gratinado, sobre cama de pisto manchego',
    price: 13.00, category: 'pescados', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600',
    rating: 4.6, isRecommended: false,
    soldOut: false, allergens: ['pescado', 'huevos'],
  },
  {
    id: '24', name: 'Fritura Malagueña', description: 'Variado de pescado frito: boquerones, calamares, gambas y chopitos',
    price: 12.00, category: 'pescados', image: 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?w=600',
    rating: 4.7, isRecommended: true,
    soldOut: false, allergens: ['gluten', 'pescado', 'crustaceos', 'moluscos'],
  },
  // HAMBURGUESAS
  {
    id: '25', name: 'Hakuna Burger', description: '200g de ternera, cheddar, bacon crujiente, cebolla caramelizada y salsa especial',
    price: 10.50, category: 'hamburguesas', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600',
    rating: 4.9, isRecommended: true, isNew: true,
    soldOut: false, allergens: ['gluten', 'lacteos', 'huevos', 'mostaza'],
  },
  {
    id: '26', name: 'Burger Clásica', description: '150g de ternera con lechuga, tomate, queso y salsa burger',
    price: 8.50, category: 'hamburguesas', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600',
    rating: 4.5, isRecommended: false,
    soldOut: false, allergens: ['gluten', 'lacteos', 'huevos'],
  },
  {
    id: '27', name: 'Pollo Crispy Burger', description: 'Pechuga empanada crujiente con coleslaw y salsa ranch',
    price: 9.00, category: 'hamburguesas', image: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600',
    rating: 4.6, isRecommended: false,
    soldOut: false, allergens: ['gluten', 'huevos', 'lacteos', 'mostaza'],
  },
  {
    id: '28', name: 'Vegana Beyond', description: 'Beyond Meat con aguacate, rúcula y salsa vegana',
    price: 10.00, category: 'hamburguesas', image: 'https://images.unsplash.com/photo-1520072959219-c595e6cdc07a?w=600',
    rating: 4.4, isRecommended: false,
    soldOut: true, allergens: ['gluten', 'soja'],
  },
  // POSTRES
  {
    id: '29', name: 'Tarta de Queso Casera', description: 'Nuestra famosa tarta de queso horneada con base de galleta',
    price: 5.50, category: 'postres', image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600',
    rating: 4.9, isRecommended: true,
    soldOut: false, allergens: ['gluten', 'lacteos', 'huevos'],
  },
  {
    id: '30', name: 'Coulant de Chocolate', description: 'Bizcocho caliente con corazón de chocolate fundido y helado de vainilla',
    price: 6.00, category: 'postres', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=600',
    rating: 4.8, isRecommended: true,
    soldOut: false, allergens: ['gluten', 'lacteos', 'huevos'],
  },
  {
    id: '31', name: 'Crema Catalana', description: 'Crema tradicional con azúcar quemado y canela',
    price: 4.50, category: 'postres', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600',
    rating: 4.5, isRecommended: false,
    soldOut: false, allergens: ['lacteos', 'huevos'],
  },
  // BEBIDAS
  {
    id: '32', name: 'Cerveza Caña', description: 'Caña de cerveza bien fría (Cruzcampo/Alhambra)',
    price: 1.80, category: 'bebidas', image: 'https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600',
    rating: 4.5, isRecommended: false,
    soldOut: false, allergens: ['gluten'],
  },
  {
    id: '33', name: 'Cerveza Jarra', description: 'Jarra de cerveza (500ml)',
    price: 3.00, category: 'bebidas', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600',
    rating: 4.5, isRecommended: false,
    soldOut: false, allergens: ['gluten'],
  },
  {
    id: '34', name: 'Tinto de Verano', description: 'Con limón o casera, refresco sevillano por excelencia',
    price: 2.50, category: 'bebidas', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600',
    rating: 4.6, isRecommended: true,
    soldOut: false, allergens: ['sulfitos'],
  },
  {
    id: '35', name: 'Copa de Vino', description: 'Tinto o blanco, selección de la casa',
    price: 3.00, category: 'bebidas', image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600',
    rating: 4.4, isRecommended: false,
    soldOut: false, allergens: ['sulfitos'],
  },
  {
    id: '36', name: 'Refresco', description: 'Coca-Cola, Fanta, Sprite, Aquarius',
    price: 2.00, category: 'bebidas', image: 'https://images.unsplash.com/photo-1581636625402-29b2a704ef13?w=600',
    rating: 4.0, isRecommended: false,
    soldOut: false, allergens: [],
  },
  // CÓCTELES
  {
    id: '37', name: 'Mojito', description: 'Ron, hierbabuena fresca, lima, azúcar y soda',
    price: 7.00, category: 'cocteles', image: 'https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=600',
    rating: 4.7, isRecommended: true,
    soldOut: false, allergens: [],
  },
  {
    id: '38', name: 'Gin Tonic Premium', description: 'Ginebra premium con tónica y botánicos seleccionados',
    price: 9.00, category: 'cocteles', image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600',
    rating: 4.8, isRecommended: true,
    soldOut: false, allergens: [],
  },
  {
    id: '39', name: 'Margarita', description: 'Tequila, triple sec, zumo de lima y borde de sal',
    price: 8.00, category: 'cocteles', image: 'https://images.unsplash.com/photo-1556855810-ac404aa91e85?w=600',
    rating: 4.6, isRecommended: false,
    soldOut: false, allergens: [],
  },
  {
    id: '40', name: 'Aperol Spritz', description: 'Aperol, prosecco y soda con rodaja de naranja',
    price: 8.00, category: 'cocteles', image: 'https://images.unsplash.com/photo-1560512823-829485b8bf24?w=600',
    rating: 4.7, isRecommended: true,
    soldOut: false, allergens: ['sulfitos'],
  },
];

export const reviews: Review[] = [
  { id: '1', author: 'María García', rating: 5, text: 'El mejor bar de Mairena sin duda. Las croquetas de jamón están espectaculares y el trato es inmejorable. Siempre repetimos con amigos.', date: '2024-11-15', avatar: 'MG' },
  { id: '2', author: 'Antonio López', rating: 5, text: 'Fuimos a cenar un sábado y quedamos encantados. El secreto ibérico estaba en su punto perfecto. Volveremos seguro.', date: '2024-10-28', avatar: 'AL' },
  { id: '3', author: 'Carmen Ruiz', rating: 4, text: 'Muy buen ambiente y comida casera de calidad. La tarta de queso es adictiva. Solo pongo 4 estrellas porque a veces hay que esperar un poco.', date: '2024-12-03', avatar: 'CR' },
  { id: '4', author: 'Javier Moreno', rating: 5, text: 'Celebramos un cumpleaños aquí y fue todo perfecto. El personal super atento y la comida riquísima. La Hakuna Burger es brutal.', date: '2024-09-20', avatar: 'JM' },
  { id: '5', author: 'Laura Fernández', rating: 5, text: 'Descubrimos este bar por casualidad y ahora es nuestro sitio favorito. Los montaditos de pringá son los mejores de la zona.', date: '2024-11-05', avatar: 'LF' },
  { id: '6', author: 'Pablo Sánchez', rating: 4, text: 'Buen sitio para ir de tapas con amigos. Precios razonables y buena relación calidad-precio. Las gambas al ajillo están de 10.', date: '2024-08-18', avatar: 'PS' },
  { id: '7', author: 'Elena Martín', rating: 5, text: 'Un bar con encanto en Mairena. La decoración es muy acogedora y la carta tiene mucha variedad. Recomiendo el atún rojo.', date: '2024-12-10', avatar: 'EM' },
  { id: '8', author: 'Francisco Jiménez', rating: 5, text: 'Vengo todos los fines de semana. El tinto de verano y las tapas son perfectos para el fin de semana. Gran ambiente.', date: '2024-10-12', avatar: 'FJ' },
];

export const galleryImages = [
  { src: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800', alt: 'Interior del bar' },
  { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800', alt: 'Terraza exterior' },
  { src: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', alt: 'Zona de barra' },
  { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800', alt: 'Detalle decoración' },
  { src: 'https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?w=800', alt: 'Eventos y celebraciones' },
  { src: 'https://images.unsplash.com/photo-1485686531765-ba63b07845a7?w=800', alt: 'Tapas variadas' },
  { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800', alt: 'Platos principales' },
  { src: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=800', alt: 'Cócteles' },
];

export const businessInfo = {
  name: 'Hakuna Bar',
  tagline: 'Tu rincón favorito en Mairena del Aljarafe',
  description: 'En Hakuna Bar creemos que los mejores momentos se viven alrededor de una buena mesa. Cocina casera con productos de primera calidad, un ambiente acogedor y el mejor servicio. Ven a disfrutar de nuestras tapas, raciones y platos a la brasa en el corazón de Mairena del Aljarafe.',
  address: 'Mairena del Aljarafe, Sevilla',
  phone: '+34 XXX XXX XXX',
  email: 'info@hakunabar.es',
  instagram: 'https://www.instagram.com/hakuna_mairena_aljarafe/',
  facebook: 'https://www.facebook.com/HakunaBarr/',
  googleMaps: 'https://www.google.es/maps/?cid=8326573138277151285',
  schedule: [
    { day: 'Lunes', hours: 'Cerrado' },
    { day: 'Martes', hours: '12:00 - 00:00' },
    { day: 'Miércoles', hours: '12:00 - 00:00' },
    { day: 'Jueves', hours: '12:00 - 00:00' },
    { day: 'Viernes', hours: '12:00 - 01:00' },
    { day: 'Sábado', hours: '12:00 - 01:00' },
    { day: 'Domingo', hours: '12:00 - 00:00' },
  ],
  googleRating: 4.7,
  totalReviews: 156,
};
