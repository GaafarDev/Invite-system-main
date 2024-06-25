<template>
  <div class="finance-page">
    <ProfitLabel :profit="parseFloat(calculateTotalProfit())" />

    <h2>My Events List</h2>

    <div class="events-list">
      <div v-for="event in events" :key="event.id" class="event-card">
        <h3>{{ event.title }}</h3>
        <div>
          <table>
            <thead>
              <tr>
                <th>Ticket Name</th>
                <th>Ticket Price</th>
                <th>Quantity Sold</th>
                <th>Total Sales</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ticket in event.tickets" :key="ticket.id">
                <td>{{ ticket.ticket_name }}</td>
                <td>RM {{ ticket.ticket_price }}</td>
                <td>{{ getQuantitySold(ticket.id) }}</td>
                <td>RM {{ calculateTotalSales(ticket) }}</td>
              </tr>
            </tbody>
          </table>
          <p><strong>Total: RM {{ calculateEventTotal(event) }}</strong></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfitLabel from './ProfitLabel.vue';

export default {
  components: {
    ProfitLabel
  },
  data() {
    return {
      // userId: 1, // Replace with actual user ID
      userId: localStorage.getItem('id'),
      events: [],
      ticketSales: {}, // Store ticket sales by ticket ID with quantities and total sales
    };
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
    fetchEvents() {
      const url = `http://127.0.0.1:8000/api/users/${this.userId}/createdevents`;
      fetch(url)
        .then(response => response.json())
        .then(data => {
          this.events = data;
          this.fetchTicketSales(); // Fetch ticket sales data after events are loaded
        })
        .catch(error => {
          console.error('Error fetching events:', error);
        });
    },
    fetchTicketSales() {
      this.events.forEach(event => {
        event.tickets.forEach(ticket => {
          const url = `http://127.0.0.1:8000/api/ticketsales/ticket/${ticket.id}`;
          fetch(url)
            .then(response => response.json())
            .then(data => {
              // Calculate total sales for each ticket including quantity
              const totalSales = data.reduce((total, sale) => {
                return total + (sale.quantity * ticket.ticket_price);
              }, 0);
              // Store total sales and quantities for the ticket
              this.setTicketSales(ticket.id, {
                totalSales: parseFloat(totalSales.toFixed(2)), // Convert to number and fix to 2 decimal places
                quantitySold: this.calculateQuantitySold(data),
              });
            })
            .catch(error => {
              console.error('Error fetching ticket sales:', error);
            });
        });
      });
    },
    setTicketSales(ticketId, salesData) {
      this.ticketSales = {
        ...this.ticketSales,
        [ticketId]: salesData,
      };
    },
    calculateQuantitySold(ticketSalesData) {
      return ticketSalesData.reduce((total, sale) => {
        return total + sale.quantity;
      }, 0);
    },
    getQuantitySold(ticketId) {
      return this.ticketSales[ticketId] ? this.ticketSales[ticketId].quantitySold : 0;
    },
    calculateTotalSales(ticket) {
      const totalSales = this.ticketSales[ticket.id] ? this.ticketSales[ticket.id].totalSales : 0;
      return totalSales.toFixed(2); // Ensure total sales is formatted to 2 decimal places
    },
    calculateEventTotal(event) {
      return event.tickets.reduce((total, ticket) => {
        return total + parseFloat(this.ticketSales[ticket.id] ? this.ticketSales[ticket.id].totalSales : 0);
      }, 0).toFixed(2); // Ensure event total is formatted to 2 decimal places
    },
    calculateTotalProfit() {
      return this.events.reduce((total, event) => {
        return total + parseFloat(this.calculateEventTotal(event));
      }, 0).toFixed(2); // Ensure total profit is formatted to 2 decimal places
    },
  },
};
</script>

<style scoped>
.finance-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px; /* Add margin-top to create space from the navbar */
}

.events-list {
  width: 70%;
  margin-top: 20px;
}

.event-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 20px;
}

h2, h3 {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
}

th {
  background-color: #f2f2f2;
}
</style>
