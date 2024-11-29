<template>
  <div class="card">
    <!-- Partie cliquable pour redirection -->
    <div class="card-content" @click="goToDetail">
      <img :src="imageSrc" alt="Advertisement image" class="card-image" />
      <div class="card-text">
        <h3>{{ title }}</h3>
        <p>{{ description }}</p>
      </div>
    </div>

    <!-- Btn "Learn More" pour afficher les détails supplémentaires -->
    <div class="card-footer">
      <button class="card-btn" @click="toggleDetails">
        {{ showDetails ? 'Show Less' : 'Learn More' }}
      </button>
    </div>

    <!-- Informations supplémentaires visibles quand showDetails est vrai -->
    <div v-if="showDetails" class="additional-info">
      <p><strong>Wages:</strong> {{ wages }}</p>
      <p><strong>Place:</strong> {{ place }}</p>
      <p v-if="workingTime">
        <strong>Working Time:</strong> {{ workingTime }} hours/week
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CardDisplay',
  props: {
    id: { type: String, required: true }, //
    title: String,
    description: String,
    imageSrc: String,
    wages: String,
    place: String,
    workingTime: Number,
  },
  data() {
    return {
      showDetails: false, // Gère l'affichage des détails supplémentaires
    };
  },
  methods: {
    goToDetail() {
      this.$router.push({
        name: 'advertisementDetail',
        params: { id: this.id },
      });
    },
    toggleDetails() {
      this.showDetails = !this.showDetails;
    },
  },
};
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 14px;
  margin-left: 10px;
  margin-right: 10px;
  text-align: center;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
}

.card-content {
  cursor: pointer;
}

.card-image {
  width: 80%;
  height: auto;
  border-radius: 4px;
  margin: 0 auto;
  max-width: 300px;
}

h3 {
  margin: 12px 0;
  font-size: 1.2rem;
}

p {
  font-size: 1rem;
  color: #555;
}

.card-footer {
  display: flex;
  justify-content: center;
  padding-top: 10px;
}

.card-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
}

.card-btn:hover {
  background-color: #0056b3;
}

.additional-info {
  margin-top: 12px;
  text-align: left;
}
</style>
