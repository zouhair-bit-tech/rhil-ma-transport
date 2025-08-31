export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Mission {
  id: string;
  commandNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickup: Location;
  destination: Location;
  weight: number;
  urgent: boolean;
  price: number;
  distance: number;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'accepted';
  driverId?: string;
  driverName?: string;
  driverPhone?: string;
  createdAt: Date;
  estimatedPickupTime?: Date;
  estimatedDeliveryTime?: Date;
  notes?: string;
  vehicleInfo?: string; // Ajouté pour la cohérence
  estimatedArrival?: Date; // Ajouté pour la cohérence
}

export type Trip = Mission;


export interface BookingForm {
  pickup: Location;
  destination: Location;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  description: string;
  weight: number;
  urgent: boolean;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  licensePlate: string;
  isAvailable: boolean;
  currentLocation?: Location;
  rating: number;
  completedMissions: number;
}

export interface PricingConfig {
  basePrice: number; // 50 DH pour Bouznika
  pricePerKm: number;
  urgentFee: number;
  weightFee: number;
} 