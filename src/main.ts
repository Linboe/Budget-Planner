// @ts-nocheck
import './style.css';

/**
 *  x   Ett fält för att mata in en utgift (belopp och beskrivning)
 *  x   Ett fält för att mata in en inkomst (belopp och beskrivning)
 *      Bredvid varje budgetpost ska det finnas en radera-knapp
 *          (när utskrivet i list)
 *      Det ska visas en balans (inkomster minus utgifter)
 *          - anpassas vid borttagning av värde i list
 *      Balansens ska färgkodas beroende på om det är ett positivt eller negativt värde
 *      Balansen ska uppdateras varje gång en ny utgift eller inkomst matas in
 *  x   Till varje budgetpost ska det gå att välja en kategori från en dropdown-lista (select)
 *      Informationen ska sparas i local storage så att när användaren kommer till sidan nästa gång, så ska informationen finnas kvar. Nytt
 *      Kategorierna ska läsas in via JSON. Vi går igenom detta på lektionen.
 */

//const budgetForm = document.querySelector('#budgetForm'); //anv endast i första kodförsöket

const expenseAmount = document.querySelector('#expenseAmount');
const noteExpense = document.querySelector('#noteExpense');
const categoryExpense = document.querySelector('#categoryExpense');

const incomeAmount = document.querySelector('#incomeAmount');
const noteIncome = document.querySelector('#noteIncome');
const categoryIncome = document.querySelector('#categoryIncome');

const balance = document.querySelector('#totalBalance');
//const list = document.querySelector('#list'); //anv endast i första kodförsöket

const registerBtn = document.querySelector('#register');
//const deleteBtn = document.querySelector('#deleteBtn'); //endast för att testa LS behövs ej nu
//deleteBtn.addEventListener('click', deleteFromLocalStorage);

// --------------------- annat sätt ----------------------
// ---------- Local Storage och lite JSON f.4/2 ----------

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
  const incomeCategory = categoryIncome.value;

  if (incomeValue !== 0 && incomeNote !== '') {
    transactions.push({
      amount: incomeValue,
      note: incomeNote,
      category: incomeCategory,
      type: 'income',
    });
  }

  const expenseValue = Number(expenseAmount.value);
  const expenseNote = noteExpense.value.trim();
  const expenseCategory = categoryExpense.value;

  if (expenseValue !== 0 && expenseNote !== '') {
    transactions.push({
      amount: expenseValue,
      note: expenseNote,
      category: expenseCategory,
      type: 'expense',
    });
  }

  incomeAmount.value = '';
  noteIncome.value = '';
  categoryIncome.value = '';
  expenseAmount.value = '';
  noteExpense.value = '';
  categoryExpense.value = '';

  saveToLocalStorage();
  writeToScreen();
}

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
    //om inget finns sparat, return pga onödigt resten körs
    console.warn('Det finns inget sparat i localStorage');

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
    html += `
      <li>${t.amount} kr - ${t.note} (${t.category})
        <button class="delete" data-id="${index}">Radera</button>
      </li>`;
  });

  html += '</ul>';

  dataHtmlEl.innerHTML = html;

  document.querySelectorAll('button.delete').forEach(btn => {
    btn.addEventListener('click', deletetTransaction);
  });

  // testa reduce istället: summa-balance
  const totalTransactionBalance = transactions.reduce((currentBalance, transaction) => {
    if (transaction.type === 'income') {
      return currentBalance + transaction.amount;
    } else {
      return currentBalance - transaction.amount;
    }
  }, 0);

  totalBalance.textContent = totalTransactionBalance;
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
// ---------------------- 1 sätt att göra det på  ----------------------
// --------------------------- första koden  ---------------------------
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
