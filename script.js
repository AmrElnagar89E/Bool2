// Global variables
let orders = [];

// Function to add a new order
function addOrder() {
  const tableInput = document.getElementById("tableInput");
  const hoursInput = document.getElementById("hoursInput");
  const peopleInput = document.getElementById("peopleInput");

  // Get the values from the input fields
  const table = parseInt(tableInput.value);
  const hours = parseInt(hoursInput.value);
  const people = parseInt(peopleInput.value);

  // Validate inputs
  if (isNaN(table) || isNaN(hours) || isNaN(people)) {
    alert("Please enter valid values for table, hours, and number of people.");
    return;
  }

  // Calculate finish time
  const now = new Date();
  const finishTime = new Date(now.getTime() + hours * 60 * 60 * 1000).toLocaleTimeString();

  // Calculate cost
  const cost = hours * people * 8;

  // Create a new order object
  const order = {
    orderNumber: orders.length + 1,
    tableNumber: table,
    hours: hours,
    numOfPeople: people,
    timeAdded: now.toLocaleTimeString(),
    finishTime: finishTime,
    cost: cost,
  };

  // Add the order to the orders array
  orders.push(order);

  // Clear input fields
  tableInput.value = "";
  hoursInput.value = "";
  peopleInput.value = "";

  // Render the table
  renderTable();

  // Enable the export button
  const exportButton = document.getElementById("exportButton");
  exportButton.disabled = false;
}

// Function to render the table
function renderTable() {
  const tableBody = document.getElementById("orderTableBody");
  tableBody.innerHTML = "";

  // Sort orders by order number
  orders.sort((a, b) => a.orderNumber - b.orderNumber);

  // Loop through orders and create table rows
  orders.forEach((order) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${order.orderNumber}</td>
      <td>${order.tableNumber}</td>
      <td>${order.hours}</td>
      <td>${order.numOfPeople}</td>
      <td>${order.timeAdded}</td>
      <td>${order.finishTime}</td>
      <td>$${order.cost}</td>
    `;
    tableBody.appendChild(row);
  });

  // Update total number of orders and total money
  const totalOrders = document.getElementById("totalOrders");
  totalOrders.textContent = orders.length;

  const totalMoney = document.getElementById("totalMoney");
  const totalCost = orders.reduce((total, order) => total + order.cost, 0);
  totalMoney.textContent = `$${totalCost}`;
}

// Function to export data as CSV
function exportTableData() {
  if (orders.length === 0) {
    alert("No data to export.");
    return;
  }

  const confirmed = confirm("Are you sure you want to export the data?");
  if (confirmed) {
    // Convert orders array to CSV format
    const csvContent = convertToCSV();

    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a temporary download link and trigger the download
    const currentDate = getCurrentDate();
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = `bool_${currentDate}.csv`;
    downloadLink.click();

    // Clear orders array and table
    orders = [];
    renderTable();

    // Disable the export button
    const exportButton = document.getElementById("exportButton");
    exportButton.disabled = true;
  }
}

// Function to convert orders array to CSV format
function convertToCSV() {
  const header = [
    "Order Number         ",
    "Table Number           ",
    "Hours",
    "Number of People",
    "Time Added",
    "Finish Time",
    "Cost",
  ];
  const rows = orders.map((order) => [
    order.orderNumber,
    order.tableNumber,
    order.hours,
    order.numOfPeople,
    order.timeAdded,
    order.finishTime,
    order.cost,
  ]);

  // Calculate total number of orders
  const totalOrders = orders.length;

  // Calculate total money
  const totalMoney = orders.reduce((sum, order) => sum + order.cost, 0);

  const footer = [
    `Total Orders: ${totalOrders}`,
    `\nTotal Money: $${totalMoney}`,
  ];

  const allRows = [header, ...rows, footer];
  return allRows.map((row) => row.join(",")).join("\n");
}

// Function to get the current date in YYYY-MM-DD format
function getCurrentDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Initialize the table
renderTable();
