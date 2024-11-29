<template>
  <div class="page-container">
    <Navbar />
    <div class="content-wrapper">
      <div class="ads-container">
        <Card
          v-for="ad in ads"
          :key="ad.id"
          :id="String(ad.id)"
          :title="ad.title"
          :description="ad.description"
          :imageSrc="ad.logo_url"
          :wages="ad.salary"
          :place="ad.location"
          :workingTime="ad.working_time"
        />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Navbar from '@/components/Navbar.vue';
import Card from '@/components/Card.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'AdvertisementsPage',
  components: {
    Navbar,
    Card,
    Footer,
  },

  data() {
    return {
      ads: [],
    };
  },

  mounted() {
    this.fetchAds();
  },

  methods: {
    async fetchAds() {
      try {
        // Utiliser la variable d'environnement pour définir l'URL de l'API
        const apiUrl = `${process.env.VUE_APP_API_BASE_URL}/ads/getads`;

        const response = await fetch(apiUrl);
        const data = await response.json();

        // Vérifiez si la réponse est bien un tableau
        if (Array.isArray(data)) {
          this.ads = data; // Assigner les données à ads
        } else {
          console.error('API response is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
      }
    },
  },
};
</script>

<style>
.page-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Make sure the whole page takes full height */
}

.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 20px;
}

.ads-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  gap: 20px;
  margin-top: 20px;
}

.ads-container > * {
  background-color: white;
  padding: 20px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 10px;
}

footer {
  margin-top: auto; /* Push the footer to the bottom of the page */
}

@media (max-width: 1024px) {
  .ads-container {
    grid-template-columns: repeat(2, 1fr); /* 2 columns */
  }
}

@media (max-width: 768px) {
  .ads-container {
    grid-template-columns: 1fr; /* 1 column */
    gap: 10px;
  }

  .ads-container > * {
    padding: 15px;
  }
}
</style>
