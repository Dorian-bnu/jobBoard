<template>
  <div class="sign-up-banner">
    <div class="banner-content">
      <div class="text-part">
        <h2>Join Us Today!</h2>
        <p>
          Whether you're looking for your next dream job or the perfect
          candidate, sign up now and start your journey with us!
        </p>
      </div>
      <img
        src="../assets/pngwing.com.png"
        alt="Sign up image"
        class="banner-image"
      />
      <SignupButton @click.prevent="goToSignUp" :buttonText="'Sign Up'" />
    </div>
  </div>
</template>

<script>
import SignupButton from './SignupButton.vue';

export default {
  name: 'SignUpBanner',
  components: {
    SignupButton,
  },
  methods: {
    goToSignUp() {
      this.$router.push({ path: '/signup' });
    },
  },
};
</script>

<style scoped>
.sign-up-banner {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  flex: 1;
}

.banner-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  max-width: 900px;
  flex-wrap: wrap;
}

.text-part {
  max-width: 400px;
}

.banner-image {
  max-width: 250px;
  height: auto;
  border-radius: 10px;
}

.sign-up-button {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .banner-content {
    flex-direction: column;
    text-align: center;
  }

  .banner-image {
    margin-top: 20px;
    max-width: 100%;
  }
}

@media (min-width: 1024px) {
  .sign-up-banner {
    padding: 40px;
  }

  .banner-content {
    gap: 60px;
    max-width: 1100px;
  }

  .text-part h2 {
    font-size: 32px;
  }

  .text-part p {
    font-size: 18px;
  }

  .banner-image {
    max-width: 300px;
  }
}

@media (min-width: 1440px) {
  .sign-up-banner {
    padding: 60px;
  }

  .banner-content {
    gap: 80px;
    max-width: 1300px;
  }

  .text-part h2 {
    font-size: 40px;
  }

  .text-part p {
    font-size: 20px;
  }

  .banner-image {
    max-width: 350px;
  }
}
</style>
