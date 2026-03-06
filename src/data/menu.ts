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

export const MENU_PRODUCTS: Product[] = [
  // PLATILLOS
  {
    id: 'tacos-harina',
    name: 'Tacos de Harina',
    description: 'Deliciosos tacos en tortilla de harina con carne asada a las brasas, cebollita y cilantro.',
    price: 30,
    image: tacosHarina,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'tacos-maiz',
    name: 'Tacos de Maíz',
    description: 'Tacos tradicionales en tortilla de maíz con carne asada, cebolla y cilantro.',
    price: 25,
    image: tacosMaiz,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'taco-dorado',
    name: 'Taco Dorado',
    description: 'Taco frito crujiente relleno de carne, acompañado de lechuga, crema y salsa.',
    price: 25,
    image: tacoDorado,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'lorenzas-volcan',
    name: 'Lorenzas / Volcán',
    description: 'Tortilla gruesa de maíz con queso fundido, carne asada y salsa. ¡Una explosión de sabor!',
    price: 35,
    image: lorenzasVolcan,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'quesadillas',
    name: 'Quesadillas',
    description: 'Tortilla de harina con abundante queso fundido y carne asada. Doraditas y crujientes.',
    price: 35,
    image: quesadillas,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'chorreadas-gorditas',
    name: 'Chorreadas / Gorditas',
    description: 'Gorditas de masa gruesa rellenas de carne asada, frijoles, queso y crema.',
    price: 35,
    image: chorreadasGorditas,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'toritos',
    name: 'Toritos',
    description: 'Chiles rellenos de queso y carne asada, capeados y doraditos. ¡Picositos y deliciosos!',
    price: 35,
    image: toritos,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'gringas',
    name: 'Gringas',
    description: 'Tortilla de harina con queso fundido, carne asada y piña asada. Combinación perfecta.',
    price: 40,
    image: gringas,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'taco-macho',
    name: 'Taco Macho',
    description: 'Taco jumbo en tortilla de harina con generosa porción de carne asada, frijoles, queso y guacamole.',
    price: 50,
    image: tacoMacho,
    category: 'platillos',
    extras: AVAILABLE_EXTRAS,
  },
  {
    id: 'taco-tripa',
    name: 'Taco de Tripa',
    description: 'Taco con tripa asada crujiente, cebolla, cilantro y limón. El clásico de la taquería.',
    price: 30,
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
    image: aguaHorchata,
    category: 'bebidas',
    extras: [],
  },
  {
    id: 'agua-cebada',
    name: 'Agua de Cebada',
    description: 'Agua fresca de cebada, suave y refrescante.',
    price: 25,
    image: aguaCebada,
    category: 'bebidas',
    extras: [],
  },
  {
    id: 'agua-jamaica',
    name: 'Agua de Jamaica',
    description: 'Agua fresca de flor de jamaica, refrescante y un poco ácida.',
    price: 25,
    image: aguaJamaica,
    category: 'bebidas',
    extras: [],
  },
  {
    id: 'agua-pina',
    name: 'Agua de Piña',
    description: 'Agua fresca de piña natural, dulce y tropical.',
    price: 25,
    image: aguaPina,
    category: 'bebidas',
    extras: [],
  },
  {
    id: 'agua-tamarindo',
    name: 'Agua de Tamarindo',
    description: 'Agua fresca de tamarindo, con su toque dulce-ácido inconfundible.',
    price: 25,
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
