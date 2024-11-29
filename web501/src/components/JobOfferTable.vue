<template>
  <h3>Your Job Offers :</h3>
  <table>
    <thead>
      <tr>
        <th>Job</th>
        <th>Candidate</th>
        <th>Status</th>
        <th>Resume</th>
        <th>Applicant Message</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="offer in jobOffers" :key="offer.application_id">
        <td>{{ offer.title }}</td>
        <td>{{ offer.first_name }} {{ offer.last_name }}</td>
        <td>
          <select
            v-model="offer.status"
            @change="
              updateApplicationStatus(offer.application_id, offer.status)
            "
          >
            <option value="submitted">Submitted</option>
            <option value="in_review">In Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </td>
        <td>
          <button @click="downloadResume(offer.resume)" class="download">
            Download Resume
          </button>
        </td>
        <td>{{ offer.message }}</td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'JobOfferTable',
  props: {
    jobOffers: {
      type: Array,
      required: true,
    },
    jobApplications: {
      type: Array,
      required: false,
      default: () => [],
    },
    newJobOffer: {
      type: Object,
      default: () => ({
        title: '',
        description: '',
        salary: 0,
        location: '',
        working_time: 0,
        message: '',
      }),
    },
  },
  methods: {
    updateApplicationStatus(applicationId, status) {
      console.log(
        `Updating status for application ID ${applicationId} to ${status}`
      );
    },
    downloadResume(resumeData) {
      const blob = new Blob([resumeData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'resume.pdf';
      a.click();
    },
  },
};
</script>

<style>
table {
  border: solid 1px black;
  border-collapse: separate;
  border-spacing: 0;
  margin: 5px auto;
  border-radius: 10px;
  overflow: hidden;
}
td,
th {
  margin: 5px auto;
  padding: 5px;
  border: solid 1px black;
}
.download {
  margin: 5px;
  max-height: 40px;
  text-align: center;
}
</style>
