<template>
  <div class="finance-page bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8 bg-white shadow-lg rounded-lg p-6">
        <h1 class="text-3xl font-extrabold text-gray-900 mb-4">Financial Overview</h1>
        <div class="flex items-center justify-between">
          <ProfitLabel :profit="parseFloat(calculateTotalProfit())" />
          <BarChart :chart-data="chartData" class="h-40 w-1/2" />
        </div>
      </div>

      <div class="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-900">My Events List</h2>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search events..."
              class="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div v-if="loading" class="flex justify-center items-center h-64">
            <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
          <div v-else-if="filteredEvents.length === 0" class="text-center text-gray-500 py-8">
            No events found.
          </div>
          <div v-else class="space-y-8">
            <TransitionGroup name="list" tag="div">
              <div v-for="event in filteredEvents" :key="event.id" class="bg-white shadow-md rounded-lg overflow-hidden border border-gray-200 transition duration-500 ease-in-out transform hover:scale-102 hover:shadow-lg">
                <div class="px-6 py-4 bg-gradient-to-r from-indigo-600 to-indigo-800">
                  <h3 class="text-xl font-semibold text-white">{{ event.title }}</h3>
                </div>
                <div class="p-6">
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Name</th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Price</th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Sold</th>
                          <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Sales</th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="ticket in event.tickets" :key="ticket.id">
                          <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <span v-tooltip="ticket.description">{{ ticket.ticket_name }}</span>
                          </td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RM {{ ticket.ticket_price }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ getQuantitySold(ticket.id) }}</td>
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">RM {{ calculateTotalSales(ticket) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="mt-4 flex justify-end">
                    <p class="text-lg font-semibold text-gray-900">Total: RM {{ calculateEventTotal(event) }}</p>
                  </div>
                </div>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import ProfitLabel from './ProfitLabel.vue';
import BarChart from './BarChart.vue';

export default {
  components: {
    ProfitLabel,
    BarChart
  },
  setup() {
    const userId = ref(localStorage.getItem('id'));
    const events = ref([]);
    const ticketSales = ref({});
    const loading = ref(true);
    const searchQuery = ref('');

    const filteredEvents = computed(() => {
      return events.value.filter(event => 
        event.title.toLowerCase().includes(searchQuery.value.toLowerCase())
      );
    });

    const chartData = computed(() => ({
      labels: events.value.map(event => event.title),
      datasets: [{
        label: 'Total Sales',
        data: events.value.map(event => parseFloat(calculateEventTotal(event))),
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1
      }]
    }));

    const fetchEvents = async () => {
      loading.value = true;
      try {
        const url = `http://127.0.0.1:8000/api/users/${userId.value}/createdevents`;
        const response = await fetch(url);
        events.value = await response.json();
        await fetchTicketSales();
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        loading.value = false;
      }
    };

    const fetchTicketSales = async () => {
      for (const event of events.value) {
        for (const ticket of event.tickets) {
          try {
            const url = `http://127.0.0.1:8000/api/ticketsales/ticket/${ticket.id}`;
            const response = await fetch(url);
            const data = await response.json();
            const totalSales = data.reduce((total, sale) => total + (sale.quantity * ticket.ticket_price), 0);
            setTicketSales(ticket.id, {
              totalSales: parseFloat(totalSales.toFixed(2)),
              quantitySold: calculateQuantitySold(data),
            });
          } catch (error) {
            console.error('Error fetching ticket sales:', error);
          }
        }
      }
    };

    const setTicketSales = (ticketId, salesData) => {
      ticketSales.value = {
        ...ticketSales.value,
        [ticketId]: salesData,
      };
    };

    const calculateQuantitySold = (ticketSalesData) => {
      return ticketSalesData.reduce((total, sale) => total + sale.quantity, 0);
    };

    const getQuantitySold = (ticketId) => {
      return ticketSales.value[ticketId] ? ticketSales.value[ticketId].quantitySold : 0;
    };

    const calculateTotalSales = (ticket) => {
      const totalSales = ticketSales.value[ticket.id] ? ticketSales.value[ticket.id].totalSales : 0;
      return totalSales.toFixed(2);
    };

    const calculateEventTotal = (event) => {
      return event.tickets.reduce((total, ticket) => total + parseFloat(ticketSales.value[ticket.id] ? ticketSales.value[ticket.id].totalSales : 0), 0).toFixed(2);
    };

    const calculateTotalProfit = () => {
      return events.value.reduce((total, event) => total + parseFloat(calculateEventTotal(event)), 0).toFixed(2);
    };

    fetchEvents();

    return {
      userId,
      events,
      ticketSales,
      loading,
      searchQuery,
      filteredEvents,
      chartData,
      getQuantitySold,
      calculateTotalSales,
      calculateEventTotal,
      calculateTotalProfit,
    };
  }
};
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
