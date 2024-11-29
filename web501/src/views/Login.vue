<template>
  <div class="page-container">
    <Navbar />
    <div class="content-wrapper">
      <div class="login-page">
        <h1>Login Page</h1>
        <div>
          <form @submit.prevent="login">
            <div class="login">
              <div class="login-input">
                <label for="email">Mail:</label>
                <input
                  v-model="email"
                  type="text"
                  id="email"
                  name="email"
                  required
                />
              </div>

              <div class="login-input">
                <label for="password">Password :</label>
                <input
                  v-model="password"
                  type="password"
                  id="password"
                  name="password"
                  required
                />
              </div>

              <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
              </div>

              <div class="login-input login-button">
                <button type="submit">Connexion</button>
                <button @click.prevent="goToSignUp">Sign Up</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'LoginPage',
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async login() {
      // Validation des champs
      if (!this.email || !this.password) {
        this.errorMessage = 'Email and password are required';
        return;
      }

      try {
        // Utiliser la variable d'environnement pour l'URL de l'API
        const apiUrl = `${process.env.VUE_APP_API_BASE_URL}/users/login`;

        // Envoi de la requête de connexion
        const response = await axios.post(apiUrl, {
          email: this.email,
          password: this.password,
        });

        // Enregistrer le token dans le localStorage
        localStorage.setItem('token', response.data.token);

        // Rediriger vers la page d'accueil après connexion réussie
        this.$router.push({ name: 'home' });
      } catch (error) {
        // Gérer les erreurs de connexion
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage =
            'An error occurred while trying to log in. Please try again.';
        }

        // Nettoyer les champs de mot de passe après un échec
        this.password = '';
      }
    },
    goToSignUp() {
      // Rediriger vers la page d'inscription
      this.$router.push({ name: 'SignUpPage' });
    },
  },
};
</script>

<style scoped>
/* Page container to ensure footer sticks to bottom */
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Content wrapper to push footer down */
.content-wrapper {
  flex-grow: 1;
  display: flex;
  /*Erase the justify-content in case you want the content back to the top*/
  justify-content: center;
  align-items: center;
}

h1 {
  margin-bottom: 10px;
  color: #007bff;
}

.login-page {
  max-width: 300px;
  padding: 20px;
  width: 100%;
}

.login,
.login-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
  align-items: center;
}

input {
  border-radius: 15px;
  padding: 5px;
}

.login-button {
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  gap: 5px;
}

button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.error-message {
  color: red;
  margin-top: 10px;
}

@media (min-width: 1024px) {
  h1 {
    font-size: 2.5rem;
  }

  .login-page {
    max-width: 500px;
    padding: 60px;
  }
}

@media (min-width: 1440px) {
  h1 {
    font-size: 3rem;
  }

  .login-page {
    max-width: 600px;
    padding: 80px;
  }

  input {
    font-size: 1.2rem;
  }
}
</style>
