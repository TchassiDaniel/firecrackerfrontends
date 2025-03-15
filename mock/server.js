const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3002;
const JWT_SECRET = 'your-secret-key';

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Charger la base de données mock
const dbPath = path.join(__dirname, 'db.json');
const getDb = () => {
  const rawData = fs.readFileSync(dbPath);
  return JSON.parse(rawData);
};

// Middleware d'authentification
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Ajouter un délai artificiel
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));


// Routes pout la connexion 
app.post('/api/auth/login', async (req, res) => {
  await delay(500);
  const { email, password } = req.body;
  const db = getDb();
  
  //on verifie si l'utilisateur est dans la bd
  const user = db.users.find(u => u.email === email); //je chercher l'email dans la bd
  
    if (!user) {
      return res.status(405).json({ message: 'utilisateur non trouve ' });
    }

  //on verifie que le mot de passe est correcte
  if ( user.password !== password) {
    console.log(password);
    console.log(user.password);
    return res.status(401).json({ message: 'mot de passe incorrect' });
  }
  
  //toker pour la session

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  //cookie pour le token pour la session
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  });
  
  // Préparer la réponse
  const response = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
  
 

  // Envoyer la réponse
  res.json(response);
 
});

//routes pour la deconnnexion
app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

//routes pour get un utilisateurs
app.get('/api/auth/user', authenticateToken, async (req, res) => {
  await delay(500);
  const db = getDb();
  const user = db.users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'utilisateur non trouve' });
  }
  
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});


// Routes pour l'administrateur
app.get('/api/vms', authenticateToken, async (req, res) => {
  await delay(500);
  const db = getDb(); //je recupere les vms dans la bd
  let vms = db.vms || [];

  // Vérifier si l'utilisateur est admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'il faut etre admin ' });
  }

  // Appliquer les filtres
  const { status, user, search } = req.query;
  
  if (status) {
    vms = vms.filter(vm => vm.status === status);
  }
  
  if (user) {
    vms = vms.filter(vm => vm.user.id === user);
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    vms = vms.filter(vm => 
      vm.name.toLowerCase().includes(searchLower) ||
      vm.user.name.toLowerCase().includes(searchLower)
    );
  }

  res.json(vms);
});

//recupere une vm specifique
app.get('/api/vms/:id', authenticateToken, async (req, res) => {
  await delay(500);
  const db = getDb();
  

  // Vérifier si l'utilisateur est admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const vm = (db.vms || []).find(v => v.id === req.params.id);
  
  if (!vm) {
    return res.status(404).json({ error: "VM not found" });
  }
  
  res.json(vm);
});

//recuperer les logs d'une vm

app.get('/api/vms/:id/logs', authenticateToken, async (req, res) => {
  await delay(500);
  const db = getDb();
  
  // Vérifier si l'utilisateur est admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  const logs = (db['vm-logs'] || []).find(l => l.vm_id === req.params.id);
  
  if (!logs) {
    return res.json({ logs: [] });
  }
  
  res.json(logs.logs);
});

// Route pour les utilisateurs
app.get('/api/users', authenticateToken, async (req, res) => {
  await delay(500);
  const db = getDb();
  
  // Si l'utilisateur n'est pas admin, ne renvoyer que ses propres informations
  if (req.user.role !== 'admin') {
    const users = db.users.filter(u => u.id === req.user.id);
    return res.json(users);
  }
  
  res.json(db.users.map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role
  })));
});

// Route pour les images système
app.get('/api/system-images', authenticateToken, async (req, res) => {
  await delay(500);
  const db = getDb();
  res.json(db['system-images'] || []);
});


// Démarrer le serveur
app.listen(port, () => {
  console.log('\x1b[32m%s\x1b[0m', '🚀 Mock API Server is running!');
  console.log('\x1b[36m%s\x1b[0m', `➜ Local: http://localhost:${port}`);
  console.log('\nAvailable routes:');
  console.log('\x1b[33m%s\x1b[0m', '  POST   /api/auth/login');
  console.log('\x1b[33m%s\x1b[0m', '  POST   /api/auth/logout');
  console.log('\x1b[33m%s\x1b[0m', '  GET    /api/auth/user');
  console.log('\x1b[33m%s\x1b[0m', '  GET    /api/vms');
  console.log('\x1b[33m%s\x1b[0m', '  GET    /api/vms/:id');
  console.log('\x1b[33m%s\x1b[0m', '  GET    /api/vms/:id/logs');
  console.log('\x1b[33m%s\x1b[0m', '  GET    /api/users');
  console.log('\x1b[33m%s\x1b[0m', '  GET    /api/system-images');
});
