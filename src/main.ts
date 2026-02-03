// @ts-nocheck
import './style.css';

/**
 *  x   Ett fält för att mata in en utgift (belopp och beskrivning)
 *  x   Ett fält för att mata in en inkomst (belopp och beskrivning)
 *      Bredvid varje budgetpost ska det finnas en radera-knapp
 *          (när utskrivet i list)
 *  x   Det ska visas en balans (inkomster minus utgifter)
 *          - anpassas vid borttagning av värde i list
 *      Balansens ska färgkodas beroende på om det är ett positivt eller negativt värde
 *  x   Balansen ska uppdateras varje gång en ny utgift eller inkomst matas in
 *  x   Till varje budgetpost ska det gå att välja en kategori från en dropdown-lista (select)
 *      Informationen ska sparas i local storage så att när användaren kommer till sidan nästa gång, så ska informationen finnas kvar. Nytt
 *      Kategorierna ska läsas in via JSON. Vi går igenom detta på lektionen.
 */

const registerBtn = document.querySelector('#register');
const budgetForm = document.querySelector('#budgetForm');
const transactions = [];
const expenseAmount = document.querySelector('#expenseAmount');
const noteExpense = document.querySelector('#noteExpense');
const categoryExpense = document.querySelector('#categoryExpense');

const incomeAmount = document.querySelector('#incomeAmount');
const noteIncome = document.querySelector('#noteIncome');
const categoryIncome = document.querySelector('#categoryIncome');

const balance = document.querySelector('#balance');
const list = document.querySelector('#list');

registerBtn.addEventListener('click', registerTransaction => {
  registerTransaction.preventDefault();

  if (expenseAmount.value) {
    transactions.push({
      amount: Number(expenseAmount.value),
      note: noteExpense.value,
      category: categoryExpense.value,
      type: 'expense',
    });
  }

  if (incomeAmount.value) {
    transactions.push({
      amount: Number(incomeAmount.value),
      note: noteIncome.value,
      category: categoryIncome.value,
      type: 'income',
    });
  }

  registerTransactions();
});

function registerTransactions() {
  list.innerHTML = '';

  transactions.forEach(transaction => {
    const li = document.createElement('li');
    li.textContent = `${transaction.note} ${transaction.amount} kr (${transaction.category})`;
    list.appendChild(li);

    li.classList.add(transaction.type);
    list.appendChild(li);
  });

  // testa reduce istället
  const totalBalance = transactions.reduce((currentBalance, transaction) => {
    if (transaction.type === 'income') {
      return currentBalance + transaction.amount;
    } else {
      return currentBalance - transaction.amount;
    }
  }, 0);

  balance.textContent = totalBalance;
  budgetForm.reset();
}
