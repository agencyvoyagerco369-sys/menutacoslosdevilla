// Business hours configuration for Cd. Obregón, Sonora, Mexico
// Timezone: America/Hermosillo (MST, UTC-7, no DST)

export const BUSINESS_HOURS = {
  openHour: 0,   // 12:00 AM (24 hrs)
  closeHour: 24, // 12:00 AM (24 hrs)
  timezone: 'America/Hermosillo',
};

export const BUSINESS_INFO = {
  name: 'Taquería Los de Villa',
  phone: '+526442045477',
  phoneDisplay: '+52 644 204 5477',
  whatsapp: '526442045477',
  googleMapsUrl: 'https://www.google.com/maps/search/Blvd.%20Antonio%20Caso%203751%2C%20Cajeme%2C%2085136%20Cdad.%20Obreg%C3%B3n%2C%20Son.%2C%20M%C3%A9xico/@27.4908,-109.9984,17z?hl=es',
  schedule: 'Abierto las 24 horas',
};

export function isBusinessOpen(): boolean {
  // 24 hours — always open
  return true;
}

export function getBusinessStatus(): { isOpen: boolean; message: string } {
  const isOpen = isBusinessOpen();
  
  if (isOpen) {
    return {
      isOpen: true,
      message: 'Abierto ahora • Pedidos disponibles 24 hrs',
    };
  }
  
  return {
    isOpen: false,
    message: 'Cerrado • Intenta más tarde',
  };
}
