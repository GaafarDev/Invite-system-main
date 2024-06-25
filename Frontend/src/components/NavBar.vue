<template>
  <nav class="navbar flex items-center justify-between px-5">
    <div class="AppLogo">
      <img src="../assets/Icons/InviteLogo.png" alt="logo" class="h-12" />
    </div>
    <div class="menu flex-1 flex justify-center">
      <ul class="flex list-none space-x-4 text-lg">
        <li>
          <router-link to="/" active-class="active-page" class="nav-link">Home</router-link>
        </li>
        <li>
          <router-link to="/events" active-class="active-page" class="nav-link">Events</router-link>
        </li>
        <li>
          <router-link to="/invitations" active-class="active-page" class="nav-link">Invitations</router-link>
        </li>
        <li>
          <router-link to="/organizer-events" active-class="active-page" class="nav-link">Organized Events</router-link>
        </li>
      </ul>
    </div>
    <div class="icons flex items-center space-x-4">
      <router-link to="/create-event" class="nav-link">Create Event</router-link>
      <router-link to="#">
        <img src="../assets/Icons/ticket_icon.png" alt="Tickets" title="Tickets" class="h-8 w-8" />
      </router-link>
      <router-link to="#">
        <img src="../assets/Icons/star_icon.png" alt="Interested" title="Interested" class="h-8 w-8" />
      </router-link>
      <div class="relative profile-dropdown">
        <router-link to="#">
          <img src="../assets/Icons/profile_icon.png" alt="Profile" class="h-8 w-8 mr-5" />
        </router-link>
        <div class="dropdown-content absolute right-0 bg-dropdown-bg shadow-dropdown mt-2 rounded-lg hidden">
          <router-link to="/profile" class="block px-4 py-2 text-black">Profile</router-link>
          <router-link to="#" @click.prevent="logout" class="block px-4 py-2 text-black">Logout</router-link>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import apiClient from '../services/api';  

export default {
  name: 'NavBar',
  created() {
    this.checkUser();
  },
  methods: {
    async logout() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found in local storage');
        }
        await apiClient.post('/api/logout', {}, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        localStorage.removeItem('token');  
        localStorage.removeItem('id');  
        this.$router.push('/login'); 
      } catch (error) {
        console.error('Logout error:', error);
      }
    },
    checkUser() {
      const userId = localStorage.getItem('id');
      const token = localStorage.getItem('token');
      if (!userId || !token) {
        this.$router.push('/login');
      }
    }
  },
  mounted() {
    const dropdown = this.$el.querySelector('.profile-dropdown');
    const dropdownContent = this.$el.querySelector('.dropdown-content');

    dropdown.addEventListener('click', function(event) {
      dropdownContent.classList.toggle('hidden');
      event.stopPropagation(); 
    });

    document.addEventListener('click', function() {
      if (!dropdownContent.classList.contains('hidden')) {
        dropdownContent.classList.add('hidden');
      }
    });
  }
}
</script>

<style scoped>
.active-page {
  font-weight: bold;
  color: #FFE047;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
  border-radius: 10px;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Montserrat', Arial, sans-serif;
}

.navbar {
  width: 100%;
  height: 65px;
  background-color: #2B293D;
}

.nav-link {
  text-decoration: none;
  color: white;
  transition: color 0.4s ease-in-out;
}

.nav-link:hover {
  color: #FFE047;
  font-weight: bold;
}

.profile-dropdown {
  position: relative;
}

.dropdown-content {
  position: absolute;
  right: 0;
  background-color: #fff;
  shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
  border-radius: 10px;
  z-index: 1000; 
  width: 150px;  
}

.dropdown-content a {
  display: block;
  padding: 10px;
  color: black;
  text-decoration: none;
}

.dropdown-content a:hover {
  background-color: #f1f1f1;
}

.hidden {
  display: none;
}
</style>