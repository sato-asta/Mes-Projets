# 🔐 Comment fonctionne l'authentification

## 1️⃣ INSCRIPTION - L'utilisateur se crée un compte

```
Frontend → POST /users
{
  "email": "jean@example.com",
  "password": "SecurePass123",
  "firstname": "Jean",
  "provider": "local"
}

Backend → Response 200
{
  "id": "...",
  "email": "jean@example.com",
  "name": "Jean"
}
```

**Ce qui se passe:**
- L'utilisateur crée un compte
- Son mot de passe est **hashé** (crypté) avec bcrypt
- Il ne peut pas voir le vrai mot de passe après

---

## 2️⃣ CONNEXION - L'utilisateur se connecte

```
Frontend → POST /users/login
{
  "email": "jean@example.com",
  "password": "SecurePass123"
}

Backend → Response 200
{
  "id": "...",
  "email": "jean@example.com",
  "access_token": "eyJhbGciOiJIUzI1NiIs...",  ← TOKEN JWT !
  "token_type": "bearer"
}
```

**Ce qui se passe:**
1. Backend reçoit email et password
2. Backend cherche l'utilisateur en base de données
3. Backend compare le password avec le hash stocké
4. Si correct → Backend crée un **JWT Token**
5. Backend envoie le token au frontend

---

## 3️⃣ LE JWT TOKEN - C'est quoi ?

Un JWT (JSON Web Token) est un **ticket d'accès sécurisé** avec 3 parties:

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJlbWFpbCI6ImplYW5AZXhhbXBsZS5jb20iLCJleHAiOjE2OTI0NzY4MDB9.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c

↓ DÉCODÉ ↓

Header (en-tête):
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload (contenu):
{
  "email": "jean@example.com",
  "exp": 1692476800,  ← Expire le 18 août 2026
  "iat": 1685684800   ← Créé le 18 mai 2026
}

Signature (vérification):
- Calculée avec SECRET_KEY
- Prouve que c'est authentique
```

**Le token contient:**
- L'email de l'utilisateur
- La date d'expiration (30 jours)
- Une signature pour vérifier que c'est authentique

---

## 4️⃣ UTILISATION DU TOKEN - Accéder aux routes protégées

```
Frontend → GET /budgets/jean@example.com
Headers:
  Authorization: Bearer eyJhbGciOiJIUzI1NiIs...

Backend:
  1. Récupère le token du header
  2. Vérifie la signature avec SECRET_KEY
  3. Vérifie que le token n'a pas expiré
  4. Extrait l'email: "jean@example.com"
  5. Récupère l'utilisateur en base
  6. ✅ L'utilisateur est authentifié!
  7. Exécute la route

Response 200:
{
  "salary": 2000,
  "expenses": [...]
}
```

---

## 5️⃣ ERREURS D'AUTHENTIFICATION

### ❌ Pas de token
```
Frontend → GET /budgets/jean@example.com
(SANS header Authorization)

Backend → Response 401
{
  "detail": "Invalid authentication credentials"
}
```

### ❌ Token expiré
```
Frontend → GET /budgets/jean@example.com
Headers:
  Authorization: Bearer token_expiré

Backend → Response 401
{
  "detail": "Token expiré"
}
→ Solution: Se reconnecter pour avoir un nouveau token
```

### ❌ Token invalide
```
Frontend → GET /budgets/jean@example.com
Headers:
  Authorization: Bearer token_modifié

Backend → Response 401
{
  "detail": "Token invalide"
}
→ Token a été altéré, pas de confiance
```

### ❌ Accès non autorisé
```
Frontend → GET /budgets/pierre@example.com
(Jean essaie d'accéder au budget de Pierre)

Backend → Response 403
{
  "detail": "Vous ne pouvez accéder qu'à votre propre budget"
}
→ Chacun ne peut voir que SES données
```

---

## 6️⃣ FLUX COMPLET - Etape par étape

```
┌─────────────┐
│  Utilisateur │
└──────┬──────┘
       │
       ├─ 1. S'inscrire (POST /users) → Crée compte
       │
       ├─ 2. Se connecte (POST /users/login) → Reçoit TOKEN
       │
       ├─ 3. Ajoute TOKEN dans les headers
       │     Authorization: Bearer TOKEN
       │
       └─ 4. Accède aux routes protégées
            GET /budgets/email
            POST /wishlists
            GET /friends
            etc...
            
            Toutes les requêtes envoient le TOKEN
```

---

## 7️⃣ CODE - Comment ça marche dans le backend

### auth.py - Création du token
```python
def create_access_token(email: str):
    payload = {
        "email": email,
        "exp": datetime.utcnow() + timedelta(minutes=30*24),  # 30 jours
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")
    return token
```

### auth.py - Vérification du token
```python
def verify_token(credentials):
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        email = payload.get("email")
        return email
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expiré")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")
```

### auth.py - Guard pour les routes
```python
def get_current_user(email: str = Depends(verify_token)):
    user = db.users.find_one({"email": email})
    if user is None:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé")
    return user
```

### Utiliser le guard dans une route
```python
@router.get("/budgets/{user_id}")
def get_budget(user_id: str, current_user: dict = Depends(get_current_user)):
    # current_user est automatiquement l'utilisateur authentifié
    
    # Vérifier que l'utilisateur accède à SES données
    if user_id != current_user["email"]:
        raise HTTPException(status_code=403, detail="Accès refusé")
    
    budget = db.budgets.find_one({"user_id": user_id})
    return budget
```

---

## 8️⃣ VARIABLES D'ENVIRONNEMENT - Configuration

Fichier `.env`:
```
SECRET_KEY=votre-clé-très-sécurisée-très-longue-et-compliquée
MONGO_URI=mongodb://localhost:27017
MONGO_DB=wishlist_db
```

**SECRET_KEY** est ultra important:
- ✅ Très longue (min 32 caractères)
- ✅ Très compliquée (majuscules, chiffres, caractères spéciaux)
- ✅ JAMAIS dans le code, TOUJOURS dans .env
- ✅ JAMAIS partagée

---

## 9️⃣ FRONTEND - Comment envoyer le token

### Avec Fetch API
```javascript
// Connexion
const response = await fetch("http://localhost:8000/users/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
        email: "jean@example.com",
        password: "SecurePass123"
    })
})

const data = await response.json()
const token = data.access_token

// Sauvegarder le token
localStorage.setItem("token", token)

// Utiliser le token pour une requête protégée
const budgetResponse = await fetch(
    "http://localhost:8000/budgets/jean@example.com",
    {
        headers: {
            "Authorization": `Bearer ${token}`  ← Le token ici !
        }
    }
)
```

### Avec Axios (plus facile)
```javascript
import axios from 'axios'

const api = axios.create({baseURL: "http://localhost:8000"})

// Ajouter le token automatiquement à TOUTES les requêtes
api.interceptors.request.use(config => {
    const token = localStorage.getItem("token")
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

// Connexion
const loginResponse = await api.post("/users/login", {
    email: "jean@example.com",
    password: "SecurePass123"
})
localStorage.setItem("token", loginResponse.data.access_token)

// Toutes les futures requêtes ont automatiquement le token !
const budget = await api.get("/budgets/jean@example.com")
```

---

## 🔟 RÉSUMÉ - Les 3 points clés

| Étape | Action | Résultat |
|-------|--------|----------|
| **1. Login** | POST /users/login | Reçoit JWT token |
| **2. Stockage** | localStorage.setItem("token", ...) | Token sauvegardé |
| **3. Utilisation** | Authorization: Bearer token | Accès à toutes les routes |

---

## ❓ FAQ - Questions fréquentes

**Q: Qu'est-ce qui se passe si le token expire?**
A: L'utilisateur reçoit erreur 401. Il doit se reconnecter pour avoir un nouveau token.

**Q: Comment sauvegarder le token?**
A: Dans `localStorage` (navigateur) ou dans les cookies (plus sécurisé).

**Q: Le token est-il visible?**
A: Oui, mais c'est normal. C'est juste une succession de caractères. La signature garantit qu'il n'a pas été modifié.

**Q: Et si quelqu'un vole le token?**
A: C'est grave! Donc:
- Utilisez HTTPS en production (pas HTTP)
- Stockez en secure cookie (pas localStorage)
- Changez régulièrement SECRET_KEY

**Q: Pourquoi 30 jours?**
A: Bon compromis entre sécurité et commodité. Peut être changé dans auth.py

---

## 🎯 Résultat final

✅ Seuls les utilisateurs authentifiés peuvent:
- Voir leurs budgets
- Créer des wishlists
- Ajouter des amis
- Etc.

✅ Chaque utilisateur ne peut accéder qu'à **SES DONNÉES**

✅ Les routes publiques (login, register) restent accessibles
