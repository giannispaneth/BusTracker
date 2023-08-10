
<template>
  <form @submit.prevent="submitForm" >
    <label>Username</label>
    <input type="UserName" v-model="UserName" required>

    <label>Password:</label>
    <input type="password" v-model="password" required>
    <div v-if="passwordError" class="error">{{ passwordError }}</div>

    <label>Vehicle Type</label>
    <select v-model="Vehicle">
      
        <option v-for="choose in attributes.options" :key="choose">{{ choose }}</option>
      
    </select>

    <label>Vehicle Number</label>
    <input type="text" v-model="VehicleNumber" @keyup.alt="addSkill">
   

    
    <div class="login">
      <button type="submit">Login</button>
    </div>
  </form>
</template>

<script setup>

import {useStore} from 'vuex'
import {ref} from 'vue'
import { useRouter } from 'vue-router';
import {computed} from 'vue'
import {onMounted} from 'vue'
 
    const router=useRouter();
    const longitude = ref(0);
    const latitude = ref(0);
    const accuracy =ref(0);
    const store=useStore();
    
    const attributes=computed(()=> store.state.attributes);
    const Vehicle =ref('');
    const VehicleNumber=ref('');
    const UserName=ref('');
    const password=ref('');
    const passwordError=ref('');
    
    const submitForm = () => {
     
      const formData = {
        UserName: UserName.value,
        Vehicle: Vehicle.value,
        VehicleNumber: VehicleNumber.value,
        latitude: latitude.value,
        longitude: longitude.value,
        accuracy: accuracy.value
    // Add other form data fields if needed
      };
      console.log(formData)
      updateAttributes();
      store.dispatch('submitForm', formData); // Dispatch the submitForm action with form data
      router.push('/LoggedIn'); // Navigate to the 'LoggedIn' component
    };
    // update state attributes 
    const updateAttributes = () => {
      const newAttributes = {password:password.value, VehicleNumber: VehicleNumber.value, Vehicle: Vehicle.value, UserName: UserName.value };
      store.commit('updateAttributes', newAttributes);
    };
    
    const getGeolocation = async () => {
        try {
          const position = await new Promise((resolve, reject) => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
              });
            } else {
              reject('Geolocation is not supported by this browser.');
            }
          });
          

          // Extract longitude and latitude from the position object
          longitude.value = position.coords.longitude;
          latitude.value = position.coords.latitude;
          accuracy.value = position.coords.accuracy;
          // Emit geolocation data to the server
        } catch (error) {
          console.error('Error getting geolocation:', error);
        }

    };
    onMounted(async () => {
      // Call the logUserName function every 3 seconds
      setInterval(async () => {
        await getGeolocation(); // Wait for geolocation to update attributes
        logUserName(); // Now attributes should be updated
      }, 3000);
      updateAttributes();
    });
    const logUserName = () => {
      console.log(attributes);
      
    };


    
  


</script>

<style>
  form {
    max-width: 420px;
    margin: 30px auto;
    background: white;
    text-align: left;
    padding: 40px;
    border-radius: 10px;
  }
  label {
    color: #aaa;
    display: inline-block;
    margin: 25px 0 15px;
    font-size: 0.6em;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: bold;
  }
  input, select {
    display: block;
    padding: 10px 6px;
    width: 100%;
    box-sizing: border-box;
    border: none;
    border-bottom: 1px solid #ddd;
    color: #555;
  }
  input[type="checkbox"] {
    display: inline-block;
    width: 16px;
    margin: 0 10px 0 0;
    position: relative;
    top: 2px;
  }
  .pill {
    display: inline-block;
    margin: 20px 10px 0 0;
    padding: 6px 12px;
    background: #eee;
    border-radius: 20px;
    font-size: 12px;
    letter-spacing: 1px;
    font-weight: bold;
    color: #777;
    cursor: pointer;
  }
  button {
    background: #0b6dff;
    border: 0;
    padding: 10px 20px;
    margin-top: 20px;
    color: white;
    border-radius: 20px;
  }
  .login {
    text-align: center;
  }
  .error {
    color: #ff0062;
    margin-top: 10px;
    font-size: 0.8em;
    font-weight: bold;
  }
</style>