let customer1Balance = 1000;
let customer2Balance = 1000;
let transactionHistory = [];

function sendMoney(customerNumber) {
  window.location.href = 'send_money.html?customer=' + customerNumber;
}

function transferMoney(event) {
  event.preventDefault();

  const urlParams = new URLSearchParams(window.location.search);
  const customerNumber = urlParams.get('customer');
  const amount = parseFloat(document.getElementById('amount').value);

  let customerBalance = 0;
  let otherCustomerBalance = 0;

  if (customerNumber === '1') {
    customerBalance = customer1Balance;
    otherCustomerBalance = customer2Balance;
  } else if (customerNumber === '2') {
    customerBalance = customer2Balance;
    otherCustomerBalance = customer1Balance;
  }

  if (amount > customerBalance) {
    alert('Not Valid');
  } else {
    customerBalance -= amount;
    otherCustomerBalance += amount;

    if (customerNumber === '1') {
      customer1Balance = customerBalance;
      customer2Balance = otherCustomerBalance;
    } else if (customerNumber === '2') {
      customer2Balance = customerBalance;
      customer1Balance = otherCustomerBalance;
    }

    const sender = customerNumber === '1' ? 'John Doe' : 'Jane Smith';
    const receiver = customerNumber === '1' ? 'Jane Smith' : 'John Doe';

    const transaction = {
      sender: sender,
      receiver: receiver,
      amount: amount
    };

    transactionHistory.push(transaction);

    localStorage.setItem('customer1Balance', customer1Balance);
    localStorage.setItem('customer2Balance', customer2Balance);
    localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));

    alert(amount + ' transferred to ' + receiver + ' account.');
    window.location.href = 'customers.html';
  }

  return false;
}

// Update balances on the previous page
window.onload = function() {
  const balance1 = document.getElementById('balance1');
  const balance2 = document.getElementById('balance2');

  if (localStorage.getItem('customer1Balance')) {
    customer1Balance = parseFloat(localStorage.getItem('customer1Balance'));
    balance1.textContent = customer1Balance;
  }

  if (localStorage.getItem('customer2Balance')) {
    customer2Balance = parseFloat(localStorage.getItem('customer2Balance'));
    balance2.textContent = customer2Balance;
  }

  localStorage.removeItem('customer1Balance');
  localStorage.removeItem('customer2Balance');
};

// Populate transaction history table
if (window.location.pathname === '/transaction_history.html') {
  const transactionTable = document.getElementById('transactionTable');

  if (localStorage.getItem('transactionHistory')) {
    transactionHistory = JSON.parse(localStorage.getItem('transactionHistory'));

    for (let i = 0; i < transactionHistory.length; i++) {
      const transaction = transactionHistory[i];

      const row = document.createElement('tr');
      const senderCell = document.createElement('td');
      senderCell.textContent = transaction.sender;
      const receiverCell = document.createElement('td');
      receiverCell.textContent = transaction.receiver;
      const amountCell = document.createElement('td');
      amountCell.textContent = transaction.amount;

      row.appendChild(senderCell);
      row.appendChild(receiverCell);
      row.appendChild(amountCell);

      transactionTable.appendChild(row);
    }
  }
}