'use strict';

const buttonStart = document.querySelector('.button--start');
const tableBody = document.querySelector('tbody');
const score = document.querySelector('.game-score');
const message = document.querySelectorAll('[data-message]');

const [lose, win] = message;
const gameField = [...tableBody.children].map(el => [...el.children]);
const fieldTurnRows = gameField.reduce((acc, curr) => {
  for (let i = 0; i < curr.length; i++) {
    acc[i].push(curr[i]);
  }

  return acc;
}, [[], [], [], []]);
const reversField = gameField.map(rev => [...rev].reverse());
const reversFieldTurnRows = fieldTurnRows.map(rev => [...rev].reverse());
let startGamePress;

buttonStart.addEventListener('click', startGame);
window.addEventListener('keyup', moveItem);

function startGame(eventStart) {
  startGamePress = true;
  eventStart.currentTarget.classList.remove('button--start');
  eventStart.currentTarget.classList.add('button--restart');
  eventStart.currentTarget.textContent = 'restart';
  score.textContent = 0;
  message.forEach(m => m.classList.add('hidden'));

  removeStyleCell();
  clearCell();
  fillRandomCell(true);
  fillRandomCell(true);
}

function moveItem(eventKey) {
  eventKey.preventDefault();
  let isMove = false;

  const arrKey = ['ArrowUp', 'ArrowDown', 'ArrowRight', 'ArrowLeft'];

  if (!arrKey.includes(eventKey.key) || !startGamePress) {
    return;
  }

  switch (eventKey.key) {
    case 'ArrowUp':
      isMove = move(fieldTurnRows);
      break;
    case 'ArrowDown':
      isMove = move(reversFieldTurnRows);
      break;
    case 'ArrowRight':
      isMove = move(reversField);
      break;
    case 'ArrowLeft':
      isMove = move(gameField);
      break;
    default:
      throw Error('key no move');
  }

  const state = fillRandomCell(isMove);

  if (!state) {
    gameOver(score.textContent, true);
  }
}

function move(field) {
  let isMoveCell = false;

  field.forEach(e => {
    for (let i = 1; i < e.length; i++) {
      if (e[i].textContent === '') {
        continue;
      }

      let target;
      let j = i - 1;

      while (
        j >= 0
        && (e[j].textContent === ''
        || e[j].textContent === e[i].textContent)
      ) {
        target = e[j];
        j--;
      }

      if (!target) {
        continue;
      }

      isMoveCell = mergeMove(target, e[i]);
    }
  });

  return isMoveCell;
}

function mergeMove(targ, cell) {
  if (targ.textContent === '') {
    targ.textContent = cell.textContent;
    cell.textContent = '';
    cell.className = 'field-cell';

    return true;
  }

  if (targ.textContent === cell.textContent) {
    targ.textContent = cell.textContent * 2;
    cell.textContent = '';
    cell.className = 'field-cell';

    gameOver(addScore(targ.textContent));

    return true;
  }

  return false;
}

function random2And4() {
  const arrNum = [4];

  arrNum.length = 10;
  arrNum.fill(2, 1);

  return arrNum[Math.round(Math.random())];
}

function getRandom(max, min = 0) {
  return Math.floor(Math.random() * (max - min) + min);
}

function fillRandomCell(isMove) {
  const emptyCells = [...gameField]
    .flat()
    .filter(cell => !cell.textContent);

  if (emptyCells.length === 0) {
    return false;
  }

  if (isMove) {
    emptyCells[getRandom(emptyCells.length)].textContent = random2And4();
    addStyleCell();
  }  

  return true;
}

function clearCell() {
  gameField.forEach(row => {
    row.forEach(cell => {
      cell.textContent = '';
    });
  });
}

function removeStyleCell() {
  gameField.forEach(e => {
    e.forEach(a => {
      if (a.textContent !== '') {
        a.className = 'field-cell';
      }
    });
  });
}

function addStyleCell() {
  gameField.forEach(e => {
    e.forEach(a => {
      if (a.textContent !== '') {
        a.classList.add(`field-cell--${a.textContent}`);
      }
    });
  });
}

function addScore(num = 0) {
  score.textContent = +score.textContent + +num;

  return +score.textContent + +num;
}

function gameOver(num, over = false) {
  if (+num >= 2048) {
    win.classList.remove('hidden');
    startGamePress = false;

    return;
  }

  if (over) {
    lose.classList.remove('hidden');
    startGamePress = false;
  }
}
