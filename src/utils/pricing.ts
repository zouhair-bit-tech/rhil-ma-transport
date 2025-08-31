import { Location, PricingConfig } from '../types';

// Configuration des prix pour RHIL.MA
export const PRICING_CONFIG: PricingConfig = {
  basePrice: 50, // Prix de base à Bouznika
  pricePerKm: 2.5, // Prix par kilomètre
  urgentFee: 20, // Frais pour transport urgent
  weightFee: 5, // Frais par kg au-dessus de 10kg
};

// Calcul de la distance entre deux points (formule de Haversine)
export function calculateDistance(point1: Location, point2: Location): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (point2.lat - point1.lat) * Math.PI / 180;
  const dLon = (point2.lng - point1.lng) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return Math.round(distance * 100) / 100; // Arrondir à 2 décimales
}

// Calcul du prix total du transport
export function calculatePrice(
  pickup: Location, 
  destination: Location, 
  weight: number, 
  urgent: boolean
): number {
  const distance = calculateDistance(pickup, destination);
  
  let totalPrice = PRICING_CONFIG.basePrice;
  
  // Prix par distance
  if (distance > 0) {
    totalPrice += distance * PRICING_CONFIG.pricePerKm;
  }
  
  // Frais pour transport urgent
  if (urgent) {
    totalPrice += PRICING_CONFIG.urgentFee;
  }
  
  // Frais pour poids excessif
  if (weight > 10) {
    const excessWeight = weight - 10;
    totalPrice += excessWeight * PRICING_CONFIG.weightFee;
  }
  
  return Math.round(totalPrice);
}

// Formatage du prix en dirhams
export function formatPrice(price: number): string {
  return `${price.toFixed(2)} DH`;
}

// Estimation du temps d'arrivée
export function estimateArrivalTime(distance: number): number {
  // Vitesse moyenne estimée : 25 km/h en ville
  const averageSpeed = 25;
  const timeInHours = distance / averageSpeed;
  return Math.ceil(timeInHours * 60); // Retourner en minutes
} 