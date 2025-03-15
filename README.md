# Firecracker App

Ce projet utilise [Next.js](https://nextjs.org) pour le frontend et Express.js pour le backend mock.

## Configuration du Projet

### 1. Installation des dépendances

```bash
# Installation des dépendances du frontend
cd firecracker-app
npm install

# Installation des dépendances du backend
cd mock
npm install
```

### 2. Démarrage des serveurs

```bash
# Démarrer le backend (depuis le dossier mock)
cd mock
node server.js
# Le serveur backend démarre sur http://localhost:3002

# Démarrer le frontend (depuis le dossier principal)
cd ..
npm run dev
# Le frontend démarre sur http://localhost:3000
```

### 3. Accès à l'application

1. Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur
2. Utilisez les identifiants suivants pour vous connecter :
   - Email: utilisez un email existant dans `mock/db.json`
   - Mot de passe: le mot de passe se trouve dans db.json : "123456789"

## Structure du Projet

- `firecracker-app/` : Application frontend Next.js
- `firecracker-app/mock/` : Serveur backend mock
  - `server.js` : API Express avec authentification JWT
  - `db.json` : Base de données mock
  - `routes.json` : Configuration des routes

## Fonctionnalités

- Authentification JWT avec cookies
- Interface d'administration des VMs
- Gestion des utilisateurs
- Visualisation des logs
