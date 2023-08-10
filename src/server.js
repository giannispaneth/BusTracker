const express = require('express');
const http = require('http');

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server, {cors: {origin: "*"}});
app.use(cors());

// Connect to MongoDB using Mongoose
mongoose.connect("mongodb://127.0.0.1:27017/WoW")
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));

// Create Mongoose schema and model for drivers
const driverSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: false },
  vehicle: { type: String, required: false },
  username: { type: String, required: false },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  accuracy: { type: Number, required: true },
});

const Driver = mongoose.model('Driver', driverSchema);

// Create Express app and HTTP server

app.get('/getBusCoordinates', async (req, res) => {
  try {
    // Retrieve bus coordinates from the database using Mongoose
    const busCoordinates = await Driver.find({}, 'vehicle vehicleNumber latitude longitude accuracy').exec();

    // Send the bus coordinates as a response
    res.status(200).json(busCoordinates);
  } catch (error) {
    console.error('Error fetching bus coordinates:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
// Socket.io connection handling
io.on('connection', (socket) => {
  const serverUrl = `${socket.handshake.protocol}://${socket.handshake.headers.host}`;
  console.log(`Connected to server at: ${serverUrl}`);
  console.log('A user connected:', socket.id);

  // Handle driver's position update
  socket.on('submitForm', (data) => {


    const { vehicleNumber, vehicle, username, latitude, longitude, accuracy } = data;
    const driverData = new Driver({
      vehicleNumber:vehicleNumber,
      vehicle:vehicle,
      username:username,
      latitude:latitude,
      longitude:longitude,
      accuracy:accuracy
    });

    driverData.save()
  });  
  socket.on('updatePosition', (data) => {
    const { vehicleNumber, vehicle, username, latitude, longitude, accuracy } = data;

    // Save the driver's position data to the database
    const driverData = new Driver({
      vehicleNumber:vehicleNumber,
      vehicle:vehicle,
      username:username,
      latitude:latitude,
      longitude:longitude,
      accuracy:accuracy
    });

    driverData.save()
  });  
  socket.on('search', async (query) => {
    try {
      // Use Mongoose to search for items that match the query
      const searchResults = await driverData.find({
        $or: [
          { username: { $regex: query, $options: 'i' } },
          { vehicleNumber: { $regex: query, $options: 'i' } },
          { vehicle: { $regex: query, $options: 'i' } }
        ]
      }).exec();

      // Emit the search results back to the client using the 'searchResults' event
      socket.emit('searchResults', searchResults);
    } catch (error) {
      console.error('Error:', error);
    }
  });
  socket.on('logout', () => {
    // Perform logout actions, such as removing the user's session
    
    // Example: Removing the socket connection
    socket.disconnect(true);
  });
  });

  

  

// Set up a middleware to handle preflight requests
app.options('*', cors());

const port = process.env.PORT || 3000;

server.listen(port, () => {
  const protocol = server.address().family === 'IPv6' ? 'http' : 'http';
  const address = server.address().address === '::' ? 'localhost' : server.address().address;
  const url = `${protocol}://${address}:${port}`;
  
  console.log(`Server is running on port ${url}`);
});