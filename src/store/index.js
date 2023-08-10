import { createStore } from 'vuex';
import io from 'socket.io-client';

const store = createStore({
  state: {
    attributes: {
      UserName: '',
      password: '',
      Vehicle: '',
      terms: false,
      skills: [],
      VehicleNumber: '',
      passwordError: null,
      options: ['Mazda Rx', 'Mazda sx', 'mazdaqri'],
      loggedIn: false,
      socket: null, // Initialize socket as null
      latitude: 0,
      longitude: 0,
      accuracy: 0
    }
  },
  mutations: {
    setPasswordError(state, error) {
      state.attributes.passwordError = error;
      console.log(error)
    },
    updateAttributes(state, newAttributes) {
      state.attributes.password = newAttributes.password;
      state.attributes.Vehicle = newAttributes.Vehicle;
      state.attributes.VehicleNumber = newAttributes.VehicleNumber;
      state.attributes.UserName = newAttributes.UserName;
      console.log(state.attributes)
    },
    // ... other mutations
  },
  actions: {
    async initializeSocket({ state }) {
      // Create a socket instance and store it in state
      state.attributes.socket = io('http://localhost:3000');
      state.attributes.socket.on('connect', () => {
        console.log('Socket connected');
        // Set up interval for sending position data
        
      });
    },
    async submitForm({ commit,state },formData) {
      // Password length validation
      
      if (state.attributes.password.length <= 5) {
        commit('setPasswordError', 'Password must be longer than 5 characters');
        return;
      }

      // Prepare form data
      
      await this.dispatch('initializeSocket')
        
      try {
        // Emit the form data using Socket.IO
        state.attributes.socket.emit('submitForm', formData);
        console.log('Form submitted using Socket.IO');

        // Clear password error
        commit('setPasswordError', '');
      } catch (error) {
        console.error('Error:', error);
      }
    },
    async sendPosition({ state }) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            state.attributes.socket.emit('updatePosition', {
              VehicleNumber: state.attributes.VehicleNumber,
              Vehicle: state.attributes.Vehicle,
              UserName: state.attributes.UserName,
              latitude: latitude,
              longitude: longitude,
              accuracy: accuracy
            });
            
            state.attributes.latitude = position.latitude;
            state.attributes.longitude = position.longitude;
            state.attributes.accuracy = position.accuracy;
          },
          (error) => {
            console.error('Error getting geolocation:', error);
            state.attributes.socket.emit('updatePosition', {
              VehicleNumber: state.attributes.VehicleNumber,
              Vehicle: state.attributes.Vehicle,
              UserName: state.attributes.UserName,
              latitude: 0,
              longitude: 0,
              accuracy: 0
            });
          },
          {
            enableHighAccuracy: true
          }
        );
        
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    }
    // ... other actions
  }
});

export default store;
