<template>
  <div>
    <h1>Bus Company Manager Page</h1>
    <input v-model="searchQuery" placeholder="Search for driver or bus...">
    <button @click="search">Search</button>
    
    <div v-if="searchResults.length">
      <h2>Search Results:</h2>
      <div v-for="(result, index) in searchResults" :key="index">
        <p >Driver: {{ result.username }}</p>
        <p >Bus:{{ result.vehicle }} Vehicle Number: {{ result.vehicleNumber }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref,onMounted } from 'vue';
import io from 'socket.io-client';
import axios from 'axios';
const searchQuery = ref('');
const searchResults = ref([]);

const socket = io('http://localhost:3000'); 

const search = async () => {
  try {
    const response = await axios.get(`http://localhost:3000/search?query=${encodeURIComponent(searchQuery.value)}`);
    searchResults.value = response.data;
  } catch (error) {
    console.error('Error:', error);
  }
};

socket.on('searchResults', (results) => {
  searchResults.value = results;})
  onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/getBusCoordinates');
    // Process the bus coordinates data and update the component's state as needed
  } catch (error) {
    console.error('Error fetching bus coordinates:', error);
  }
});


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