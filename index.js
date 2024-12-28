const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3001;

const userRoutes = require('./routes/api/users');
const thoughtRoutes = require('./routes/api/thoughts');

app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);


app.use(express.json());

mongoose.connect('mongodb://localhost/social_network', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.log('Error connecting to MongoDB:', err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
