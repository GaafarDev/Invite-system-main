<template>
    <div class="eventCard bg-white rounded-lg overflow-hidden mt-5 shadow-sm hover:shadow-md transition-shadow duration-200 max-w-sm mx-auto">
      <div class="upperCard relative">
        <div class="eventCardImage">
          <img src="../assets/Images/Event.png" alt="Event Image" class="w-full h-48 object-cover" />
          <div class="eventType absolute bottom-1 left-0 bg-yellow-400 text-gray-900 py-1 px-2 rounded-tr-md font-bold">
            {{ eventType }}
          </div>
          <div class="eventStar absolute top-2 right-2">
            <img src="../assets/Icons/star_icon.png" alt="Star Icon" class="w-6 h-6" />
          </div>
        </div>
      </div>
      <div class="bottomCard p-5 flex">
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
                  {{ eventInterested }} interested
                </span>
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'EventCard',
    props: {
      imageSrc: {
        type: String,
        default: "../assets/Images/Event.png"
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
      }
    }
  }
  </script>
  
  <style scoped>
  .eventCard {
    transition: box-shadow 0.2s ease-in-out;
  }
  
  .eventCard:hover {
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
  </style>
  