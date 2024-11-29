<template>
  <div class="advertisement-detail">
    <Navbar />
    <div class="detail-container">
      <h1>{{ ad.title }}</h1>
      <!-- Affichage de l'image de l'annonce -->
      <img
        :src="ad.logo_url"
        alt="Company Logo"
        class="company-logo"
        v-if="ad.logo_url"
      />
      <p><strong>Description:</strong> {{ ad.description }}</p>
      <p><strong>Salary:</strong> {{ ad.salary }}</p>
      <p><strong>Location:</strong> {{ ad.location }}</p>
    </div>

    <!-- Formulaire de candidature -->
    <div class="application-form">
      <h2>Apply to this job offer</h2>
      <form @submit.prevent="submitApplication">
        <div>
          <label for="message">Your personnal message</label>
          <textarea
            v-model="form.message"
            maxlength="256"
            placeholder="Please write your message here (256 characters max)"
          ></textarea>
        </div>
        <div>
          <label for="cv">Upload your resume: </label>
          <input type="file" @change="onFileChange" />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
    <div class="footer-fix"></div>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'AdvertisementDetail',
  components: {
    Navbar,
    Footer,
  },
  data() {
    return {
      ad: {}, // Détails de l'annonce
      form: {
        message: '',
        cv: null,
      },
    };
  },
  async created() {
    const id = this.$route.params.id; // Récupérer l'ID de l'annonce depuis l'URL
    try {
      const response = await fetch(
        `${process.env.VUE_APP_API_BASE_URL}/ads/getads/${id}`
      );
      if (response.ok) {
        this.ad = await response.json();
      } else {
        console.error(
          "Erreur lors de la récupération des détails de l'annonce."
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des détails de l'annonce:",
        error
      );
    }
  },
  methods: {
    onFileChange(event) {
      this.form.cv = event.target.files[0];
    },
    async submitApplication() {
      // Créer les données de la requête
      const formData = new FormData();
      formData.append('message', this.form.message);
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      formData.append('cv', this.form.cv);
      formData.forEach((value, key) => {
        console.log(key, value);
      });
      formData.append('advertisement_id', this.ad.id);
      formData.forEach((value, key) => {
        console.log(key, value);
      });

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/users/job`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        if (response.ok) {
          alert('Candidature envoyée avec succès!');
        } else {
          alert("Erreur lors de l'envoi de la candidature.");
        }
      } catch (error) {
        console.error("Erreur lors de l'envoi de la candidature:", error);
      }
    },
  },
};
</script>

<style scoped>
.advertisement-detail {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.footer-fix {
  flex-grow: 1;
}

.detail-container {
  margin: 20px auto;
  text-align: center;
  padding: 20px;
  max-width: 800px;
}

.detail-container h1 {
  color: rgb(27, 40, 139);
  margin-bottom: 10px;
}

.company-logo {
  max-width: 300px;
  margin: 20px 0;
}

.detail-container p {
  margin-bottom: 10px;
}

.application-form {
  margin: 40px auto;
  padding: 20px;
  max-width: 800px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
}

.application-form h2 {
  margin-bottom: 20px;
}

.application-form textarea {
  width: 100%;
  min-height: 120px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  box-sizing: border-box; /* Make sure padding doesn't affect size */
}

.application-form input[type='file'] {
  margin-top: 10px;
}

.application-form button {
  margin-top: 20px;
  padding: 10px 20px;
  cursor: pointer;
}

/*Responsivness*/
@media (min-width: 1024px) {
  .application-form {
    max-width: 1200px;
    padding: 50px;
    font-size: 1.2rem;
  }

  .application-form textarea {
    min-height: 200px;
    font-size: 1.1rem;
  }

  .application-form input[type='file'] {
    font-size: 1.1rem;
  }

  .application-form button {
    padding: 20px;
    font-size: 1.2rem;
  }
}
</style>
