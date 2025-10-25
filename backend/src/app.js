const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const documentRoutes = require('./routes/documentRoutes');
const shareRoutes = require('./routes/shareRoutes');
const verifyRoutes = require('./routes/verifyRoutes');
const logRoutes = require('./routes/logRoutes');
const organizationRoutes = require('./routes/organizationRoutes');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/verify', verifyRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/organization', organizationRoutes);

// basic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || 'Server Error' });
});

module.exports = app;
