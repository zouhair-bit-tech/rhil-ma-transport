import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';
import DynamicMap from '../components/DynamicMap';
import AdminLogin from '../components/AdminLogin';
import DriverManagement from '../components/DriverManagement';
import { Mission, Driver } from '../types';

// Styled Components
const AdminContainer = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  color: #1e3c72;
  text-align: center;
  margin-bottom: 2rem;
`;

const AdminGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 15px;
  padding: 1.5rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const SectionTitle = styled.h2`
  color: #1e3c72;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MissionCard = styled.div<{ status: string }>`
  border: 2px solid ${props => {
    switch (props.status) {
      case 'pending': return '#ffc107';
      case 'assigned': return '#17a2b8';
      case 'in_progress': return '#007bff';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#e9ecef';
    }
  }};
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: ${props => props.status === 'completed' ? '#f8f9fa' : 'white'};
`;

const MissionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CommandNumber = styled.span`
  font-weight: bold;
  color: #1e3c72;
  font-family: 'Courier New', monospace;
`;

const StatusBadge = styled.span<{ status: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background: ${props => {
    switch (props.status) {
      case 'pending': return '#ffc107';
      case 'assigned': return '#17a2b8';
      case 'in_progress': return '#007bff';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  }};
`;

const MissionDetails = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const DetailLabel = styled.span`
  font-size: 0.8rem;
  color: #666;
  font-weight: bold;
`;

const DetailValue = styled.span`
  color: #333;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  background: ${props => {
    switch (props.variant) {
      case 'primary': return '#007bff';
      case 'success': return '#28a745';
      case 'warning': return '#ffc107';
      case 'danger': return '#dc3545';
      case 'info': return '#17a2b8';
      default: return '#6c757d';
    }
  }};
  color: white;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const DriverCard = styled.div<{ isAvailable: boolean }>`
  border: 2px solid ${props => props.isAvailable ? '#28a745' : '#dc3545'};
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  background: ${props => props.isAvailable ? 'white' : '#f8f9fa'};
  opacity: ${props => props.isAvailable ? 1 : 0.7};
`;

const DriverHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const DriverName = styled.span`
  font-weight: bold;
  color: #1e3c72;
  font-size: 1.1rem;
`;

const AvailabilityBadge = styled.span<{ isAvailable: boolean }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
  color: white;
  background: ${props => props.isAvailable ? '#28a745' : '#dc3545'};
`;

const DriverStats = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1rem 0;
`;



const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 2px solid #e1e5e9;
  border-radius: 5px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #1e3c72;
  }
`;

const SearchInput = styled.input`
  padding: 0.5rem;
  border: 2px solid #e1e5e9;
  border-radius: 5px;
  font-size: 0.9rem;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #1e3c72;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 10px;
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  opacity: 0.9;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: #1e3c72;
  font-size: 0.9rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #1e3c72;
  }
`;

// Modal Components
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalTitle = styled.h3`
  color: #1e3c72;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
`;

// Add Driver Modal Component
interface AddDriverModalProps {
  onClose: () => void;
  onAdd: (driverData: Omit<Driver, 'id'>) => void;
}

const AddDriverModal: React.FC<AddDriverModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleType: '',
    licensePlate: '',
    currentLocation: { lat: 33.7890, lng: -7.1600 },
    isAvailable: true,
    rating: 5.0,
    completedMissions: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.vehicleType || !formData.licensePlate) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    onAdd(formData);
  };

  return (
    <Modal>
      <ModalContent>
        <ModalTitle>➕ Ajouter un Nouveau Chauffeur</ModalTitle>
        <ModalForm onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label>Nom complet *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom du chauffeur"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Téléphone *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+212 6 XX XX XX XX"
                type="tel"
                required
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label>Type de véhicule *</Label>
              <Select
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                required
              >
                <option value="">Sélectionner un type</option>
                <option value="Triporteur électrique">Triporteur électrique</option>
                <option value="Triporteur thermique">Triporteur thermique</option>
                <option value="Camionnette">Camionnette</option>
                <option value="Fourgon">Fourgon</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Plaque d'immatriculation *</Label>
              <Input
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                placeholder="12345-A-6"
                required
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>Position initiale (coordonnées GPS)</Label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <Input
                type="number"
                step="0.000001"
                value={formData.currentLocation.lat}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  currentLocation: { 
                    ...formData.currentLocation, 
                    lat: parseFloat(e.target.value) || 0 
                  } 
                })}
                placeholder="Latitude"
              />
              <Input
                type="number"
                step="0.000001"
                value={formData.currentLocation.lng}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  currentLocation: { 
                    ...formData.currentLocation, 
                    lng: parseFloat(e.target.value) || 0 
                  } 
                })}
                placeholder="Longitude"
              />
            </div>
          </FormGroup>

          <ModalButtons>
            <Button variant="danger" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="success" type="submit">
              Ajouter le Chauffeur
            </Button>
          </ModalButtons>
        </ModalForm>
      </ModalContent>
    </Modal>
  );
};

// Edit Driver Modal Component
interface EditDriverModalProps {
  driver: Driver;
  onClose: () => void;
  onEdit: (driverId: string, updatedData: Partial<Driver>) => void;
}

const EditDriverModal: React.FC<EditDriverModalProps> = ({ driver, onClose, onEdit }) => {
  const [formData, setFormData] = useState({
    name: driver.name,
    phone: driver.phone,
    vehicleType: driver.vehicleType,
    licensePlate: driver.licensePlate,
    rating: driver.rating,
    currentLocation: driver.currentLocation || { lat: 33.7890, lng: -7.1600 }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.vehicleType || !formData.licensePlate) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    onEdit(driver.id, formData);
  };

  return (
    <Modal>
      <ModalContent>
        <ModalTitle>✏️ Modifier le Chauffeur</ModalTitle>
        <ModalForm onSubmit={handleSubmit}>
          <FormRow>
            <FormGroup>
              <Label>Nom complet *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Nom du chauffeur"
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Téléphone *</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+212 6 XX XX XX XX"
                type="tel"
                required
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label>Type de véhicule *</Label>
              <Select
                value={formData.vehicleType}
                onChange={(e) => setFormData({ ...formData, vehicleType: e.target.value })}
                required
              >
                <option value="Triporteur électrique">Triporteur électrique</option>
                <option value="Triporteur thermique">Triporteur thermique</option>
                <option value="Camionnette">Camionnette</option>
                <option value="Fourgon">Fourgon</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Plaque d'immatriculation *</Label>
              <Input
                value={formData.licensePlate}
                onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
                placeholder="12345-A-6"
                required
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <Label>Note actuelle</Label>
              <Input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                placeholder="Note sur 5"
              />
            </FormGroup>
            <FormGroup>
              <Label>Missions complétées</Label>
              <Input
                type="number"
                min="0"
                value={driver.completedMissions}
                disabled
                style={{ backgroundColor: '#f8f9fa' }}
              />
            </FormGroup>
          </FormRow>

          <FormGroup>
            <Label>Position actuelle (coordonnées GPS)</Label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <Input
                type="number"
                step="0.000001"
                value={formData.currentLocation.lat}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  currentLocation: { 
                    ...formData.currentLocation, 
                    lat: parseFloat(e.target.value) || 0 
                  } 
                })}
                placeholder="Latitude"
              />
              <Input
                type="number"
                step="0.000001"
                value={formData.currentLocation.lng}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  currentLocation: { 
                    ...formData.currentLocation, 
                    lng: parseFloat(e.target.value) || 0 
                  } 
                })}
                placeholder="Longitude"
              />
            </div>
          </FormGroup>

          <ModalButtons>
            <Button variant="danger" onClick={onClose}>
              Annuler
            </Button>
            <Button variant="success" type="submit">
              Mettre à Jour
            </Button>
          </ModalButtons>
        </ModalForm>
      </ModalContent>
    </Modal>
  );
};

interface AdminPageProps {
  missions: Mission[];
  drivers: Driver[];
}

const AdminPage: React.FC<AdminPageProps> = ({ missions: initialMissions, drivers: initialDrivers }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [missions, setMissions] = useState<Mission[]>(initialMissions);
  const [drivers, setDrivers] = useState<Driver[]>(initialDrivers);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [showEditDriverModal, setShowEditDriverModal] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState<Driver | null>(null);

  useEffect(() => {
    setMissions(initialMissions);
  }, [initialMissions]);

  useEffect(() => {
    setDrivers(initialDrivers);
  }, [initialDrivers]);

  // Filter missions based on status and search
  const filteredMissions = missions.filter(mission => {
    const matchesStatus = statusFilter === 'all' || mission.status === statusFilter;
    const matchesSearch = mission.commandNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         mission.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Filter available drivers
  const availableDrivers = drivers.filter(driver => driver.isAvailable);

  // Calculate statistics
  const totalMissions = missions.length;
  const pendingMissions = missions.filter(m => m.status === 'pending').length;
  const inProgressMissions = missions.filter(m => m.status === 'in_progress').length;
  const completedMissions = missions.filter(m => m.status === 'completed').length;

  const assignDriverToMission = (missionId: string, driverId: string) => {
    const mission = missions.find(m => m.id === missionId);
    const driver = drivers.find(d => d.id === driverId);
    
    if (mission && driver) {
      setMissions(missions.map(m => 
        m.id === missionId 
          ? { ...m, status: 'assigned', driverId: driver.id, driverName: driver.name, driverPhone: driver.phone }
          : m
      ));
      
      setDrivers(drivers.map(d => 
        d.id === driverId ? { ...d, isAvailable: false } : d
      ));
      
      toast.success(`Chauffeur ${driver.name} assigné à la mission ${mission.commandNumber}`);
    }
  };

  const updateMissionStatus = (missionId: string, newStatus: Mission['status']) => {
    setMissions(missions.map(m => 
      m.id === missionId ? { ...m, status: newStatus } : m
    ));
    
    if (newStatus === 'completed') {
      // Free up the driver
      const mission = missions.find(m => m.id === missionId);
      if (mission?.driverId) {
        setDrivers(drivers.map(d => 
          d.id === mission.driverId ? { ...d, isAvailable: true } : d
        ));
      }
    }
    
    toast.success(`Statut de la mission mis à jour: ${newStatus}`);
  };

  const contactClient = (mission: Mission) => {
    // Simulate client contact
    toast.success(`Contact établi avec ${mission.customerName} (${mission.customerPhone})`);
  };

  const addNote = (missionId: string, note: string) => {
    setMissions(missions.map(m => 
      m.id === missionId ? { ...m, notes: note } : m
    ));
    toast.success('Note ajoutée à la mission');
  };

  // Driver management functions
  const addDriver = (driverData: Omit<Driver, 'id'>) => {
    const newDriver: Driver = {
      ...driverData,
      id: `driver${Date.now()}`,
      isAvailable: true,
      rating: 5.0,
      completedMissions: 0
    };
    setDrivers([...drivers, newDriver]);
    setShowAddDriverModal(false);
    toast.success(`Chauffeur ${newDriver.name} ajouté avec succès !`);
  };

  const editDriver = (driverId: string, updatedData: Partial<Driver>) => {
    setDrivers(drivers.map(d => 
      d.id === driverId ? { ...d, ...updatedData } : d
    ));
    setShowEditDriverModal(false);
    setDriverToEdit(null);
    toast.success('Informations du chauffeur mises à jour !');
  };

  const deleteDriver = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (driver && !driver.isAvailable) {
      toast.error('Impossible de supprimer un chauffeur en mission');
      return;
    }
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le chauffeur ${driver?.name} ?`)) {
      setDrivers(drivers.filter(d => d.id !== driverId));
      toast.success('Chauffeur supprimé avec succès');
    }
  };

  const updateDriverLocation = (driverId: string, lat: number, lng: number) => {
    setDrivers(drivers.map(d => 
      d.id === driverId ? { ...d, currentLocation: { lat, lng } } : d
    ));
  };

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={setIsAuthenticated} />;
  }

  return (
    <AdminContainer>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <PageTitle>🚚 Tableau de Bord Administrateur</PageTitle>
        <Button 
          variant="danger" 
          onClick={() => setIsAuthenticated(false)}
          style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
        >
          🚪 Déconnexion
        </Button>
      </div>
      
      {/* Statistics */}
      <StatsGrid>
        <StatCard>
          <StatNumber>{totalMissions}</StatNumber>
          <StatLabel>Total Missions</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{pendingMissions}</StatNumber>
          <StatLabel>En Attente</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{inProgressMissions}</StatNumber>
          <StatLabel>En Cours</StatLabel>
        </StatCard>
        <StatCard>
          <StatNumber>{completedMissions}</StatNumber>
          <StatLabel>Terminées</StatLabel>
        </StatCard>
      </StatsGrid>

      <AdminGrid>
        {/* Missions Section */}
        <Section>
          <SectionTitle>
            📋 Missions de Transport
            <span style={{ fontSize: '0.9rem', color: '#666', marginLeft: '1rem' }}>
              ({filteredMissions.length} missions)
            </span>
          </SectionTitle>
          
          <FilterSection>
            <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Tous les statuts</option>
              <option value="pending">En attente</option>
              <option value="assigned">Assignée</option>
              <option value="in_progress">En cours</option>
              <option value="completed">Terminée</option>
              <option value="cancelled">Annulée</option>
            </Select>
            <SearchInput
              placeholder="Rechercher par numéro ou nom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </FilterSection>

          {filteredMissions.map(mission => (
            <MissionCard key={mission.id} status={mission.status}>
              <MissionHeader>
                <CommandNumber>{mission.commandNumber}</CommandNumber>
                <StatusBadge status={mission.status}>
                  {mission.status === 'pending' && 'En Attente'}
                  {mission.status === 'assigned' && 'Assignée'}
                  {mission.status === 'in_progress' && 'En Cours'}
                  {mission.status === 'completed' && 'Terminée'}
                  {mission.status === 'cancelled' && 'Annulée'}
                </StatusBadge>
              </MissionHeader>
              
              <MissionDetails>
                <DetailItem>
                  <DetailLabel>Client</DetailLabel>
                  <DetailValue>{mission.customerName}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Téléphone</DetailLabel>
                  <DetailValue>{mission.customerPhone}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Départ</DetailLabel>
                  <DetailValue>{mission.pickup.address}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Arrivée</DetailLabel>
                  <DetailValue>{mission.destination.address}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Poids</DetailLabel>
                  <DetailValue>{mission.weight} kg</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Prix</DetailLabel>
                  <DetailValue>{mission.price} DH</DetailValue>
                </DetailItem>
                {mission.driverName && (
                  <DetailItem>
                    <DetailLabel>Chauffeur</DetailLabel>
                    <DetailValue>{mission.driverName}</DetailValue>
                  </DetailItem>
                )}
                {mission.notes && (
                  <DetailItem>
                    <DetailLabel>Notes</DetailLabel>
                    <DetailValue>{mission.notes}</DetailValue>
                  </DetailItem>
                )}
              </MissionDetails>

              <ActionButtons>
                <Button variant="info" onClick={() => contactClient(mission)}>
                  📞 Contacter Client
                </Button>
                
                {mission.status === 'pending' && (
                  <Button 
                    variant="primary" 
                    onClick={() => setSelectedMission(mission)}
                  >
                    🚗 Assigner Chauffeur
                  </Button>
                )}
                
                {mission.status === 'assigned' && (
                  <Button 
                    variant="success" 
                    onClick={() => updateMissionStatus(mission.id, 'in_progress')}
                  >
                    ▶️ Démarrer Mission
                  </Button>
                )}
                
                {mission.status === 'in_progress' && (
                  <Button 
                    variant="success" 
                    onClick={() => updateMissionStatus(mission.id, 'completed')}
                  >
                    ✅ Terminer Mission
                  </Button>
                )}
                
                {mission.status !== 'completed' && mission.status !== 'cancelled' && (
                  <Button 
                    variant="danger" 
                    onClick={() => updateMissionStatus(mission.id, 'cancelled')}
                  >
                    ❌ Annuler
                  </Button>
                )}
              </ActionButtons>
            </MissionCard>
          ))}
        </Section>

                 {/* Drivers Section */}
         <Section>
                      <DriverManagement
             drivers={drivers}
             onAddDriver={addDriver}
             onEditDriver={editDriver}
             onDeleteDriver={deleteDriver}
           />

           <SectionTitle style={{ marginTop: '2rem', marginBottom: '1rem' }}>
             🚗 Liste des Chauffeurs
             <span style={{ fontSize: '0.9rem', color: '#666', marginLeft: '1rem' }}>
               ({availableDrivers.length} disponibles sur {drivers.length})
             </span>
           </SectionTitle>

           {drivers.map(driver => (
            <DriverCard key={driver.id} isAvailable={driver.isAvailable}>
              <DriverHeader>
                <DriverName>{driver.name}</DriverName>
                <AvailabilityBadge isAvailable={driver.isAvailable}>
                  {driver.isAvailable ? 'Disponible' : 'En Mission'}
                </AvailabilityBadge>
              </DriverHeader>
              
              <DriverStats>
                <DetailItem>
                  <DetailLabel>Véhicule</DetailLabel>
                  <DetailValue>{driver.vehicleType}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Plaque</DetailLabel>
                  <DetailValue>{driver.licensePlate}</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Note</DetailLabel>
                  <DetailValue>⭐ {driver.rating}/5</DetailValue>
                </DetailItem>
                <DetailItem>
                  <DetailLabel>Missions</DetailLabel>
                  <DetailValue>{driver.completedMissions}</DetailValue>
                </DetailItem>
              </DriverStats>

                             <ActionButtons>
                 <Button variant="info" onClick={() => setSelectedDriver(driver)}>
                   📍 Voir Position
                 </Button>
                 <Button variant="primary">
                   📞 Contacter
                 </Button>
                 <Button 
                   variant="warning" 
                   onClick={() => {
                     setDriverToEdit(driver);
                     setShowEditDriverModal(true);
                   }}
                 >
                   ✏️ Modifier
                 </Button>
                 <Button 
                   variant="danger" 
                   onClick={() => deleteDriver(driver.id)}
                   disabled={!driver.isAvailable}
                 >
                   🗑️ Supprimer
                 </Button>
               </ActionButtons>
            </DriverCard>
          ))}

          {/* Map for tracking */}
          <SectionTitle style={{ marginTop: '2rem' }}>🗺️ Suivi en Temps Réel</SectionTitle>
          <DynamicMap
            center={[31.7917, -7.0926]}
            zoom={6}
            onLocationSelect={(location, type) => {
              // Admin view - just show coordinates
              toast.success(`${type === 'pickup' ? 'Point A' : 'Point B'}: ${location.lat.toFixed(6)}, ${location.lng.toFixed(6)}`);
            }}
          />
        </Section>
      </AdminGrid>

      {/* Driver Assignment Modal */}
      {selectedMission && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '15px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <h3>Assigner un chauffeur à {selectedMission.commandNumber}</h3>
            <p>Client: {selectedMission.customerName}</p>
            <p>Trajet: {selectedMission.pickup.address} → {selectedMission.destination.address}</p>
            
            <div style={{ margin: '1rem 0' }}>
              <h4>Chauffeurs disponibles:</h4>
              {availableDrivers.map(driver => (
                <div key={driver.id} style={{
                  border: '1px solid #ddd',
                  padding: '1rem',
                  margin: '0.5rem 0',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }} onClick={() => {
                  assignDriverToMission(selectedMission.id, driver.id);
                  setSelectedMission(null);
                }}>
                  <strong>{driver.name}</strong> - {driver.vehicleType}<br />
                  Note: ⭐ {driver.rating}/5 | Missions: {driver.completedMissions}
                </div>
              ))}
            </div>
            
            <Button onClick={() => setSelectedMission(null)}>Annuler</Button>
                     </div>
         </div>
       )}

       {/* Add Driver Modal */}
       {showAddDriverModal && (
         <AddDriverModal 
           onClose={() => setShowAddDriverModal(false)}
           onAdd={addDriver}
         />
       )}

       {/* Edit Driver Modal */}
       {showEditDriverModal && driverToEdit && (
         <EditDriverModal 
           driver={driverToEdit}
           onClose={() => {
             setShowEditDriverModal(false);
             setDriverToEdit(null);
           }}
           onEdit={editDriver}
         />
       )}
     </AdminContainer>
   );
 };

export default AdminPage;
