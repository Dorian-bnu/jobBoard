<template>
  <div class="page-container">
    <Navbar />
    <fieldset class="button-to-click">
      <legend>General settings</legend>
      <div class="container-button">
        <div>
          <label for="change">Change your password : </label>
          <button
            @click="showPasswordChangeForm = true"
            class="change"
            name="change"
          >
            Change password
          </button>
        </div>
        <div>
          <label for="disconnect">Disconnect from your account : </label>
          <button @click="disconnect" class="change" name="disconnect">
            Disconnect
          </button>
        </div>
        <div>
          <label for="delete"
            >Delete your account (this action cannot be reversed ! ) :
          </label>
          <button @click="confirmDeleteAccount" class="delete" name="delete">
            Remove
          </button>
        </div>
      </div>
    </fieldset>
    <fieldset>
      <legend>
        {{ userRole }}
      </legend>
      <div v-if="userRole === 'applicant'">
        <h3>Your Applications :</h3>
        <ul>
          <li v-for="application in jobApplications" :key="application.id">
            Job: {{ application.title }} - Status:
            {{ application.status }}
          </li>
        </ul>
      </div>
      <div v-if="userRole === 'manager'">
        <JobOfferTable :jobOffers="jobOffers" />
      </div>
    </fieldset>
    <button @click="showAddJobOfferModal = true" class="add">
      Add Job Offer
    </button>
    <div v-if="showAddJobOfferModal" class="modal">
      <JobOfferForm
        v-model:jobOffer="newJobOffer"
        @submit-job-offer="submitNewJobOffer"
        @close="showAddJobOfferModal = false"
      />
    </div>
    <div v-if="showPasswordChangeForm" class="modal">
      <div class="modal-content">
        <h3>Change Password</h3>
        <form @submit.prevent="submitNewPassword">
          <label for="newPassword">New Password:</label>
          <input
            v-model="newPassword"
            type="password"
            id="newPassword"
            required
          />
          <button type="submit">Submit</button>
          <button @click="showPasswordChangeForm = false" type="button">
            Cancel
          </button>
        </form>
      </div>
    </div>
    <div class="blank"></div>
    <Footer />
  </div>
</template>

<script>
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import JobOfferForm from '@/components/JobOfferForm.vue';
import JobOfferTable from '../components/JobOfferTable.vue';

export default {
  name: 'SettingsVue',
  components: {
    Navbar,
    Footer,
    JobOfferForm,
    JobOfferTable,
  },
  data() {
    return {
      showPasswordChangeForm: false,
      newPassword: '',
      userRole: '',
      jobApplications: [],
      jobOffers: [],
      showAddJobOfferModal: false,
      newJobOffer: {
        title: '',
        description: '',
        salary: 0,
        location: '',
        working_time: 0,
        message: '',
      },
    };
  },
  methods: {
    async submitNewJobOffer() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          `${process.env.VUE_APP_API_BASE_URL}/ads/joboffers`,
          this.newJobOffer,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Job Offer created successfully');
        this.showAddJobOfferModal = false;
        this.fetchJobOffers();
      } catch (error) {
        console.error('Error creating job offer:', error);
        alert('Failed to create job offer');
      }
    },
    async updateApplicationStatus(applicationId, status) {
      try {
        const token = localStorage.getItem('token');
        await axios.put(
          `${process.env.VUE_APP_API_BASE_URL}/ads/${applicationId}/status`,
          { status },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Application status updated successfully');
      } catch (error) {
        console.error('Error updating application status:', error);
        alert('Failed to update application status');
      }
    },

    downloadResume(resumeData) {
      const blob = new Blob([resumeData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
    },
    async fetchUserRole() {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = `${process.env.VUE_APP_API_BASE_URL}/users/info`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.userRole = response.data.role;
        if (this.userRole === 'applicant') {
          this.fetchJobApplications();
        } else if (this.userRole === 'manager') {
          this.fetchJobOffers();
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    },
    async fetchJobApplications() {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = `${process.env.VUE_APP_API_BASE_URL}/users/applications`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.jobApplications = response.data;
      } catch (error) {
        console.error('Error fetching job applications:', error);
      }
    },
    async fetchJobOffers() {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = `${process.env.VUE_APP_API_BASE_URL}/users/offers`;
        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.jobOffers = response.data;
      } catch (error) {
        console.error('Error fetching job offers:', error);
      }
    },
    async submitNewPassword() {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = `${process.env.VUE_APP_API_BASE_URL}/users/changepwd`;
        const response = await axios.post(
          apiUrl,
          { password: this.newPassword },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        alert('Password changed successfully');
        this.showPasswordChangeForm = false;
      } catch (error) {
        console.error('Error changing password:', error);
        alert('Failed to change password');
      }
    },
    confirmDeleteAccount() {
      if (
        window.confirm(
          'Are you sure you want to delete your account? This action cannot be undone.'
        )
      ) {
        this.deleteAccount();
      }
    },
    async deleteAccount() {
      try {
        const token = localStorage.getItem('token');
        const apiUrl = `${process.env.VUE_APP_API_BASE_URL}/users/deleteaccount`;
        console.log('Token envoyé:', token);
        await axios.delete(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Account deleted successfully');
        localStorage.removeItem('token');
        this.$router.push({ name: 'home' });
      } catch (error) {
        console.error('Error deleting account:', error);
        alert('Failed to delete account');
      }
    },
    disconnect() {
      console.log('test');
      localStorage.removeItem('token');
      window.location.href = '/login';
    },
  },
  mounted() {
    this.fetchUserRole();
    this.fetchJobApplications();
    this.fetchJobOffers();
  },
};
</script>

<style>
.container-button {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.container-button > div {
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
}
legend {
  padding: 0 10px;
  font-size: larger;
  font-weight: bold;
  text-transform: capitalize;
  text-decoration: underline;
}
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  width: 100px;
}
.delete {
  background-color: rgb(167, 61, 61);
}
.download {
  margin: 5px;
  max-height: 40px;
  text-align: center;
}
fieldset {
  padding: 10px;
  margin: 10px;
  border-radius: 10px;
}
.blank {
  flex-grow: 1;
}
.page-container > Footer {
  margin-top: auto;
}
.add {
  margin: 10px auto;
}
</style>
