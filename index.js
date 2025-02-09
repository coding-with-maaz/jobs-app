// server.js

// 1. Import dependencies
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const session = require('express-session');
const connectDB = require('./config/db'); // Adjust path as needed
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const jobRoutes = require('./routes/jobRoutes'); // Import job routes
const notificationRoutes = require('./routes/notificationRoutes');
// const analyticsRoutes = require('./routes/analyticsRoutes');

// 2. Load environment variables
dotenv.config();

// 3. Connect to MongoDB
connectDB();

// 4. Create the Express app
const app = express();

// 5. Global middlewares
app.use(express.json());



// 5a. Configure & use sessions (before routes)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'someSecretKey',
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true } // Enable only if using HTTPS
  })
);



// 6. Define server port
const PORT = process.env.PORT || 4000;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:8081'], // Adjust if your frontend is served from a different origin
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));  

// 7. Mount your routes
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/notifications', notificationRoutes);
// app.use('/api/analytics', analyticsRoutes);


// Simple test route (optional)
app.get('/', (req, res) => {
  res.send('Hello from the Express server!');
});

// 8. Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
