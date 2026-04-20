# 🃏 Riftbound Tracker

Suivi de winrate interactif pour toutes les légendes de Riftbound.

## Fonctionnalités

- ✅ **40 légendes** avec rôles colorés
- 📊 **Winrate en temps réel** par légende et global
- 🔥 **Tendances** visuelles (🔥 ≥60% · ✅ ≥50% · ⚠️ ≥35% · ❌ <35%)
- 🔍 **Recherche + filtres** (joués, non joués, positif, négatif)
- 📈 **Tri** par winrate, nombre de parties, nom
- 💾 **Sauvegarde automatique** dans le navigateur (localStorage)
- 📱 **Responsive** mobile/desktop

## Déploiement sur Vercel (5 minutes)

### Option 1 — Via GitHub (recommandé)

1. Crée un repo GitHub et push ce dossier :
   ```bash
   git init
   git add .
   git commit -m "init riftbound tracker"
   git remote add origin https://github.com/TON_USERNAME/riftbound-tracker.git
   git push -u origin main
   ```

2. Va sur [vercel.com](https://vercel.com) → **New Project**
3. Importe ton repo GitHub
4. Clique **Deploy** — c'est tout ✅

### Option 2 — Via Vercel CLI

```bash
npm install -g vercel
vercel
```

Suis les instructions dans le terminal.

## Développement local

```bash
npm install
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Next.js 14** (Pages Router)
- **React 18**
- **CSS-in-JS** (styled-jsx natif Next.js)
- **Google Fonts** — Cinzel + Crimson Pro
- **localStorage** pour la persistance des données
