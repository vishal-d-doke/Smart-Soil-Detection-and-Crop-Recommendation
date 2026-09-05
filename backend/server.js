import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Smart Soil backend is running',
    app: 'Smart Soil Detection and Crop Recommendation',
    status: 'ok',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/weather', (req, res) => {
  res.json({
    location: 'North Valley',
    temperature: 29.4,
    humidity: 63,
    unit: 'C',
    updatedAt: new Date().toISOString(),
  });
});

app.get('/api/market', (req, res) => {
  res.json([
    { crop: 'Maize', price: 1820, unit: '/qt', change: '+2.4%' },
    { crop: 'Rice', price: 2450, unit: '/qt', change: '+1.1%' },
    { crop: 'Wheat', price: 2130, unit: '/qt', change: '-0.8%' },
    { crop: 'Soybean', price: 2895, unit: '/qt', change: '+3.2%' },
  ]);
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
