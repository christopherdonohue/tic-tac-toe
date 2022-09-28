const cells = [...document.querySelectorAll('.cell')];
const darkMode = document.querySelector('.dark-mode');
const board = document.querySelector('.board');
const winnerLines = [...document.querySelectorAll('.winner-line')];
const winnerText = document.querySelector('.winner-text');
let endGame = false;
const players = [
  {
    value: 'X',
    turn: true,
  },
  {
    value: 'O',
    turn: false,
  },
];

darkMode.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme-body');
  cells.forEach((cell) => {
    cell.classList.toggle('dark-theme-board');
    cell.children[0].classList.toggle('dark-theme-font');
    winnerText.classList.toggle('dark-theme-font');
  });
});

const checkForWin = () => {
  let winArr = [];
  let horizontals = [];
  let verticals = [];
  let diagonals = [[], []];
  let hWin;
  let vWin;
  let dWin;

  const checkForThreeMatchingValues = (arrays, isDiagonal = false) => {
    let results = { win: false, winningPlayer: null };
    arrays.forEach((row, index) => {
      if (
        row.every((el) => el.value === players[0].value) ||
        row.every((el) => el.value === players[1].value)
      ) {
        if (isDiagonal) {
          switch (index) {
            case 0:
              results.direction = 'diagonal-backward';
              break;
            case 1:
              results.direction = 'diagonal-forward';
              break;
          }
        }
        results.win = true;
        results.domElements = row.map((obj) => obj.domElement);
        switch (row[0].value) {
          case 'X':
            results.winningPlayer = players[0].value;
            break;
          case 'O':
            results.winningPlayer = players[1].value;
            break;
        }
      }
    });
    return results;
  };

  const displayWinner = (results) => {
    const div1 = document.createElement('div');
    const div2 = document.createElement('div');
    const div3 = document.createElement('div');
    div1.classList.add('winner');
    div2.classList.add('winner');
    div3.classList.add('winner');
    switch (results.direction) {
      case 'vertical':
        div1.classList.add('vertical');
        div2.classList.add('vertical');
        div3.classList.add('vertical');
        break;
      case 'diagonal-forward':
        winnerLines[0].classList.remove('hidden');
        break;
      case 'diagonal-backward':
        winnerLines[1].classList.remove('hidden');
        break;
    }
    if (!results.direction.includes('diagonal')) {
      results.domElements[0].appendChild(div1);
      results.domElements[1].appendChild(div2);
      results.domElements[2].appendChild(div3);
    }
    winnerText.children[0].innerText = `Winner is Player ${results.winningPlayer}`;
    endGame = true;
    startOrEndGame();
  };

  cells.forEach((cell) => {
    winArr.push({ value: cell.children[0].innerText, domElement: cell });
    if (winArr.length % 3 === 0) {
      horizontals.push(winArr);
      winArr = [];
    }
  });

  for (let i = 0; i < 3; i++) {
    horizontals.forEach((row) => {
      row.forEach((el, index) => {
        if (index === i) {
          winArr.push(el);
        }

        if (winArr.length / 3 === 1) {
          verticals.push(winArr);
          winArr = [];
        }
      });
    });
    if (i === 0) {
      diagonals[0].push(horizontals[0][0]);
      diagonals[1].push(horizontals[0][2]);
    } else if (i === 1) {
      diagonals[0].push(horizontals[1][1]);
      diagonals[1].push(horizontals[1][1]);
    } else if (i === 2) {
      diagonals[0].push(horizontals[2][2]);
      diagonals[1].push(horizontals[2][0]);
    }
  }

  hWin = checkForThreeMatchingValues(horizontals);
  vWin = checkForThreeMatchingValues(verticals);
  dWin = checkForThreeMatchingValues(diagonals, true);

  if (hWin.win) {
    hWin.direction = 'horizontal';
    displayWinner(hWin);
  } else if (vWin.win) {
    vWin.direction = 'vertical';
    displayWinner(vWin);
  } else if (dWin.win) {
    displayWinner(dWin);
  }
};

function startOrEndGame() {
  cells.forEach((cell) => {
    if (!endGame) {
      cell.addEventListener('click', () => {
        if (cell.children[0].classList.contains('unused')) {
          players.forEach((player) => {
            if (player.turn) {
              cell.children[0].innerText = player.value;
              player.turn = false;
            } else {
              player.turn = true;
            }
          });
          cell.children[0].classList.remove('unused');
        }
        checkForWin();
      });
    } else {
      cell.style.pointerEvents = 'none';
    }
  });
}

startOrEndGame();
