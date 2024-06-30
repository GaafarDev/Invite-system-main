<template>
  <div class="invitation-page container mx-auto p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <div class="p-6 md:p-8">
        <h2 class="text-3xl font-bold mb-6">Your Invitations</h2>
        
        <div v-if="loading" class="text-center py-8">
          <p class="text-xl text-gray-600">Loading invitations...</p>
        </div>

        <div v-else-if="error" class="text-center py-8">
          <p class="text-xl text-red-600">{{ error }}</p>
        </div>
        
        <div v-else-if="invitations.length === 0" class="text-center py-8">
          <p class="text-xl text-gray-600">You don't have any invitations at the moment.</p>
        </div>
        
        <div v-else class="space-y-4">
          <div v-for="invitation in invitations" :key="invitation.id" class="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 v-if="invitation.event" class="text-xl font-semibold mb-2 text-purple-700">{{ invitation.event.title || 'No Title' }}</h3>
            <p v-if="invitation.event" class="text-gray-600 mb-4 text-blue-600">{{ invitation.event.description || 'No Description' }}</p>
            <div class="flex justify-end space-x-4">
              <button @click="acceptInvitation(invitation.id)" class="primary">Accept</button>
              <button @click="rejectInvitation(invitation.id)" class="secondary">Reject</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '../services/api';

export default {
  data() {
    return {
      invitations: [],
      loading: true,
      error: null,
      userId: null // We'll set this in mounted hook
    };
  },
  async mounted() {
    try {
      const userId = localStorage.getItem('id') || 3; // Replace with actual user ID logic if needed
      const response = await apiClient.get(`http://127.0.0.1:8000/api/users/${userId}`);
      this.userId = response.data.id; // Assuming the response contains user ID in `id` field
      this.fetchInvitations();
    } catch (error) {
      console.error('Error fetching user ID:', error);
      this.error = 'Failed to load user information. Please try again later.';
      this.loading = false;
    }
  },
  methods: {
    async fetchInvitations() {
      this.loading = true;
      this.error = null;
      try {
        const response = await apiClient.get(`/api/users/${this.userId}/invitations`);
        console.log('Invitations response:', response.data); // Debugging
        this.invitations = response.data;
        console.log(this.invitations); // Log invitations to check structure
        this.loading = false;
      } catch (error) {
        console.error('Error fetching invitations:', error);
        this.error = 'Failed to load invitations. Please try again later.';
        this.loading = false;
      }
    },
    async respondToInvitation(invitationId, response) {
      try {
        await apiClient.put(`/api/invitations/${invitationId}/respond`, { response });
        this.showMessage(`Invitation ${response}ed successfully!`);
        this.fetchInvitations();
      } catch (error) {
        console.error(`Error ${response}ing invitation:`, error.response.data);
        this.showMessage(`Failed to ${response} invitation. Please try again.`);
      }
    },
    acceptInvitation(invitationId) {
      this.respondToInvitation(invitationId, 'accepted');
    },
    rejectInvitation(invitationId) {
      this.respondToInvitation(invitationId, 'rejected');
    },
    showMessage(message) {
      alert(message);
    }
  }
};
</script>

<style scoped>
@import 'tailwindcss/tailwind.css';

button {
  @apply px-6 py-2 rounded-md shadow-sm transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2;
}

button.primary {
  @apply bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700;
}

button.secondary {
  @apply bg-gray-500 text-white hover:bg-gray-600;
}
</style>
