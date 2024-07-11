const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const { sequelize } = require('./models');
const inventoryRoutes = require('./routes/inventory');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

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

app.use('/api/inventory', inventoryRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
    
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.sync({ alter: true });
      console.log('Database synced in development mode.');
    }

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Unable to start the server:', error);
  }
};

startServer();