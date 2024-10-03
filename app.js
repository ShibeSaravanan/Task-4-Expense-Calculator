// Array to store entries (income and expenses)
let entries = [];

// Get references to DOM elements
const form = document.getElementById('entry-form');
const tbody = document.getElementById('entries-tbody');
const filterRadios = document.querySelectorAll('input[name="filter"]');

// Totals display elements
const totalIncomeDisplay = document.getElementById('total-income');
const totalExpensesDisplay = document.getElementById('total-expenses');
const balanceDisplay = document.getElementById('balance');

// Hidden field to store index of entry being edited
const editIndex = document.getElementById('edit-index');
const submitButton = document.getElementById('submit-button');
const resetButton = document.getElementById('reset-button');

// Event listener for form submission (add or edit entry)
form.addEventListener('submit', function(event) {
    event.preventDefault();

    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;

    const entry = { type, description, amount: parseFloat(amount) };

    // Check if we are in edit mode
    const index = editIndex.value;

    if (index === "-1") {
        // Add new entry
        entries.push(entry);
    } else {
        // Edit existing entry
        entries[index] = entry;
        editIndex.value = "-1";  // Reset the hidden field
        submitButton.textContent = "Add Entry";  // Change button back to "Add Entry"
    }

    form.reset();

    // Display updated entries and recalculate totals
    displayEntries(entries);
    calculateTotals(entries);
});

// Event listener for reset button
resetButton.addEventListener('click', function() {
    // Reset the form fields
    form.reset();

    // Reset to add mode if the form was in edit mode
    editIndex.value = "-1";
    submitButton.textContent = "Add Entry";
});

// Event listener for radio button filter change
filterRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        const selectedFilter = this.value;

        // Filter entries based on the selected radio button value
        if (selectedFilter === 'all') {
            displayEntries(entries);
        } else {
            const filteredEntries = entries.filter(entry => entry.type === selectedFilter);
            displayEntries(filteredEntries);
        }

        // Recalculate totals based on the filtered view
        calculateTotals(entries);
    });
});

// Function to display entries in the table
function displayEntries(entriesToDisplay) {
    // Clear the existing table rows
    tbody.innerHTML = '';

    // Loop through the entries and add them as table rows
    entriesToDisplay.forEach((entry, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="color: #392F5A">${entry.type}</td>
            <td style="color: #392F5A">${entry.description}</td>
            <td style="color: #392F5A">${entry.amount.toFixed(2)}</td>
            <td style="color: #392F5A">
                <button onclick="editEntry(${index})" id="edt"><i class="fa-regular fa-pen-to-square" style="color: #9dd9d2;"></i> Edit</button>
                <button onclick="deleteEntry(${index})" id="del"><i class="fa-regular fa-trash-can" style="color: #ff8811;"></i> Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Function to calculate and display totals
function calculateTotals(entries) {
    let totalIncome = 0;
    let totalExpenses = 0;

    // Calculate the total income and expenses
    entries.forEach(entry => {
        if (entry.type === 'income') {
            totalIncome += entry.amount;
        } else if (entry.type === 'expense') {
            totalExpenses += entry.amount;
        }
    });

    // Calculate the balance (income - expenses)
    const balance = totalIncome - totalExpenses;

    // Update the DOM with the totals
    totalIncomeDisplay.textContent = totalIncome.toFixed(2);
    totalExpensesDisplay.textContent = totalExpenses.toFixed(2);
    balanceDisplay.textContent = balance.toFixed(2);
}

// Function to delete an entry
function deleteEntry(index) {
    // Remove the entry from the array
    entries.splice(index, 1);

    // Re-display entries and recalculate totals
    displayEntries(entries);
    calculateTotals(entries);
}

// Function to edit an entry
function editEntry(index) {
    // Fill the form with the selected entry's data
    const entry = entries[index];
    document.getElementById('type').value = entry.type;
    document.getElementById('description').value = entry.description;
    document.getElementById('amount').value = entry.amount;

    // Set the index in the hidden field to indicate we are editing
    editIndex.value = index;

    // Change the form button to "Update Entry"
    submitButton.textContent = "Update Entry";
}
