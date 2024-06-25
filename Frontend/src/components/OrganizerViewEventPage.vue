<template>
  <div class="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div v-if="eventDetails" class="md:flex">
        <!-- Event Image -->
        <div class="md:flex-shrink-0">
          <img class="h-48 w-full object-cover md:w-48" :src="eventDetails.image_link" alt="Event Image" />
        </div>
        <div class="p-8">
          <div class="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{{ eventDetails.category }}</div>
          <h1 class="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {{ eventDetails.title }}
          </h1>
          
          <!-- Date and Time -->
          <div class="mt-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Date and Time</h3>
            <div class="mt-2 text-base text-gray-500">
              <p><span class="font-semibold">Starts:</span> {{ formatDateTime(eventDetails.start_datetime) }}</p>
              <p><span class="font-semibold">Ends:</span> {{ formatDateTime(eventDetails.end_datetime) }}</p>
            </div>
          </div>

          <!-- Location -->
          <div class="mt-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Location</h3>
            <p class="mt-2 text-base text-gray-500">{{ eventDetails.location }}</p>
          </div>

          <!-- Description -->
          <div class="mt-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Description</h3>
            <p class="mt-2 text-base text-gray-500">{{ eventDetails.description }}</p>
          </div>

          <!-- Tickets -->
          <div class="mt-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Tickets</h3>
            <ul class="mt-2 space-y-2">
              <li v-for="ticket in eventDetails.tickets" :key="ticket.id" class="flex items-center justify-between">
                <span class="text-base text-gray-500">{{ ticket.ticket_name }}</span>
                <span class="text-base font-semibold text-gray-900">RM {{ ticket.ticket_price }}</span>
              </li>
            </ul>
          </div>

          <!-- Interests and Invite -->
          <div class="mt-8 flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">
                {{ eventDetails.interests.length }} people are interested
              </p>
            </div>
            <button @click="sendInvitation" class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <img src="../assets/Icons/send_invitation.png" alt="ticket" class="w-5 h-5 mr-2" />
              Send Invitation
            </button>
          </div>
        </div>
      </div>
      <div v-else class="p-8 text-center">
        <p class="text-gray-500">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      eventDetails: null
    };
  },
  methods: {
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
    fetchEventDetails(eventId) {
      axios.get(`https://invite-system-backend.up.railway.app/api/events/${eventId}`)
        .then(response => {
          this.eventDetails = response.data;
        })
        .catch(error => {
          console.error("Error fetching event details:", error);
        });
    },
    inviteParticipant(ticketId) {
      const payload = {
        organizer_id: 1,  // Replace with actual organizer ID
        ticket_id: ticketId
        // Additional details as required
      };
      axios.post(`https://invite-system-backend.up.railway.app/api/inviteparticipant`, payload)
        .then(() => {
          alert("Participant invited successfully!");
        })
        .catch(error => {
          console.error("Error inviting participant:", error);
        });
    },
    sendInvitation() {
      this.$router.push({
        name: 'SendInvitation',
        query: {
          eventId: this.$route.params.eventId
        }
      });
    }
  },
  created() {
    this.fetchEventDetails(this.$route.params.eventId);
  }
};
</script>

<style scoped>
.view-event-details-page {
  padding: 100px;
  padding-right:300px;
  padding-left:300px;
  margin-left: 5%;
  margin-right: 5%;
}

.event-details {
  background-color: #f9f9f9;
  padding: 10px;
  margin-left: 20PX;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.event-image img {
  width: 90%; /* Adjust the width as needed, could be 100% of the container */
  height: 450px; /* Height for 16:9 aspect ratio, based on the width */
  object-fit: cover; /* Crop and cover the area */
  border-radius: 15px;
  max-width: 100%; /* Adjust or remove max-width as needed */
  max-height: 500px;
}

.details{
  padding: 10px;
  margin-left: 40px;
}

.date-time-section, .location-section, .category-section, .description-section, .tickets-section, .interests-section {
  margin-bottom: 20px;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
}

h3 {
  font-size: 20px;
  margin-bottom: 10px;
}

button {
  padding: 10px 20px;
  background-color: #FFE047;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

button img{
  height: auto;
  width: 20px;
  padding-right:5px;
  padding-top:3px;
}

.interests-and-invite {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
