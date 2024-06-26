<template>
  <div class="eventCard bg-white rounded-lg overflow-hidden mt-5 shadow-sm hover:shadow-md transition-shadow duration-200 max-w-sm mx-auto">
    <div class="upperCard relative">
      <div class="eventCardImage" @click="navigateToEventPage">
        <img :src="imageSrc" alt="Event Image" class="w-full h-48 object-cover cursor-pointer" />
        <div class="eventType absolute bottom-1 left-0 bg-yellow-400 text-gray-900 py-1 px-2 rounded-tr-md font-bold">
          {{ eventType }}
        </div>
        <div class="eventStar absolute top-2 right-2">
          <img 
            :src="currentIcon" 
            alt="Star Icon" 
            class="w-6 h-6 cursor-pointer" 
            @click.stop="toggleInterest"
          />
        </div>
      </div>
    </div>
    <div class="bottomCard p-5 flex" @click="navigateToEventPage">
      <div class="eventDate text-center mr-3">
        <h2 class="text-lg text-blue-600 font-medium mb-1">{{ eventMonth }}</h2>
        <h1 class="text-xl font-bold">{{ eventDays }}</h1>
      </div>
      <div class="eventDetails flex-1">
        <ul class="list-none">
          <li class="mb-2">
            <h3 class="text-lg font-semibold text-gray-900">{{ eventTitle }}</h3>
          </li>
          <li class="mb-2">
            <p class="address text-sm font-medium text-gray-600">{{ eventLocation }}</p>
          </li>
          <li class="mb-2">
            <p class="time text-sm text-gray-600">{{ eventTime }}</p>
          </li>
          <li>
            <p class="flex items-center">
              <span class="price text-gray-600 font-medium mr-2 flex items-center">
                <img src="../assets/Icons/ticketCard.png" alt="ticket" class="w-5 h-5 mr-1" />
                {{ eventPrice }}
              </span>
              <span class="interested text-gray-600 font-medium flex items-center">
                <img src="../assets/Icons/starCard.png" alt="Interest" class="w-5 h-5 mr-1" />
                {{ computedInterested }} interested
              </span>
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import apiClient from '@/services/api.js';

export default {
  name: 'EventCard',
  props: {
    imageSrc: {
      type: String,
      default: require("../assets/Images/Event.png")
    },
    eventType: {
      type: String,
      default: "Travel & Adventure"
    },
    eventMonth: {
      type: String,
      default: "NOV"
    },
    eventDays: {
      type: String,
      default: "25 - 26"
    },
    eventTitle: {
      type: String,
      default: "Lakeside Camping at Pawna"
    },
    eventLocation: {
      type: String,
      default: "Jalan Sultan Yahya Petra, UTMKL"
    },
    eventTime: {
      type: String,
      default: "8:30 AM - 7:30 PM"
    },
    eventPrice: {
      type: String,
      default: "RM 100"
    },
    eventInterested: {
      type: Number,
      default: 14
    },
    eventId: { // Ensure eventId is defined only once
      type: Number,
      required: true
    }
  },
  data() {
    return {
      defaultIcon: require('../assets/Icons/star_icon.png'),
      clickedIcon: require('../assets/Icons/white_star_icon.png'),
      currentIcon: require('../assets/Icons/star_icon.png'),
      isInterested: false,
      isInterestedDefault: false,
      interestId: null,
      userId: null
    };
  },
  created() {
    this.userId = localStorage.getItem('id');
    if (this.userId) {
      console.log(`User Id: ${this.userId}`);
    } else {
      console.error('User ID not found in localStorage');
    }
  },
  mounted() {
    if (this.userId) {
      this.checkUserInterest();
      if (this.checkUserInterest) {
        this.isInterestedDefault = true;
    }
    }
  },
  methods: {
    toggleInterest() {
      if (this.isInterested) {
        this.removeInterest();
      } else {
        this.addInterest();
      }
    },
    addInterest() {
      const data = {
        event_id: this.eventId,
        user_id: this.userId
      };
      apiClient.post('/api/interests', data)
        .then(response => {
          console.log('Interest added successfully:', response.data);
          this.isInterested = true;
          this.currentIcon = this.clickedIcon;
          this.$emit('interest-updated', this.eventId, 1);
        })
        .catch(error => {
          console.error('Error adding interest:', error);
        });
    },
    removeInterest() {
      const data = {
        event_id: this.eventId,
        user_id: this.userId
      };
      apiClient.delete('/api/interests', { data })
        .then(response => {
          console.log('Interest removed successfully:', response.data);
          this.isInterested = false;
          this.currentIcon = this.defaultIcon;
          this.$emit('interest-updated', this.eventId, -1);
        })
        .catch(error => {
          console.error('Error removing interest:', error);
        });
    },
    checkUserInterest() {
      apiClient.get(`/api/users/${this.userId}/interests`)
        .then(response => {
          const interests = response.data;
          const interest = interests.find(i => i.event_id === this.eventId);
          if (interest) {
            this.isInterested = true;
            this.currentIcon = this.clickedIcon;
            this.interestId = interest.id;
            return true;
          } else {
            this.isInterested = false;
            this.currentIcon = this.defaultIcon;
            return false;
          }
        })
        .catch(error => {
          console.error('Error fetching user interests:', error);
        });
    },
    navigateToEventPage() {
      this.$emit('event-card-clicked');
    },
  },
  computed: {
    computedInterested() {
      // if(this.isInterestedDefault){
      //   return this.isInterested ? this.eventInterested + this.isInterestedDefault: this.eventInterested;
      // }
      return this.isInterested ? this.eventInterested + 1  : this.eventInterested;
    }
  }
};
</script>

<style scoped>
.eventCard {
  transition: box-shadow 0.2s ease-in-out;
}

.eventCard:hover {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}
</style>