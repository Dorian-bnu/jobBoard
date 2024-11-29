<template>
  <nav class="navbar">
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/advertisements">Advertisements</router-link></li>
      <li><router-link to="/settings">Settings</router-link></li>
      <li><router-link to="/login">Log in</router-link></li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: 'NavBar',
};
</script>

<style scoped>
.navbar {
  background-color: #333;
  padding: 10px;
}

.navbar ul {
  list-style: none;
  display: flex;
  justify-content: space-around;
  margin: 0;
  padding: 0;
}

.navbar li {
  display: inline;
}

.navbar a {
  color: white;
  text-decoration: none;
  padding: 10px;
}

.navbar a:hover {
  background-color: #555;
}

@media (max-width: 357px) {
  .navbar a {
    font-size: 14px;
    padding: 8px;
  }
}

@media (max-width: 320px) {
  .navbar a {
    font-size: 12px;
    padding: 6px;
  }
}
</style>
