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

// Routes d'authentification
app.post('/api/auth/login', async (req, res) => {
  await delay(500);
  const { email, password } = req.body;
  const db = getDb();
  
  const user = db.users.find(u => u.email === email);
  
  // Pour le développement, accepter "password" directement
  if (!user || password !== "password") {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 heures
  });
  
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/auth/user', authenticateToken, async (req, res) => {
  await delay(500);
  const db = getDb();
  const user = db.users.find(u => u.id === req.user.id);
  
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
});

// Routes pour l'admin
app.get('/api/vms', authenticateToken, async (req, res) => {
  await delay(500);
  const db = getDb();
  let vms = db.vms || [];

  // Vérifier si l'utilisateur est admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
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
