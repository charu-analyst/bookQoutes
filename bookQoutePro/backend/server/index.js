import express from 'express';
import dotenv from 'dotenv';
import '../server/DB/dbConnection.js'
import userRoute from '../server/routes/userRoute.js';
import bookQoutesRoute from '../server/routes/bookQoutesRoute.js'; 
import cors from 'cors';
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 app.use(cors());
// Routes
app.use('/api/users', userRoute);
app.use('/api/quotes', bookQoutesRoute); 

// Default route
app.get('/', (req, res) => {
  res.send('API is running');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ statusCode: '500', responseMessages: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
