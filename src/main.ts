// @ts-nocheck
import './style.css';
import categories from './categories.json';

/**
 *  x   Ett fält för att mata in en utgift (belopp och beskrivning)
 *  x   Ett fält för att mata in en inkomst (belopp och beskrivning)
 *  x   Bredvid varje budgetpost ska det finnas en radera-knapp (när utskrivet i list)
 *  x   Det ska visas en balans (inkomster minus utgifter)
 *  x       - anpassas vid borttagning av värde i list
 *  x   Balansens ska färgkodas beroende på om det är ett positivt eller negativt värde
 *  x   Balansen ska uppdateras varje gång en ny utgift eller inkomst matas in
 *  x   Till varje budgetpost ska det gå att välja en kategori från en dropdown-lista (select)
 *  x   Informationen ska sparas i local storage så att när användaren kommer till sidan nästa gång, så ska informationen finnas kvar. Nytt
 *      Kategorierna ska läsas in via JSON. Vi går igenom detta på lektionen.
 */

//const budgetForm = document.querySelector('#budgetForm'); //anv endast i första kodförsöket
//const list = document.querySelector('#list'); //anv endast i första kodförsöket
//const deleteBtn = document.querySelector('#deleteBtn'); //endast för att testa LS behövs ej nu
//deleteBtn.addEventListener('click', deleteFromLocalStorage); //endast för att testa LS behövs ej nu

const expenseAmount = document.querySelector('#expenseAmount');
const noteExpense = document.querySelector('#noteExpense');
const categoryExpenseDropdown = document.querySelector('#categoryExpenseDropdown');

const incomeAmount = document.querySelector('#incomeAmount');
const noteIncome = document.querySelector('#noteIncome');
const categoryIncomeDropdown = document.querySelector('#categoryIncomeDropdown');

const totalBalance = document.querySelector('#totalBalance');

const registerBtn = document.querySelector('#register');

// ----------------------------------------------------------------------
// -------------------------- funktioner osv  ---------------------------
// ----------------------------------------------------------------------

registerBtn.addEventListener('click', addTransaction);
//noteExpense.addEventListener('keydown', checkInputConfirm);

let transactions = []; //sparar alla transaktioner
const LS_DB_ID = 'transactions';

[incomeAmount, noteIncome, expenseAmount, noteExpense].forEach(input => {
  input.addEventListener('keydown', checkInputConfirm);
}); //för att Enter ska fungera i alla input-fält

function addTransaction() {
  const incomeValue = Number(incomeAmount.value);
  const incomeNote = noteIncome.value.trim();
  const incomeCategoryDropdown = categoryIncomeDropdown.value;

  if (incomeValue !== 0 && incomeNote !== '') {
    transactions.push({
      amount: incomeValue,
      note: incomeNote,
      category: incomeCategoryDropdown,
      type: 'income',
    });
  }

  const expenseValue = Number(expenseAmount.value);
  const expenseNote = noteExpense.value.trim();
  const expenseCategoryDropdown = categoryExpenseDropdown.value;

  if (expenseValue !== 0 && expenseNote !== '') {
    transactions.push({
      amount: expenseValue,
      note: expenseNote,
      category: expenseCategoryDropdown,
      type: 'expense',
    });
  }

  incomeAmount.value = '';
  noteIncome.value = '';
  categoryIncomeDropdown.value = '';
  expenseAmount.value = '';
  noteExpense.value = '';
  categoryExpenseDropdown.value = '';

  saveToLocalStorage();
  writeToScreen();
}
// kategorier JSON
if (categoryExpenseDropdown) {
  categories.expenses.forEach(category => {
    categoryExpenseDropdown.innerHTML += `<option value="${category.value}">${category.text}</option>`;
  });
}

if (categoryIncomeDropdown) {
  categories.incomes.forEach(category => {
    categoryIncomeDropdown.innerHTML += `<option value="${category.value}">${category.text}</option>`;
  });
}

console.log(categories);

function checkInputConfirm(e) {
  if (e.key !== 'Enter') {
    return;
  }
  e.preventDefault(); // för att inte formuläret ska skickas varje gång man trycker enter

  addTransaction();
}

function saveToLocalStorage() {
  const stringified = JSON.stringify(transactions);

  localStorage.setItem(LS_DB_ID, stringified); //detta värde måste vara unikt för varje input
  console.log('Data saved.');
}

function readFromLocalStorage() {
  const savedValue = localStorage.getItem(LS_DB_ID); //localStorage inbyggd EJ variabel

  if (savedValue === null) {
    console.warn('Det finns inget sparat i localStorage'); //om inget finns sparat, return pga onödigt resten körs
    return;
  }

  transactions = JSON.parse(savedValue); //inbyggd funktion som gör om text till array igen = återställer
  writeToScreen();
  console.log('transactions är nu', transactions);
}

const dataHtmlEl = document.querySelector('#transactions');
function writeToScreen() {
  let html = '<ul>';

  transactions.forEach((t, index) => {
    //för att (-) ska stå framför expense, t=transactions förkortning
    let operatorAmount;
    if (t.type === 'expense') {
      operatorAmount = `-${t.amount}`;
    } else {
      operatorAmount = `${t.amount}`;
    }

    let typeClass;
    if (t.type === 'expense') {
      typeClass = 'expense';
    } else {
      typeClass = 'income';
    }

    html += `
      <li class="${typeClass}">${operatorAmount} kr: ${t.note} (${t.category})
        <button class="delete" data-id="${index}">Radera</button>
      </li>`;
  });

  html += '</ul>';

  dataHtmlEl.innerHTML = html;

  document.querySelectorAll('button.delete').forEach(btn => {
    btn.addEventListener('click', deletetTransaction);
  });

  // testa reduce istället: summa-balance
  const totalTransactionBalance = transactions.reduce((currentBalance, t) => {
    if (t.type === 'income') {
      return currentBalance + t.amount;
    } else {
      return currentBalance - t.amount;
    }
  }, 0);

  totalBalance.textContent = `Total balans: ${totalTransactionBalance} kr`;
}

function deletetTransaction(e) {
  const id = Number(e.target.dataset.id);

  transactions.splice(id, 1); //1 visar att endast en grej ska raderas
  saveToLocalStorage();
  writeToScreen();
}

function deleteFromLocalStorage() {
  localStorage.removeItem(LS_DB_ID);
  transactions = [];

  writeToScreen(); //kom ihåg detta så det syns att det tagits bort
}

readFromLocalStorage();
writeToScreen();

/*
// ------------------ första koden innan LS och JSON -------------------
// ----------------------- kvar för egen skull  ------------------------
// ---------------------------------------------------------------------

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

    // sätta (-) framför utgifter i listan
    let operatorAmount;
    if (transaction.type === 'expense') {
      operatorAmount = `-${transaction.amount}`;
    } else {
      operatorAmount = `${transaction.amount}`;
    }

    li.textContent = `${operatorAmount} kr ${transaction.note} (${transaction.category})`;
    list.appendChild(li);

    // extra class för färg
    li.classList.add(transaction.type);
    list.appendChild(li);
  });

  // testa reduce istället: summa-balance
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
  */
