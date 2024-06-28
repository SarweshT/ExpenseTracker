// scripts.js

const API_URL = 'http://localhost:3000';

async function signUp() {
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;

    const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        alert('User registered successfully');
    } else {
        alert('Error registering user');
    }
}

async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch(`${API_URL}/users`);
    const users = await response.json();

    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        document.getElementById('auth').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
        loadExpenses();
    } else {
        alert('Invalid credentials');
    }
}

async function addExpense() {
    const user = JSON.parse(localStorage.getItem('user'));
    const category = document.getElementById('expense-category').value;
    const amount = document.getElementById('expense-amount').value;
    const description = document.getElementById('expense-description').value;

    const response = await fetch(`${API_URL}/expenses`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category, amount, description, userId: user.id })
    });

    if (response.ok) {
        loadExpenses();
    } else {
        alert('Error adding expense');
    }
}

async function loadExpenses() {
    const user = JSON.parse(localStorage.getItem('user'));
    const response = await fetch(`${API_URL}/expenses`);
    const expenses = await response.json();

    const userExpenses = expenses.filter(expense => expense.userId === user.id);

    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';

    userExpenses.forEach(expense => {
        const li = document.createElement('li');
        li.textContent = `${expense.category}: $${expense.amount} - ${expense.description}`;
        expenseList.appendChild(li);
    });

    updateChart(userExpenses);
}

function updateChart(expenses) {
    const categories = {};
    
    expenses.forEach(expense => {
        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }
        categories[expense.category] += parseFloat(expense.amount);
    });

    const ctx = document.getElementById('expense-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: Object.keys(categories),
            datasets: [{
                label: 'Expenses',
                data: Object.values(categories),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        }
    });
}

function logout() {
    localStorage.removeItem('user');
    document.getElementById('auth').classList.remove('hidden');
    document.getElementById('app').classList.add('hidden');
}
