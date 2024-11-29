<template>
  <div class="home-page">
    <Navbar />
    <div class="title">
      <h1>Welcome to ProMatcher</h1>
      <p>Match your ambitions with your career</p>
    </div>
    <div class="logo-container">
      <img
        src="@/assets/ProMatcher_Logo_With_Text.webp"
        alt="ProMatcher Logo"
        class="promatcher-logo"
      />
    </div>
    <SignUpBanner />
    <div class="content-wrapper"></div>
    <Footer />
  </div>
</template>

<script>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';
import SignUpBanner from './SignUpBanner.vue';

export default {
  name: 'HomePage',
  components: {
    Navbar,
    SignUpBanner,
    Footer,
  },
};
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  text-align: center;
  min-height: 100vh;
}

.home-page h1 {
  color: #007bff;
}

.title {
  padding: 20px;
}

.content-wrapper {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.logo-container {
  margin-top: 40px;
}

.promatcher-logo {
  max-width: 400px;
  width: 100%;
}

@media (min-width: 1024px) {
  .home-page h1 {
    font-size: 36px;
  }

  .home-page p {
    font-size: 18px;
  }

  .promatcher-logo {
    max-width: 500px;
  }
}

@media (min-width: 1440px) {
  .home-page h1 {
    font-size: 48px;
  }

  .home-page p {
    font-size: 20px;
  }

  .promatcher-logo {
    max-width: 600px;
  }
}
</style>
