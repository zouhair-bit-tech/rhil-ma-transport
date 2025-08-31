import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import { Trip, Location } from '../types';
import TrackingMap from '../components/TrackingMap';

const TrackingContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  color: #1e3c72;
  text-align: center;
  margin-bottom: 2rem;
`;

const SearchSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  text-align: center;
`;

const SearchInput = styled.input`
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1.1rem;
  width: 300px;
  margin-right: 1rem;
  
  &:focus {
    outline: none;
    border-color: #1e3c72;
  }
  
  @media (max-width: 768px) {
    width: 100%;
    margin-right: 0;
    margin-bottom: 1rem;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

const TrackingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const MapSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;



const StatusSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const StatusCard = styled.div`
  background: #f8f9fa;
  border-radius: 10px;
  padding: 1.5rem;
  margin-bottom: 1rem;
`;

const StatusTitle = styled.h3`
  color: #1e3c72;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const StatusBadge = styled.span<{ $status: string }>`
  background: ${props => {
    switch (props.$status) {
      case 'pending': return '#ffc107';
      case 'accepted': return '#17a2b8';
      case 'in_progress': return '#007bff';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
`;

const StatusInfo = styled.div`
  margin-bottom: 0.5rem;
  
  strong {
    color: #1e3c72;
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin: 1rem 0;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  width: ${props => props.$progress}%;
  transition: width 0.3s ease;
`;

// Données simulées pour la démonstration
const mockTrip: Trip = {
  id: "TRIP-001",
  commandNumber: "TRIP-001",
  customerName: "John Doe",
  customerPhone: "+212 6 00 00 00 00",
  pickup: {
    lat: 33.7890,
    lng: -7.1600,
    address: "Bouznika, Maroc"
  },
  destination: {
    lat: 33.5731,
    lng: -7.5898,
    address: "Casablanca, Maroc"
  },
  weight: 15,
  urgent: false,
  distance: 45.2,
  price: 163,
  status: 'in_progress',
  createdAt: new Date('2024-01-15T10:00:00'),
  estimatedArrival: new Date('2024-01-15T11:30:00'),
  driverId: "DRIVER-001",
  driverName: "Ahmed Benali",
  driverPhone: "+212 6 12 34 56 78",
  vehicleInfo: "Triporteur Honda - Plaque: 12345-A-6"
};

const TrackingPage: React.FC = () => {
  const [tripId, setTripId] = useState('');
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!tripId.trim()) {
      toast.error('Veuillez entrer un numéro de commande');
      return;
    }

    setIsSearching(true);
    
    try {
      // Simuler la recherche
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Pour la démo, on utilise toujours le même voyage
      setCurrentTrip(mockTrip);
      toast.success('Commande trouvée !');
      
    } catch (error) {
      toast.error('Erreur lors de la recherche');
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusProgress = (status: string): number => {
    switch (status) {
      case 'pending': return 20;
      case 'accepted': return 40;
      case 'in_progress': return 70;
      case 'completed': return 100;
      case 'cancelled': return 0;
      default: return 0;
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'accepted': return 'Acceptée';
      case 'in_progress': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return 'Inconnu';
    }
  };

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'pending': return '⏳';
      case 'accepted': return '✅';
      case 'in_progress': return '🚚';
      case 'completed': return '🎉';
      case 'cancelled': return '❌';
      default: return '❓';
    }
  };

  return (
    <TrackingContainer>
      <PageTitle>Suivre un Transport</PageTitle>
      
      <SearchSection>
        <h3>Entrez votre numéro de commande</h3>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          <SearchInput
            type="text"
            placeholder="Ex: TRIP-001"
            value={tripId}
            onChange={(e) => setTripId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <SearchButton onClick={handleSearch} disabled={isSearching}>
            {isSearching ? 'Recherche...' : 'Rechercher'}
          </SearchButton>
        </div>
      </SearchSection>

      {currentTrip && (
        <TrackingGrid>
          <MapSection>
            <h3>Suivi en temps réel</h3>
            <TrackingMap trip={currentTrip} />
          </MapSection>
          
          <StatusSection>
            <h3>Statut de votre commande</h3>
            
            <StatusCard>
              <StatusTitle>
                {getStatusIcon(currentTrip.status)} Statut
                <StatusBadge $status={currentTrip.status}>
                  {getStatusText(currentTrip.status)}
                </StatusBadge>
              </StatusTitle>
              
              <ProgressBar>
                <ProgressFill $progress={getStatusProgress(currentTrip.status)} />
              </ProgressBar>
              
              <StatusInfo>
                <strong>Numéro de commande:</strong> {currentTrip.commandNumber}
              </StatusInfo>
              <StatusInfo>
                <strong>Date de création:</strong> {currentTrip.createdAt.toLocaleDateString('fr-FR')}
              </StatusInfo>
              <StatusInfo>
                <strong>Distance:</strong> {currentTrip.distance} km
              </StatusInfo>
              <StatusInfo>
                <strong>Prix:</strong> {currentTrip.price} DH
              </StatusInfo>
            </StatusCard>
            
            {currentTrip.driverId && (
              <StatusCard>
                <StatusTitle>🚚 Informations du chauffeur</StatusTitle>
                <StatusInfo>
                  <strong>Nom:</strong> {currentTrip.driverName}
                </StatusInfo>
                <StatusInfo>
                  <strong>Téléphone:</strong> {currentTrip.driverPhone}
                </StatusInfo>
                <StatusInfo>
                  <strong>Véhicule:</strong> {currentTrip.vehicleInfo}
                </StatusInfo>
              </StatusCard>
            )}
            
            {currentTrip.estimatedArrival && (
              <StatusCard>
                <StatusTitle>⏰ Estimation d'arrivée</StatusTitle>
                <StatusInfo>
                  <strong>Heure estimée:</strong> {currentTrip.estimatedArrival.toLocaleTimeString('fr-FR')}
                </StatusInfo>
                <StatusInfo>
                  <strong>Date:</strong> {currentTrip.estimatedArrival.toLocaleDateString('fr-FR')}
                </StatusInfo>
              </StatusCard>
            )}
            
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <p style={{ color: '#666', fontSize: '0.9rem' }}>
                💡 <strong>Conseil:</strong> Vous recevrez des notifications en temps réel 
                sur l'état de votre commande.
              </p>
            </div>
          </StatusSection>
        </TrackingGrid>
      )}
    </TrackingContainer>
  );
};

export default TrackingPage; 
