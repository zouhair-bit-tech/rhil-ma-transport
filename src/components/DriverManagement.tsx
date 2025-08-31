//import React, { useState } from 'react';
import styled from 'styled-components';
import { toast } from 'react-hot-toast';

interface Driver {
  id: string;
  name: string;
  phone: string;
  vehicleType: string;
  licensePlate: string;
  isAvailable: boolean;
  currentLocation?: { lat: number; lng: number };
  rating: number;
  completedMissions: number;
}

interface DriverManagementProps {
  drivers: Driver[];
  onAddDriver: (driverData: Omit<Driver, 'id'>) => void;
  onEditDriver: (driverId: string, updatedData: Partial<Driver>) => void;
  onDeleteDriver: (driverId: string) => void;
}

// Styled Components
const Container = styled.div`
  margin-bottom: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  color: #1e3c72;
  margin: 0;
`;

const AddButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  
  &:hover {
    background: #218838;
  }
`;

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

const Form = styled.form`
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

const Select = styled.select`
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #1e3c72;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'success' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  background: ${props => {
    switch (props.variant) {
      case 'success': return '#28a745';
      case 'danger': return '#dc3545';
      default: return '#007bff';
    }
  }};
  color: white;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }
`;

const DriverManagement: React.FC<DriverManagementProps> = ({
  drivers,
  onAddDriver,
  onEditDriver,
  onDeleteDriver
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    vehicleType: '',
    licensePlate: '',
    currentLocation: { lat: 33.7890, lng: -7.1600 }
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.vehicleType || !formData.licensePlate) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    const newDriverData: Omit<Driver, 'id'> = {
      ...formData,
      isAvailable: true,
      rating: 5.0,
      completedMissions: 0
    };
    
    onAddDriver(newDriverData);
    setShowAddModal(false);
    setFormData({
      name: '',
      phone: '',
      vehicleType: '',
      licensePlate: '',
      currentLocation: { lat: 33.7890, lng: -7.1600 }
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDriver) return;
    
    if (!formData.name || !formData.phone || !formData.vehicleType || !formData.licensePlate) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    onEditDriver(editingDriver.id, formData);
    setShowEditModal(false);
    setEditingDriver(null);
  };

  const openEditModal = (driver: Driver) => {
    setEditingDriver(driver);
    setFormData({
      name: driver.name,
      phone: driver.phone,
      vehicleType: driver.vehicleType,
      licensePlate: driver.licensePlate,
      currentLocation: driver.currentLocation || { lat: 33.7890, lng: -7.1600 }
    });
    setShowEditModal(true);
  };

  const handleDelete = (driverId: string) => {
    const driver = drivers.find(d => d.id === driverId);
    if (driver && !driver.isAvailable) {
      toast.error('Impossible de supprimer un chauffeur en mission');
      return;
    }
    
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le chauffeur ${driver?.name} ?`)) {
      onDeleteDriver(driverId);
    }
  };

  return (
    <Container>
      <Header>
        <Title>🚗 Gestion des Chauffeurs</Title>
        <AddButton onClick={() => setShowAddModal(true)}>
          ➕ Ajouter Chauffeur
        </AddButton>
      </Header>

      {/* Add Driver Modal */}
      {showAddModal && (
        <Modal>
          <ModalContent>
            <ModalTitle>➕ Ajouter un Nouveau Chauffeur</ModalTitle>
            <Form onSubmit={handleAddSubmit}>
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

              <ButtonGroup>
                <Button variant="danger" onClick={() => setShowAddModal(false)}>
                  Annuler
                </Button>
                <Button variant="success" type="submit">
                  Ajouter le Chauffeur
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}

      {/* Edit Driver Modal */}
      {showEditModal && editingDriver && (
        <Modal>
          <ModalContent>
            <ModalTitle>✏️ Modifier le Chauffeur</ModalTitle>
            <Form onSubmit={handleEditSubmit}>
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

              <ButtonGroup>
                <Button variant="danger" onClick={() => setShowEditModal(false)}>
                  Annuler
                </Button>
                <Button variant="success" type="submit">
                  Mettre à Jour
                </Button>
              </ButtonGroup>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </Container>
  );
};

export default DriverManagement;
