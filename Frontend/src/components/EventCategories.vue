<template>
    <div class="event-categories bg-gray-100 py-12 rounded-lg shadow-lg mx-4 md:mx-12">
      <h1 class="text-4xl font-bold mb-8 text-center">Explore Categories</h1>
      <div class="category-list flex flex-wrap justify-center gap-8">
        <router-link
          v-for="category in categories"
          :key="category.name"
          :to="{ name: 'EventListByCategory', params: { categoryName: category.name } }"
          class="category-card flex flex-col items-center transition-transform transform hover:scale-105"
        >
          <img :src="category.imageSrc" :alt="category.name" class="category-image w-32 h-32 rounded-full object-cover mb-4" />
          <h2 class="text-lg font-semibold text-center">{{ category.name }}</h2>
        </router-link>
      </div>
    </div>
  </template>
  
  
  

  <script>
  export default {
    name: 'EventCategories',
    data() {
      return {
        categories: [
          { name: 'Entertainment', imageSrc: require('../assets/Images/Entertainment.png') },
          { name: 'Educational & Business', imageSrc: require('../assets/Images/EducationalBusiness.png') },
          { name: 'Cultural & Arts', imageSrc: require('../assets/Images/CulturalArts.png') },
          { name: 'Sports & Fitness', imageSrc: require('../assets/Images/SportsFitness.png') },
          { name: 'Technology & Innovation', imageSrc: require('../assets/Images/TechnologyInnovation.png') },
          { name: 'Travel & Adventure', imageSrc: require('../assets/Images/TravelAdventure.png') },
        ],
      };
    },
  }
  </script>
  
  
  

  <style scoped>
  .event-categories {
    text-align: center;
  }
  
  .category-card {
    text-decoration: none;
    color: inherit;
    width: 150px;
    text-align: center;
  }
  
  .category-image {
    transition: transform 0.3s;
  }
  
  .category-card:hover .category-image {
    transform: scale(1.05);
  }
  </style>
  
  