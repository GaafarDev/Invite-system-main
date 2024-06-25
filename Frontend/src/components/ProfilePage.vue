<template>
  <div class="max-w-4xl mx-auto py-8">
    <h1 class="text-2xl font-semibold mb-6">My Account</h1>
    <div class="flex space-x-8">
      <aside class="w-1/4 bg-gray-100 p-4 rounded-lg">
        <ul class="space-y-4">
          <li @click="currentSection = 'accountInfo'" class="cursor-pointer hover:underline">Account Info</li>
          <li @click="currentSection = 'changeEmail'" class="cursor-pointer hover:underline">Change Email</li>
          <li @click="currentSection = 'password'" class="cursor-pointer hover:underline">Password</li>
        </ul>
      </aside>
      <main class="flex-1 bg-white p-8 rounded-lg shadow-md">
        <div v-if="loading" class="text-center">
          <div class="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div v-if="!loading">
          <div v-if="currentSection === 'accountInfo'">
            <h2 class="text-xl font-semibold mb-4">Account Information</h2>
            <div class="mb-6">
              <div class="flex items-center space-x-4 mb-4">
                <img :src="profile.pic_url || profilePicture" alt="Profile Photo" class="w-20 h-20 rounded-full">
                <input type="file" @change="onPhotoSelected" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100">
              </div>
              <form @submit.prevent="saveProfile">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Full Name</label>
                    <input v-model="profile.fullname" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Website</label>
                    <input v-model="profile.website" type="url" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Company</label>
                    <input v-model="profile.company" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                </div>
                <h3 class="text-lg font-medium mb-4">Contact Details</h3>
                <p class="text-sm text-gray-600 mb-6">These details are private and only used to contact you for ticketing or prizes.</p>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input v-model="profile.phone" type="tel" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Address</label>
                    <input v-model="profile.address" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">City</label>
                    <input v-model="profile.city" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Country</label>
                    <input v-model="profile.country" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700">Postcode</label>
                    <input v-model="profile.postcode" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                  </div>
                </div>
                <button type="submit" :disabled="isSaving" class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                  <span v-if="isSaving">Saving...</span>
                  <span v-else>Save My Profile</span>
                </button>
              </form>
            </div>
          </div>
          <div v-if="currentSection === 'changeEmail'">
            <h2 class="text-xl font-semibold mb-4">Change Email</h2>
            <form @submit.prevent="changeEmail">
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700">New Email</label>
                <input v-model="newEmail" type="email" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              </div>
              <button type="submit" :disabled="isChangingEmail" class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                <span v-if="isChangingEmail">Changing...</span>
                <span v-else>Change Email</span>
              </button>
            </form>
          </div>
          <div v-if="currentSection === 'password'">
            <h2 class="text-xl font-semibold mb-4">Change Password</h2>
            <form @submit.prevent="changePassword">
              <div class="mb-6">
                <label class="block text-sm font-medium text-gray-700">New Password</label>
                <input v-model="newPassword" type="password" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              </div>
              <button type="submit" :disabled="isChangingPassword" class="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
                <span v-if="isChangingPassword">Changing...</span>
                <span v-else>Change Password</span>
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
    <div v-if="successMessage" class="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded-md">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="fixed bottom-4 right-4 bg-red-500 text-white py-2 px-4 rounded-md">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import profilePicture from '../assets/Images/profile_picture.png';

export default {
  data() {
    return {
      currentSection: 'accountInfo',
      profilePicture,
      profile: {
        fullname: '',
        website: '',
        company: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        postcode: '',
        pic_url: ''
      },
      newEmail: '',
      newPassword: '',
      loading: true,
      isSaving: false,
      isChangingEmail: false,
      isChangingPassword: false,
      successMessage: '',
      errorMessage: ''
    };
  },
  async mounted() {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');
      
      const response = await axios.get(`https://invite-system-backend.up.railway.app/api/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      this.profile = response.data;
      this.loading = false;
    } catch (error) {
      console.error('Error fetching user data:', error);
      this.loading = false;
      this.errorMessage = 'Failed to load profile data';
      setTimeout(() => this.errorMessage = '', 3000);
    }
  },
  methods: {
    onPhotoSelected(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = e => {
          this.profile.pic_url = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    async saveProfile() {
      this.isSaving = true;
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');

        // Ensure all fields are properly initialized and formatted
        const profileData = {
          fullname: this.profile.fullname || '',
          website: this.profile.website || '',
          company: this.profile.company || '',
          phone: this.profile.phone || '',
          address: this.profile.address || '',
          city: this.profile.city || '',
          country: this.profile.country || '',
          postcode: this.profile.postcode || '',
          pic_url: this.profile.pic_url || ''
        };

        console.log('Sending profile data:', profileData);

        const response = await axios.put(`https://invite-system-backend.up.railway.app/api/users/${userId}`, profileData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        console.log('Profile saved:', response.data);
        this.successMessage = 'Profile saved successfully!';
        setTimeout(() => (this.successMessage = ''), 3000);
      } catch (error) {
        console.error('Error saving profile:', error);

        if (error.response) {
          console.error('Error response:', error.response.data);
        }

        this.errorMessage = error.response?.data?.message || 'Error saving profile!';
        setTimeout(() => (this.errorMessage = ''), 3000);
      } finally {
        this.isSaving = false;
      }
    },

    async changeEmail() {
      this.isChangingEmail = true;
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');

        const response = await axios.put(`https://invite-system-backend.up.railway.app/api/users/${userId}/email`, { email: this.newEmail }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Email changed:', response.data);
        this.successMessage = 'Email changed successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      } catch (error) {
        console.error('Error changing email:', error);
        this.errorMessage = 'Error changing email!';
        setTimeout(() => this.errorMessage = '', 3000);
      } finally {
        this.isChangingEmail = false;
      }
    },

    async changePassword() {
      this.isChangingPassword = true;
      try {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('id');

        const response = await axios.put(`https://invite-system-backend.up.railway.app/api/users/${userId}/password`, {
          password: this.newPassword
        }, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        console.log('Password changed:', response.data);
        this.successMessage = 'Password changed successfully!';
        setTimeout(() => this.successMessage = '', 3000);
      } catch (error) {
        console.error('Error changing password:', error);
        this.errorMessage = 'Error changing password!';
        setTimeout(() => this.errorMessage = '', 3000);
      } finally {
        this.isChangingPassword = false;
      }
    }
  }
};
</script>

<style scoped>
.spinner-border {
  border-top-color: #3490dc;
  border-right-color: #3490dc;
  border-bottom-color: transparent;
  border-left-color: #3490dc;
}
</style>
