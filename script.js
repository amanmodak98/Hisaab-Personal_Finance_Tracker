// Local Storage Keys
const CREDITS_KEY = 'hisaab_credits';
const EXPENSES_KEY = 'hisaab_expenses';
const UDHAAR_KEY = 'hisaab_udhaar';
const CONTACTS_KEY = 'hisaab_contacts';
const THEME_KEY = 'hisaab_theme';

// Data Arrays
let credits = [];
let expenses = [];
let udhaar = [];
let contacts = [];

// Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');
    
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    updateThemeIcon(newTheme);
    
    // Add a smooth transition effect
    document.documentElement.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.documentElement.style.transition = '';
    }, 300);
}

function updateThemeIcon(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    if (themeIcon) {
        themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// DOM Elements
const creditForm = document.getElementById('creditForm');
const expenseForm = document.getElementById('expenseForm');
const udhaarForm = document.getElementById('udhaarForm');
const creditsTableBody = document.getElementById('creditsTableBody');
const expensesTableBody = document.getElementById('expensesTableBody');
const udhaarHistoryTableBody = document.getElementById('udhaarHistoryTableBody');
const totalCreditsEl = document.getElementById('totalCredits');
const totalExpensesEl = document.getElementById('totalExpenses');
const balanceEl = document.getElementById('balance');
const totalUdhaarGivenEl = document.getElementById('totalUdhaarGiven');
const totalUdhaarTakenEl = document.getElementById('totalUdhaarTaken');
const netUdhaarEl = document.getElementById('netUdhaar');
const personSummaryEl = document.getElementById('personSummary');
const personFilterEl = document.getElementById('personFilter');
const typeFilterEl = document.getElementById('typeFilter');
// Date filter elements
const creditStartDateEl = document.getElementById('creditStartDate');
const creditEndDateEl = document.getElementById('creditEndDate');
const expenseStartDateEl = document.getElementById('expenseStartDate');
const expenseEndDateEl = document.getElementById('expenseEndDate');
const udhaarStartDateEl = document.getElementById('udhaarStartDate');
const udhaarEndDateEl = document.getElementById('udhaarEndDate');

// Contact Management DOM Elements
const addContactForm = document.getElementById('addContactForm');
const contactsList = document.getElementById('contactsList');
const contactModal = document.getElementById('contactModal');
const editContactModal = document.getElementById('editContactModal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeTheme();
    loadData();
    setupEventListeners();
    updateSummary();
    renderTables();
    updatePersonFilter();
    renderContacts();
    
    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('creditDate').value = today;
    document.getElementById('expenseDate').value = today;
    document.getElementById('udhaarDate').value = today;
    
    // Setup theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});

// Setup Event Listeners
function setupEventListeners() {
    creditForm.addEventListener('submit', handleCreditSubmit);
    expenseForm.addEventListener('submit', handleExpenseSubmit);
    if (udhaarForm) {
        udhaarForm.addEventListener('submit', handleUdhaarSubmit);
    }
    
    // Edit form listener
    document.getElementById('editForm').addEventListener('submit', handleEditSubmit);
    
    // Contact management listeners
    addContactForm.addEventListener('submit', handleAddContact);
    document.getElementById('editContactForm').addEventListener('submit', handleEditContact);
    document.getElementById('contactTransactionForm').addEventListener('submit', handleContactTransaction);
    
    // Quick action buttons
    document.getElementById('lentMoneyBtn').addEventListener('click', () => showTransactionForm('given'));
    document.getElementById('borrowedMoneyBtn').addEventListener('click', () => showTransactionForm('taken'));
    document.getElementById('receivedBackBtn').addEventListener('click', () => showTransactionForm('received_back'));
    document.getElementById('paidBackBtn').addEventListener('click', () => showTransactionForm('paid_back'));
    
    // Contact actions
    document.getElementById('editContactBtn').addEventListener('click', showEditContactModal);
    document.getElementById('deleteContactBtn').addEventListener('click', deleteCurrentContact);
    
    // Filter event listeners
    if (personFilterEl) {
        personFilterEl.addEventListener('change', filterUdhaarTransactions);
    }
    if (typeFilterEl) {
        typeFilterEl.addEventListener('change', filterUdhaarTransactions);
    }
    // Date range listeners
    if (creditStartDateEl) creditStartDateEl.addEventListener('change', renderCreditsTable);
    if (creditEndDateEl) creditEndDateEl.addEventListener('change', renderCreditsTable);
    if (expenseStartDateEl) expenseStartDateEl.addEventListener('change', renderExpensesTable);
    if (expenseEndDateEl) expenseEndDateEl.addEventListener('change', renderExpensesTable);
    if (udhaarStartDateEl) udhaarStartDateEl.addEventListener('change', renderUdhaarHistoryTable);
    if (udhaarEndDateEl) udhaarEndDateEl.addEventListener('change', renderUdhaarHistoryTable);
    const clearFiltersBtn = document.getElementById('clearFilters');
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearFilters);
    }
    const clearCreditDateBtn = document.getElementById('clearCreditDateFilters');
    if (clearCreditDateBtn) clearCreditDateBtn.addEventListener('click', clearCreditDateFilters);
    const clearExpenseDateBtn = document.getElementById('clearExpenseDateFilters');
    if (clearExpenseDateBtn) clearExpenseDateBtn.addEventListener('click', clearExpenseDateFilters);
    
    // Data management buttons
    document.getElementById('exportData').addEventListener('click', exportData);
    document.getElementById('importData').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', importData);
    document.getElementById('clearData').addEventListener('click', clearAllData);
}

// Handle Credit Form Submission
function handleCreditSubmit(e) {
    e.preventDefault();
    
    const date = document.getElementById('creditDate').value;
    const amount = parseFloat(document.getElementById('creditAmount').value);
    const from = document.getElementById('creditFrom').value.trim();
    
    if (!date || !amount || !from || amount <= 0) {
        alert('Please fill in all fields with valid data!');
        return;
    }
    
    const credit = {
        id: Date.now(),
        date: date,
        amount: amount,
        from: from,
        timestamp: new Date().toISOString()
    };
    
    credits.push(credit);
    saveData();
    updateSummary();
    renderCreditsTable();
    creditForm.reset();
    
    // Reset date to today
    document.getElementById('creditDate').value = new Date().toISOString().split('T')[0];
    
    showNotification('Credit added successfully!', 'success');
}

// Handle Expense Form Submission
function handleExpenseSubmit(e) {
    e.preventDefault();
    
    const date = document.getElementById('expenseDate').value;
    const purpose = document.getElementById('expensePurpose').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    
    if (!date || !purpose || !amount || amount <= 0) {
        alert('Please fill in all fields with valid data!');
        return;
    }
    
    const expense = {
        id: Date.now(),
        date: date,
        purpose: purpose,
        amount: amount,
        timestamp: new Date().toISOString()
    };
    
    expenses.push(expense);
    saveData();
    updateSummary();
    renderExpensesTable();
    expenseForm.reset();
    
    // Reset date to today
    document.getElementById('expenseDate').value = new Date().toISOString().split('T')[0];
    
    showNotification('Expense added successfully!', 'success');
}

// Handle Udhaar Form Submission
function handleUdhaarSubmit(e) {
    e.preventDefault();
    
    const date = document.getElementById('udhaarDate').value;
    const type = document.getElementById('udhaarType').value;
    const person = document.getElementById('udhaarPerson').value.trim();
    const amount = parseFloat(document.getElementById('udhaarAmount').value);
    const purpose = document.getElementById('udhaarPurpose').value.trim();
    
    if (!date || !type || !person || !amount || !purpose || amount <= 0) {
        alert('Please fill in all fields with valid data!');
        return;
    }
    
    const udhaarEntry = {
        id: Date.now(),
        date: date,
        type: type, // 'given', 'taken', 'received_back', 'paid_back'
        person: person.toLowerCase(), // Store in lowercase for consistency
        personDisplay: person, // Store original case for display
        amount: amount,
        purpose: purpose,
        timestamp: new Date().toISOString()
    };
    
    udhaar.push(udhaarEntry);
    saveData();
    updateSummary();
    renderTables();
    updatePersonFilter();
    udhaarForm.reset();
    
    // Reset date to today
    document.getElementById('udhaarDate').value = new Date().toISOString().split('T')[0];
    
    const typeMessages = {
        'given': 'Money lent successfully!',
        'taken': 'Money borrowed recorded!',
        'received_back': 'Money received back recorded!',
        'paid_back': 'Payment back recorded!'
    };
    
    showNotification(typeMessages[type], 'success');
}

// Delete Credit
function deleteCredit(id) {
    if (confirm('Are you sure you want to delete this credit?')) {
        credits = credits.filter(credit => credit.id !== id);
        saveData();
        updateSummary();
        renderCreditsTable();
        showNotification('Credit deleted successfully!', 'success');
    }
}

// Delete Expense
function deleteExpense(id) {
    if (confirm('Are you sure you want to delete this expense?')) {
        expenses = expenses.filter(expense => expense.id !== id);
        saveData();
        updateSummary();
        renderExpensesTable();
        showNotification('Expense deleted successfully!', 'success');
    }
}

// Delete Udhaar
function deleteUdhaar(id) {
    if (confirm('Are you sure you want to delete this udhaar transaction?')) {
        udhaar = udhaar.filter(entry => entry.id !== id);
        saveData();
        updateSummary();
        renderTables();
        updatePersonFilter();
        showNotification('Udhaar transaction deleted successfully!', 'success');
    }
}

// Contact Management Functions
let currentContactId = null;

function handleAddContact(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value.trim();
    const phone = document.getElementById('contactPhone').value.trim();
    
    if (!name) {
        alert('Please enter a contact name!');
        return;
    }
    
    // Check if contact already exists
    const existingContact = contacts.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (existingContact) {
        alert('A contact with this name already exists!');
        return;
    }
    
    const contact = {
        id: Date.now(),
        name: name,
        phone: phone || '',
        createdAt: new Date().toISOString()
    };
    
    contacts.push(contact);
    saveData();
    renderContacts();
    addContactForm.reset();
    showNotification('Contact added successfully!', 'success');
}

function renderContacts() {
    if (contacts.length === 0) {
        contactsList.innerHTML = '<div class="no-contacts">No contacts added yet. Add your first contact above!</div>';
        return;
    }
    
    contactsList.innerHTML = contacts.map(contact => {
        const balance = calculateContactBalance(contact.id);
        const balanceClass = balance > 0 ? 'owes-you' : (balance < 0 ? 'you-owe' : 'settled');
        const balanceText = balance > 0 ? 
            `Owes you ₹${Math.abs(balance).toLocaleString('en-IN', {minimumFractionDigits: 2})}` :
            balance < 0 ? 
            `You owe ₹${Math.abs(balance).toLocaleString('en-IN', {minimumFractionDigits: 2})}` :
            'Settled';
        
        const initials = contact.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        
        return `
            <div class="contact-card" onclick="openContactModal(${contact.id})">
                <div class="contact-header">
                    <div class="contact-avatar">
                        <span>${initials}</span>
                    </div>
                    <div>
                        <div class="contact-name">${contact.name}</div>
                        ${contact.phone ? `<div class="contact-phone">${contact.phone}</div>` : ''}
                    </div>
                </div>
                <div class="contact-balance ${balanceClass}">
                    ${balanceText}
                </div>
            </div>
        `;
    }).join('');
}

function calculateContactBalance(contactId) {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return 0;
    
    const contactTransactions = udhaar.filter(u => u.person === contact.name.toLowerCase());
    
    let balance = 0;
    contactTransactions.forEach(transaction => {
        switch (transaction.type) {
            case 'given':
                balance += transaction.amount; // They owe you
                break;
            case 'taken':
                balance -= transaction.amount; // You owe them
                break;
            case 'received_back':
                balance -= transaction.amount; // They paid you back
                break;
            case 'paid_back':
                balance += transaction.amount; // You paid them back
                break;
        }
    });
    
    return balance;
}

function openContactModal(contactId) {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;
    
    currentContactId = contactId;
    const balance = calculateContactBalance(contactId);
    const initials = contact.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    
    // Update modal content
    document.getElementById('contactModalTitle').textContent = contact.name;
    document.getElementById('contactInitials').textContent = initials;
    document.getElementById('contactDisplayName').textContent = contact.name;
    document.getElementById('contactDisplayPhone').textContent = contact.phone || 'No phone number';
    
    const balanceEl = document.getElementById('contactBalance');
    const balanceTextEl = document.getElementById('contactBalanceText');
    
    if (balance > 0) {
        balanceEl.textContent = `₹${balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;
        balanceEl.className = 'balance-amount credit-amount';
        balanceTextEl.textContent = 'owes you';
    } else if (balance < 0) {
        balanceEl.textContent = `₹${Math.abs(balance).toLocaleString('en-IN', {minimumFractionDigits: 2})}`;
        balanceEl.className = 'balance-amount expense-amount';
        balanceTextEl.textContent = 'you owe';
    } else {
        balanceEl.textContent = '₹0.00';
        balanceEl.className = 'balance-amount neutral';
        balanceTextEl.textContent = 'Settled';
    }
    
    // Render transaction history
    renderContactTransactionHistory(contactId);
    
    // Show modal
    contactModal.style.display = 'block';
}

function closeContactModal() {
    contactModal.style.display = 'none';
    hideTransactionForm();
    currentContactId = null;
}

function showTransactionForm(type) {
    const form = document.getElementById('transactionForm');
    const title = document.getElementById('transactionFormTitle');
    
    const typeNames = {
        'given': 'You Lent Money',
        'taken': 'You Borrowed Money',
        'received_back': 'You Received Money Back',
        'paid_back': 'You Paid Money Back'
    };
    
    title.textContent = typeNames[type];
    document.getElementById('transactionContactId').value = currentContactId;
    document.getElementById('transactionType').value = type;
    document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
    
    form.style.display = 'block';
    document.getElementById('transactionAmount').focus();
}

function hideTransactionForm() {
    document.getElementById('transactionForm').style.display = 'none';
    document.getElementById('contactTransactionForm').reset();
}

function handleContactTransaction(e) {
    e.preventDefault();
    
    const contactId = parseInt(document.getElementById('transactionContactId').value);
    const type = document.getElementById('transactionType').value;
    const date = document.getElementById('transactionDate').value;
    const amount = parseFloat(document.getElementById('transactionAmount').value);
    const purpose = document.getElementById('transactionPurpose').value.trim();
    
    if (!date || !amount || !purpose || amount <= 0) {
        alert('Please fill in all fields with valid data!');
        return;
    }
    
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) {
        alert('Contact not found!');
        return;
    }
    
    const udhaarEntry = {
        id: Date.now(),
        date: date,
        type: type,
        person: contact.name.toLowerCase(),
        personDisplay: contact.name,
        amount: amount,
        purpose: purpose,
        timestamp: new Date().toISOString()
    };
    
    udhaar.push(udhaarEntry);
    saveData();
    updateSummary();
    renderTables();
    updatePersonFilter();
    renderContacts();
    
    // Update modal content
    openContactModal(contactId);
    hideTransactionForm();
    
    const typeMessages = {
        'given': 'Money lent recorded successfully!',
        'taken': 'Money borrowed recorded successfully!',
        'received_back': 'Money received back recorded!',
        'paid_back': 'Payment back recorded!'
    };
    
    showNotification(typeMessages[type], 'success');
}

function renderContactTransactionHistory(contactId) {
    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return;
    
    const contactTransactions = udhaar
        .filter(u => u.person === contact.name.toLowerCase())
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    const historyEl = document.getElementById('contactTransactionHistory');
    
    if (contactTransactions.length === 0) {
        historyEl.innerHTML = '<div class="no-data">No transactions yet with this contact.</div>';
        return;
    }
    
    historyEl.innerHTML = contactTransactions.map(transaction => {
        const typeText = {
            'given': 'You Lent',
            'taken': 'You Borrowed',
            'received_back': 'You Received Back',
            'paid_back': 'You Paid Back'
        }[transaction.type];
        
        return `
            <div class="transaction-item">
                <div class="transaction-left">
                    <div class="transaction-type ${transaction.type}">${typeText}</div>
                    <div class="transaction-purpose">${transaction.purpose}</div>
                    <div class="transaction-date">${formatDate(transaction.date)}</div>
                </div>
                <div class="transaction-right">
                    <div class="transaction-amount">₹${transaction.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                    <div class="transaction-actions">
                        <button class="edit-btn" onclick="editUdhaar(${transaction.id})">Edit</button>
                        <button class="delete-btn" onclick="deleteUdhaar(${transaction.id})">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function showEditContactModal() {
    const contact = contacts.find(c => c.id === currentContactId);
    if (!contact) return;
    
    document.getElementById('editContactId').value = contact.id;
    document.getElementById('editContactName').value = contact.name;
    document.getElementById('editContactPhone').value = contact.phone;
    
    editContactModal.style.display = 'block';
}

function closeEditContactModal() {
    editContactModal.style.display = 'none';
}

function handleEditContact(e) {
    e.preventDefault();
    
    const contactId = parseInt(document.getElementById('editContactId').value);
    const newName = document.getElementById('editContactName').value.trim();
    const newPhone = document.getElementById('editContactPhone').value.trim();
    
    if (!newName) {
        alert('Please enter a contact name!');
        return;
    }
    
    const contactIndex = contacts.findIndex(c => c.id === contactId);
    if (contactIndex === -1) {
        alert('Contact not found!');
        return;
    }
    
    const oldName = contacts[contactIndex].name;
    
    // Update contact
    contacts[contactIndex].name = newName;
    contacts[contactIndex].phone = newPhone;
    
    // Update all related udhaar transactions
    udhaar.forEach(transaction => {
        if (transaction.person === oldName.toLowerCase()) {
            transaction.person = newName.toLowerCase();
            transaction.personDisplay = newName;
        }
    });
    
    saveData();
    renderContacts();
    updatePersonFilter();
    renderTables();
    closeEditContactModal();
    closeContactModal();
    
    showNotification('Contact updated successfully!', 'success');
}

function deleteCurrentContact() {
    if (!currentContactId) return;
    
    const contact = contacts.find(c => c.id === currentContactId);
    if (!contact) return;
    
    const hasTransactions = udhaar.some(u => u.person === contact.name.toLowerCase());
    
    if (hasTransactions) {
        if (!confirm(`This contact has transaction history. Deleting will also remove all transactions with ${contact.name}. Are you sure?`)) {
            return;
        }
        
        // Remove all transactions for this contact
        udhaar = udhaar.filter(u => u.person !== contact.name.toLowerCase());
    } else {
        if (!confirm(`Are you sure you want to delete ${contact.name}?`)) {
            return;
        }
    }
    
    // Remove contact
    contacts = contacts.filter(c => c.id !== currentContactId);
    
    saveData();
    renderContacts();
    updatePersonFilter();
    renderTables();
    updateSummary();
    closeContactModal();
    
    showNotification('Contact deleted successfully!', 'success');
}

// Edit Functions
function editCredit(id) {
    const credit = credits.find(c => c.id === id);
    if (!credit) return;
    
    showEditModal('credit', credit);
}

function editExpense(id) {
    const expense = expenses.find(e => e.id === id);
    if (!expense) return;
    
    showEditModal('expense', expense);
}

function editUdhaar(id) {
    const udhaarEntry = udhaar.find(u => u.id === id);
    if (!udhaarEntry) return;
    
    showEditModal('udhaar', udhaarEntry);
}

function showEditModal(type, entry) {
    const modal = document.getElementById('editModal');
    const modalTitle = document.getElementById('modalTitle');
    const editEntryId = document.getElementById('editEntryId');
    const editEntryType = document.getElementById('editEntryType');
    const editDate = document.getElementById('editDate');
    const editAmount = document.getElementById('editAmount');
    
    // Hide all fields initially
    document.getElementById('editFromRow').style.display = 'none';
    document.getElementById('editPurposeRow').style.display = 'none';
    document.getElementById('editPersonRow').style.display = 'none';
    document.getElementById('editUdhaarTypeRow').style.display = 'none';
    
    // Set common values
    editEntryId.value = entry.id;
    editEntryType.value = type;
    editDate.value = entry.date;
    editAmount.value = entry.amount;
    
    // Configure modal based on entry type
    switch (type) {
        case 'credit':
            modalTitle.textContent = 'Edit Credit';
            document.getElementById('editFromRow').style.display = 'flex';
            document.getElementById('editFrom').value = entry.from;
            break;
            
        case 'expense':
            modalTitle.textContent = 'Edit Expense';
            document.getElementById('editPurposeRow').style.display = 'flex';
            document.getElementById('editPurpose').value = entry.purpose;
            break;
            
        case 'udhaar':
            modalTitle.textContent = 'Edit Udhaar Transaction';
            document.getElementById('editPersonRow').style.display = 'flex';
            document.getElementById('editPurposeRow').style.display = 'flex';
            document.getElementById('editUdhaarTypeRow').style.display = 'flex';
            document.getElementById('editPerson').value = entry.personDisplay;
            document.getElementById('editPurpose').value = entry.purpose;
            document.getElementById('editUdhaarType').value = entry.type;
            break;
    }
    
    modal.style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

function handleEditSubmit(e) {
    e.preventDefault();
    
    const entryId = parseInt(document.getElementById('editEntryId').value);
    const entryType = document.getElementById('editEntryType').value;
    const editDate = document.getElementById('editDate').value;
    const editAmount = parseFloat(document.getElementById('editAmount').value);
    
    if (!editDate || !editAmount || editAmount <= 0) {
        alert('Please provide valid date and amount!');
        return;
    }
    
    switch (entryType) {
        case 'credit':
            updateCredit(entryId, editDate, editAmount, document.getElementById('editFrom').value.trim());
            break;
        case 'expense':
            updateExpense(entryId, editDate, editAmount, document.getElementById('editPurpose').value.trim());
            break;
        case 'udhaar':
            updateUdhaar(entryId, editDate, editAmount, 
                        document.getElementById('editPerson').value.trim(),
                        document.getElementById('editPurpose').value.trim(),
                        document.getElementById('editUdhaarType').value);
            break;
    }
}

function updateCredit(id, date, amount, from) {
    if (!from) {
        alert('Please provide "From whom" information!');
        return;
    }
    
    const creditIndex = credits.findIndex(c => c.id === id);
    if (creditIndex !== -1) {
        credits[creditIndex] = {
            ...credits[creditIndex],
            date: date,
            amount: amount,
            from: from
        };
        
        saveData();
        updateSummary();
        renderTables();
        closeEditModal();
        showNotification('Credit updated successfully!', 'success');
    }
}

function updateExpense(id, date, amount, purpose) {
    if (!purpose) {
        alert('Please provide expense purpose!');
        return;
    }
    
    const expenseIndex = expenses.findIndex(e => e.id === id);
    if (expenseIndex !== -1) {
        expenses[expenseIndex] = {
            ...expenses[expenseIndex],
            date: date,
            amount: amount,
            purpose: purpose
        };
        
        saveData();
        updateSummary();
        renderTables();
        closeEditModal();
        showNotification('Expense updated successfully!', 'success');
    }
}

function updateUdhaar(id, date, amount, person, purpose, type) {
    if (!person || !purpose || !type) {
        alert('Please fill in all required fields!');
        return;
    }
    
    const udhaarIndex = udhaar.findIndex(u => u.id === id);
    if (udhaarIndex !== -1) {
        udhaar[udhaarIndex] = {
            ...udhaar[udhaarIndex],
            date: date,
            amount: amount,
            person: person.toLowerCase(),
            personDisplay: person,
            purpose: purpose,
            type: type
        };
        
        saveData();
        updateSummary();
        renderTables();
        updatePersonFilter();
        closeEditModal();
        showNotification('Udhaar transaction updated successfully!', 'success');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const editModal = document.getElementById('editModal');
    const contactModal = document.getElementById('contactModal');
    const editContactModal = document.getElementById('editContactModal');
    
    if (event.target === editModal) {
        closeEditModal();
    }
    
    if (event.target === contactModal) {
        closeContactModal();
    }
    
    if (event.target === editContactModal) {
        closeEditContactModal();
    }
}

// Render Credits Table
function renderCreditsTable() {
    if (credits.length === 0) {
        creditsTableBody.innerHTML = '<tr><td colspan="4" class="no-data">No credits recorded yet. Add your first credit above!</td></tr>';
        return;
    }
    
    // Filter by date range if provided
    let filtered = [...credits];
    if (creditStartDateEl && creditStartDateEl.value) {
        const start = new Date(creditStartDateEl.value);
        filtered = filtered.filter(c => new Date(c.date) >= start);
    }
    if (creditEndDateEl && creditEndDateEl.value) {
        const end = new Date(creditEndDateEl.value);
        end.setHours(23,59,59,999);
        filtered = filtered.filter(c => new Date(c.date) <= end);
    }
    if (filtered.length === 0) {
        creditsTableBody.innerHTML = '<tr><td colspan="4" class="no-data">No credits in this date range.</td></tr>';
        return;
    }
    // Sort credits by date (newest first)
    const sortedCredits = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    creditsTableBody.innerHTML = sortedCredits.map(credit => `
        <tr>
            <td>${formatDate(credit.date)}</td>
            <td class="credit-amount">₹${credit.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
            <td>${credit.from}</td>
            <td>
                <button class="edit-btn" onclick="editCredit(${credit.id})">Edit</button>
                <button class="delete-btn" onclick="deleteCredit(${credit.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Render Expenses Table
function renderExpensesTable() {
    if (expenses.length === 0) {
        expensesTableBody.innerHTML = '<tr><td colspan="4" class="no-data">No expenses recorded yet. Add your first expense above!</td></tr>';
        return;
    }
    
    // Filter by date range if provided
    let filtered = [...expenses];
    if (expenseStartDateEl && expenseStartDateEl.value) {
        const start = new Date(expenseStartDateEl.value);
        filtered = filtered.filter(c => new Date(c.date) >= start);
    }
    if (expenseEndDateEl && expenseEndDateEl.value) {
        const end = new Date(expenseEndDateEl.value);
        end.setHours(23,59,59,999);
        filtered = filtered.filter(c => new Date(c.date) <= end);
    }
    if (filtered.length === 0) {
        expensesTableBody.innerHTML = '<tr><td colspan="4" class="no-data">No expenses in this date range.</td></tr>';
        return;
    }
    // Sort expenses by date (newest first)
    const sortedExpenses = filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    expensesTableBody.innerHTML = sortedExpenses.map(expense => `
        <tr>
            <td>${formatDate(expense.date)}</td>
            <td>${expense.purpose}</td>
            <td class="expense-amount">₹${expense.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
            <td>
                <button class="edit-btn" onclick="editExpense(${expense.id})">Edit</button>
                <button class="delete-btn" onclick="deleteExpense(${expense.id})">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Calculate Person-wise Balances
function calculatePersonBalances() {
    const personBalances = {};
    
    // Sort transactions by date to calculate running balances
    const sortedTransactions = [...udhaar].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sortedTransactions.forEach(transaction => {
        const person = transaction.person;
        
        if (!personBalances[person]) {
            personBalances[person] = {
                name: transaction.personDisplay,
                totalGiven: 0,
                totalTaken: 0,
                totalReceivedBack: 0,
                totalPaidBack: 0,
                netBalance: 0,
                transactions: []
            };
        }
        
        const personData = personBalances[person];
        
        switch (transaction.type) {
            case 'given':
                personData.totalGiven += transaction.amount;
                break;
            case 'taken':
                personData.totalTaken += transaction.amount;
                break;
            case 'received_back':
                personData.totalReceivedBack += transaction.amount;
                break;
            case 'paid_back':
                personData.totalPaidBack += transaction.amount;
                break;
        }
        
        // Calculate net balance
        // Positive means they owe you money
        // Negative means you owe them money
        personData.netBalance = (personData.totalGiven - personData.totalReceivedBack) - 
                                (personData.totalTaken - personData.totalPaidBack);
        
        personData.transactions.push(transaction);
    });
    
    return personBalances;
}

// Render Person Summary
function renderPersonSummary() {
    const personBalances = calculatePersonBalances();
    const people = Object.keys(personBalances);
    
    if (people.length === 0) {
        personSummaryEl.innerHTML = '<div class="no-data">No udhaar transactions yet. Add your first udhaar transaction above!</div>';
        return;
    }
    
    personSummaryEl.innerHTML = people.map(person => {
        const data = personBalances[person];
        const balanceClass = data.netBalance > 0 ? 'credit-amount' : (data.netBalance < 0 ? 'expense-amount' : 'neutral');
        const balanceText = data.netBalance > 0 ? 
            `owes you ₹${Math.abs(data.netBalance).toLocaleString('en-IN', {minimumFractionDigits: 2})}` :
            data.netBalance < 0 ? 
            `you owe ₹${Math.abs(data.netBalance).toLocaleString('en-IN', {minimumFractionDigits: 2})}` :
            'Settled (₹0.00)';
        
        return `
            <div class="person-card">
                <div class="person-header">
                    <h3>${data.name}</h3>
                    <div class="person-balance ${balanceClass}">
                        ${balanceText}
                    </div>
                </div>
                <div class="person-details">
                    <div class="person-stat">
                        <span class="stat-label">Total Given:</span>
                        <span class="stat-value">₹${data.totalGiven.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="person-stat">
                        <span class="stat-label">Total Taken:</span>
                        <span class="stat-value">₹${data.totalTaken.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="person-stat">
                        <span class="stat-label">Received Back:</span>
                        <span class="stat-value">₹${data.totalReceivedBack.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                    </div>
                    <div class="person-stat">
                        <span class="stat-label">Paid Back:</span>
                        <span class="stat-value">₹${data.totalPaidBack.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Render Udhaar History Table
function renderUdhaarHistoryTable() {
    const currentPersonFilter = personFilterEl.value;
    const currentTypeFilter = typeFilterEl.value;
    
    let filteredUdhaar = [...udhaar];
    
    // Apply person filter
    if (currentPersonFilter !== 'all') {
        filteredUdhaar = filteredUdhaar.filter(entry => entry.person === currentPersonFilter);
    }
    
    // Apply type filter
    if (currentTypeFilter !== 'all') {
        filteredUdhaar = filteredUdhaar.filter(entry => entry.type === currentTypeFilter);
    }
    // Apply date range filter
    if (udhaarStartDateEl && udhaarStartDateEl.value) {
        const start = new Date(udhaarStartDateEl.value);
        filteredUdhaar = filteredUdhaar.filter(e => new Date(e.date) >= start);
    }
    if (udhaarEndDateEl && udhaarEndDateEl.value) {
        const end = new Date(udhaarEndDateEl.value);
        end.setHours(23,59,59,999);
        filteredUdhaar = filteredUdhaar.filter(e => new Date(e.date) <= end);
    }
    
    if (filteredUdhaar.length === 0) {
        const noDataMessage = currentPersonFilter !== 'all' || currentTypeFilter !== 'all' ? 
            'No transactions match the current filters.' : 
            'No udhaar transactions yet. Add your first udhaar transaction above!';
        udhaarHistoryTableBody.innerHTML = `<tr><td colspan="6" class="no-data">${noDataMessage}</td></tr>`;
        return;
    }
    
    // Sort udhaar by date (newest first)
    const sortedUdhaar = filteredUdhaar.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    udhaarHistoryTableBody.innerHTML = sortedUdhaar.map(entry => {
        const typeText = {
            'given': 'Money Lent',
            'taken': 'Money Borrowed',
            'received_back': 'Received Back',
            'paid_back': 'Paid Back'
        }[entry.type];
        
        const typeClass = {
            'given': 'udhaar-given',
            'taken': 'udhaar-taken',
            'received_back': 'udhaar-received',
            'paid_back': 'udhaar-paid'
        }[entry.type];
        
        return `
            <tr>
                <td>${formatDate(entry.date)}</td>
                <td>${entry.personDisplay}</td>
                <td class="${typeClass}">${typeText}</td>
                <td class="${typeClass}">₹${entry.amount.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                <td>${entry.purpose}</td>
                <td>
                    <button class="edit-btn" onclick="editUdhaar(${entry.id})">Edit</button>
                    <button class="delete-btn" onclick="deleteUdhaar(${entry.id})">Delete</button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update person filter dropdown
function updatePersonFilter() {
    const uniquePersons = [...new Set(udhaar.map(entry => entry.person))];
    const currentSelection = personFilterEl.value;
    
    personFilterEl.innerHTML = '<option value="all">All People</option>' + 
        uniquePersons.map(person => {
            const personDisplay = udhaar.find(entry => entry.person === person).personDisplay;
            return `<option value="${person}">${personDisplay}</option>`;
        }).join('');
    
    // Restore previous selection if it still exists
    if (uniquePersons.includes(currentSelection) || currentSelection === 'all') {
        personFilterEl.value = currentSelection;
    }
}

// Filter udhaar transactions
function filterUdhaarTransactions() {
    renderUdhaarHistoryTable();
}

// Clear filters
function clearFilters() {
    personFilterEl.value = 'all';
    typeFilterEl.value = 'all';
    if (udhaarStartDateEl) udhaarStartDateEl.value = '';
    if (udhaarEndDateEl) udhaarEndDateEl.value = '';
    renderUdhaarHistoryTable();
}

// Clear date filters helpers
function clearCreditDateFilters() {
    if (creditStartDateEl) creditStartDateEl.value = '';
    if (creditEndDateEl) creditEndDateEl.value = '';
    renderCreditsTable();
}

function clearExpenseDateFilters() {
    if (expenseStartDateEl) expenseStartDateEl.value = '';
    if (expenseEndDateEl) expenseEndDateEl.value = '';
    renderExpensesTable();
}

// Render all tables
function renderTables() {
    renderCreditsTable();
    renderExpensesTable();
    renderUdhaarHistoryTable();
    renderPersonSummary();
}

// Update Summary
function updateSummary() {
    const totalCredits = credits.reduce((sum, credit) => sum + credit.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const balance = totalCredits - totalExpenses;
    
    // Calculate udhaar summary
    const totalUdhaarGiven = udhaar
        .filter(entry => entry.type === 'given')
        .reduce((sum, entry) => sum + entry.amount, 0);
    
    const totalUdhaarTaken = udhaar
        .filter(entry => entry.type === 'taken')
        .reduce((sum, entry) => sum + entry.amount, 0);
    
    const totalReceivedBack = udhaar
        .filter(entry => entry.type === 'received_back')
        .reduce((sum, entry) => sum + entry.amount, 0);
    
    const totalPaidBack = udhaar
        .filter(entry => entry.type === 'paid_back')
        .reduce((sum, entry) => sum + entry.amount, 0);
    
    // Net udhaar calculation
    const netUdhaar = (totalUdhaarGiven - totalReceivedBack) - (totalUdhaarTaken - totalPaidBack);
    
    // Update DOM elements
    totalCreditsEl.textContent = `₹${totalCredits.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;
    totalExpensesEl.textContent = `₹${totalExpenses.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;
    balanceEl.textContent = `₹${balance.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;
    
    totalUdhaarGivenEl.textContent = `₹${totalUdhaarGiven.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;
    totalUdhaarTakenEl.textContent = `₹${totalUdhaarTaken.toLocaleString('en-IN', {minimumFractionDigits: 2})}`;
    
    if (netUdhaar > 0) {
        netUdhaarEl.textContent = `₹${netUdhaar.toLocaleString('en-IN', {minimumFractionDigits: 2})} (owed to you)`;
        netUdhaarEl.className = 'credit-amount';
    } else if (netUdhaar < 0) {
        netUdhaarEl.textContent = `₹${Math.abs(netUdhaar).toLocaleString('en-IN', {minimumFractionDigits: 2})} (you owe)`;
        netUdhaarEl.className = 'expense-amount';
    } else {
        netUdhaarEl.textContent = '₹0.00 (settled)';
        netUdhaarEl.className = 'neutral';
    }
    
    // Update balance color
    balanceEl.className = balance >= 0 ? 'credit-amount' : 'expense-amount';
}

// Data Management Functions
function saveData() {
    localStorage.setItem(CREDITS_KEY, JSON.stringify(credits));
    localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
    localStorage.setItem(UDHAAR_KEY, JSON.stringify(udhaar));
    localStorage.setItem(CONTACTS_KEY, JSON.stringify(contacts));
}

function loadData() {
    const savedCredits = localStorage.getItem(CREDITS_KEY);
    const savedExpenses = localStorage.getItem(EXPENSES_KEY);
    const savedUdhaar = localStorage.getItem(UDHAAR_KEY);
    const savedContacts = localStorage.getItem(CONTACTS_KEY);
    
    if (savedCredits) {
        credits = JSON.parse(savedCredits);
    }
    
    if (savedExpenses) {
        expenses = JSON.parse(savedExpenses);
    }
    
    if (savedUdhaar) {
        udhaar = JSON.parse(savedUdhaar);
    }
    
    if (savedContacts) {
        contacts = JSON.parse(savedContacts);
    }
}

function exportData() {
    const data = {
        credits: credits,
        expenses: expenses,
        udhaar: udhaar,
        contacts: contacts,
        exportDate: new Date().toISOString(),
        version: '2.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `hisaab-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    showNotification('Data exported successfully!', 'success');
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.credits && data.expenses && data.udhaar) {
                credits = data.credits;
                expenses = data.expenses;
                udhaar = data.udhaar;
                contacts = data.contacts || []; // Handle old format
                
                saveData();
                updateSummary();
                renderTables();
                updatePersonFilter();
                renderContacts();
                
                showNotification('Data imported successfully!', 'success');
            } else {
                alert('Invalid backup file format!');
            }
        } catch (error) {
            alert('Error reading backup file!');
        }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone!')) {
        if (confirm('This will delete all credits, expenses, udhaar transactions, and contacts. Are you absolutely sure?')) {
            credits = [];
            expenses = [];
            udhaar = [];
            contacts = [];
            
            localStorage.removeItem(CREDITS_KEY);
            localStorage.removeItem(EXPENSES_KEY);
            localStorage.removeItem(UDHAAR_KEY);
            localStorage.removeItem(CONTACTS_KEY);
            
            updateSummary();
            renderTables();
            updatePersonFilter();
            renderContacts();
            
            showNotification('All data cleared successfully!', 'success');
        }
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Utility Functions
function formatDate(dateString) {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

// Keyboard Shortcuts
document.addEventListener('keydown', function(e) {
    // Escape key to close modal
    if (e.key === 'Escape') {
        closeEditModal();
    }
    
    // Ctrl/Cmd + N to focus on credit amount input
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        document.getElementById('creditAmount').focus();
    }
    
    // Ctrl/Cmd + E to focus on expense amount input
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        document.getElementById('expenseAmount').focus();
    }
});
