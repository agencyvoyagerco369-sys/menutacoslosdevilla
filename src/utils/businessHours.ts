// Business hours configuration for Cd. Obregón, Sonora, Mexico (Timezone: America/Hermosillo)

export const BUSINESS_HOURS = {
  timezone: 'America/Hermosillo',
  schedule: 'Dom a Jue: 6pm a 12am | Vie y Sáb: 6pm a 1am',
};

export const BUSINESS_INFO = {
  name: 'Taquería Los de Villa',
  phone: '+526442045477',
  phoneDisplay: '+52 644 204 5477',
  whatsapp: '526442045477',
  googleMapsUrl: 'https://www.google.com/maps/search/Blvd.%20Antonio%20Caso%203751%2C%20Cajeme%2C%2085136%20Cdad.%20Obreg%C3%B3n%2C%20Son.%2C%20M%C3%A9xico/@27.4908,-109.9984,17z?hl=es',
  schedule: 'Dom a Jue: 6pm a 12am | Vie y Sáb: 6pm a 1am',
};

export function isBusinessOpen(): boolean {
  const now = new Date();
  
  // Parse current time in Hermosillo timezone
  const hermitTimeString = now.toLocaleString('en-US', { timeZone: 'America/Hermosillo' });
  const hermitTime = new Date(hermitTimeString);
  
  const day = hermitTime.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const h = hermitTime.getHours();
  const m = hermitTime.getMinutes();
  
  // Use a 'logical day' concept where the day starts at 6 AM.
  // This allows shifts that go past midnight to stay on the same logical day.
  let logicalDay = day;
  let logicalHour = h + (m / 60); // e.g., 6:30 PM becomes 18.5
  
  // If the time is before 6 AM, it belongs to the previous logical day's shift
  if (h < 6) {
    logicalDay = (day + 6) % 7; // Map 0 (Sun) -> 6 (Sat)
    logicalHour += 24;          // Map 1 AM -> 25.0
  }
  
  // Domingo (0) a Jueves (4): Abierto de 18:00 a 00:00 (lógico: 18:00 a 24.0)
  if (logicalDay >= 0 && logicalDay <= 4) {
    return logicalHour >= 18 && logicalHour < 24;
  }
  
  // Viernes (5) y Sábado (6): Abierto de 18:00 a 01:00 (lógico: 18:00 a 25.0)
  if (logicalDay === 5 || logicalDay === 6) {
    return logicalHour >= 18 && logicalHour < 25;
  }
  
  return false;
}

export function getBusinessStatus(): { isOpen: boolean; message: string } {
  const isOpen = isBusinessOpen();
  
  if (isOpen) {
    return {
      isOpen: true,
      message: '¡Estamos Abiertos! Listos para tu pedido',
    };
  }
  
  return {
    isOpen: false,
    message: 'Cerrado por el momento • Revisa nuestro horario',
  };
}
