'use strict';

// Data
const account1 = {
    owner: 'Captain Usopp',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2020-05-27T17:01:17.194Z',
        '2020-07-11T23:36:17.929Z',
        '2020-07-12T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-04-10T14:43:26.374Z',
        '2020-06-25T18:49:59.371Z',
        '2020-07-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
    movementsDates: [
        '2019-06-11T13:15:33.035Z',
        '2019-08-03T09:48:16.867Z',
        '2019-11-15T06:04:23.907Z',
        '2019-12-22T14:18:46.235Z',
        '2020-04-09T16:33:06.386Z',
        '2020-06-16T14:43:26.374Z',
        '2020-08-23T18:49:59.371Z',
        '2020-08-26T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
    movementsDates: [
        '2019-08-28T21:31:17.178Z',
        '2019-12-03T07:42:02.383Z',
        '2020-04-11T10:17:24.185Z',
        '2020-07-13T17:01:17.194Z',
        '2020-08-19T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const movementTypeDeposit = document.querySelector('.movements__type--deposit');
const movementTypeWithdrawal = document.querySelector('.movements__type--withdrawal');

const formatDates = function(movDate, locale) {

    const calcDaysPassed = (date1, date2) => 
        Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    const daysPassed = calcDaysPassed(new Date(), movDate);
    console.log(daysPassed);

    if (daysPassed === 0) return `Today`;
    if (daysPassed === 1) return `Yesterday`;
    if (daysPassed <= 7) return `${daysPassed} days ago`;

    // const day = `${movDate.getDate()}`.padStart(2, 0);
    // const month = `${movDate.getMonth() + 1}`.padStart(2, 0);
    // const year = movDate.getFullYear();
    // return `${month}/${day}/${year}`;
    return new Intl.DateTimeFormat(locale).format(movDate);
}

const formatCurrency = function(value, currency, locale) {
    return new Intl.NumberFormat(locale, {
        style : 'currency',
        currency : currency,
    }).format(value);
}


const displayMovements = function(account) {
    containerMovements.innerHTML = '';
    account.movements.forEach((movement, index) => {
        
        const displayDate = formatDates(
            new Date(account.movementsDates[index]),
            account.locale);
        
        const type = movement > 0 ? 'deposit' : 'withdrawal';        
        const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${index + 1} ${type}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${formatCurrency(
                movement, account.currency, account.locale
            )}</div>
        </div>`; 

        containerMovements.insertAdjacentHTML('afterbegin', html);       
    });
};

const calcPrintBalance = function(account) {
    account.balance = account.movements.reduce((acc, mov) => {
        return acc + mov;
    }, 0);

    labelBalance.textContent = formatCurrency(account.balance, account.currency, account.locale);
};

const calcDisplaySummary = function(account) {
    const incomes = account.movements
        .filter(movement => movement > 0)
        .reduce((acc, curr) => acc + curr, 0);
    
    labelSumIn.textContent = formatCurrency(incomes,account.currency, account.locale);

    const outcomes = account.movements
    .filter(movement => movement < 0)
    .reduce((acc, curr) => acc + curr, 0);

    labelSumOut.textContent = formatCurrency(outcomes * -1, account.currency, account.locale);

    const interest = account.movements
    .filter(movement => movement > 0)
    .map(movement => (movement * account.interestRate) / 100)
    .filter(movement => movement >= 1)
    .reduce((acc, curr) => acc + curr, 0);

    labelSumInterest.textContent = formatCurrency(interest, account.currency, account.locale);
}

const createUsernames = function(accounts) {

    accounts.forEach(account => {
        account.username = account.owner
        .toLowerCase()
        .split(' ')
        .map(name => name[0])
        .join('');
    });

};
createUsernames(accounts);

const updateUI = function(account) {

    // Display movements
    displayMovements(account);

    // Display balance
    calcPrintBalance(account);

    // Display Summary
    calcDisplaySummary(account);
}

let currentAccount, timer;

const countDownTimer = function() {
    const tick = function() {
        
        // calculate minute and second
        let minute = `${Math.floor(time / 60)}`.padStart(2, 0);
        let second = `${time % 60}`.padStart(2, 0);
        
        // print remaining time in each call
        labelTimer.textContent = `${minute}:${second}`;

        // check if time is zero
        if (time === 0) {
            clearInterval(timer);
            labelWelcome.textContent = `Log in to get started`;
            containerApp.style.opacity = 0;
        }
        
        //decrease time by one second every second
        time--;
        
    };

    // set the intial time in seconds
    let time = 600;

    tick();
    const timer = setInterval(tick, 1000);
    return timer;

};

btnLogin.addEventListener('click', (e) => {
    e.preventDefault();

    const userName = inputLoginUsername.value;
    const loginPin = inputLoginPin.value;
    currentAccount = accounts.find(account => 
        account.username === userName && account.pin === Number(loginPin)
    );

    if (currentAccount) {

        // Display UI and message
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
        containerApp.style.opacity = 1;

        // Get Current date
        // const now = new Date();
        // const date = `${now.getDate()}`.padStart(2, 0);
        // const month = `${now.getMonth() + 1}`.padStart(2, 0);
        // const year = now.getFullYear();
        // const hours = `${now.getHours()}`.padStart(2, 0);
        // const minutes = `${now.getMinutes()}`.padStart(2, 0);
        // labelDate.textContent = `${month}/${date}/${year} ${hours}:${minutes}`;
        
        // const userLocale = navigator.language;
        // console.log(userLocale);
        
        const now = new Date();
        const options = {
            hour : 'numeric',
            minute : 'numeric',
            day : 'numeric',
            month : 'numeric',
            year : 'numeric',
        };
        labelDate.textContent = new Intl.DateTimeFormat(
            currentAccount.locale,
            options).format(now);

        // Clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();
        inputLoginUsername.blur();

        // Start Log Out Time
        if (timer) clearInterval(countDownTimer);
        timer = countDownTimer();

        // Update UI
        updateUI(currentAccount);
    }
    // console.log(acc);
});

btnTransfer.addEventListener('click', (e) => {
    e.preventDefault();

    const transferTo = inputTransferTo.value;
    const transferAmount = Number(inputTransferAmount.value);

    const transferAccount = accounts.find(account =>
        account.username === transferTo && transferTo !== currentAccount.username
    );

    // Clear input fields for current Account
    inputTransferAmount.value = inputTransferTo.value = '';
    inputTransferAmount.blur();
    inputTransferTo.blur();

    if (transferAccount && transferAmount > 0 && transferAmount <= currentAccount.balance) {
        transferAccount.movements.push(transferAmount);
        currentAccount.movements.push(-transferAmount);

        // Add movement date to both the accounts
        currentAccount.movementsDates.push(new Date().toISOString());
        transferAccount.movementsDates.push(new Date().toISOString());

        // restart timer
        clearInterval(timer);
        timer = countDownTimer();

        // Update UI
        updateUI(currentAccount);
    }
});

btnClose.addEventListener('click', (e) => {
    e.preventDefault();

    const confirmUsername = inputCloseUsername.value;
    const confirmPin = Number(inputClosePin.value);

    // Clear input fields for current Account
    inputCloseUsername.value = inputClosePin.value = '';
    inputCloseUsername.blur();
    inputClosePin.blur();

    if (currentAccount.username === confirmUsername && currentAccount.pin === confirmPin) {

        const index = accounts.findIndex(account => currentAccount.username === account.username);
        
        // remove account from array
        accounts.splice(index, 1);

        // Hide UI and change message
        labelWelcome.textContent = 'Log in to get started';
        containerApp.style.opacity = 0;
    }
    
});

btnLoan.addEventListener('click', (e) => {
    e.preventDefault();

    const loanAmount = Math.round(inputLoanAmount.value);

    const isDepositGTLoanAmount = currentAccount.movements.some(mov => mov >= loanAmount * 0.1);

    inputLoanAmount.value = '';

    if (loanAmount > 0 && isDepositGTLoanAmount) {
        // Add movement
        currentAccount.movements.push(loanAmount);

        // Add movement date
        currentAccount.movementsDates.push(new Date().toISOString());

        // restart timer
        clearInterval(timer);
        timer = countDownTimer();

        // updateUI
        updateUI(currentAccount);
    }
});

btnSort.addEventListener('click', (e) => {
    
    const sortBy = (e.target.innerText.includes('↓')) ? 'desc' : 'asc';

    if (sortBy === 'desc') {
        currentAccount.movements.sort((a, b) => a - b);
        e.target.innerHTML = `&uparrow; SORT`;

        displayMovements(currentAccount.movements);
    } else {
        currentAccount.movements.sort((a, b) => b - a);
        e.target.innerHTML = `&downarrow; SORT`;

        displayMovements(currentAccount.movements);

    }
});
