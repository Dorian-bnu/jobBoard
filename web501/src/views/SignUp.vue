<template>
  <div class="page-container">
    <Navbar />
    <div class="content-wrapper">
      <div class="signup-page">
        <h1>Sign Up Page</h1>
        <div>
          <form @submit.prevent="signUp">
            <div class="signup">
              <div class="signup-input">
                <label for="firstName">First Name:</label>
                <input
                  v-model="firstName"
                  type="text"
                  id="firstName"
                  name="firstName"
                  required
                />
              </div>

              <div class="signup-input">
                <label for="lastName">Last Name:</label>
                <input
                  v-model="lastName"
                  type="text"
                  id="lastName"
                  name="lastName"
                  required
                />
              </div>

              <div class="signup-input">
                <label for="email">Email:</label>
                <input
                  v-model="email"
                  type="email"
                  id="email"
                  name="email"
                  required
                />
              </div>

              <div class="signup-input">
                <label for="password">Password:</label>
                <input
                  v-model="password"
                  type="password"
                  id="password"
                  name="password"
                  required
                />
              </div>

              <div class="signup-input">
                <label for="role">Role:</label>
                <select v-model="role" id="role" name="role" required>
                  <option disabled value="">Chose your value</option>
                  <option>Applicant</option>
                  <option>Manager</option>
                </select>
              </div>

              <div class="signup-input">
                <label for="resume">Upload Resume (PDF):</label>
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  @change="handleFileUpload"
                  accept="application/pdf"
                />
              </div>
              <!-- Manager-specific company input fields -->
              <div v-if="role === 'Manager'" class="manager-fields">
                <h3>Company Information</h3>
                <div class="signup-input">
                  <label for="companyName">Company Name:</label>
                  <input
                    v-model="companyName"
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                  />
                </div>

                <div class="signup-input">
                  <label for="companyField">Field:</label>
                  <input
                    v-model="companyField"
                    type="text"
                    id="companyField"
                    name="companyField"
                    required
                  />
                </div>

                <div class="signup-input">
                  <label for="companySize">Company Size:</label>
                  <input
                    v-model.number="companySize"
                    type="number"
                    id="companySize"
                    name="companySize"
                    required
                  />
                </div>

                <div class="signup-input">
                  <label for="address">Company Address:</label>
                  <input
                    v-model="address"
                    type="text"
                    id="address"
                    name="address"
                    required
                  />
                </div>

                <div class="signup-input">
                  <label for="logoUrl">Logo URL:</label>
                  <input
                    v-model="logoUrl"
                    type="text"
                    id="logoUrl"
                    name="logoUrl"
                    required
                  />
                </div>
              </div>

              <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
              </div>

              <div class="signup-input signup-button">
                <SignupButton :buttontext="'Sign up'" />
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
import SignupButton from '@/components/SignupButton.vue';

export default {
  name: 'SignUpPage',
  components: {
    Navbar,
    Footer,
    SignupButton,
  },
  data() {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      role: '',
      errorMessage: '',
    };
  },
  methods: {
    handleFileUpload(event) {
      this.resume = event.target.files[0]; // Capture the selected file
    },
    async signUp() {
      try {
        // Utiliser la variable d'environnement pour l'URL de l'API
        const apiUrl = `${process.env.VUE_APP_API_BASE_URL}/users/register`;

        // Envoi de la requête d'inscription
        const formData = new FormData();
        formData.append('firstName', this.firstName);
        formData.append('lastName', this.lastName);
        formData.append('email', this.email);
        formData.append('password', this.password);
        formData.append('role', this.role);
        if (this.resume) {
          formData.append('resume', this.resume);
        }

        // Ajouter les informations de l'entreprise si le rôle est "Manager"
        if (this.role === 'Manager') {
          formData.append('companyName', this.companyName);
          formData.append('companyField', this.companyField);
          formData.append('companySize', this.companySize);
          formData.append('address', this.address);
          formData.append('logoUrl', this.logoUrl);
        }

        await axios.post(apiUrl, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Rediriger vers la page de login après une inscription réussie
        this.$router.push({ name: 'LoginPage' });
      } catch (error) {
        // Gérer les erreurs d'inscription
        this.errorMessage = error.response?.data?.message || 'Sign up failed';
      }
    },
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-wrapper {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

h1 {
  margin-bottom: 10px;
  color: #007bff;
}

.signup-page {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.signup,
.signup-input {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

input,
select {
  border-radius: 15px;
  padding: 5px;
  width: 100%;
  box-sizing: border-box;
}

.signup-button {
  margin-top: 10px;
}

.error-message {
  color: red;
  margin-top: 10px;
}

@media (max-width: 360px) {
  .signup-page {
    padding: 10px;
  }

  h1 {
    font-size: 1.5em;
  }
}
</style>
