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
 *  x   Kategorierna ska läsas in via JSON. Vi går igenom detta på lektionen.
 */

//const budgetForm = document.querySelector('#budgetForm'); //anv endast i första kodförsöket
//const list = document.querySelector('#list'); //anv endast i första kodförsöket
//const deleteBtn = document.querySelector('#deleteBtn'); //endast för att testa LS behövs ej nu
//deleteBtn.addEventListener('click', deleteFromLocalStorage); //endast för att testa LS behövs ej nu

const expenseAmount = document.querySelector('#expenseAmount') as HTMLInputElement | null;
const noteExpense = document.querySelector('#noteExpense') as HTMLInputElement | null;
const catExpenseDropdown = document.querySelector('#categoryExpenseDropdown') as HTMLSelectElement | null;

const incomeAmount = document.querySelector('#incomeAmount') as HTMLInputElement | null;
const noteIncome = document.querySelector('#noteIncome') as HTMLInputElement | null;
const catIncomeDropdown = document.querySelector('#categoryIncomeDropdown') as HTMLSelectElement | null;

const totalBalance = document.querySelector('#totalBalance') as HTMLElement | null;

const registerBtn = document.querySelector('#register') as HTMLButtonElement | null;

// ----------------------------------------------------------------------
// -------------------------- funktioner osv  ---------------------------
// ----------------------------------------------------------------------

if (registerBtn) {
  registerBtn.addEventListener('click', addTransaction);
}

interface Transaction {
  //ts
  amount: number;
  note: string;
  cat: string;
  type: 'income' | 'expense';
}

let transactions: Transaction[] = []; //sparar alla transaktioner
const LS_DB_ID = 'transactions';

/*
------------------------------------------------------------------------
------------------------ Enter för ALLA input --------------------------
------------------------------------------------------------------------
*/
[incomeAmount, noteIncome, expenseAmount, noteExpense].forEach(input => {
  if (input) {
    input.addEventListener('keydown', checkInputConfirm);
  }
});

/*
------------------------------------------------------------------------
---------------------- få input-info till object  ----------------------
------------------------------------------------------------------------
*/

function addTransaction() {
  if (!incomeAmount || !noteIncome || !catIncomeDropdown || !expenseAmount || !noteExpense || !catExpenseDropdown) {
    return;
  }

  const incomeValue = Number(incomeAmount.value);
  const incomeNote = noteIncome.value.trim();
  const incomecatDropdown = catIncomeDropdown.value;

  if (incomeValue !== 0 && incomeNote !== '') {
    transactions.push({
      amount: incomeValue,
      note: incomeNote,
      cat: incomecatDropdown,
      type: 'income',
    });
  }

  const expenseValue = Number(expenseAmount.value);
  const expenseNote = noteExpense.value.trim();
  const expensecatDropdown = catExpenseDropdown.value;

  if (expenseValue !== 0 && expenseNote !== '') {
    transactions.push({
      amount: expenseValue,
      note: expenseNote,
      cat: expensecatDropdown,
      type: 'expense',
    });
  }

  incomeAmount.value = '';
  noteIncome.value = '';
  catIncomeDropdown.value = '';
  expenseAmount.value = '';
  noteExpense.value = '';
  catExpenseDropdown.value = '';

  saveToLocalStorage();
  writeToScreen();
}
/*
------------------------------------------------------------------------
--------------------------- Kategorier JSON ----------------------------
------------------------------------------------------------------------
*/
if (catExpenseDropdown) {
  categories.expenses.forEach(cat => {
    catExpenseDropdown.innerHTML += `<option value="${cat.value}">${cat.text}</option>`;
  });
}

if (catIncomeDropdown) {
  categories.incomes.forEach(cat => {
    catIncomeDropdown.innerHTML += `<option value="${cat.value}">${cat.text}</option>`;
  });
}

/*
------------------------------------------------------------------------
----------------- för att Enter ska fungera vid input ------------------
------------------------------------------------------------------------
*/
function checkInputConfirm(e: KeyboardEvent) {
  if (e.key !== 'Enter') {
    return;
  }
  e.preventDefault(); // för att inte formuläret ska skickas varje gång man trycker enter

  addTransaction();
}

/*
------------------------------------------------------------------------
---------------------- Spara till Local Storage ------------------------
------------------------------------------------------------------------
*/
function saveToLocalStorage() {
  const stringified = JSON.stringify(transactions);

  localStorage.setItem(LS_DB_ID, stringified); //detta värde måste vara unikt för varje input
  console.log('Data saved.');
}

/*
------------------------------------------------------------------------
------------------------ Läsa av info från LS --------------------------
------------------------------------------------------------------------
*/
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

/*
------------------------------------------------------------------------
----------------------- skriva ut transaktioner ------------------------
------------------------------------------------------------------------
*/
const dataHtmlEl = document.querySelector('#transactions') as HTMLElement | null;
function writeToScreen() {
  if (!dataHtmlEl) {
    return;
  }

  let html = '<ul>';

  transactions.forEach((t, index) => {
    //för att (-) ska stå framför expense, t=transactions förkortning
    let operatorAmount;
    if (t.type === 'expense') {
      operatorAmount = `-${t.amount}`;
    } else {
      operatorAmount = `${t.amount}`;
    }

    //sätta class för färgkodning av expense vs income
    let typeClass;
    if (t.type === 'expense') {
      typeClass = 'expense';
    } else {
      typeClass = 'income';
    }

    html += `
    <div class="transactionList">
      <li class="${typeClass}">${operatorAmount} kr: ${t.note} (${t.cat})
        <button class="delete material-symbols-outlined" data-id="${index}">delete</button>
      </li>
    </div>`;
  });

  html += '</ul>';

  dataHtmlEl.innerHTML = html;

  //deleteBtn
  document.querySelectorAll('button.delete').forEach(btn => {
    btn.addEventListener('click', deletetTransaction);
  });

  /*
------------------------------------------------------------------------
------------------------ Räkna ut total balans -------------------------
------------------------------------------------------------------------
*/

  const totalTransactionBalance = transactions.reduce((currentBalance, t) => {
    if (t.type === 'income') {
      return currentBalance + t.amount;
    } else {
      return currentBalance - t.amount;
    }
  }, 0);

  if (!totalBalance) {
    return;
  }

  totalBalance.textContent = `Total balans: ${totalTransactionBalance} kr`;

  // ta bort gamla färgklasser
  totalBalance.classList.remove('balance-positive', 'balance-negative', 'balance-zero');

  // färgkoda balansen
  if (totalTransactionBalance > 0) {
    totalBalance.classList.add('balance-positive');
  } else if (totalTransactionBalance < 0) {
    totalBalance.classList.add('balance-negative');
  } else {
    totalBalance.classList.add('balance-zero');
  }
}

/*
------------------------------------------------------------------------
------------------------ ta bort en transaktion ------------------------
------------------------------------------------------------------------
*/
function deletetTransaction(e: Event) {
  const id = Number((e.target as HTMLElement).dataset.id);

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
// ------------------- OBS IGNORERA DENNA KOD NEDAN --------------------
// ------------------ första koden innan LS och JSON -------------------
// ----------------------- kvar för egen skull  ------------------------
// ---------------------------------------------------------------------

registerBtn.addEventListener('click', registerTransaction => {
  registerTransaction.preventDefault();

  if (expenseAmount.value) {
    transactions.push({
      amount: Number(expenseAmount.value),
      note: noteExpense.value,
      cat: catExpense.value,
      type: 'expense',
    });
  }

  if (incomeAmount.value) {
    transactions.push({
      amount: Number(incomeAmount.value),
      note: noteIncome.value,
      cat: catIncome.value,
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

    li.textContent = `${operatorAmount} kr ${transaction.note} (${transaction.cat})`;
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
