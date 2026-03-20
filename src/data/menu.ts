import { Product, AVAILABLE_EXTRAS } from '@/types/menu';

import tacosHarina from '@/assets/tacos-harina.png';
import tacosMaiz from '@/assets/tacos-maiz.png';
import tacoDorado from '@/assets/taco-dorado.png';
import lorenzasVolcan from '@/assets/lorenzas-volcan.png';
import quesadillas from '@/assets/quesadillas.png';
import chorreadasGorditas from '@/assets/chorreadas-gorditas.png';
import toritos from '@/assets/toritos.png';
import gringas from '@/assets/gringas.png';
import tacoMacho from '@/assets/taco-macho.png';
import tacoTripa from '@/assets/taco-tripa.png';
import aguaHorchata from '@/assets/agua-horchata.png';
import aguaCebada from '@/assets/agua-cebada.png';
import aguaJamaica from '@/assets/agua-jamaica.png';
import aguaPina from '@/assets/agua-pina.png';
import aguaTamarindo from '@/assets/agua-tamarindo.png';
import cocaCola from '@/assets/coca-cola.png';

// Promociones
import promoTaquera from '@/assets/promo-taquera.png';
import promoChorreada from '@/assets/promo-chorreada.png';
import promoTorito from '@/assets/promo-torito.png';
import promoQuesadilla from '@/assets/promo-quesadilla.png';

export const MENU_PRODUCTS: Product[] = [
  // PROMOCIONES
  {
    id: 'promo-taquera',
    name: 'Promo Taquera',
    description: '3 tacos de harina o maíz a elegir, 1 porción de frijoles charros y 1/2 litro de agua de sabor a elegir. Incluye: Repollo, aguacate, salsa de jugo de tomate, pepino, salsa verde, zanahoria, salsa tatemada y cebollita asada.',
    price: 135,
    image: promoTaquera,
    category: 'promociones',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'promo-chorreada',
    name: 'Promo Chorreada Completa',
    description: '2 Chorreadas (gordita de masa con asiento, queso y carne), 1 litro de agua fresca a elegir y 2 porciones de frijoles charros. Incluye: Repollo, aguacate, salsa de jugo de tomate, pepino, salsa verde, zanahoria, salsa tatemada y cebollita asada.',
    price: 199,
    image: promoChorreada,
    category: 'promociones',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'promo-torito',
    name: 'Promo Torito Especial',
    description: '2 Toritos (chile verde relleno de carne asada con queso gratinado), 1 litro de agua a elegir y 2 porciones de frijoles charros. Incluye: Repollo, aguacate, salsa de jugo de tomate, pepino, salsa verde, zanahoria, salsa tatemada y cebollita asada.',
    price: 199,
    image: promoTorito,
    category: 'promociones',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'promo-quesadilla',
    name: 'Promo Quesadilla Completa',
    description: '2 Quesadillas, 1 litro de agua fresca a elegir y 2 porciones de frijoles charros. Incluye: Repollo, aguacate, salsa de jugo de tomate, pepino, salsa verde, zanahoria, salsa tatemada y cebollita asada.',
    price: 199,
    image: promoQuesadilla,
    category: 'promociones',
    extras: AVAILABLE_EXTRAS,
  },

  // PLATILLOS
  {
    id: 'tacos-harina',
    name: 'Tacos de Harina',
    description: 'Deliciosos tacos en tortilla de harina con carne asada a las brasas, repollo, jugo de tomate y salsa verde.',
    price: 40,
    image: tacosHarina,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'tacos-maiz',
    name: 'Tacos de Maíz',
    description: 'Tacos tradicionales en tortilla de maíz con carne asada, repollo, jugo de tomate y salsa verde.',
    price: 40,
    image: tacosMaiz,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'taco-dorado',
    name: 'Taco Dorado',
    description: 'Taco frito crujiente relleno de carne, acompañado de lechuga, crema, repollo, jugo de tomate y salsa verde.',
    price: 40,
    image: tacoDorado,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'lorenzas-volcan',
    name: 'Lorenzas / Volcán',
    description: 'Tortilla gruesa de maíz con queso fundido, carne asada, repollo, jugo de tomate y salsa verde. ¡Una explosión de sabor!',
    price: 50,
    image: lorenzasVolcan,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'quesadillas',
    name: 'Quesadillas',
    description: 'Tortilla casera con abundante queso, carne asada, repollo, jugo de tomate y salsa verde.',
    price: 80,
    sizes: [
      { id: 'harina', name: 'De Harina', price: 80 },
      { id: 'maiz', name: 'De Maíz', price: 80 },
    ],
    image: quesadillas,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'caramelo',
    name: 'Platillo Caramelo',
    description: 'Quesadilla con tortilla casera con carne asada, frijol y queso fundido, con repollo, jugo de tomate y salsa verde.',
    price: 90,
    sizes: [
      { id: 'harina', name: 'De Harina', price: 90 },
      { id: 'maiz', name: 'De Maíz', price: 90 },
    ],
    image: quesadillas,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'chorreadas-gorditas',
    name: 'Chorreadas / Gorditas',
    description: 'Gorditas de masa con asiento o frijol y queso fundido, con repollo, jugo de tomate y salsa verde.',
    price: 85,
    image: chorreadasGorditas,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'toritos',
    name: 'Toritos',
    description: 'Chile relleno de carne asada con queso gratinado sobre una tortilla de harina o maíz, con repollo, jugo de tomate y salsa verde.',
    price: 90,
    sizes: [
      { id: 'harina', name: 'De Harina', price: 90 },
      { id: 'maiz', name: 'De Maíz', price: 90 },
    ],
    image: toritos,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'gringas',
    name: 'Gringas',
    description: 'Quesadilla de harina empalmada en tortilla taquera con delicioso queso fundido y carne asada, con repollo, jugo de tomate y salsa verde.',
    price: 80,
    sizes: [
      { id: 'harina', name: 'De Harina', price: 80 },
      { id: 'maiz', name: 'De Maíz', price: 80 },
    ],
    image: gringas,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'taco-macho',
    name: 'Taco Macho',
    description: 'Taco con tortilla taquera empalmada con queso fundido, guacamole, con repollo, jugo de tomate y salsa verde.',
    price: 85,
    sizes: [
      { id: 'harina', name: 'De Harina', price: 85 },
      { id: 'maiz', name: 'De Maíz', price: 85 },
    ],
    image: tacoMacho,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'taco-tripa',
    name: 'Taco de Tripa',
    description: 'Taco con tripa asada crujiente, repollo, jugo de tomate, salsa verde y limón. El clásico de la taquería.',
    price: 40,
    image: tacoTripa,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },

  // BEBIDAS
  {
    id: 'agua-horchata',
    name: 'Agua de Horchata',
    description: 'Refrescante agua de arroz con canela. Dulce y cremosa.',
    price: 25,
    sizes: [
      { id: 'medio', name: '1/2 Litro', price: 25 },
      { id: 'litro', name: '1 Litro', price: 35 },
    ],
    image: aguaHorchata,
    category: 'bebidas',
    extras: [],
  },
  {
    id: 'agua-cebada',
    name: 'Agua de Cebada',
    description: 'Agua fresca de cebada, suave y refrescante.',
    price: 25,
    sizes: [
      { id: 'medio', name: '1/2 Litro', price: 25 },
      { id: 'litro', name: '1 Litro', price: 35 },
    ],
    image: aguaCebada,
    category: 'bebidas',
    extras: [],
  },
  {
    id: 'agua-jamaica',
    name: 'Agua de Jamaica',
    description: 'Agua fresca de flor de jamaica, refrescante y un poco ácida.',
    price: 25,
    sizes: [
      { id: 'medio', name: '1/2 Litro', price: 25 },
      { id: 'litro', name: '1 Litro', price: 35 },
    ],
    image: aguaJamaica,
    category: 'bebidas',
    extras: [],
  },
  {
    id: 'agua-pina',
    name: 'Agua de Piña',
    description: 'Agua fresca de piña natural, dulce y tropical.',
    price: 25,
    sizes: [
      { id: 'medio', name: '1/2 Litro', price: 25 },
      { id: 'litro', name: '1 Litro', price: 35 },
    ],
    image: aguaPina,
    category: 'bebidas',
    extras: [],
  },
  {
    id: 'agua-tamarindo',
    name: 'Agua de Tamarindo',
    description: 'Agua fresca de tamarindo, con su toque dulce-ácido inconfundible.',
    price: 25,
    sizes: [
      { id: 'medio', name: '1/2 Litro', price: 25 },
      { id: 'litro', name: '1 Litro', price: 35 },
    ],
    image: aguaTamarindo,
    category: 'bebidas',
    extras: [],
  },
  {
    id: 'coca-cola-355',
    name: 'Coca-Cola 355ml',
    description: 'Coca-Cola de 355ml bien fría.',
    price: 20,
    image: cocaCola,
    category: 'bebidas',
    extras: [],
  },
  {
    id: 'coca-cola-600',
    name: 'Coca-Cola 600ml',
    description: 'Coca-Cola de 600ml bien fría.',
    price: 25,
    image: cocaCola,
    category: 'bebidas',
    extras: [],
  },
];
