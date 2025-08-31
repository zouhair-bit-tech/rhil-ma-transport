# RHIL.MA - Application de Transport de Bagages par Triporteur

## 🚚 Description

RHIL.MA est une application web moderne pour la gestion de services de transport de bagages par triporteur au Maroc. L'application permet aux clients de commander des transports, sélectionner des points de départ et d'arrivée sur une carte interactive, et suivre leurs commandes en temps réel.

## ✨ Fonctionnalités Principales

### 🗺️ Carte Interactive
- Sélection des points de départ et d'arrivée sur une carte OpenStreetMap
- Calcul automatique des distances et des prix
- Marqueurs visuels pour les points de collecte et de livraison
- Centrage automatique sur le Maroc avec Bouznika comme ville de référence

### 💰 Calcul Automatique des Prix
- **Prix de base à Bouznika : 50 DH**
- Prix par kilomètre : 2.5 DH
- Frais pour transport urgent : +20 DH
- Frais pour poids excessif : +5 DH par kg au-dessus de 10kg

### 📱 Interface Utilisateur Moderne
- Design responsive et adaptatif
- Animations fluides avec Framer Motion
- Interface intuitive et facile à utiliser
- Compatible mobile et desktop

### 🔍 Suivi en Temps Réel
- Recherche de commandes par numéro
- Affichage du statut en temps réel
- Suivi GPS du triporteur
- Informations détaillées sur le chauffeur et le véhicule

## 🛠️ Technologies Utilisées

- **Frontend :** React 18 + TypeScript
- **Styling :** Styled Components
- **Cartes :** Leaflet + React Leaflet
- **Formulaires :** React Hook Form
- **Animations :** Framer Motion
- **Notifications :** React Hot Toast
- **Routing :** React Router DOM

## 📋 Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn
- Navigateur web moderne

## 🚀 Installation

1. **Cloner le projet**
   ```bash
   git clone [URL_DU_REPO]
   cd RHIL-MA
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Démarrer l'application en mode développement**
   ```bash
   npm start
   ```

4. **Ouvrir votre navigateur**
   L'application sera accessible à l'adresse : `http://localhost:3000`

## 📦 Construire l'application pour la production

Pour préparer votre application au déploiement, vous devez créer une version de production optimisée. Cette version sera contenue dans un dossier `build`.

```bash
npm run build
```

Cette commande va créer un dossier `build` à la racine de votre projet. C'est ce dossier que vous déploierez sur un serveur.

## 🚀 Déploiement

Une fois l'application "buildée", vous pouvez déployer le contenu du dossier `build` sur n'importe quel service d'hébergement de sites statiques. Voici quelques options populaires et simples :

### Vercel (Recommandé)
1.  Créez un compte sur [Vercel](https://vercel.com).
2.  Connectez votre compte GitHub, GitLab, ou Bitbucket.
3.  Importez votre projet.
4.  Vercel détectera automatiquement que c'est une application React. Il configurera les paramètres pour vous :
    -   **Build Command:** `npm run build`
    -   **Output Directory:** `build`
5.  Cliquez sur "Deploy". Votre site sera en ligne en quelques minutes.

### Netlify
Le processus est très similaire à Vercel.
1.  Créez un compte sur [Netlify](https://www.netlify.com).
2.  Connectez votre compte Git et sélectionnez votre projet.
3.  Utilisez les mêmes paramètres de build :
    -   **Build command:** `npm run build`
    -   **Publish directory:** `build`
4.  Déployez le site.

## 🔐 Accès Administrateur

- **URL Admin :** `https://[VOTRE_URL_DEPLOYES]/admin`
- **Identifiants de test :**
  - Utilisateur : `admin`
  - Mot de passe : `rhil2024`

### 🚗 Gestion des Chauffeurs
- **Ajouter un chauffeur** : Bouton "➕ Ajouter Chauffeur" avec formulaire complet
- **Modifier un chauffeur** : Bouton "✏️ Modifier" sur chaque carte de chauffeur
- **Supprimer un chauffeur** : Bouton "🗑️ Supprimer" (désactivé si en mission)
- **Suivi en temps réel** : Position GPS, statut de disponibilité, notes et évaluations

### 🗺️ Cartes Dynamiques et Hors Ligne
- **Technologie OpenLayers** : Cartes performantes et compatibles hors ligne
- **Coordonnées GPS en temps réel** : Affichage des coordonnées précises au survol de la souris
- **Marqueurs dynamiques** : Points A/B, position du chauffeur, et route du trajet
- **Mode hors ligne** : Fonctionnement même sans connexion internet
- **Interface intuitive** : Instructions claires et feedback visuel pour la sélection des points

## 🏗️ Structure du Projet

```
RHIL-MA/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── BookingPage.tsx
│   │   └── TrackingPage.tsx
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   └── pricing.ts
│   ├── styles/
│   │   ├── global.css
│   │   └── App.css
│   ├── App.tsx
│   └── index.tsx
├── package.json
└── README.md
```

## 📱 Utilisation

### 1. Page d'Accueil
- Présentation du service RHIL.MA
- Boutons d'action pour commander ou suivre un transport
- Informations sur les avantages du service

### 2. Commander un Transport
- Sélection des points sur la carte interactive
- Remplissage du formulaire de commande
- Calcul automatique du prix selon la distance et le poids
- Envoi de la commande

### 3. Suivre un Transport
- Recherche par numéro de commande
- Affichage du statut en temps réel
- Carte de suivi avec position du triporteur
- Informations détaillées sur la livraison

## 🎯 Configuration des Prix

L'application utilise un système de tarification transparent :

```typescript
const PRICING_CONFIG = {
  basePrice: 50,        // Prix de base à Bouznika
  pricePerKm: 2.5,      // Prix par kilomètre
  urgentFee: 20,        // Frais pour transport urgent
  weightFee: 5          // Frais par kg au-dessus de 10kg
};
```

## 🔧 Personnalisation

### Modifier les Coordonnées
- **Centre du Maroc :** `MAP_CENTER` dans `BookingPage.tsx`
- **Bouznika :** `BOUZNIKA_COORDS` dans `BookingPage.tsx`

### Modifier les Prix
- Éditer `src/utils/pricing.ts` pour ajuster la tarification

### Modifier le Design
- Personnaliser les composants styled-components
- Modifier les couleurs dans les fichiers CSS

## 📱 Responsive Design

L'application est entièrement responsive et s'adapte à tous les écrans :
- **Desktop :** Affichage en grille à 2 colonnes
- **Tablet :** Adaptation automatique des layouts
- **Mobile :** Interface optimisée pour les petits écrans

## 🔒 Sécurité

- Validation des formulaires côté client
- Protection contre les injections XSS
- Gestion sécurisée des données utilisateur

## 📞 Support

Pour toute question ou assistance :
- **Email :** support@rhil.ma
- **Téléphone :** +212 6 XX XX XX XX
- **Adresse :** Bouznika, Maroc

## 📄 Licence

Ce projet est développé pour RHIL.MA. Tous droits réservés.

## 🎉 Remerciements

- OpenStreetMap pour les cartes
- La communauté React pour les outils
- Tous les contributeurs open source

---

**RHIL.MA** - Transport de Bagages par Triporteur au Maroc 🇲🇦 