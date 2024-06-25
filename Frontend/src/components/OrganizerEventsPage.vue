<template>
  <div class="events-page bg-gray-100 min-h-screen">
    <div class="container mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold mb-8 text-center">My Organized Events</h1>
      
  

      <div class="upcoming-events mb-16">
        <h2 class="text-3xl font-semibold mb-6">Upcoming Organized Events</h2>
        <div class="event-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <EventCard
            v-for="event in displayedUpcomingEvents"
            :key="event.id"
            @click="goToEventDetails(event)"
            :eventId="event.id" 
            :eventType="event.category"
            :eventMonth="getMonth(event.start_datetime)"
            :eventDays="getDays(event.start_datetime, event.end_datetime)"
            :eventTitle="event.title"
            :eventLocation="event.location"
            :eventTime="getTime(event.start_datetime, event.end_datetime)"
            :eventPrice="getPrice(event.tickets)"
            :eventInterested="event.interests.length"
            class="transform hover:scale-105 transition duration-300"
          />
        </div>
        <div class="text-center mt-8">
          <button v-if="showMoreUpcomingButton" @click="loadMoreUpcoming" 
                  class="see-more-btn py-3 px-8 bg-yellow-400 hover:bg-yellow-500 rounded-full transition-colors duration-300 ease-in-out shadow-md">
            See More
          </button>
        </div>
      </div>

      <div class="past-events">
        <h2 class="text-3xl font-semibold mb-6">Past Organized History</h2>
        <div class="event-cards grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <EventCard
            v-for="event in displayedPastEvents"
            :key="event.id"
            @click="goToEventDetails(event)"
            :eventId="event.id" 
            :eventType="event.category"
            :eventMonth="getMonth(event.start_datetime)"
            :eventDays="getDays(event.start_datetime, event.end_datetime)"
            :eventTitle="event.title"
            :eventLocation="event.location"
            :eventTime="getTime(event.start_datetime, event.end_datetime)"
            :eventPrice="getPrice(event.tickets)"
            :eventInterested="event.interests.length"
            class="transform hover:scale-105 transition duration-300 opacity-75"
          />
        </div>
        <div class="text-center mt-8">
          <button v-if="showMorePastButton" @click="loadMorePast" 
                  class="see-more-btn py-3 px-8 bg-gray-300 hover:bg-gray-400 rounded-full transition-colors duration-300 ease-in-out shadow-md">
            See More
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import EventCard from './EventCard.vue';

export default {
  components: {
    EventCard,
  },
  data() {
    return {
      events: [],
      displayedUpcomingEvents: [],
      displayedPastEvents: [],
      upcomingLimit: 6,
      pastLimit: 6,
    };
  },
  computed: {
    showMoreUpcomingButton() {
      return this.displayedUpcomingEvents.length < this.upcomingEvents.length;
    },
    showMorePastButton() {
      return this.displayedPastEvents.length < this.pastEvents.length;
    },
    upcomingEvents() {
      const now = new Date();
      return this.events.filter(event => new Date(event.start_datetime) > now);
    },
    pastEvents() {
      const now = new Date();
      return this.events.filter(event => new Date(event.start_datetime) < now);
    }
  },
  methods: {
    loadMoreUpcoming() {
      this.upcomingLimit += 6;
      this.updateDisplayedUpcomingEvents();
    },
    loadMorePast() {
      this.pastLimit += 6;
      this.updateDisplayedPastEvents();
    },
    updateDisplayedUpcomingEvents() {
      this.displayedUpcomingEvents = this.upcomingEvents.slice(0, this.upcomingLimit);
    },
    updateDisplayedPastEvents() {
      this.displayedPastEvents = this.pastEvents.slice(0, this.pastLimit);
    },
    getMonth(datetime) {
      const date = new Date(datetime);
      return date.toLocaleString('default', { month: 'short' }).toUpperCase();
    },
    getDays(start, end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (startDate.getDate() === endDate.getDate()) {
        return startDate.getDate().toString();
      }
      return `${startDate.getDate()} - ${endDate.getDate()}`;
    },
    getTime(start, end) {
      const startTime = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endTime = new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${startTime} - ${endTime}`;
    },
    getPrice(tickets) {
      if (tickets.length === 0) {
        return 'Free';
      }
      return `RM ${Math.min(...tickets.map(ticket => ticket.ticket_price))}`;
    },
    fetchEvents() {
      const userId = localStorage.getItem('id');
      if (!userId) {
        console.error('User ID not found in localStorage');
        return;
      }

      // axios.get(`http://127.0.0.1:8000/api/events/upcoming/${userId}`)
      axios.get(` http://127.0.0.1:8000/api/users/${userId}/createdevents`)
     
        .then(response => {
          // Log the response from Axios
          console.log('Axios Response:', response);

          // Update events and displayed events
          this.events = response.data;
          this.updateDisplayedUpcomingEvents();
          this.updateDisplayedPastEvents();
        })
        .catch(error => {
          console.error("There was an error fetching the events!", error);
        });
    },
    goToEventDetails(event) {
        this.$router.push({
          name: 'ViewEventDetails',
          params: {
            eventId: event.id
          }
        });
      }
    },
    mounted() {
      this.fetchEvents();
    }
};
</script>

<style scoped>
/* Any additional styles can be added here if needed */
</style>
