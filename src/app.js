const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/users', require('./routes/userRoutes'));
app.use('/expenses', require('./routes/expenseRoutes'));
app.use('/balances', require('./routes/balanceRoutes'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

module.exports = app;