<template>
  <div class="job-offer-form modal-content">
    <h3>Add New Job Offer</h3>
    <form @submit.prevent="submitJobOffer">
      <label for="title">Job Title:</label>
      <input name="title" v-model="localJobOffer.title" type="text" required />

      <label for="description">Description:</label>
      <textarea
        name="description"
        v-model="localJobOffer.description"
        required
      ></textarea>

      <label for="salary">Salary:</label>
      <input
        name="salary"
        v-model="localJobOffer.salary"
        type="number"
        required
      />

      <label for="location">Location:</label>
      <input
        name="location"
        v-model="localJobOffer.location"
        type="text"
        required
      />

      <label for="working_time">Working time (in hours/week):</label>
      <input
        name="working_time"
        v-model.number="localJobOffer.working_time"
        type="number"
        required
      />

      <button type="submit" class="form-button">Submit</button>
      <button @click="$emit('close')" type="button" class="form-button">
        Cancel
      </button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'JobOfferForm',
  props: {
    jobOffer: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localJobOffer: { ...this.jobOffer }, // Use local copy to avoid mutating prop
    };
  },
  watch: {
    localJobOffer: {
      handler(newValue) {
        this.$emit('update:jobOffer', newValue); // Emit the changes to parent
      },
      deep: true,
    },
  },
  methods: {
    submitJobOffer() {
      this.$emit('submit-job-offer', this.localJobOffer);
    },
  },
};
</script>

<style>
.job-offer-form.modal-content {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 50px auto; /*Centers the thingy*/
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  padding: 20px;
}

.job-offer-form h3 {
  margin-bottom: 20px;
}

.job-offer-form form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.job-offer-form label {
  font-weight: bold;
}

.job-offer-form input,
.job-offer-form textarea {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.job-offer-form textarea {
  resize: vertical;
  min-height: 80px;
  max-height: 300px;
}

.form-button {
  cursor: pointer;
  margin: 5px auto;
  display: block;
}

.job-offer-form button:hover {
  opacity: 0.9;
}
</style>
