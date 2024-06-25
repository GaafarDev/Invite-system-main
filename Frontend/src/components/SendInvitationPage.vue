<template>
  <div class="send-invitation-page container mx-auto p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <div class="p-6 md:p-8">
        <h2 class="text-3xl font-bold mb-8 text-center text-gray-800">Send Invitation</h2>
        
        <!-- Event Details Section -->
        <div v-if="eventDetails" class="event-details bg-gray-50 p-6 rounded-lg mb-8 shadow-sm">
          <h3 class="text-2xl font-semibold mb-4 text-gray-800">{{ eventDetails.title }}</h3>
          <p class="text-gray-600 mb-4">{{ eventDetails.description }}</p>
          <div class="flex items-center text-gray-700 mb-2">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span><strong>Date:</strong> {{ formatDateTime(eventDetails.start_datetime) }} - {{ formatDateTime(eventDetails.end_datetime) }}</span>
          </div>
          <div class="flex items-center text-gray-700">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            <span><strong>Location:</strong> {{ eventDetails.location }}</span>
          </div>
        </div>
        <div v-else class="animate-pulse bg-gray-200 h-40 rounded-lg mb-8"></div>
        
        <!-- Search Input -->
        <div class="form-group relative mb-6">
          <input 
            type="text" 
            v-model="searchQuery" 
            id="searchUsers"
            placeholder=" "
            class="input-field"
          >
          <label for="searchUsers" class="input-label">Search users</label>
        </div>

        <!-- User List -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="user in filteredUsers" :key="user.id" class="user-item bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4">
            <div class="flex items-center mb-4">
              <img :src="user.pic_url || 'https://via.placeholder.com/50'" alt="User Image" class="w-12 h-12 rounded-full mr-4" />
              <div>
                <p class="font-semibold text-gray-800">{{ user.fullname }}</p>
                <p class="text-sm text-gray-600">{{ user.email }}</p>
              </div>
            </div>
            <label class="flex items-center space-x-3">
              <input type="checkbox" v-model="selectedUsers" :value="user.id" class="form-checkbox h-5 w-5 text-blue-600" />
              <span class="text-gray-700">Select</span>
            </label>
          </div>
        </div>

        <!-- Send Button -->
        <div class="mt-8 text-center">
          <button @click="sendInvitations" class="primary">
            Send Invitation
          </button>
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="success-message text-center mt-8 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span class="block sm:inline">{{ successMessage }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import apiClient from '@/services/api.js';

export default {
  data() {
    return {
      eventDetails: null,
      users: [],
      selectedUsers: [],
      successMessage: "",
      searchQuery: '',
    };
  },
  created() {
    const eventId = this.$route.query.eventId;
    this.fetchEventDetails(eventId);
    this.fetchUsers();
  },
  methods: {
    fetchEventDetails(eventId) {
      axios.get(`http://127.0.0.1:8000/api/events/${eventId}`)
        .then(response => {
          this.eventDetails = response.data;
        })
        .catch(error => {
          console.error("Error fetching event details:", error);
        });
    },
    fetchUsers() {
      apiClient.get('/api/users')
        .then(response => {
          this.users = response.data;
        })
        .catch(error => {
          console.error("Error fetching users:", error);
        });
    },
    formatDateTime(datetime) {
      const options = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      };
      const date = new Date(datetime);
      return date.toLocaleString('en-US', options);
    },
    sendInvitations() {
      const payload = {
        event_id: this.eventDetails.id,
        user_id: this.selectedUsers
      };
      axios.post('http://127.0.0.1:8000/api/invitations', payload)
        .then(response => {
          console.log("Invitations sent successfully:", response.data);
          this.successMessage = "Invitations sent successfully!";
          this.selectedUsers = [];
        })
        .catch(error => {
          console.error("Error sending invitations:", error);
          this.successMessage = "Error sending invitations. Please try again.";
        });
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => 
        user.fullname.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }
  }
};
</script>

<style scoped>
@import 'tailwindcss/tailwind.css';

.input-field {
  @apply block w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition duration-200 ease-in-out;
  @apply bg-gray-50 text-gray-900 placeholder-transparent;
  @apply text-base;
}

.input-field::placeholder {
  @apply text-gray-400;
}

.input-field:hover {
  @apply border-gray-300;
}

.form-group {
  @apply relative;
}

.input-label {
  @apply absolute left-4 top-3 text-gray-500 transition-all duration-200 ease-in-out;
  pointer-events: none;
}

.input-field:focus ~ .input-label,
.input-field:not(:placeholder-shown) ~ .input-label {
  @apply text-xs text-blue-500 -top-2 left-3 bg-white px-1;
}

button {
  @apply px-6 py-2 rounded-md shadow-sm transition duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2;
}

button.primary {
  @apply bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700;
}

.form-group {
  @apply mb-6 animate-fade-in-up;
}

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}
</style>