import { Injectable, computed, signal } from '@angular/core';

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  /** Старая цена для отображения скидки */
  oldPrice?: number;
  categoryId: number;
  /** Основное изображение (первое из галереи) */
  imageUrl: string;
  /** Галерея изображений для карусели */
  images: string[];
  rating: number;
  reviews: number;
  weightGrams: number;
  kcal: number;
  prepMinutes: number;
  tags: string[];
}

export interface Category {
  id: number;
  name: string;
  emoji: string;
}

/** Хелпер для стабильных картинок из Unsplash */
const U = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

interface DishSeed {
  id: number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  categoryId: number;
  ids: string[];
  rating: number;
  reviews: number;
  weightGrams: number;
  kcal: number;
  prepMinutes: number;
  tags: string[];
}

const mk = (p: DishSeed): Dish => ({
  ...p,
  imageUrl: U(p.ids[0]),
  images: p.ids.map((id) => U(id)),
});

const DISHES: Dish[] = [
  // ─── Пицца ───
  mk({
    id: 1,
    name: 'Маргарита',
    description: 'Томаты, моцарелла, свежий базилик и оливковое масло на тонком тесте.',
    price: 550,
    oldPrice: 620,
    categoryId: 1,
    ids: ['photo-1574071318508-1cdbab80d002', 'photo-1513104890138-7c749659a591', 'photo-1594007654792-2f5430b18fd8'],
    rating: 4.8,
    reviews: 214,
    weightGrams: 450,
    kcal: 250,
    prepMinutes: 15,
    tags: ['Вегетарианское', 'Хит'],
  }),
  mk({
    id: 2,
    name: 'Пепперони',
    description: 'Пикантная пепперони, моцарелла и фирменный томатный соус.',
    price: 650,
    categoryId: 1,
    ids: ['photo-1628840042765-356cda07504e', 'photo-1513104890138-7c749659a591', 'photo-1574071318508-1cdbab80d002'],
    rating: 4.9,
    reviews: 388,
    weightGrams: 500,
    kcal: 280,
    prepMinutes: 15,
    tags: ['Острое', 'Хит'],
  }),
  mk({
    id: 3,
    name: 'Четыре сыра',
    description: 'Моцарелла, дорблю, пармезан и чеддер на сливочной основе.',
    price: 720,
    categoryId: 1,
    ids: ['photo-1513104890138-7c749659a591', 'photo-1628840042765-356cda07504e', 'photo-1565299624946-b28f40a0ae38'],
    rating: 4.7,
    reviews: 176,
    weightGrams: 480,
    kcal: 300,
    prepMinutes: 18,
    tags: ['Вегетарианское', 'Сырное'],
  }),
  mk({
    id: 4,
    name: 'Гавайская',
    description: 'Курица, ананасы, моцарелла и томатный соус.',
    price: 680,
    categoryId: 1,
    ids: ['photo-1594007654792-2f5430b18fd8', 'photo-1574071318508-1cdbab80d002', 'photo-1571407970349-bc81e7e96d47'],
    rating: 4.5,
    reviews: 132,
    weightGrams: 520,
    kcal: 260,
    prepMinutes: 16,
    tags: ['Новинка'],
  }),

  // ─── Суши ───
  mk({
    id: 5,
    name: 'Филадельфия',
    description: 'Лосось, сливочный сыр, огурец и нори. 8 кусочков.',
    price: 890,
    oldPrice: 990,
    categoryId: 2,
    ids: ['photo-1579584425555-c3ce17fd4351', 'photo-1617196034796-73dfa7b1fd56', 'photo-1553621042-f6e147245754'],
    rating: 4.9,
    reviews: 402,
    weightGrams: 350,
    kcal: 180,
    prepMinutes: 20,
    tags: ['Хит'],
  }),
  mk({
    id: 6,
    name: 'Калифорния',
    description: 'Краб, авокадо, огурец и икра тобико. 8 кусочков.',
    price: 750,
    categoryId: 2,
    ids: ['photo-1617196034796-73dfa7b1fd56', 'photo-1553621042-f6e147245754', 'photo-1579584425555-c3ce17fd4351'],
    rating: 4.6,
    reviews: 245,
    weightGrams: 320,
    kcal: 160,
    prepMinutes: 20,
    tags: ['Лёгкое'],
  }),
  mk({
    id: 7,
    name: 'Запечённый лосось',
    description: 'Лосось под сливочно-сырной шапкой, запечённый в печи.',
    price: 820,
    categoryId: 2,
    ids: ['photo-1580822184718-f6342f5e56e7', 'photo-1611143669185-af224c5e3252', 'photo-1553621042-f6e147245754'],
    rating: 4.8,
    reviews: 198,
    weightGrams: 340,
    kcal: 210,
    prepMinutes: 25,
    tags: ['Острое', 'Новинка'],
  }),
  mk({
    id: 8,
    name: 'Ролл с креветкой',
    description: 'Тигровая креветка, авокадо, спайси-соус и кунжут.',
    price: 690,
    categoryId: 2,
    ids: ['photo-1611143669185-af224c5e3252', 'photo-1579584425555-c3ce17fd4351', 'photo-1617196034796-73dfa7b1fd56'],
    rating: 4.7,
    reviews: 154,
    weightGrams: 300,
    kcal: 170,
    prepMinutes: 22,
    tags: ['Хит'],
  }),

  // ─── Бургеры ───
  mk({
    id: 9,
    name: 'Чизбургер Классик',
    description: 'Говяжья котлета, чеддер, салат, томат и фирменный соус.',
    price: 490,
    categoryId: 3,
    ids: ['photo-1568901346375-23c9450c58cd', 'photo-1553979459-d2229ba7433b', 'photo-1586190848861-99aa4a171e90'],
    rating: 4.7,
    reviews: 312,
    weightGrams: 300,
    kcal: 500,
    prepMinutes: 12,
    tags: ['Хит'],
  }),
  mk({
    id: 10,
    name: 'Двойной бекон',
    description: 'Двойная котлета, бекон, двойной чеддер и карамелизированный лук.',
    price: 690,
    oldPrice: 760,
    categoryId: 3,
    ids: ['photo-1553979459-d2229ba7433b', 'photo-1586190848861-99aa4a171e90', 'photo-1568901346375-23c9450c58cd'],
    rating: 4.9,
    reviews: 276,
    weightGrams: 420,
    kcal: 780,
    prepMinutes: 15,
    tags: ['Новинка'],
  }),
  mk({
    id: 11,
    name: 'Острый чикен',
    description: 'Куриное филе в остром кляре, коул-слоу и халапеньо.',
    price: 520,
    categoryId: 3,
    ids: ['photo-1572802415393-8d8d45f4f7fb', 'photo-1568901346375-23c9450c58cd', 'photo-1553979459-d2229ba7433b'],
    rating: 4.4,
    reviews: 143,
    weightGrams: 310,
    kcal: 560,
    prepMinutes: 14,
    tags: ['Острое'],
  }),
  mk({
    id: 12,
    name: 'Вегетарианский',
    description: 'Котлета из нута, гуакамоле, томат и свежий салат.',
    price: 450,
    categoryId: 3,
    ids: ['photo-1586190848861-99aa4a171e90', 'photo-1572802415393-8d8d45f4f7fb', 'photo-1568901346375-23c9450c58cd'],
    rating: 4.5,
    reviews: 98,
    weightGrams: 280,
    kcal: 420,
    prepMinutes: 13,
    tags: ['Вегетарианское'],
  }),

  // ─── Десерты ───
  mk({
    id: 13,
    name: 'Тирамису',
    description: 'Классический итальянский десерт с маскарпоне и кофе.',
    price: 420,
    categoryId: 4,
    ids: ['photo-1571877227200-a0d98ea607e9', 'photo-1551024506-0bccd828d307', 'photo-1565958011703-44f9829ba187'],
    rating: 4.8,
    reviews: 231,
    weightGrams: 180,
    kcal: 320,
    prepMinutes: 5,
    tags: ['Вегетарианское', 'Хит'],
  }),
  mk({
    id: 14,
    name: 'Чизкейк',
    description: 'Нежный сливочный чизкейк на песочной основе.',
    price: 390,
    categoryId: 4,
    ids: ['photo-1533134242453-ee4f3b1b1f3f', 'photo-1551024506-0bccd828d307', 'photo-1565958011703-44f9829ba187'],
    rating: 4.6,
    reviews: 187,
    weightGrams: 160,
    kcal: 350,
    prepMinutes: 5,
    tags: ['Вегетарианское', 'Без глютена'],
  }),
  mk({
    id: 15,
    name: 'Шоколадный фондан',
    description: 'Тёплый кекс с жидкой шоколадной сердцевиной.',
    price: 450,
    categoryId: 4,
    ids: ['photo-1624353365286-3f8d66c1605e', 'photo-1551024506-0bccd828d307', 'photo-1571877227200-a0d98ea607e9'],
    rating: 4.9,
    reviews: 265,
    weightGrams: 150,
    kcal: 400,
    prepMinutes: 12,
    tags: ['Новинка', 'Вегетарианское'],
  }),
  mk({
    id: 16,
    name: 'Медовик',
    description: 'Многослойный медовый торт со сметанным кремом.',
    price: 380,
    categoryId: 4,
    ids: ['photo-1565958011703-44f9829ba187', 'photo-1533134242453-ee4f3b1b1f3f', 'photo-1624353365286-3f8d66c1605e'],
    rating: 4.7,
    reviews: 121,
    weightGrams: 170,
    kcal: 340,
    prepMinutes: 5,
    tags: ['Хит'],
  }),

  // ─── Напитки ───
  mk({
    id: 17,
    name: 'Кола',
    description: 'Классическая Coca-Cola 0.5 л.',
    price: 150,
    categoryId: 5,
    ids: ['photo-1554866585-cd94860890b7', 'photo-1621263764928-df1444c5e859', 'photo-1544145945-f90425340c7e'],
    rating: 4.3,
    reviews: 89,
    weightGrams: 500,
    kcal: 45,
    prepMinutes: 1,
    tags: [],
  }),
  mk({
    id: 18,
    name: 'Лимонад',
    description: 'Домашний лимонад с мятой и льдом.',
    price: 220,
    categoryId: 5,
    ids: ['photo-1621263764928-df1444c5e859', 'photo-1600271886742-f049cd451bba', 'photo-1554866585-cd94860890b7'],
    rating: 4.5,
    reviews: 76,
    weightGrams: 400,
    kcal: 90,
    prepMinutes: 3,
    tags: ['Вегетарианское', 'Новинка'],
  }),
  mk({
    id: 19,
    name: 'Фреш апельсин',
    description: 'Свежевыжатый апельсиновый сок 0.3 л.',
    price: 260,
    categoryId: 5,
    ids: ['photo-1600271886742-f049cd451bba', 'photo-1621263764928-df1444c5e859', 'photo-1544145945-f90425340c7e'],
    rating: 4.7,
    reviews: 112,
    weightGrams: 300,
    kcal: 120,
    prepMinutes: 3,
    tags: ['Вегетарианское', 'Без глютена'],
  }),
  mk({
    id: 20,
    name: 'Капучино',
    description: 'Двойной эспрессо с нежной молочной пенкой.',
    price: 190,
    categoryId: 5,
    ids: ['photo-1544145945-f90425340c7e', 'photo-1497534446932-c925b458314e', 'photo-1600271886742-f049cd451bba'],
    rating: 4.6,
    reviews: 143,
    weightGrams: 250,
    kcal: 110,
    prepMinutes: 4,
    tags: ['Хит'],
  }),

  // ─── Паста ───
  mk({
    id: 21,
    name: 'Карбонара',
    description: 'Спагетти, гуанчале, яичный желток, пармезан и чёрный перец.',
    price: 590,
    categoryId: 6,
    ids: ['photo-1621996346565-e3dbc646d9a9', 'photo-1551183053-bf91a1d81141', 'photo-1473093295043-cdd812d0e601'],
    rating: 4.8,
    reviews: 209,
    weightGrams: 380,
    kcal: 540,
    prepMinutes: 18,
    tags: ['Хит'],
  }),
  mk({
    id: 22,
    name: 'Болоньезе',
    description: 'Тальятелле с говяжьим рагу и томатами.',
    price: 560,
    categoryId: 6,
    ids: ['photo-1551183053-bf91a1d81141', 'photo-1473093295043-cdd812d0e601', 'photo-1621996346565-e3dbc646d9a9'],
    rating: 4.7,
    reviews: 176,
    weightGrams: 400,
    kcal: 520,
    prepMinutes: 20,
    tags: [],
  }),
  mk({
    id: 23,
    name: 'Паста с креветками',
    description: 'Лингвини, тигровые креветки, чеснок и сливочный соус.',
    price: 690,
    oldPrice: 780,
    categoryId: 6,
    ids: ['photo-1473093295043-cdd812d0e601', 'photo-1621996346565-e3dbc646d9a9', 'photo-1551183053-bf91a1d81141'],
    rating: 4.9,
    reviews: 143,
    weightGrams: 360,
    kcal: 480,
    prepMinutes: 22,
    tags: ['Новинка'],
  }),
  mk({
    id: 24,
    name: 'Паста четыре сыра',
    description: 'Пенне в сливочном соусе из четырёх видов сыра.',
    price: 620,
    categoryId: 6,
    ids: ['photo-1621996346565-e3dbc646d9a9', 'photo-1473093295043-cdd812d0e601', 'photo-1551183053-bf91a1d81141'],
    rating: 4.6,
    reviews: 98,
    weightGrams: 370,
    kcal: 560,
    prepMinutes: 18,
    tags: ['Вегетарианское', 'Сырное'],
  }),

  // ─── Салаты ───
  mk({
    id: 25,
    name: 'Цезарь',
    description: 'Романо, курица гриль, пармезан, сухарики и соус цезарь.',
    price: 420,
    categoryId: 7,
    ids: ['photo-1512621776951-a57141f2eefd', 'photo-1546069901-ba9599a7e63c', 'photo-1540189549336-e6e99c3679fe'],
    rating: 4.7,
    reviews: 188,
    weightGrams: 250,
    kcal: 280,
    prepMinutes: 10,
    tags: ['Хит'],
  }),
  mk({
    id: 26,
    name: 'Греческий',
    description: 'Огурец, томат, фета, оливки и красный лук.',
    price: 380,
    categoryId: 7,
    ids: ['photo-1546069901-ba9599a7e63c', 'photo-1540189549336-e6e99c3679fe', 'photo-1512621776951-a57141f2eefd'],
    rating: 4.6,
    reviews: 132,
    weightGrams: 230,
    kcal: 200,
    prepMinutes: 8,
    tags: ['Вегетарианское', 'Лёгкое'],
  }),
  mk({
    id: 27,
    name: 'Салат с тунцом',
    description: 'Микс салата, тунец, яйцо, томаты черри и оливковое масло.',
    price: 460,
    categoryId: 7,
    ids: ['photo-1540189549336-e6e99c3679fe', 'photo-1512621776951-a57141f2eefd', 'photo-1546069901-ba9599a7e63c'],
    rating: 4.5,
    reviews: 87,
    weightGrams: 240,
    kcal: 260,
    prepMinutes: 10,
    tags: ['Без глютена', 'Лёгкое'],
  }),
  mk({
    id: 28,
    name: 'Оливье',
    description: 'Классический салат с курицей и домашним майонезом.',
    price: 350,
    categoryId: 7,
    ids: ['photo-1546069901-ba9599a7e63c', 'photo-1540189549336-e6e99c3679fe', 'photo-1512621776951-a57141f2eefd'],
    rating: 4.4,
    reviews: 154,
    weightGrams: 220,
    kcal: 310,
    prepMinutes: 8,
    tags: [],
  }),

  // ─── Супы ───
  mk({
    id: 29,
    name: 'Том Ям',
    description: 'Острый тайский суп с креветками, кокосовым молоком и лемонграссом.',
    price: 520,
    categoryId: 8,
    ids: ['photo-1547592166-23ac45744acd', 'photo-1476718406336-bb5a9690ee2a', 'photo-1547592166-23ac45744acd'],
    rating: 4.8,
    reviews: 176,
    weightGrams: 350,
    kcal: 240,
    prepMinutes: 20,
    tags: ['Острое', 'Хит'],
  }),
  mk({
    id: 30,
    name: 'Крем-суп грибной',
    description: 'Бархатистый суп из шампиньонов со сливками и гренками.',
    price: 390,
    categoryId: 8,
    ids: ['photo-1476718406336-bb5a9690ee2a', 'photo-1547592166-23ac45744acd', 'photo-1476718406336-bb5a9690ee2a'],
    rating: 4.6,
    reviews: 121,
    weightGrams: 300,
    kcal: 210,
    prepMinutes: 15,
    tags: ['Вегетарианское'],
  }),
  mk({
    id: 31,
    name: 'Борщ',
    description: 'Наваристый борщ с говядиной, свёклой и сметаной.',
    price: 340,
    categoryId: 8,
    ids: ['photo-1547592166-23ac45744acd', 'photo-1476718406336-bb5a9690ee2a', 'photo-1547592166-23ac45744acd'],
    rating: 4.7,
    reviews: 198,
    weightGrams: 320,
    kcal: 190,
    prepMinutes: 12,
    tags: ['Хит'],
  }),
  mk({
    id: 32,
    name: 'Уха',
    description: 'Прозрачный рыбный суп с лососем и зеленью.',
    price: 420,
    categoryId: 8,
    ids: ['photo-1476718406336-bb5a9690ee2a', 'photo-1547592166-23ac45744acd', 'photo-1476718406336-bb5a9690ee2a'],
    rating: 4.5,
    reviews: 76,
    weightGrams: 330,
    kcal: 170,
    prepMinutes: 18,
    tags: ['Лёгкое'],
  }),

  // ─── Завтраки ───
  mk({
    id: 33,
    name: 'Омлет',
    description: 'Пышный омлет с томатами и зеленью.',
    price: 290,
    categoryId: 9,
    ids: ['photo-1533089860892-a7c6f0a88666', 'photo-1525351484163-7529414344d8', 'photo-1482049016688-2d3e1b311543'],
    rating: 4.5,
    reviews: 134,
    weightGrams: 220,
    kcal: 260,
    prepMinutes: 10,
    tags: ['Вегетарианское'],
  }),
  mk({
    id: 34,
    name: 'Сырники',
    description: 'Сырники из творога со сметаной и вареньем.',
    price: 320,
    categoryId: 9,
    ids: ['photo-1525351484163-7529414344d8', 'photo-1482049016688-2d3e1b311543', 'photo-1533089860892-a7c6f0a88666'],
    rating: 4.7,
    reviews: 187,
    weightGrams: 200,
    kcal: 340,
    prepMinutes: 12,
    tags: ['Хит', 'Вегетарианское'],
  }),
  mk({
    id: 35,
    name: 'Авокадо-тост',
    description: 'Хрустящий тост с гуакамоле, яйцом пашот и семенами чиа.',
    price: 350,
    categoryId: 9,
    ids: ['photo-1482049016688-2d3e1b311543', 'photo-1533089860892-a7c6f0a88666', 'photo-1525351484163-7529414344d8'],
    rating: 4.6,
    reviews: 98,
    weightGrams: 180,
    kcal: 290,
    prepMinutes: 8,
    tags: ['Вегетарианское', 'Новинка'],
  }),
  mk({
    id: 36,
    name: 'Круассан',
    description: 'Слоёный круассан с маслом и абрикосовым джемом.',
    price: 210,
    categoryId: 9,
    ids: ['photo-1533089860892-a7c6f0a88666', 'photo-1482049016688-2d3e1b311543', 'photo-1525351484163-7529414344d8'],
    rating: 4.4,
    reviews: 76,
    weightGrams: 120,
    kcal: 240,
    prepMinutes: 5,
    tags: [],
  }),

  // ─── Гриль ───
  mk({
    id: 37,
    name: 'Стейк Рибай',
    description: 'Мраморная говядина на гриле с розмарином и маслом.',
    price: 1290,
    oldPrice: 1490,
    categoryId: 10,
    ids: ['photo-1544025162-d76694265947', 'photo-1600891964092-4316c288032e', 'photo-1529692236671-f1f6cf9683ba'],
    rating: 4.9,
    reviews: 231,
    weightGrams: 400,
    kcal: 720,
    prepMinutes: 25,
    tags: ['Хит'],
  }),
  mk({
    id: 38,
    name: 'Куриные крылья',
    description: 'Крылья BBQ на гриле с острым соусом.',
    price: 540,
    categoryId: 10,
    ids: ['photo-1529692236671-f1f6cf9683ba', 'photo-1544025162-d76694265947', 'photo-1600891964092-4316c288032e'],
    rating: 4.7,
    reviews: 176,
    weightGrams: 350,
    kcal: 610,
    prepMinutes: 20,
    tags: ['Острое'],
  }),
  mk({
    id: 39,
    name: 'Свиные ребра',
    description: 'Ребра, томлённые в глазури и обжаренные на гриле.',
    price: 790,
    categoryId: 10,
    ids: ['photo-1600891964092-4316c288032e', 'photo-1529692236671-f1f6cf9683ba', 'photo-1544025162-d76694265947'],
    rating: 4.8,
    reviews: 143,
    weightGrams: 450,
    kcal: 820,
    prepMinutes: 30,
    tags: ['Новинка'],
  }),
  mk({
    id: 40,
    name: 'Овощи на гриле',
    description: 'Сезонные овощи на гриле с оливковым маслом и специями.',
    price: 420,
    categoryId: 10,
    ids: ['photo-1544025162-d76694265947', 'photo-1529692236671-f1f6cf9683ba', 'photo-1600891964092-4316c288032e'],
    rating: 4.5,
    reviews: 87,
    weightGrams: 300,
    kcal: 180,
    prepMinutes: 15,
    tags: ['Вегетарианское', 'Лёгкое'],
  }),
];

@Injectable({ providedIn: 'root' })
export class Catalog {
  readonly categories: Category[] = [
    { id: 1, name: 'Пицца', emoji: '🍕' },
    { id: 2, name: 'Суши', emoji: '🍣' },
    { id: 3, name: 'Бургеры', emoji: '🍔' },
    { id: 4, name: 'Десерты', emoji: '🍰' },
    { id: 5, name: 'Напитки', emoji: '🥤' },
    { id: 6, name: 'Паста', emoji: '🍝' },
    { id: 7, name: 'Салаты', emoji: '🥗' },
    { id: 8, name: 'Супы', emoji: '🍲' },
    { id: 9, name: 'Завтраки', emoji: '🍳' },
    { id: 10, name: 'Гриль', emoji: '🍖' },
  ];

  /** Теги для фильтра «особенности» */
  readonly allTags = ['Хит', 'Новинка', 'Острое', 'Вегетарианское', 'Без глютена', 'Сырное', 'Лёгкое'];

  private readonly _dishes = signal<Dish[]>(DISHES);

  readonly dishes = this._dishes.asReadonly();

  readonly minPrice = computed(() => Math.min(...this._dishes().map((d) => d.price)));
  readonly maxPrice = computed(() => Math.max(...this._dishes().map((d) => d.price)));

  findById(id: number): Dish | undefined {
    return this._dishes().find((d) => d.id === id);
  }

  categoryName(categoryId: number): string {
    return this.categories.find((c) => c.id === categoryId)?.name ?? '';
  }

  categoryEmoji(categoryId: number): string {
    return this.categories.find((c) => c.id === categoryId)?.emoji ?? '';
  }

  countByCategory(categoryId: number): number {
    return this._dishes().filter((d) => d.categoryId === categoryId).length;
  }

  /** Популярные блюда — по рейтингу */
  popular(limit = 8): Dish[] {
    return [...this._dishes()]
      .sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
      .slice(0, limit);
  }

  /** Новинки */
  novelties(limit = 4): Dish[] {
    return this._dishes()
      .filter((d) => d.tags.includes('Новинка'))
      .slice(0, limit);
  }

  /** Блюда со скидкой */
  discounted(limit = 4): Dish[] {
    return this._dishes()
      .filter((d) => d.oldPrice && d.oldPrice > d.price)
      .slice(0, limit);
  }

  /** Похожие блюда из той же категории */
  related(dish: Dish, limit = 4): Dish[] {
    return this._dishes()
      .filter((d) => d.categoryId === dish.categoryId && d.id !== dish.id)
      .slice(0, limit);
  }
}
