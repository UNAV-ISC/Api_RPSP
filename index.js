const express = require('express');
const mysql = require('mysql2');
const app = express();
const multer = require('multer')
const port = 3000;

const upload  = multer();


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
const req = require('express/lib/request');
const res = require('express/lib/response');
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
//SELECT * FROM users WHERE user=? && phone=?',[user], [phone]
//Comparacion de Login
app.post('/login',upload.none(), (req, res) => {
  // if(req.body && req.body.user && req.body.phoneNumber){
    // var { user, phoneNumber } = req.body;
    console.log(req.body)
    let user= 'Gamaliel';
    let phoneNumber='+529531437195';
    console.log(user);
    console.log(phoneNumber);

    db.connect((err) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      db.query('SELECT * FROM users WHERE user=? AND phoneNumber=?', [user, phoneNumber], (err, results) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (results.length > 0) {
          
          //res.json(results);
          res.send(true);
        } else {
          //console.log(`Usuario no encontrado: ${user} ${phone}`);
          
          res.status(404).json({ message: 'Usuario no encontrado' });
        }
      });
    });
  // }else{
    
  //     console.log(`Usuario no encontrado: ${user} ${phoneNumber}`);
  //     return res.status(400).json({ error: 'User or phone not provided' });

  // }
  
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

  