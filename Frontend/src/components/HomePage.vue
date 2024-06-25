<template>
  <div class="home-page bg-gray-100 min-h-screen">
    <div class="banner relative w-full h-96">
      <img src="../assets/Images/homeBanner.jpg" alt="homeBanner" class="w-full h-full object-cover filter brightness-50">
      <div class="banner-content absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-white z-10">
        <h1 class="text-5xl font-bold mb-4 animate-fade-in-down">Don't miss out!</h1>
        <h2 class="text-3xl mt-2 mb-6 animate-fade-in-up">Explore the <span class="text-yellow-400 font-semibold">vibrant events</span> happening locally and globally.</h2>
        <div class="search-bar flex items-center justify-center mt-8 relative w-full max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search Events Name..."
            v-model="searchQuery"
            @input="dynamicSearch"
            class="p-4 w-full rounded-l-full border-2 border-yellow-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition duration-300 ease-in-out text-gray-800"
          />
          <button @click="searchEvents" class="p-4 bg-yellow-400 hover:bg-yellow-500 rounded-r-full transition-colors duration-300 ease-in-out">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          <div v-if="searchQuery.length > 2 && filteredEvents.length > 0" class="suggestions absolute top-full left-0 w-full mt-2 bg-white shadow-xl rounded-md overflow-hidden z-10">
            <ul class="max-h-60 overflow-y-auto">
              <li v-for="event in filteredEvents" :key="event.id" @click="selectEvent(event)" class="px-4 py-3 cursor-pointer hover:bg-yellow-100 transition duration-200 border-b border-gray-200 last:border-b-0">
                <div class="font-semibold text-gray-800">{{ event.title }}</div>
                <div class="text-sm text-gray-600">{{ event.location }} | {{ formatDate(event.start_datetime) }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <EventCategories class="my-12" />
    <div class="events-page container mx-auto px-4 py-12">
      <h1 class="text-4xl font-bold mb-8 text-center">Discover Events</h1>
      <div class="filters flex flex-wrap justify-center space-x-4 mb-8">
        <button v-for="filter in ['All', 'Today', 'Tomorrow', 'This Weekend', 'Free']" :key="filter" class="filter-btn py-2 px-6 bg-white shadow-md rounded-full hover:bg-yellow-400 hover:text-white transition-all duration-300 mb-2">
          {{ filter }}
        </button>
      </div>
      <div class="upcoming-events mb-16">
        <h2 class="text-3xl font-semibold mb-6">Upcoming Events</h2>
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
            class="transform hover:scale-105 transition duration-300 opacity-75"
          />
        </div>
        <div class="text-center mt-8">
          <button v-if="showMoreUpcomingButton" @click="loadMoreUpcoming" class="see-more-btn py-3 px-8 bg-yellow-400 hover:bg-yellow-500 rounded-full transition-colors duration-300 ease-in-out shadow-md">
            See More
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventCategories from './EventCategories.vue';
import EventCard from './EventCard.vue';
import apiClient from '../services/api';

export default {
  components: {
    EventCategories,
    EventCard,
  },
  data() {
    return {
      events: [],
      searchQuery: '',
      filteredEvents: [],
      displayedUpcomingEvents: [],
      upcomingLimit: 6,
      searchTimeout: null,
    };
  },
  computed: {
    showMoreUpcomingButton() {
      return this.displayedUpcomingEvents.length < this.upcomingEvents.length;
    },
    upcomingEvents() {
      const now = new Date();
      return this.events
        .filter(event => new Date(event.start_datetime) > now)
        .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime));
    },
  },
  methods: {
    async fetchEvents() {
      try {
        const response = await apiClient.get('/api/events');
        this.events = response.data;
        this.updateDisplayedUpcomingEvents();
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    },
    async dynamicSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(async () => {
        if (this.searchQuery.length > 2) {
          try {
            const response = await apiClient.get('/api/events/search', {
              params: { query: this.searchQuery }
            });
            this.filteredEvents = response.data;
          } catch (error) {
            console.error('Error searching events:', error);
            this.filteredEvents = [];
          }
        } else {
          this.filteredEvents = [];
        }
      }, 300);
    },
    selectEvent(event) {
      this.$router.push({ name: 'ViewEventDetails', params: { eventId: event.id } });
      this.searchQuery = '';
      this.filteredEvents = [];
    },
    async searchEvents() {
      if (this.searchQuery.length > 2) {
        try {
          const response = await apiClient.get(`/api/events?search=${this.searchQuery}`);
          this.events = response.data;
          this.updateDisplayedUpcomingEvents();
        } catch (error) {
          console.error('Error searching events:', error);
        }
      }
    },
    loadMoreUpcoming() {
      this.upcomingLimit += 6;
      this.updateDisplayedUpcomingEvents();
    },
    updateDisplayedUpcomingEvents() {
      this.displayedUpcomingEvents = this.upcomingEvents.slice(0, this.upcomingLimit);
    },
    getMonth(datetime) {
      const date = new Date(datetime);
      return date.toLocaleString('default', { month: 'short' }).toUpperCase();
    },
    getDays(start, end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (startDate.getDate() === endDate.getDate()) {
        return startDate.getDate();
      }
      return `${startDate.getDate()} - ${endDate.getDate()}`;
    },
    getTime(start, end) {
      const startTime = new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endTime = new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${startTime} - ${endTime}`;
    },
    getPrice(tickets) {
      if (tickets.length === 0) return 'Free';
      const prices = tickets.map(ticket => ticket.ticket_price).filter(price => !isNaN(price));
      return prices.length > 0 ? `From RM ${Math.min(...prices)}` : 'Free';
    },
    goToEventDetails(event) {
      this.$router.push({ name: 'ViewEventDetails', params: { eventId: event.id } });
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
  },
  mounted() {
    this.fetchEvents();
  }
};
</script>

<style scoped>
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translate3d(0, -20%, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate3d(0, 20%, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
.animate-fade-in-down {
  animation: fadeInDown 1s ease-out;
}
.animate-fade-in-up {
  animation: fadeInUp 1s ease-out;
}
.search-bar {
  position: relative;
  z-index: 20;
}
.search-bar input {
  color: #1a202c;
  font-size: 1rem;
}
.search-bar input::placeholder {
  color: #a0aec0;
}
.suggestions {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
.suggestions ul {
  scrollbar-width: thin;
  scrollbar-color: #CBD5E0 #EDF2F7;
}
.suggestions ul::-webkit-scrollbar {
  width: 8px;
}
.suggestions ul::-webkit-scrollbar-track {
  background: #EDF2F7;
}
.suggestions ul::-webkit-scrollbar-thumb {
  background-color: #CBD5E0;
  border-radius: 20px;
  border: 3px solid #EDF2F7;
}
</style>
