//import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import TrackingPage from './pages/TrackingPage';
import AdminPage from './pages/AdminPage';
import { Mission, Driver } from './types';
import './styles/App.css';

// Mock data for demonstration
const mockMissions: Mission[] = [
  {
    id: '1',
    commandNumber: 'TRIP-123456789',
    customerName: 'Ahmed Benali',
    customerPhone: '+212 6 12 34 56 78',
    customerEmail: 'ahmed@email.com',
    pickup: { lat: 33.7890, lng: -7.1600, address: 'Bouznika, Maroc' },
    destination: { lat: 31.7917, lng: -7.0926, address: 'Marrakech, Maroc' },
    weight: 25,
    urgent: true,
    price: 180,
    distance: 52,
    status: 'pending',
    createdAt: new Date(),
    notes: 'Bagages fragiles, manipulation délicate requise'
  },
  {
    id: '2',
    commandNumber: 'TRIP-987654321',
    customerName: 'Fatima Zahra',
    customerPhone: '+212 6 98 76 54 32',
    pickup: { lat: 33.5731, lng: -7.5898, address: 'Casablanca, Maroc' },
    destination: { lat: 33.7890, lng: -7.1600, address: 'Bouznika, Maroc' },
    weight: 15,
    urgent: false,
    price: 120,
    distance: 38,
    status: 'assigned',
    driverId: 'driver1',
    driverName: 'Mohammed Alami',
    driverPhone: '+212 6 11 22 33 44',
    createdAt: new Date(Date.now() - 86400000),
    estimatedPickupTime: new Date(Date.now() + 3600000),
    estimatedDeliveryTime: new Date(Date.now() + 7200000)
  }
];

const mockDrivers: Driver[] = [
  {
    id: 'driver1',
    name: 'Mohammed Alami',
    phone: '+212 6 11 22 33 44',
    vehicleType: 'Triporteur électrique',
    licensePlate: '12345-A-6',
    isAvailable: false,
    currentLocation: { lat: 33.5731, lng: -7.5898, address: 'Casablanca' },
    rating: 4.8,
    completedMissions: 156
  },
  {
    id: 'driver2',
    name: 'Hassan Tazi',
    phone: '+212 6 55 66 77 88',
    vehicleType: 'Triporteur thermique',
    licensePlate: '67890-B-6',
    isAvailable: true,
    currentLocation: { lat: 33.7890, lng: -7.1600, address: 'Bouznika' },
    rating: 4.6,
    completedMissions: 89
  },
  {
    id: 'driver3',
    name: 'Karim Bennani',
    phone: '+212 6 99 00 11 22',
    vehicleType: 'Triporteur électrique',
    licensePlate: '11111-C-6',
    isAvailable: true,
    currentLocation: { lat: 31.7917, lng: -7.0926, address: 'Marrakech' },
    rating: 4.9,
    completedMissions: 203
  }
];


function App() {
  const [missions, setMissions] = useState<Mission[]>(mockMissions);
  const [drivers, setDrivers] = useState<Driver[]>(mockDrivers);

  const addMission = (newMission: Omit<Mission, 'id' | 'status' | 'createdAt'>) => {
    const mission: Mission = {
      ...newMission,
      id: `TRIP-${Date.now()}`,
      commandNumber: `TRIP-${Date.now()}`,
      status: 'pending',
      createdAt: new Date(),
    };
    setMissions(prevMissions => [mission, ...prevMissions]);
  };

  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/booking" element={<BookingPage onAddMission={addMission} />} />
          <Route path="/tracking" element={<TrackingPage />} />
          <Route path="/admin" element={<AdminPage missions={missions} drivers={drivers} />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default App; 
