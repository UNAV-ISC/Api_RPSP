const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: '198.12.242.203',  // Cambia por el host de tu base de datos
  user: 'rpspadmin',       // Tu usuario de MySQL
  password: 'rpspAdmin24',       // Tu contraseña de MySQL
  database: 'reavivados',
});

// Verifica la conexión a la base de datos
db.connect(err => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Si funciona');
});

// Iniciar el servidor
app.listen(port, '0.0.0.0', () => {
  console.log(`Servidor corriendo en http://198.12.242.203:${port}`);
});

const cors = require('cors');
app.use(cors());



// Obtener todos los items
app.get('/users', (req, res) => {
  db.connect((err) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(results);
    });
  });
});

// Obtener un item por ID
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }
      res.json(result[0]);
    });
  });

// Crear un nuevo item
app.post('/users/new', (req, res) => {
    const { user, phoneNumber } = req.body;
    db.query('INSERT INTO users (user, phoneNumber) VALUES (?, ?)', [user, phoneNumber], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ message: 'Item creado', id: result.insertId });
    });
  });

// Actualizar un item por ID
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { user, phoneNumber } = req.body;
    db.query('UPDATE users SET user = ?, phoneNumber = ? WHERE id = ?', [user, phoneNumber, id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }
      res.json({ message: 'Item actualizado' });
    });
  });
  
// Eliminar un item por ID
app.delete('/items/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Item no encontrado' });
      }
      res.json({ message: 'Item eliminado' });
    });
  });
  