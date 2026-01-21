# 📊 Décor Discount Analytics

Application moderne d'analyse retail construite avec React, TypeScript et Vite.

## ✨ Fonctionnalités

- 📁 **Upload CSV double** : Chargez 1 ou 2 fichiers CSV (fusion automatique)
- 📈 **Dashboard complet** : KPIs, graphiques interactifs, analyses avancées
- 🔍 **Recherche** : Tickets et clients avec drill-down détaillé
- 🎨 **Design moderne** : Interface pro avec Tailwind CSS
- ⚡ **Performance** : Traite +1M lignes rapidement
- 🌐 **Séparation Web** : M41/M42 isolés des magasins physiques

## 🚀 Démarrage rapide

### Installation

```bash
cd decor-analytics
npm install
```

### Lancement en dev

```bash
npm run dev
```

Ouvre [http://localhost:5173](http://localhost:5173)

### Build production

```bash
npm run build
npm run preview
```

## 📋 Format CSV attendu

Le CSV doit contenir ces colonnes (séparateur `;`) :

- `Date`
- `Horaire`
- `Famille Produit`
- `N° Ticket`
- `N° Produit`
- `S/Famille Produit`
- `N° Magasin`
- `Client Fidélité`
- `N° Carte de fidélité`
- `Date de création carte`
- `Ville Fidélité`
- `C.P Fidélité`
- `CA Ventes TTC Période 1`

**Important** : Si vous exportez en 2 parties, assurez-vous que les 2 fichiers ont un en-tête !

## 🛠️ Stack technique

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Styling moderne
- **Recharts** - Graphiques interactifs
- **PapaParse** - Parsing CSV
- **Lucide React** - Icônes

## 📊 Analyses disponibles

### Dashboard
- **KPIs** : CA total, transactions, panier moyen, clients
- **Fidélisation** : Répartition fidèles/non fidèles
- **Top Familles** : Top 10 produits par CA
- **Top Magasins** : Performance par magasin
- **Saisonnalité** : Évolution du CA dans le temps
- **Web** : Statistiques M41 + M42 séparées

### Recherche
- **Tickets** : Recherche par numéro, voir détails complets
- **Clients** : Recherche par carte, historique d'achats

## 🎯 À faire

- [ ] Export des résultats en PDF/Excel
- [ ] Filtres par période
- [ ] Cross-selling matrix visuelle
- [ ] Locomotives et converteuses
- [ ] Analyse géographique détaillée
- [ ] Mode sombre

## 📝 Scripts disponibles

```bash
npm run dev          # Lancer en mode développement
npm run build        # Build production
npm run preview      # Prévisualiser le build
npm run lint         # Linter le code
```

## 📄 Licence

Propriétaire - Décor Discount
