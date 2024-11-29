<template>
  <footer class="footer">
    <p class="footer-text">Team web501</p>
  </footer>
</template>

<script>
export default {
  name: 'PageFooter',
};
</script>

<style scoped>
footer {
  background-color: #f1f1f1;
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  border-top: 1px solid #ccc;
  margin-top: 10px;
}

.footer-content {
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.footer-text {
  display: inline-block;
  color: #333;
  font-size: 1rem;
}
</style>
