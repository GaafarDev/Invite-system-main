<template>
    <div class="p-8">
        <h1 class="text-3xl font-bold mb-8">{{ categoryName }} Events</h1>
        <div v-if="loading" class="flex justify-center items-center">
            <div class="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12"></div>
        </div>
        <div v-else-if="error" class="text-red-500 text-center">
            There was an error fetching the events. Please try again later.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <EventCard 
                v-for="event in mappedEvents" 
                :key="event.id" 
                :event-id="event.id"
                @click="goToEventDetails(event.id)"
                :event-type="event.eventType" 
                :event-month="event.eventMonth"
                :event-days="event.eventDays"
                :event-title="event.eventTitle"
                :event-location="event.eventLocation"
                :event-time="event.eventTime"
                :event-price="event.eventPrice"
                :event-interested="event.eventInterested"
                class="cursor-pointer transition-transform transform hover:scale-105"
            />
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
            filteredEvents: [],
            loading: true,
            error: false
        };
    },
    computed: {
        categoryName() {
            return this.$route.params.categoryName;
        },
        mappedEvents() {
            return this.filteredEvents.map(event => ({
                id: event.id,
                eventType: event.category,
                eventMonth: new Date(event.start_datetime).toLocaleString('default', { month: 'short' }).toUpperCase(),
                eventDays: `${new Date(event.start_datetime).getDate()} - ${new Date(event.end_datetime).getDate()}`,
                eventTitle: event.title,
                eventLocation: event.location,
                eventTime: `${new Date(event.start_datetime).toLocaleTimeString()} - ${new Date(event.end_datetime).toLocaleTimeString()}`,
                eventPrice: `RM ${event.tickets[0]?.ticket_price || 0}`,
                eventInterested: event.interested || 0,
            }));
        }
    },
    methods: {
        fetchEvents() {
            axios.get('https://invite-system-backend.up.railway.app/api/events')
                .then(response => {
                    this.events = response.data;
                    this.filterEventsByCategory();
                    this.loading = false;
                })
                .catch(error => {
                    console.error("There was an error fetching the events!", error);
                    this.error = true;
                    this.loading = false;
                });
        },
        filterEventsByCategory() {
            this.filteredEvents = this.events.filter(event => event.category === this.categoryName);
        },
        goToEventDetails(eventId) {
            this.$router.push({ name: 'ViewEventDetails', params: { eventId } });
        }
    },
    watch: {
        categoryName() {
            this.filterEventsByCategory();
        },
    },
    mounted() {
        this.fetchEvents();
    },
};
</script>

<style>
.loader {
    border-top-color: #3498db;
    animation: spinner 0.6s linear infinite;
}

@keyframes spinner {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
