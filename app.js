const state = {
    expenses: [],
    totalAmount: 0
};

const proxyState = new Proxy(state, {
    set(target, key, value) {
        target[key] = value;
        if (key === 'expenses' || key === 'totalAmount') {
            render();
        }
        return true;
    }
});

const form = document.getElementById('expense-form');
const expenseName = document.getElementById('expense-name');
const expenseAmount = document.getElementById('expense-amount');
const expenseList = document.getElementById('expense-list');
const totalAmount = document.getElementById('total-amount');


function render() {
    expenseList.innerHTML = ''; 
    proxyState.expenses.forEach((expense, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${expense.name} - ${expense.amount} руб.
            <button onclick="deleteExpense(${index})">Удалить</button>
        `;
        expenseList.appendChild(li);
    });

    totalAmount.textContent = proxyState.totalAmount;
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = expenseName.value.trim();
    const amount = parseFloat(expenseAmount.value);
    if (name && amount && amount > 0) {
        proxyState.expenses = [...proxyState.expenses, { name, amount }];
        proxyState.totalAmount = proxyState.expenses.reduce((sum, exp) => sum + exp.amount, 0); 
        expenseName.value = '';
        expenseAmount.value = '';
    }
});

function deleteExpense(index) {
    proxyState.expenses = proxyState.expenses.filter((_, i) => i !== index);
    proxyState.totalAmount = proxyState.expenses.reduce((sum, exp) => sum + exp.amount, 0); 
}

render();