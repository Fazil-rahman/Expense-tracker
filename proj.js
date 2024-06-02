document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expense-form');
    const expenseAmountInput = document.getElementById('expense-amount');
    const descriptionInput = document.getElementById('description');
    const categorySelect = document.getElementById('category');
    const totalExpenses = document.getElementById('total-expenses');
    const expensesList = document.getElementById('expenses-list');

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    function saveExpensesToLocalStorage() {
        localStorage.setItem('expenses', JSON.stringify(expenses));
    }

    function calculateTotalExpenses() {
        return expenses.reduce((total, expense) => total + expense.amount, 0);
    }

    function renderExpenses() {
        expensesList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const expenseItem = document.createElement('li');
            expenseItem.className = 'list-group-item d-flex justify-content-between align-items-center';
            expenseItem.innerHTML = `
                <span>${expense.description} - ₹${expense.amount.toFixed(2)} - ${expense.category}</span>
                <div>
                    <button class="btn btn-secondary btn-sm edit-expense-btn" data-index="${index}">Edit</button>
                    <button class="btn btn-danger btn-sm delete-expense-btn" data-index="${index}">Delete</button>
                </div>
            `;
            expensesList.appendChild(expenseItem);
        });
        totalExpenses.textContent = `Total Expenses: ₹${calculateTotalExpenses().toFixed(2)}`;
    }

    function addExpense(amount, description, category) {
        expenses.push({ amount: parseFloat(amount), description, category });
        saveExpensesToLocalStorage();
        renderExpenses();
    }

    function deleteExpense(index) {
        expenses.splice(index, 1);
        saveExpensesToLocalStorage();
        renderExpenses();
    }

    function editExpense(index) {
        const expense = expenses[index];
        const newDescription = prompt('Edit Description:', expense.description);
        const newAmount = parseFloat(prompt('Edit Amount:', expense.amount));
        const newCategory = prompt('Edit Category:', expense.category);

        if (newDescription !== null && !isNaN(newAmount) && newCategory !== null) {
            expenses[index] = { amount: newAmount, description: newDescription, category: newCategory };
            saveExpensesToLocalStorage();
            renderExpenses();
        }
    }

    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const amount = expenseAmountInput.value.trim();
        const description = descriptionInput.value.trim();
        const category = categorySelect.value.trim();
        if (amount && description && category) {
            addExpense(amount, description, category);
            expenseAmountInput.value = '';
            descriptionInput.value = '';
            categorySelect.selectedIndex = 0;
        } else {
            alert('Please fill in all fields');
        }
    });

    expensesList.addEventListener('click', function(event) {
        const index = event.target.dataset.index;
        if (event.target.classList.contains('delete-expense-btn')) {
            if (confirm('Are you sure you want to delete this expense?')) {
                deleteExpense(index);
            }
        } else if (event.target.classList.contains('edit-expense-btn')) {
            editExpense(index);
        }
    });

    renderExpenses();
});
