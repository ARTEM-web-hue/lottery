let lotteryHistory = []; // История лотерейных чисел
const lotteryHistorySize = 10; // Максимальное количество записей в таблице

// Получаем элементы DOM
const loginContainer = document.getElementById('login-container');
const gameContainer = document.getElementById('game-container');
const loginForm = document.getElementById('login-form');
const registerLink = document.getElementById('register-link');
const calculateButton = document.getElementById('calculate-button');
const ageInput = document.getElementById('age');
const weightInput = document.getElementById('weight');
const lotteryNumberDisplay = document.getElementById('lottery-number');
const lotteryTableBody = document.querySelector('#lottery-table tbody');

// Загружаем историю лотерейных чисел из localStorage
function loadLotteryHistory() {
  const savedHistory = localStorage.getItem('lotteryHistory');
  if (savedHistory) {
    lotteryHistory = JSON.parse(savedHistory);
    updateLotteryTable();
  }
}

// Сохраняем историю лотерейных чисел в localStorage
function saveLotteryHistory() {
  localStorage.setItem('lotteryHistory', JSON.stringify(lotteryHistory));
}

// Обновляем таблицу лотерейных билетов
function updateLotteryTable() {
  lotteryTableBody.innerHTML = ''; // Очищаем таблицу
  lotteryHistory.forEach((entry) => {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td>${entry.username}</td>
            <td>${entry.lotteryNumber}</td>
        `;
    lotteryTableBody.appendChild(row);
  });
}

// Добавляем запись в историю лотерейных чисел
function addToLotteryHistory(username, lotteryNumber) {
  lotteryHistory.push({ username, lotteryNumber });
  // Ограничиваем историю 10 записями
  if (lotteryHistory.length > lotteryHistorySize) {
    lotteryHistory = lotteryHistory.slice(-lotteryHistorySize);
  }
  saveLotteryHistory();
  updateLotteryTable();
}

// Рассчитываем лотерейное число
function calculateLotteryNumber(age, weight) {
  let result = (age * weight) / 4; // Перемножаем и делим на 4
  if (result < 81) {
    result += 81; // Добавляем 81, если число меньше 81
  } else {
    result += 18; // Добавляем 18, если число больше или равно 81
  }
  result = result - weight + age; // Вычитаем вес и прибавляем возраст
  return Math.round(result); // Округляем результат
}

// Проверяем, есть ли аккаунт в localStorage
function checkAccount() {
  return localStorage.getItem('account') !== null;
}

// Создаем аккаунт
function createAccount(username, password) {
  const account = { username, password };
  localStorage.setItem('account', JSON.stringify(account));
}

// Проверяем логин и пароль
function login(username, password) {
  const account = JSON.parse(localStorage.getItem('account'));
  return account && account.username === username && account.password === password;
}

// Обработчик для формы входа
loginForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (checkAccount()) {
    if (login(username, password)) {
      loginContainer.style.display = 'none';
      gameContainer.style.display = 'block';
    } else {
      alert('Неверный логин или пароль!');
    }
  } else {
    createAccount(username, password);
    loginContainer.style.display = 'none';
    gameContainer.style.display = 'block';
  }
});

// Обработчик для ссылки регистрации
registerLink.addEventListener('click', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
    alert('Пожалуйста, введите логин и пароль!');
    return;
  }

  if (checkAccount()) {
    alert('Аккаунт уже существует! Войдите в систему.');
  } else {
    createAccount(username, password);
    loginContainer.style.display = 'none';
    gameContainer.style.display = 'block';
  }
});

// Обработчик для кнопки "Рассчитать"
calculateButton.addEventListener('click', () => {
  const age = parseInt(ageInput.value);
  const weight = parseInt(weightInput.value);

  if (isNaN(age) || isNaN(weight)) {
    alert('Пожалуйста, введите корректные значения для возраста и веса.');
    return;
  }

  const lotteryNumber = calculateLotteryNumber(age, weight);
  lotteryNumberDisplay.textContent = lotteryNumber;

  const account = JSON.parse(localStorage.getItem('account'));
  if (account) {
    addToLotteryHistory(account.username, lotteryNumber);
  }
});

// Загружаем историю лотерейных чисел при загрузке страницы
loadLotteryHistory();