<template>
  <nav>
    <router-link to="/Manager">Manager Page</router-link> |
    <router-link to="/Driver">Driver Login Page</router-link> |
    <router-link to="/LoggedIn">Driver Login Page</router-link> |
  <router-view/>
  </nav>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
