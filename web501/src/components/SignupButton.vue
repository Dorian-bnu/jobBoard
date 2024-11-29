<template>
  <button type="submit" class="signup-btn">{{ buttonText }}</button>
</template>

<script>
export default {
  name: 'SignupButton',
  props: {
    buttonText: {
      type: String,
      default: 'Sign Up',
    },
  },
};
</script>

<style scoped>
.signup-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  width: auto; /* Allow the button to resize based on content */
  margin: 0 auto;
}
</style>
