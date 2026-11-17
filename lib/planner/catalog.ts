import type { CityId, Vibe } from './types';

interface PoolStop { name: string; dLat: number; dLng: number; vibe: Vibe; cost: number; note: string }
interface City { name: string; tagline: string; lat: number; lng: number; stops: PoolStop[] }

export const CITIES: Record<CityId, City> = {
  lisbon: {
    name: 'Лиссабон', tagline: 'Холмы, трамваи и свет с реки', lat: 38.7223, lng: -9.1393,
    stops: [
      { name: 'Miradouro da Senhora do Monte', dLat: 0.0058, dLng: -0.0062, vibe: 'culture', cost: 0, note: 'Закат над Алфамой. Приходите за 40 минут.' },
      { name: 'Pastéis de Belém', dLat: -0.0021, dLng: -0.0963, vibe: 'food', cost: 6, note: 'Очередь заметно короче до 10:00.' },
      { name: 'Пена в Синтре', dLat: 0.07, dLng: -0.25, vibe: 'nature', cost: 35, note: 'Билеты онлайн. Выезд поездом в 8:30.' },
      { name: 'LX Factory', dLat: -0.0195, dLng: -0.0387, vibe: 'nightlife', cost: 18, note: 'Бары в бывшей типографии, живая музыка по пятницам.' },
    ],
  },
  kyoto: {
    name: 'Киото', tagline: 'Храмы, тишина и утренние рынки', lat: 35.0116, lng: 135.7681,
    stops: [
      { name: 'Фусими Инари', dLat: -0.0445, dLng: 0.0046, vibe: 'nature', cost: 0, note: 'Утром ворота почти пустые.' },
      { name: 'Рынок Нисики', dLat: -0.0066, dLng: -0.0032, vibe: 'food', cost: 25, note: 'Попробуйте тамаго-якитори у третьего прилавка.' },
      { name: 'Гион: чайная церемония', dLat: -0.0079, dLng: 0.0075, vibe: 'culture', cost: 60, note: 'Бронируйте за неделю.' },
      { name: 'Арасияма', dLat: -0.0022, dLng: -0.0959, vibe: 'slow', cost: 0, note: 'Бамбуковая роща лучше всего на рассвете.' },
    ],
  },
  marrakech: {
    name: 'Марракеш', tagline: 'Пыль, специи и сады за стенами', lat: 31.6295, lng: -7.9811,
    stops: [
      { name: 'Площадь Джемаа-эль-Фна', dLat: -0.0036, dLng: -0.008, vibe: 'food', cost: 15, note: 'Ужин на улице. Торгуйтесь мягко.' },
      { name: 'Сад Майорелл', dLat: 0.0121, dLng: -0.0218, vibe: 'culture', cost: 12, note: 'Билеты с временным слотом.' },
      { name: 'Хаммам', dLat: -0.0045, dLng: -0.0069, vibe: 'slow', cost: 45, note: 'Запишитесь на послеобеденное время.' },
      { name: 'Долина Уриха', dLat: -0.28, dLng: 0.33, vibe: 'adventure', cost: 70, note: 'Трансфер с водителем, выезд в 7:00.' },
    ],
  },
};
