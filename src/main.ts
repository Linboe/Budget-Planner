// @ts-nocheck
import './style.css';

/**
 *  x   Ett fält för att mata in en utgift (belopp och beskrivning)
 *  x   Ett fält för att mata in en inkomst (belopp och beskrivning)
 *      Bredvid varje budgetpost ska det finnas en radera-knapp
 *          (när utskrivet i list)
 *  x   Det ska visas en balans (inkomster minus utgifter)
 *          - anpassas vid borttagning av värde i list
 *  x   Balansens ska färgkodas beroende på om det är ett positivt eller negativt värde
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

// --------------------- annat sätt ----------------------
// ---------- Local Storage och lite JSON f.4/2 ----------

const LS_DB_ID = 'noteExpense';
const deleteBtn = document.querySelector('#deleteBtn');

noteExpense.addEventListener('keydown', checkInputConfirm);
deleteBtn.addEventListener('click', deleteFromLocalStorage);

let myData = [
  /*{
    text: InputDeviceInfo.value,
    completed: false,
  },*/
];

registerBtn.addEventListener('click', readFromLocalStorage); //var???

function checkInputConfirm(e) {
  if (e.key !== 'Enter') {
    return;
  }
  e.preventDefault(); // för att inte formuläret ska skickas varje gång man trycker enter

  myData.push({
    text: noteExpense.value,
    completed: false, //byt till andra värden
  });

  noteExpense.value = '';

  //console.log('myData:', myData);
  saveToLocalStorage();
  writeToScreen(); //skriva ut på skärmen
}

function saveToLocalStorage() {
  const stringified = JSON.stringify(myData);

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

  myData = JSON.parse(savedValue); //inbyggd funktion som gör om text till array igen = återställer
  console.log('myData är nu', myData);
}

const dataHtmlEl = document.querySelector('#transactions');
function writeToScreen() {
  let html = '<ul>';

  myData.forEach((todo, index) => {
    html += `
      <li>${todo.text} - ${todo.completed}
        <button class="delete" data-id="${index}" data-completed="false">Radera</button>
      </li>`;
  });

  html += '</ul>';

  dataHtmlEl.innerHTML = html;

  document.querySelectorAll('button.delete').forEach(btn => {
    btn.addEventListener('click', deleteToDo);
  });
}

function deleteToDo(e) {
  const id = Number(e.target.dataset.id);

  myData.splice(id, 1); //1 visar att endast en grej ska raderas

  saveToLocalStorage();

  writeToScreen();
}

function deleteFromLocalStorage() {
  localStorage.removeItem(LS_DB_ID);
  myData = [];

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
