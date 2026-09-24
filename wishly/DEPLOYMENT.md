# Guide de Déploiement - Wishly

Ce document explique comment déployer l'application sur Vercel (frontend) et Railway (backend).

## Prérequis

- Compte Vercel (vercel.com)
- Compte Railway (railway.app)
- Repository Git (GitHub, GitLab, etc.)

## 1. Configuration de MongoDB Atlas

### Étapes :

1. **Créer un compte MongoDB Atlas** (si ce n'est pas déjà fait)
   - Accéder à https://www.mongodb.com/cloud/atlas
   - S'inscrire ou se connecter
   - Créer une organisation et un projet

2. **Créer un cluster**
   - Build a Database → Créer un cluster (Free tier disponible)
   - Sélectionner le provider et la région (exemple: AWS, Europe)
   - Attendre que le cluster soit créé (~10 min)

3. **Obtenir la chaîne de connexion**
   - Aller dans Clusters → Connect
   - Sélectionner "Drivers" → "Node.js"
   - Copier la chaîne de connexion : `mongodb+srv://username:password@cluster.mongodb.net/...`
   - ⚠️ Remplacer `<password>` par le mot de passe réel et `<username>` par l'utilisateur DB
   - Exemple final : `mongodb+srv://admin:myPassword123@wishly-cluster.mongodb.net/wishly?retryWrites=true&w=majority`

## 2. Déploiement du Backend sur Railway

### Étapes :

1. **Créer un nouveau projet sur Railway**
   - Accueil → New Project
   - Sélectionner "Deploy from GitHub" ou "Deploy from Repo"
   - Connecter ton repository

2. **Configurer les variables d'environnement sur Railway**
   - Aller dans Project Settings → Variables
   - Ajouter les variables nécessaires :
     ```
     MONGO_URI=mongodb+srv://admin:myPassword123@wishly-cluster.mongodb.net/wishly?retryWrites=true&w=majority
     MONGO_DB=wishly
     SERP_API_KEY=4737d5ba7eb7fc8af6979645d1b542cb88faff5ed940ad8ecc18fa1f01de6e3c
     SECRET_KEY=57e934af1f85b7eee0e1054aa473daebf4d606398e8e884a0683a65fc2997006
     ```
   - **IMPORTANT** : Utilise ta vraie `MONGO_URI` depuis MongoDB Atlas

3. **Obtenir l'URL du backend Railway**
   - Une fois déployé, tu obtiendras une URL comme: `https://backend-wishly.up.railway.app`
   - Note bien cette URL pour la suite

## 3. Déploiement du Frontend sur Vercel

### Étapes :

1. **Créer un nouveau projet sur Vercel**
   - vercel.com → New Project
   - Importer ton repository
   - Sélectionner le dossier `frontend` comme root

2. **Configurer les variables d'environnement Vercel**
   
   Dans Vercel → Project Settings → Environment Variables, ajouter :

   ```
   NEXTAUTH_SECRET=wishly_secret_key_2026
   NEXTAUTH_URL=https://wishlyy.vercel.app
   GOOGLE_CLIENT_ID=392297769489-mge1kgjv7jgn2a0vnpdrv0bfmlts6g8o.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=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
   INTERNAL_API_URL=https://backend-wishly.up.railway.app
   ```

   ⚠️ **Important** : Remplace `https://wishlyy.vercel.app` par l'URL réelle de ton projet Vercel et `https://backend-wishly.up.railway.app` par l'URL de ton backend Railway.

3. **Déployer**
   - Clique sur "Deploy"
   - Attends la fin du déploiement

## 4. Configuration du Backend pour CORS

✅ **Déjà configuré** : Le fichier `backend/app/main.py` a été mis à jour pour autoriser les requêtes depuis :
- `http://localhost:3000` (développement local)
- `https://wishlyy.vercel.app` (production Vercel)

Si tu dois ajouter d'autres origines (ex: domaine personnalisé), modifie la section CORS dans `backend/app/main.py`.

## 5. Fichiers de configuration modifiés

- ✅ `frontend/.env.production` créé avec les URLs de production
- ✅ `backend/.env.production` créé avec le template MongoDB Atlas
- ✅ `backend/app/main.py` mis à jour pour CORS

## 6. Variables d'environnement de référence

### Backend (.env.production ou variables Railway)
```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/wishly?retryWrites=true&w=majority
MONGO_DB=wishly
SERP_API_KEY=4737d5ba7eb7fc8af6979645d1b542cb88faff5ed940ad8ecc18fa1f01de6e3c
SECRET_KEY=57e934af1f85b7eee0e1054aa473daebf4d606398e8e884a0683a65fc2997006
```

### Frontend (.env.production)
```
NEXTAUTH_SECRET=wishly_secret_key_2026
NEXTAUTH_URL=https://wishlyy.vercel.app
GOOGLE_CLIENT_ID=392297769489-mge1kgjv7jgn2a0vnpdrv0bfmlts6g8o.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
INTERNAL_API_URL=https://backend-wishly.up.railway.app
```

## 7. Vérification

Une fois déployé, teste :
1. L'authentification Google fonctionne
2. Les requêtes API au backend fonctionnent (inscription, connexion)
3. Les cookies/tokens sont bien gérés
4. La connexion MongoDB Atlas fonctionne

## Support

- Docs MongoDB Atlas: https://docs.atlas.mongodb.com
- Docs Vercel: https://vercel.com/docs
- Docs Railway: https://docs.railway.app
- Docs Next.js: https://nextjs.org/docs
