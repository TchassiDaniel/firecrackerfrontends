# Architecture API de Firecracker

Ce document explique l'architecture API de l'application Firecracker et comment utiliser les différents composants pour interagir avec les microservices backend.

## Table des matières

1. [Structure générale](#structure-générale)
2. [Flux complet de l'architecture](#flux-complet-de-larchitecture)
3. [Configuration des services](#configuration-des-services)
4. [Utilisation des Hooks](#utilisation-des-hooks)
5. [Exemples d'utilisation](#exemples-dutilisation)
6. [Bonnes pratiques](#bonnes-pratiques)

## Structure générale

L'architecture API est composée de trois composants principaux :

```
lib/
├── api/
│   └── client.ts       # Gestionnaire de clients API
├── apiEndpoints.ts     # Définition des endpoints
hooks/
├── useUsers.ts         # Hook pour la gestion des utilisateurs
└── useVirtualMachines.ts  # Hook pour la gestion des VMs
```

## Flux complet de l'architecture

### 1. Initialisation avec client.ts

Le gestionnaire de clients API est le point de départ :

```typescript
// 1. Configuration initiale des services
const SERVICE_CONFIG = {
  AUTH_SERVICE: {
    baseURL: '/api/auth',
    timeout: 5000,
  },
  // ...autres services
};

// 2. La classe ApiClientManager crée et gère les instances Axios
class ApiClientManager {
  private clients: Map<ServiceType, AxiosInstance>;
  
  constructor() {
    // Initialise tous les clients au démarrage
    this.initializeClients();
  }
}

// 3. Export d'une fonction helper
export const getServiceClient = (serviceName: ServiceType) => {
  return apiClientManager.getClient(serviceName);
};
```

### 2. Définition des routes avec apiEndpoints.ts

Centralisation de toutes les routes API :

```typescript
// 1. Définition des services disponibles
export const SERVICES = {
  AUTH_SERVICE: 'auth-service',
  USER_SERVICE: 'user-service',
  // ...
};

// 2. Définition des endpoints pour chaque service
export const API_ENDPOINTS = {
  USERS: {
    service: SERVICES.USER_SERVICE,
    endpoints: {
      LIST: '/users',
      CREATE: '/users',
      // ...
    }
  },
  // ...
};
```

### 3. Création des Hooks personnalisés

Exemple avec useUsers.ts :

```typescript
// 1. Création du hook avec état local
export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. Obtention du client pour le service
  const userClient = getServiceClient('USER_SERVICE');
  
  // 3. Définition des fonctions CRUD
  const fetchUsers = async () => {
    try {
      const response = await userClient.get(API_ENDPOINTS.USERS.endpoints.LIST);
      setUsers(response.data);
    } catch (err) {
      // Gestion des erreurs
    }
  };
  
  // ...autres fonctions
};
```

### 4. Utilisation dans les composants

```typescript
function UsersList() {
  // 1. Utilisation du hook
  const { users, isLoading, fetchUsers } = useUsers();
  
  // 2. Chargement des données au montage
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // 3. Rendu avec gestion du chargement
  if (isLoading) return <div>Chargement...</div>;
  
  return (
    <ul>
      {users.map(user => <li>{user.name}</li>)}
    </ul>
  );
}
```

### Flux de fonctionnement complet

1. **Initialisation** :
   - Au démarrage, création des instances Axios pour chaque service
   - Configuration des intercepteurs pour les tokens
   - Préparation des timeouts et URLs de base

2. **Gestion des endpoints** :
   - Centralisation des routes dans apiEndpoints.ts
   - Organisation par service pour une meilleure maintenance

3. **Hooks personnalisés** :
   - Obtention du client API approprié
   - Gestion de l'état local (loading, error, data)
   - Fourniture des méthodes CRUD

4. **Composants React** :
   - Utilisation des hooks pour accéder aux données
   - Gestion des interactions utilisateur

5. **Gestion automatique** :
   ```typescript
   // Géré par client.ts
   client.interceptors.response.use(
     response => response,
     async error => {
       if (error.response?.status === 401) {
         // Refresh token automatique
       }
     }
   );
   ```
   - Refresh automatique des tokens
   - Redirection vers login si nécessaire

### Avantages de cette architecture

1. **Séparation des préoccupations** :
   - Chaque composant a une responsabilité unique
   - Code plus facile à maintenir et à tester

2. **Réutilisabilité** :
   - Hooks utilisables dans toute l'application
   - Logique métier centralisée

3. **Type Safety** :
   - TypeScript assure la cohérence des données
   - Erreurs attrapées à la compilation

4. **Gestion automatique** :
   - Tokens gérés globalement
   - Erreurs traitées de manière cohérente

### Ajout d'un nouveau service

Pour ajouter un nouveau service à l'architecture :

1. Ajouter le service dans `SERVICES` :
   ```typescript
   export const SERVICES = {
     NOUVEAU_SERVICE: 'nouveau-service',
     // ...
   };
   ```

2. Définir ses endpoints :
   ```typescript
   export const API_ENDPOINTS = {
     NOUVEAU_SERVICE: {
       service: SERVICES.NOUVEAU_SERVICE,
       endpoints: {
         ACTION1: '/action1',
         ACTION2: '/action2',
       }
     }
   };
   ```

3. Créer un hook personnalisé :
   ```typescript
   export const useNouveauService = () => {
     const client = getServiceClient('NOUVEAU_SERVICE');
     // Implémenter la logique
   };
   ```

4. Utiliser dans les composants :
   ```typescript
   const { data, actions } = useNouveauService();
   ```

## Configuration des services

### 1. Variables d'environnement (.env.local)

```env
NEXT_PUBLIC_API_GATEWAY_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_SERVICE_URL=/api/auth
NEXT_PUBLIC_USER_SERVICE_URL=/api/users
NEXT_PUBLIC_VM_SERVICE_URL=/api/vms
NEXT_PUBLIC_NOTIFICATION_SERVICE_URL=/api/notifications
```

### 2. Configuration des timeouts

Chaque service peut avoir son propre timeout :

```typescript
const SERVICE_CONFIG = {
  AUTH_SERVICE: {
    baseURL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL,
    timeout: 5000,
  },
  // ...
};
```

## Utilisation des Hooks

### Hook Utilisateurs

```typescript
import { useUsers } from '@/hooks/useUsers';

function UsersList() {
  const { 
    users, 
    isLoading, 
    error, 
    fetchUsers,
    createUser,
    updateUser,
    deleteUser 
  } = useUsers();

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async () => {
    try {
      await createUser({
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      });
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
    }
  };
}
```

### Hook Machines Virtuelles

```typescript
import { useVirtualMachines } from '@/hooks/useVirtualMachines';

function VMList() {
  const {
    virtualMachines,
    isLoading,
    error,
    fetchVirtualMachines,
    createVirtualMachine,
    updateVirtualMachineStatus,
    deleteVirtualMachine
  } = useVirtualMachines();

  const handleStartVM = async (vmId: string) => {
    try {
      await updateVirtualMachineStatus(vmId, 'start');
    } catch (error) {
      console.error('Erreur démarrage VM:', error);
    }
  };
}
```

## Exemples d'utilisation

### 1. Création d'un utilisateur

```typescript
const { createUser } = useUsers();

const newUser = await createUser({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user'
});
```

### 2. Gestion d'une machine virtuelle

```typescript
const { createVirtualMachine, updateVirtualMachineStatus } = useVirtualMachines();

// Création d'une VM
const newVM = await createVirtualMachine({
  name: 'Production Server',
  specs: {
    cpu: 2,
    memory: 4,
    storage: 100
  }
});

// Démarrage de la VM
await updateVirtualMachineStatus(newVM.id, 'start');
```

### 3. Gestion des erreurs

```typescript
const { users, error, isLoading } = useUsers();

if (isLoading) {
  return <div>Chargement...</div>;
}

if (error) {
  return <div>Erreur: {error}</div>;
}

return (
  <ul>
    {users.map(user => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
);
```

## Bonnes pratiques

1. **Gestion des tokens**
   - Les tokens sont automatiquement gérés par le client API
   - Le refresh token est géré automatiquement en cas d'expiration

2. **Gestion des erreurs**
   - Toujours utiliser try/catch avec les appels API
   - Utiliser les états isLoading et error fournis par les hooks

3. **Performance**
   - Les hooks mettent en cache les données localement
   - Utiliser useCallback pour les fonctions de fetch
   - Éviter les appels API inutiles

4. **Sécurité**
   - Ne jamais stocker de données sensibles dans le state
   - Toujours valider les données avant l'envoi
   - Utiliser HTTPS en production

## Dépannage

### Problèmes courants

1. **Erreur 401 (Non autorisé)**
   - Vérifier que le token est présent
   - Essayer de se reconnecter

2. **Erreur 404 (Non trouvé)**
   - Vérifier les URLs des services dans .env.local
   - Vérifier que le service est en cours d'exécution

3. **Timeout**
   - Augmenter la valeur du timeout dans SERVICE_CONFIG
   - Vérifier la connexion réseau

### Debugging

Pour activer les logs de debug :

```typescript
// Dans votre composant
const { enableDebug } = useApiDebug();
enableDebug('USER_SERVICE');
```

## Support

Pour toute question ou problème :
1. Consulter la documentation API
2. Vérifier les logs du service concerné
3. Contacter l'équipe DevOps
