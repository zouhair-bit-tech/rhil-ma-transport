import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Location, BookingForm as BookingFormType, Mission } from '../types';
import { calculatePrice, formatPrice, calculateDistance } from '../utils/pricing';
import DynamicMap from '../components/DynamicMap';

// Configuration de la carte centrée sur le Maroc
const MAP_CENTER: [number, number] = [31.7917, -7.0926]; // Centre du Maroc
const BOUZNIKA_COORDS: [number, number] = [33.7890, -7.1600]; // Coordonnées de Bouznika

const BookingContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageTitle = styled.h1`
  color: #1e3c72;
  text-align: center;
  margin-bottom: 2rem;
`;

const BookingGrid = styled.div`
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



const FormSection = styled.div`
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  color: #1e3c72;
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

const TextArea = styled.textarea`
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
  
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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  width: 18px;
  height: 18px;
`;

const SubmitButton = styled.button`
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
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const SuccessModal = styled.div`
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

const SuccessContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  text-align: center;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
`;

const SuccessTitle = styled.h2`
  color: #28a745;
  margin-bottom: 1rem;
`;

const CommandNumber = styled.div`
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 10px;
  margin: 1.5rem 0;
  border: 2px solid #28a745;
`;

const CommandNumberText = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #1e3c72;
  font-family: 'Courier New', monospace;
  letter-spacing: 2px;
`;

const CommandNumberLabel = styled.div`
  color: #666;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const SuccessMessage = styled.p`
  color: #666;
  margin-bottom: 1.5rem;
  line-height: 1.6;
`;

const CloseButton = styled.button`
  background: #28a745;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: #218838;
    transform: translateY(-1px);
  }
`;

const CopyButton = styled.button`
  background: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 1rem;
  
  &:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }
`;

const PriceDisplay = styled.div`
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 1rem;
`;

const PriceText = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #1e3c72;
`;

const DistanceText = styled.div`
  color: #666;
  margin-top: 0.5rem;
`;



const BookingPage: React.FC<{ onAddMission: (mission: Omit<Mission, 'id' | 'status' | 'createdAt'>) => void; }> = ({ onAddMission }) => {
  const [pickup, setPickup] = useState<Location | undefined>();
  const [destination, setDestination] = useState<Location | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commandNumber, setCommandNumber] = useState<string>('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm<BookingFormType>();
  
  const weight = watch('weight') || 0;
  const urgent = watch('urgent') || false;
  
  // Calculer le prix en temps réel
  const price = pickup && destination ? calculatePrice(pickup, destination, weight, urgent) : 0;
  const distance = pickup && destination ? calculateDistance(pickup, destination) : 0;
  
  // Générer un numéro de commande unique
  const generateCommandNumber = (): string => {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `TRIP-${String(timestamp).slice(-6)}${String(random).padStart(3, '0')}`;
  };
  
  // Copier le numéro de commande dans le presse-papiers
  const copyCommandNumber = async () => {
    try {
      await navigator.clipboard.writeText(commandNumber);
      toast.success('Numéro de commande copié !');
    } catch (error) {
      toast.error('Impossible de copier le numéro');
    }
  };
  
  const handleLocationSelect = (location: Location, type: 'pickup' | 'destination') => {
    if (type === 'pickup') {
      setPickup(location);
      // Ne pas réinitialiser la destination automatiquement
    } else {
      setDestination(location);
    }
  };
  
  const onSubmit = async (data: BookingFormType) => {
    if (!pickup || !destination) {
      toast.error('Veuillez sélectionner les points de départ et d\'arrivée sur la carte');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simuler l'envoi de la commande
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const bookingData: BookingFormType = {
        ...data,
        pickup,
        destination
      };
      
      // Générer le numéro de commande
      const newCommandNumber = generateCommandNumber();
      setCommandNumber(newCommandNumber);
      
      const newMission: Omit<Mission, 'id' | 'status' | 'createdAt'> = {
        commandNumber: newCommandNumber,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        customerEmail: data.customerEmail,
        pickup,
        destination,
        weight: Number(data.weight),
        urgent: Boolean(data.urgent),
        price,
        distance,
      };

      onAddMission(newMission);
      
      console.log('Données de réservation:', { ...data, pickup, destination });
      console.log('Numéro de commande:', newCommandNumber);
      
      // Afficher le succès avec le numéro de commande
      setShowSuccess(true);
      
      // Réinitialiser le formulaire
      setPickup(undefined);
      setDestination(undefined);
      // Reset the form fields
      reset();
      
    } catch (error) {
      toast.error('Erreur lors de l\'envoi de la commande');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <BookingContainer>
      <PageTitle>Commander un Transport</PageTitle>
      
      <BookingGrid>
        <MapSection>
          <h3>Sélectionnez vos points sur la carte</h3>
          <DynamicMap
            onLocationSelect={handleLocationSelect}
            pickup={pickup}
            destination={destination}
            center={MAP_CENTER}
            zoom={6}
          />
        </MapSection>
        
        <FormSection>
          <h3>Détails de votre commande</h3>
          
          {pickup && destination && (
            <PriceDisplay>
              <PriceText>Prix estimé: {formatPrice(price)}</PriceText>
              <DistanceText>Distance: {distance} km</DistanceText>
            </PriceDisplay>
          )}
          
          <Form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <Label>Nom complet *</Label>
              <Input
                {...register('customerName', { required: 'Le nom est requis' })}
                placeholder="Votre nom complet"
              />
              {errors.customerName && <span style={{ color: 'red' }}>{errors.customerName.message}</span>}
            </FormGroup>
            
            <FormGroup>
              <Label>Téléphone *</Label>
              <Input
                {...register('customerPhone', { required: 'Le téléphone est requis' })}
                placeholder="Votre numéro de téléphone"
                type="tel"
              />
              {errors.customerPhone && <span style={{ color: 'red' }}>{errors.customerPhone.message}</span>}
            </FormGroup>
            
            <FormGroup>
              <Label>Email</Label>
              <Input
                {...register('customerEmail')}
                placeholder="Votre email (optionnel)"
                type="email"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Description des bagages</Label>
              <TextArea
                {...register('description')}
                placeholder="Décrivez vos bagages (taille, type, etc.)"
              />
            </FormGroup>
            
            <FormGroup>
              <Label>Poids (kg) *</Label>
              <Input
                {...register('weight', { 
                  required: 'Le poids est requis',
                  min: { value: 0.1, message: 'Le poids doit être supérieur à 0' },
                  max: { value: 100, message: 'Le poids maximum est de 100 kg' }
                })}
                type="number"
                step="0.1"
                min="0.1"
                max="100"
              />
              {errors.weight && <span style={{ color: 'red' }}>{errors.weight.message}</span>}
            </FormGroup>
            
            <FormGroup>
              <Label>Type de transport</Label>
              <Select {...register('urgent')}>
                <option value="false">Standard</option>
                <option value="true">Urgent (+20 DH)</option>
              </Select>
            </FormGroup>
            
            <CheckboxContainer>
              <Checkbox
                {...register('urgent')}
                type="checkbox"
                id="urgent"
              />
              <Label htmlFor="urgent">Transport urgent</Label>
            </CheckboxContainer>
            
            <SubmitButton type="submit" disabled={isSubmitting || !pickup || !destination}>
              {isSubmitting ? 'Envoi en cours...' : 'Commander le Transport'}
            </SubmitButton>
          </Form>
        </FormSection>
      </BookingGrid>
      
      {/* Modal de succès avec numéro de commande */}
      {showSuccess && (
        <SuccessModal>
          <SuccessContent>
            <SuccessTitle>🎉 Commande Envoyée avec Succès !</SuccessTitle>
            
            <SuccessMessage>
              Votre demande de transport a été reçue et est en cours de traitement. 
              Utilisez le numéro de commande ci-dessous pour suivre votre transport.
            </SuccessMessage>
            
            <CommandNumber>
              <CommandNumberText>{commandNumber}</CommandNumberText>
              <CommandNumberLabel>Numéro de commande</CommandNumberLabel>
            </CommandNumber>
            
            <SuccessMessage>
              <strong>Important :</strong> Notez bien ce numéro de commande. 
              Vous en aurez besoin pour suivre votre transport sur la page de suivi.
            </SuccessMessage>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <CopyButton onClick={copyCommandNumber}>
                📋 Copier le numéro
              </CopyButton>
              <CloseButton onClick={() => setShowSuccess(false)}>
                Fermer
              </CloseButton>
            </div>
          </SuccessContent>
        </SuccessModal>
      )}
    </BookingContainer>
  );
};

export default BookingPage; 
