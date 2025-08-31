import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HomeContainer = styled.div`
  min-height: 80vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
`;

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled(motion.h1)`
  font-size: 3rem;
  color: #1e3c72;
  margin-bottom: 1rem;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const CTAButtons = styled(motion.div)`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const CTAButton = styled(Link)`
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
  padding: 1rem 2rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
  }
`;

const SecondaryButton = styled(Link)`
  background: transparent;
  color: #1e3c72;
  padding: 1rem 2rem;
  border: 2px solid #1e3c72;
  border-radius: 50px;
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
  
  &:hover {
    background: #1e3c72;
    color: white;
  }
`;

const FeaturesSection = styled.section`
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const FeatureCard = styled(motion.div)`
  background: white;
  padding: 2rem;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  text-align: center;
`;

const FeatureIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const FeatureTitle = styled.h3`
  color: #1e3c72;
  margin-bottom: 1rem;
`;

const FeatureDescription = styled.p`
  color: #666;
  line-height: 1.6;
`;

const ContactSection = styled.section`
  padding: 3rem 2rem;
  background-color: #e9ecef;
  text-align: center;
`;

const ContactTitle = styled.h2`
  color: #1e3c72;
  margin-bottom: 2rem;
`;

const ContactLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
`;

const ContactLink = styled.a`
  color: #1e3c72;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: #2a5298;
    transform: translateY(-2px);
  }
`;

const TrackingIllustration = styled(motion.div)`
  margin: 2rem auto;
  max-width: 600px;
  padding: 1rem;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
`;

const IllustrationContainer = styled.div`
  position: relative;
  height: 200px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  overflow: hidden;
`;

const Point = styled.div<{ variant: 'start' | 'end' }>`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: ${props => props.variant === 'start' ? '#28a745' : '#dc3545'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
  position: relative;
  z-index: 2;
`;

const RouteLine = styled.div`
  position: absolute;
  top: 50%;
  left: 80px;
  right: 80px;
  height: 4px;
  background: linear-gradient(90deg, #28a745 0%, #17a2b8 50%, #dc3545 100%);
  border-radius: 2px;
  z-index: 1;
`;

const RouteDots = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 0.5rem;
  z-index: 1;
`;

const Dot = styled.div<{ delay: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #17a2b8;
  animation: pulse 2s infinite;
  animation-delay: ${props => props.delay}s;
  
  @keyframes pulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.2); }
  }
`;

const TrackingText = styled.div`
  text-align: center;
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
`;

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <HeroSection>
        <Title
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          RHIL.MA
        </Title>
        <Subtitle
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Transport de bagages par triporteur dans tout le Maroc. 
          Service rapide, fiable et économique à partir de 50 DH à Bouznika.
        </Subtitle>
        
        <TrackingIllustration
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <IllustrationContainer>
            <Point variant="start">A</Point>
            <RouteLine />
            <RouteDots>
              <Dot delay={0} />
              <Dot delay={0.3} />
              <Dot delay={0.6} />
              <Dot delay={0.9} />
            </RouteDots>
            <Point variant="end">B</Point>
          </IllustrationContainer>
          <TrackingText>
            🚚 Suivi en temps réel de votre transport de Bouznika vers votre destination
          </TrackingText>
        </TrackingIllustration>
        
        <CTAButtons
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <CTAButton to="/booking">Commander Maintenant</CTAButton>
          <SecondaryButton to="/tracking">Suivre un Transport</SecondaryButton>
        </CTAButtons>
      </HeroSection>

      <FeaturesSection>
        <motion.h2
          style={{ textAlign: 'center', color: '#1e3c72', marginBottom: '2rem' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          Pourquoi Choisir RHIL.MA ?
        </motion.h2>
        
        <FeaturesGrid>
          <FeatureCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <FeatureIcon>🚚</FeatureIcon>
            <FeatureTitle>Transport Rapide</FeatureTitle>
            <FeatureDescription>
              Livraison en temps réel avec suivi GPS de votre triporteur
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            <FeatureIcon>💰</FeatureIcon>
            <FeatureTitle>Prix Transparent</FeatureTitle>
            <FeatureDescription>
              Calcul automatique du prix selon la distance et le poids
            </FeatureDescription>
          </FeatureCard>

          <FeatureCard
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <FeatureIcon>📱</FeatureIcon>
            <FeatureTitle>Commande en Ligne</FeatureTitle>
            <FeatureDescription>
              Réservation simple et rapide depuis votre smartphone
            </FeatureDescription>
          </FeatureCard>
        </FeaturesGrid>
      </FeaturesSection>

      <ContactSection>
        <ContactTitle>Contactez-nous</ContactTitle>
        <ContactLinks>
          <ContactLink href="tel:+212694940573">📞 Appelez-nous: +212 694 94 05 73</ContactLink>
          <ContactLink href="https://wa.me/212694940573" target="_blank" rel="noopener noreferrer">💬 WhatsApp: +212 694 94 05 73</ContactLink>
          <ContactLink href="https://instagram.com/store.rkhawa" target="_blank" rel="noopener noreferrer">📸 Instagram: @store.rkhawa</ContactLink>
        </ContactLinks>
      </ContactSection>
    </HomeContainer>
  );
};

export default HomePage; 