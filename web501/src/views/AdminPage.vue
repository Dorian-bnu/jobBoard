<template>
  <div class="admin-page">
    <h1>Admin Page</h1>

    <div class="columns">
      <!-- Colonne Utilisateurs -->
      <section class="column">
        <h2>Users</h2>
        <button @click="fetchUsers">Load Users</button>
        <ul v-if="users && users.length">
          <li v-for="user in users" :key="user.id">
            {{ user.first_name }} {{ user.last_name }} - {{ user.email }} ({{
              user.role
            }})
            <button @click="editUser(user)">Edit</button>
            <button @click="deleteUser(user.id)">Delete</button>
          </li>
        </ul>
        <div class="pagination">
          <button
            :disabled="currentPage <= 1"
            @click="changeUserPage(currentPage - 1)"
          >
            Previous
          </button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button
            :disabled="currentPage >= totalPages"
            @click="changeUserPage(currentPage + 1)"
          >
            Next
          </button>
        </div>
      </section>

      <!-- Colonne Annonces -->
      <section class="column">
        <h2>Ads</h2>
        <button @click="fetchAds">Load Ads</button>
        <ul v-if="ads && ads.length > 0">
          <li v-for="ad in paginatedAds" :key="ad.id">
            {{ ad.title }} - {{ ad.description }}
            <button @click="editAd(ad)">Edit</button>
            <button @click="deleteAd(ad.id)">Delete</button>
          </li>
        </ul>
        <div v-else>No ads found.</div>
        <div class="pagination">
          <button
            :disabled="currentAdsPage <= 1"
            @click="changeAdsPage(currentAdsPage - 1)"
          >
            Previous
          </button>
          <span>Page {{ currentAdsPage }} of {{ totalAdsPages }}</span>
          <button
            :disabled="currentAdsPage >= totalAdsPages"
            @click="changeAdsPage(currentAdsPage + 1)"
          >
            Next
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      users: [],
      ads: [],
      editingUser: null,
      editingAd: null,
      currentPage: 1,
      totalPages: 1,
      currentAdsPage: 1,
      totalAdsPages: 1,
      token: localStorage.getItem('token') || '',
    };
  },
  computed: {
    paginatedAds() {
      const start = (this.currentAdsPage - 1) * 10;
      const end = start + 10;
      return this.ads.slice(start, end);
    },
  },
  methods: {
    async fetchUsers(page = 1) {
      try {
        const response = await axios.get(
          '${process.env.VUE_APP_API_BASE_URL}/admin/users',
          {
            headers: { Authorization: `Bearer ${this.token}` },
            params: { page, limit: 10 },
          }
        );
        this.users = response.data.users;
        this.totalPages = response.data.totalPages;
        this.currentPage = response.data.page;
      } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to load users');
      }
    },
    async fetchAds(page = 1) {
      try {
        const response = await axios.get(
          '${process.env.VUE_APP_API_BASE_URL}/admin/ads',
          {
            headers: { Authorization: `Bearer ${this.token}` },
            params: { page, limit: 10 },
          }
        );

        console.log('Fetched ads data: ', response.data);

        if (response.data && Array.isArray(response.data.ads)) {
          this.ads = response.data.ads;
          this.totalAdsPages = Math.ceil(this.ads.length / 10);
          this.currentAdsPage = response.data.page || 1;
        } else if (Array.isArray(response.data)) {
          this.ads = response.data;
          this.totalAdsPages = Math.ceil(this.ads.length / 10);
        } else {
          console.error('Ads data structure is not as expected');
          alert('Unexpected ads data structure');
        }
      } catch (error) {
        console.error('Error fetching ads:', error);
        alert('Failed to load ads');
      }
    },
    changeUserPage(page) {
      this.fetchUsers(page);
    },
    changeAdsPage(page) {
      if (page > 0 && page <= this.totalAdsPages) {
        this.currentAdsPage = page;
      }
    },
    async deleteUser(id) {
      try {
        await axios.delete(
          `${process.env.VUE_APP_API_BASE_URL}/admin/users/${id}`,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        alert('User deleted');
        this.fetchUsers(this.currentPage);
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    },
    async deleteAd(id) {
      try {
        await axios.delete(
          `${process.env.VUE_APP_API_BASE_URL}/admin/ads/${id}`,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        alert('Ad deleted');
        this.fetchAds(this.currentAdsPage);
      } catch (error) {
        console.error('Error deleting ad:', error);
        alert('Failed to delete ad');
      }
    },
    async updateUser() {
      try {
        await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/admin/users/${this.editingUser.id}`,
          this.editingUser,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        alert('User updated');
        this.fetchUsers(this.currentPage);
        this.cancelEdit();
      } catch (error) {
        console.error('Error updating user:', error);
        alert('Failed to update user');
      }
    },
    async updateAd() {
      try {
        await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/admin/ads/${this.editingAd.id}`,
          this.editingAd,
          {
            headers: { Authorization: `Bearer ${this.token}` },
          }
        );
        alert('Ad updated');
        this.fetchAds(this.currentAdsPage);
        this.cancelEdit();
      } catch (error) {
        console.error('Error updating ad:', error);
        alert('Failed to update ad');
      }
    },
    editUser(user) {
      this.editingUser = { ...user };
    },
    editAd(ad) {
      this.editingAd = { ...ad };
    },
    cancelEdit() {
      this.editingUser = null;
      this.editingAd = null;
    },
  },
  mounted() {
    this.fetchUsers();
    this.fetchAds();
  },
};
</script>

<style scoped>
.admin-page {
  padding: 20px;
}
.columns {
  display: flex;
  justify-content: space-between;
}
.column {
  width: 48%;
}
.pagination {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}
.modal {
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 5px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  background: #fff;
}
</style>
