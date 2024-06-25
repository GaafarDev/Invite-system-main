<template>
  <div class="create-event-page container mx-auto p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
    <div class="max-w-4xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <div class="progress-bar flex justify-between mb-8 bg-gray-100 p-4 rounded-t-xl">
        <div v-for="(step, index) in ['Edit', 'Banner', 'Ticketing', 'Review']" :key="index"
          :class="{'active text-blue-600 border-blue-600': currentStep >= index + 1, 'text-gray-400 border-gray-300': currentStep < index + 1}"
          class="flex-1 text-center py-2 border-b-2 transition duration-300 ease-in-out cursor-pointer hover:text-blue-500">
          {{ step }}
        </div>
      </div>

      <div class="p-6 md:p-8">
        <div v-show="currentStep === 1" class="step step-1">
          <h2 class="text-3xl font-bold mb-6">Create a New Event - Edit</h2>
          <div class="form-group relative mb-6">
            <input type="text" v-model="formData.eventTitle" id="eventTitle" class="input-field" required />
            <label for="eventTitle" class="input-label">Event Title</label>
          </div>

          <div class="form-group relative mb-6">
            <select v-model="formData.eventCategory" id="eventCategory" class="input-field appearance-none" required>
              <option value="">Please select one</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Educational & Business">Educational & Business</option>
              <option value="Cultural & Arts">Cultural & Arts</option>
              <option value="Sports & Fitness">Sports & Fitness</option>
              <option value="Technology & Innovation">Technology & Innovation</option>
              <option value="Travel & Adventure">Travel & Adventure</option>
            </select>
            <label for="eventCategory" class="input-label">Event Category</label>
            <span class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>

          <div class="form-group relative mb-6">
            <textarea v-model="formData.eventDescription" id="eventDescription" class="input-field min-h-[100px]" required></textarea>
            <label for="eventDescription" class="input-label">Additional Information</label>
          </div>

          <div class="form-group relative mb-6">
            <input type="date" v-model="formData.startDate" id="startDate" class="input-field" required />
            <label for="startDate" class="input-label">Start Date</label>
          </div>

          <div class="form-group relative mb-6">
            <input type="time" v-model="formData.startTime" id="startTime" class="input-field" required />
            <label for="startTime" class="input-label">Start Time</label>
          </div>

          <div class="form-group relative mb-6">
            <input type="date" v-model="formData.endDate" id="endDate" class="input-field" required />
            <label for="endDate" class="input-label">End Date</label>
          </div>

          <div class="form-group relative mb-6">
            <input type="time" v-model="formData.endTime" id="endTime" class="input-field" required />
            <label for="endTime" class="input-label">End Time</label>
          </div>

          <div class="form-group relative mb-6">
            <input type="text" v-model="formData.eventLocation" id="eventLocation" class="input-field" required />
            <label for="eventLocation" class="input-label">Location</label>
          </div>

          <div class="button-group flex justify-end">
            <button @click="nextStep" class="primary">Save & Continue</button>
          </div>
        </div>

        <div v-show="currentStep === 2" class="step step-2">
          <h2 class="text-3xl font-bold mb-6">Create a New Event - Banner</h2>
          <div class="form-group relative mb-6">
            <input type="file" @change="handleFileUpload" class="input-field" required />
            <label for="eventImage" class="input-label">Upload Image</label>
          </div>
          <div class="button-group flex justify-between">
            <button @click="previousStep" class="secondary">Go back to Edit Event</button>
            <button @click="nextStep" class="primary">Save & Continue</button>
          </div>
        </div>

        <div v-show="currentStep === 3" class="step step-3">
          <h2 class="text-3xl font-bold mb-6">Create a New Event - Ticketing</h2>
          <div class="form-group mb-6">
            <label class="block text-sm font-medium text-gray-700">What type of event are you running?</label>
            <div class="radio-group flex space-x-4 mt-2">
              <div class="flex items-center">
                <input type="radio" id="ticketedEvent" value="Ticketed" v-model="formData.eventType" class="input-field" required />
                <label for="ticketedEvent" class="ml-2 block text-sm font-medium text-gray-700">Ticketed Event</label>
              </div>
              <div class="flex items-center">
                <input type="radio" id="freeEvent" value="Free" v-model="formData.eventType" class="input-field" required />
                <label for="freeEvent" class="ml-2 block text-sm font-medium text-gray-700">Free Event</label>
              </div>
            </div>
          </div>

          <div v-if="formData.eventType === 'Ticketed'" class="form-group mb-6">
            <label for="ticketName" class="block text-sm font-medium text-gray-700">What tickets are you selling?</label>
            <div v-for="(ticket, index) in formData.tickets" :key="index" class="ticket-entry flex items-center space-x-4 mt-2">
              <input type="text" v-model="ticket.name" placeholder="Ticket Name" class="input-field" required />
              <input type="number" v-model="ticket.price" placeholder="Ticket Price" class="input-field" required />
              <button type="button" @click="removeTicket(index)" class="remove-button bg-red-500 text-white">Remove</button>
            </div>
            <button type="button" @click="addTicket" class="add-button primary">Add Another Ticket</button>
          </div>

          <div class="button-group flex justify-between">
            <button @click="previousStep" class="secondary">Go back to Banner</button>
            <button @click="nextStep" class="primary">Save & Continue</button>
          </div>
        </div>

        <div v-show="currentStep === 4" class="step step-4">
          <h2 class="text-3xl font-bold mb-6">Create a New Event - Review</h2>
          <div class="review-details bg-gray-50 p-8 rounded-md shadow-sm">
            <div class="event-image text-center mb-6">
              <img :src="imagePreview" alt="Event Image" class="max-w-full rounded-md shadow-sm" />
            </div>
            <h1 class="text-2xl font-bold mb-4">{{ formData.eventTitle }}</h1>
            <div class="date-time-section mb-6">
              <h3 class="text-lg font-semibold">Date and Time</h3>
              <div class="date-time-details flex items-center mt-2">
                <span class="icon mr-2">📅</span>
                <span>{{ formData.startDate }} - {{ formData.endDate }}</span>
              </div>
              <div class="date-time-details flex items-center mt-2">
                <span class="icon mr-2">⏰</span>
                <span>{{ formData.startTime }} - {{ formData.endTime }}</span>
              </div>
            </div>
            <div class="ticket-information mb-6">
              <h3 class="text-lg font-semibold">Ticket Information</h3>
              <div v-if="formData.eventType === 'Ticketed'" class="ticket-details flex items-center mt-2">
                <span class="icon mr-2">🎟️</span>
                <ul class="ticket-list list-none p-0 mt-1">
                  <li v-for="(ticket, index) in formData.tickets" :key="index" class="ticket-item flex items-center border-b border-gray-300 py-2 last:border-0">
                    {{ ticket.name }} - RM{{ ticket.price }}
                  </li>
                </ul>
              </div>
              <div v-if="formData.eventType === 'Free'" class="flex items-center mt-2">
                <span class="icon mr-2">🎟️</span>
                <span>Free Event</span>
              </div>
            </div>
            <div class="location-section mb-6">
              <h3 class="text-lg font-semibold">Location</h3>
              <p>{{ formData.eventLocation }}</p>
            </div>
            <div class="event-description-section">
              <h3 class="text-lg font-semibold">Event Description</h3>
              <p>{{ formData.eventDescription }}</p>
            </div>
          </div>
          <div class="button-group flex justify-between mt-6">
            <button @click="previousStep" class="secondary">Go back to Ticketing</button>
            <button @click="submitEvent" class="primary">Publish Event</button>
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
      currentStep: 1,
      formData: {
        eventTitle: '',
        eventCategory: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        eventLocation: '',
        eventDescription: '',
        eventType: '',
        tickets: []
      },
      uploadedImage: null
    };
  },
  computed: {
    imagePreview() {
      return this.uploadedImage ? URL.createObjectURL(this.uploadedImage) : '';
    }
  },
  methods: {
    nextStep() {
      if (this.currentStep === 1 && !this.validateStep1()) return;
      if (this.currentStep === 2 && !this.validateStep2()) return;
      if (this.currentStep === 3 && !this.validateStep3()) return;
      if (this.currentStep < 4) {
        this.currentStep++;
      }
    },
    previousStep() {
      if (this.currentStep > 1) {
        this.currentStep--;
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.uploadedImage = file;
    },
    submitEvent() {
      const userId = localStorage.getItem('id'); // Retrieve the user ID from local storage

      if (!userId) {
        alert('User ID not found. Please log in again.');
        return;
      }

      const eventData = {
        title: this.formData.eventTitle,
        description: this.formData.eventDescription,
        category: this.formData.eventCategory,
        start_datetime: `${this.formData.startDate} ${this.formData.startTime}`,
        end_datetime: `${this.formData.endDate} ${this.formData.endTime}`,
        location: this.formData.eventLocation,
        image_link: this.imagePreview,
        user_id: userId, // Use the retrieved user ID
        tickets: [],
      };

      if (this.formData.eventType === 'Ticketed') {
        eventData.tickets = this.formData.tickets.map(ticket => ({
          ticket_name: ticket.name,
          ticket_price: ticket.price,
        }));
      } else if (this.formData.eventType === 'Free') {
        eventData.tickets = [{
          ticket_name: 'Free admission',
          ticket_price: 0,
        }];
      }

      apiClient.post('/api/events/', eventData)
        .then(response => {
          console.log('Event submitted successfully', response.data);
          window.alert('Event created!');
          this.$router.push('/'); // Redirect to the root path after event creation
        })
        .catch(error => {
          console.error('There was an error submitting the event:', error.response ? error.response.data : error.message);
          if (error.response && error.response.status === 422) {
            const errors = error.response.data.errors;
            if (errors) {
              console.log('Validation errors:', errors);
            }
          } else {
            console.error('Unhandled error:', error.message);
          }
        });
    },
    validateStep1() {
      if (!this.formData.eventTitle || !this.formData.eventCategory || !this.formData.startDate || 
          !this.formData.startTime || !this.formData.endDate || !this.formData.endTime || 
          !this.formData.eventLocation || !this.formData.eventDescription) {
        alert('Please fill out all required fields.');
        return false;
      }
      return true;
    },
    validateStep2() {
      if (!this.uploadedImage) {
        alert('Please upload an image.');
        return false;
      }
      return true;
    },
    validateStep3() {
      if (!this.formData.eventType) {
        alert('Please select an event type.');
        return false;
      }
      if (this.formData.eventType === 'Ticketed' && this.formData.tickets.length === 0) {
        alert('Please add at least one ticket.');
        return false;
      }
      return true;
    },
    addTicket() {
      this.formData.tickets.push({ name: '', price: '' });
    },
    removeTicket(index) {
      this.formData.tickets.splice(index, 1);
    }
  }
};
</script>

<style scoped>
@import 'tailwindcss/tailwind.css';


.progress-bar div {
  position: relative;
}

.progress-bar div::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: #2563eb;
  transition: width 0.3s ease;
}

.progress-bar div.active::after {
  width: 100%;
}

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

select.input-field {
  @apply pr-10;
}

textarea.input-field {
  @apply resize-y;
}

/* Custom autofill style */
.input-field:-webkit-autofill,
.input-field:-webkit-autofill:hover,
.input-field:-webkit-autofill:focus {
  -webkit-text-fill-color: #1f2937;
  -webkit-box-shadow: 0 0 0px 1000px #f3f4f6 inset;
  transition: background-color 5000s ease-in-out 0s;
}

/* Floating label effect */
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

button.secondary {
  @apply bg-gray-500 text-white hover:bg-gray-600;
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

/* Custom scrollbar for textarea */
textarea.input-field {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f3f4f6;
}

textarea.input-field::-webkit-scrollbar {
  width: 8px;
}

textarea.input-field::-webkit-scrollbar-track {
  background: #f3f4f6;
}

textarea.input-field::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 4px;
  border: 2px solid #f3f4f6;
}
</style>
