# 🚀 Démonstration RHIL.MA

## 🎯 Scénarios de Test

### 1. Test de la Page d'Accueil
- ✅ Navigation vers la page d'accueil
- ✅ Affichage du logo RHIL.MA
- ✅ Boutons d'action fonctionnels
- ✅ Design responsive

### 2. Test de la Réservation
- ✅ Accès à la page de réservation
- ✅ Carte interactive centrée sur le Maroc
- ✅ Sélection des points sur la carte
- ✅ Calcul automatique des prix
- ✅ Formulaire de commande complet

### 3. Test du Suivi
- ✅ Accès à la page de suivi
- ✅ Recherche par numéro de commande
- ✅ Affichage du statut en temps réel
- ✅ Carte de suivi avec trajet

## 🧪 Données de Test

### Commande de Démonstration
- **Numéro :** TRIP-001
- **Point de départ :** Bouznika (33.7890, -7.1600)
- **Point d'arrivée :** Casablanca (33.5731, -7.5898)
- **Distance :** 45.2 km
- **Prix :** 163 DH
- **Statut :** En cours

### Calcul des Prix
```
Prix de base : 50 DH
Distance : 45.2 km × 2.5 DH = 113 DH
Total : 163 DH
```

## 📱 Fonctionnalités à Tester

### Carte Interactive
1. **Zoom et déplacement** sur la carte
2. **Sélection des points** en cliquant
3. **Marqueurs colorés** (vert = départ, rouge = arrivée)
4. **Popup d'information** sur les marqueurs

### Formulaire de Réservation
1. **Validation des champs** obligatoires
2. **Calcul en temps réel** du prix
3. **Sélection du type** de transport
4. **Soumission** du formulaire

### Suivi des Commandes
1. **Recherche** par numéro
2. **Affichage du statut** avec barre de progression
3. **Informations du chauffeur** et du véhicule
4. **Estimation d'arrivée**

## 🔧 Personnalisation Rapide

### Modifier les Coordonnées
```typescript
// Dans src/pages/BookingPage.tsx
const MAP_CENTER: [number, number] = [31.7917, -7.0926]; // Centre du Maroc
const BOUZNIKA_COORDS: [number, number] = [33.7890, -7.1600]; // Bouznika
```

### Modifier les Prix
```typescript
// Dans src/utils/pricing.ts
export const PRICING_CONFIG: PricingConfig = {
  basePrice: 50,        // Prix de base
  pricePerKm: 2.5,      // Prix par km
  urgentFee: 20,        // Frais urgent
  weightFee: 5          // Frais poids
};
```

## 🚀 Démarrage Rapide

1. **Installer les dépendances**
   ```bash
   npm install
   ```

2. **Démarrer l'application**
   ```bash
   npm start
   ```

3. **Ouvrir le navigateur**
   ```
   http://localhost:3000
   ```

## 📋 Checklist de Test

- [ ] Page d'accueil se charge correctement
- [ ] Navigation entre les pages fonctionne
- [ ] Carte interactive s'affiche
- [ ] Sélection des points sur la carte
- [ ] Calcul automatique des prix
- [ ] Formulaire de réservation
- [ ] Page de suivi des commandes
- [ ] Design responsive sur mobile
- [ ] Animations fluides
- [ ] Notifications toast

## 🎨 Personnalisation du Design

### Couleurs Principales
- **Bleu principal :** #1e3c72
- **Bleu secondaire :** #2a5298
- **Accent :** #ffd700 (or)
- **Fond :** #f5f7fa

### Typographie
- **Police principale :** System fonts
- **Taille de base :** 16px
- **Hiérarchie :** h1 (3rem), h2 (2rem), h3 (1.5rem)

## 🔍 Dépannage

### Problèmes Courants
1. **Carte ne s'affiche pas** : Vérifier la connexion internet
2. **Erreurs TypeScript** : Vérifier l'installation des dépendances
3. **Styles manquants** : Redémarrer le serveur de développement

### Solutions
- Redémarrer l'application : `Ctrl+C` puis `npm start`
- Nettoyer le cache : `npm run build`
- Vérifier les versions : `npm list`

---

**RHIL.MA** - Prêt pour la production ! 🚚✨ 