// backend/server.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { sequelize } = require('./models'); // Importa Sequelize para conectar con la base de datos
const inventoryRoutes = require('./routes/inventory'); // Importa las rutas de inventario
const app = express();
const port = 3001;
app.use(express.json());


app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
});

const sendLowStockAlert = (itemName) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'clinicanewen@gmail.com',
    subject: 'Alerta de bajo inventario',
    text: `El item ${itemName} tiene un stock bajo por favor re abastecer.`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Email sent: ' + info.response);
  });
};

app.post('/api/low-stock-alert', (req, res) => {
  const { itemName } = req.body;
  sendLowStockAlert(itemName);
  res.status(200).send('Low stock alert sent');
});

// Usar las rutas de inventario
app.use('/api/inventory', inventoryRoutes);

app.listen(port, async () => {
  console.log(`Server running at http://localhost:${port}`);
  await sequelize.authenticate();
  await sequelize.sync({ alter: true }); // Esto sincroniza todos los modelos, asegúrate de usar { alter: true } en producción.
  console.log('Database connected and synced!');
});
