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

// Enregistrer les modifications dans la base de données
const saveDb = (db) => {
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
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

// Routes pour la connexion 
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
  if (user.password !== password) {
    return res.status(401).json({ message: 'mot de passe incorrect' });
  }
  
  //token pour la session
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
  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  });
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

// --- ROUTES POUR LES MACHINES VIRTUELLES ---

// Récupérer toutes les VMs (avec filtres)
app.get('/api/vms', authenticateToken, async (req, res) => {
  await delay(500);
  const db = getDb();
  let vms = db.vms || [];

  // Filtrer les VMs selon le rôle de l'utilisateur
  if (req.user.role !== 'admin') {
    vms = vms.filter(vm => vm.user.id === req.user.id);
  }

  // Appliquer les filtres
  const { status, user, search } = req.query;
  
  if (status) {
    vms = vms.filter(vm => vm.status === status);
  }
  
  if (user && req.user.role === 'admin') {
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

// Récupérer une VM spécifique
app.get('/api/vms/:id', authenticateToken, async (req, res) => {
  await delay(500);
  const db = getDb();
  const vm = (db.vms || []).find(v => v.id === req.params.id);
  
  if (!vm) {
    return res.status(404).json({ error: "VM not found" });
  }
  
  // Vérifier si l'utilisateur a accès à cette VM
  if (req.user.role !== 'admin' && vm.user.id !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  res.json(vm);
});

// Créer une nouvelle VM
app.post('/api/vms', authenticateToken, async (req, res) => {
  await delay(1000);
  const db = getDb();
  
  const { name, vcpu_count, memory_size_mib, disk_size_gb, system_image_id } = req.body;
  
  if (!name || !vcpu_count || !memory_size_mib || !disk_size_gb || !system_image_id) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  // Trouver l'image système
  const systemImage = db['system-images'].find(img => img.id === system_image_id);
  if (!systemImage) {
    return res.status(404).json({ message: 'System image not found' });
  }
  
  // Trouver l'utilisateur
  const user = db.users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  
  // Générer un ID unique
  const id = Date.now().toString();
  
  // Créer la nouvelle VM
  const newVM = {
    id,
    name,
    status: 'stopped',
    vcpu_count: parseInt(vcpu_count),
    memory_size_mib: parseInt(memory_size_mib),
    disk_size_gb: parseInt(disk_size_gb),
    created_at: new Date().toISOString(),
    ip_address: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
    mac_address: `00:11:22:33:44:${Math.floor(Math.random() * 100)}`,
    tap_device_name: `tap${db.vms.length}`,
    tap_ip: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    },
    systemImage: {
      id: systemImage.id,
      name: systemImage.name
    },
    vmOffer: {
      id: "1",
      name: vcpu_count > 2 ? "Premium" : "Standard"
    },
    metrics: {
      cpu_usage: 0,
      memory_usage: 0,
      disk_usage: 0,
      network_rx_bytes: 0,
      network_tx_bytes: 0,
      disk_read_bytes: 0,
      disk_write_bytes: 0
    }
  };
  
  // Ajouter la VM à la base de données
  db.vms.push(newVM);
  
  // Créer des logs pour la VM
  const vmLog = {
    vm_id: id,
    logs: [
      {
        timestamp: new Date().toISOString(),
        level: "info",
        message: "VM created successfully"
      }
    ]
  };
  
  db['vm-logs'].push(vmLog);
  
  // Sauvegarder les modifications
  saveDb(db);
  
  res.status(201).json(newVM);
});

// Mettre à jour une VM
app.put('/api/vms/:id', authenticateToken, async (req, res) => {
  await delay(800);
  const db = getDb();
  
  // Trouver la VM
  const vmIndex = db.vms.findIndex(v => v.id === req.params.id);
  
  if (vmIndex === -1) {
    return res.status(404).json({ message: 'VM not found' });
  }
  
  const vm = db.vms[vmIndex];
  
  // Vérifier si l'utilisateur a accès à cette VM
  if (req.user.role !== 'admin' && vm.user.id !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  // Mettre à jour les propriétés autorisées
  const { name } = req.body;
  
  if (name) {
    vm.name = name;
  }
  
  // Mettre à jour la VM
  db.vms[vmIndex] = vm;
  
  // Sauvegarder les modifications
  saveDb(db);
  
  res.json(vm);
});

// Supprimer une VM
app.delete('/api/vms/:id', authenticateToken, async (req, res) => {
  await delay(800);
  const db = getDb();
  
  // Trouver la VM
  const vmIndex = db.vms.findIndex(v => v.id === req.params.id);
  
  if (vmIndex === -1) {
    return res.status(404).json({ message: 'VM not found' });
  }
  
  const vm = db.vms[vmIndex];
  
  // Vérifier si l'utilisateur a accès à cette VM
  if (req.user.role !== 'admin' && vm.user.id !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  // Supprimer la VM
  db.vms.splice(vmIndex, 1);
  
  // Supprimer les logs associés
  const logIndex = db['vm-logs'].findIndex(l => l.vm_id === req.params.id);
  if (logIndex !== -1) {
    db['vm-logs'].splice(logIndex, 1);
  }
  
  // Sauvegarder les modifications
  saveDb(db);
  
  res.json({ message: 'VM deleted successfully' });
});

// Routes pour les actions sur les VMs
app.post('/api/vms/:id/start', authenticateToken, async (req, res) => {
  await delay(1500);
  const db = getDb();
  
  // Trouver la VM
  const vmIndex = db.vms.findIndex(v => v.id === req.params.id);
  
  if (vmIndex === -1) {
    return res.status(404).json({ message: 'VM not found' });
  }
  
  const vm = db.vms[vmIndex];
  
  // Vérifier si l'utilisateur a accès à cette VM
  if (req.user.role !== 'admin' && vm.user.id !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  // Vérifier l'état actuel
  if (vm.status === 'running') {
    return res.status(400).json({ message: 'VM is already running' });
  }
  
  // Mettre à jour l'état
  vm.status = 'running';
  
  // Générer des métriques fictives
  vm.metrics = {
    cpu_usage: Math.floor(Math.random() * 50) + 10,
    memory_usage: Math.floor(Math.random() * 60) + 20,
    disk_usage: Math.floor(Math.random() * 40) + 10,
    network_rx_bytes: Math.floor(Math.random() * 1000000),
    network_tx_bytes: Math.floor(Math.random() * 500000),
    disk_read_bytes: Math.floor(Math.random() * 2000000),
    disk_write_bytes: Math.floor(Math.random() * 1000000)
  };
  
  // Mettre à jour la VM
  db.vms[vmIndex] = vm;
  
  // Ajouter un log
  const logIndex = db['vm-logs'].findIndex(l => l.vm_id === req.params.id);
  if (logIndex !== -1) {
    db['vm-logs'][logIndex].logs.push({
      timestamp: new Date().toISOString(),
      level: "info",
      message: "VM started successfully"
    });
  }
  
  // Sauvegarder les modifications
  saveDb(db);
  
  res.json({ message: 'VM started successfully', vm });
});

app.post('/api/vms/:id/stop', authenticateToken, async (req, res) => {
  await delay(1000);
  const db = getDb();
  
  // Trouver la VM
  const vmIndex = db.vms.findIndex(v => v.id === req.params.id);
  
  if (vmIndex === -1) {
    return res.status(404).json({ message: 'VM not found' });
  }
  
  const vm = db.vms[vmIndex];
  
  // Vérifier si l'utilisateur a accès à cette VM
  if (req.user.role !== 'admin' && vm.user.id !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  // Vérifier l'état actuel
  if (vm.status === 'stopped') {
    return res.status(400).json({ message: 'VM is already stopped' });
  }
  
  // Mettre à jour l'état
  vm.status = 'stopped';
  
  // Réinitialiser les métriques
  vm.metrics = {
    cpu_usage: 0,
    memory_usage: 0,
    disk_usage: vm.metrics.disk_usage,
    network_rx_bytes: 0,
    network_tx_bytes: 0,
    disk_read_bytes: 0,
    disk_write_bytes: 0
  };
  
  // Mettre à jour la VM
  db.vms[vmIndex] = vm;
  
  // Ajouter un log
  const logIndex = db['vm-logs'].findIndex(l => l.vm_id === req.params.id);
  if (logIndex !== -1) {
    db['vm-logs'][logIndex].logs.push({
      timestamp: new Date().toISOString(),
      level: "info",
      message: "VM stopped successfully"
    });
  }
  
  // Sauvegarder les modifications
  saveDb(db);
  
  res.json({ message: 'VM stopped successfully', vm });
});

app.post('/api/vms/:id/pause', authenticateToken, async (req, res) => {
  await delay(800);
  const db = getDb();
  
  // Trouver la VM
  const vmIndex = db.vms.findIndex(v => v.id === req.params.id);
  
  if (vmIndex === -1) {
    return res.status(404).json({ message: 'VM not found' });
  }
  
  const vm = db.vms[vmIndex];
  
  // Vérifier si l'utilisateur a accès à cette VM
  if (req.user.role !== 'admin' && vm.user.id !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
  }
  
  // Vérifier l'état actuel
  if (vm.status !== 'running') {
    return res.status(400).json({ message: 'VM must be running to pause' });
  }
  
  // Mettre à jour l'état
  vm.status = 'paused';
  
  // Mettre à jour la VM
  db.vms[vmIndex] = vm;
  
  // Ajouter un log
  const logIndex = db['vm-logs'].findIndex(l => l.vm_id === req.params.id);
  if (logIndex !== -1) {
    db['vm-logs'][logIndex].logs.push({
      timestamp: new Date().toISOString(),
      level: "info",
      message: "VM paused successfully"
    });
  }
  
  // Sauvegarder les modifications
  saveDb(db);
  
  res.json({ message: 'VM paused successfully', vm });
});

// Récupérer les logs d'une VM
app.get('/api/vms/:id/logs', authenticateToken, async (req, res) => {
  await delay(500);
  const db = getDb();
  
  // Trouver la VM
  const vm = db.vms.find(v => v.id === req.params.id);
  
  if (!vm) {
    return res.status(404).json({ message: 'VM not found' });
  }
  
  // Vérifier si l'utilisateur a accès à cette VM
  if (req.user.role !== 'admin' && vm.user.id !== req.user.id) {
    return res.status(403).json({ message: 'Access denied' });
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
    const user = db.users.find(u => u.id === req.user.id);
    return res.json([{
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }]);
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
  console.log('\x1b[33m%s\x1b[0m', '  POST   /api/vms');
  console.log('\x1b[33m%s\x1b[0m', '  PUT    /api/vms/:id');
  console.log('\x1b[33m%s\x1b[0m', '  DELETE /api/vms/:id');
  console.log('\x1b[33m%s\x1b[0m', '  POST   /api/vms/:id/start');
  console.log('\x1b[33m%s\x1b[0m', '  POST   /api/vms/:id/stop');
  console.log('\x1b[33m%s\x1b[0m', '  POST   /api/vms/:id/pause');
  console.log('\x1b[33m%s\x1b[0m', '  GET    /api/vms/:id/logs');
  console.log('\x1b[33m%s\x1b[0m', '  GET    /api/users');
  console.log('\x1b[33m%s\x1b[0m', '  GET    /api/system-images');
});