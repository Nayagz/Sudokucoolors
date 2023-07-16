function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateGrid() {
  const colorGrid = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const colors = [1, 2, 3, 4];
  const shuffledColors = shuffle(colors);
  let index = 0;

  while (index < 4) {
    const row = getRandomInt(0, 3);
    const col = getRandomInt(0, 3);

    if (colorGrid[row][col] === 0) {
      colorGrid[row][col] = shuffledColors[index++];
    }
  }

  return colorGrid;
}

function shuffle(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

let timer;
let sec = 0;
let min = 0;

const correctSound =
  "https://raw.githubusercontent.com/Nayagz/storage/main/zapsplat_multimedia_game_sound_win_complete_game_congratulations_harp_glissando_with_fanfare_and_fireworks_79053.mp3";
const incorrectSound =
  "https://raw.githubusercontent.com/Nayagz/storage/main/zapsplat_multimedia_male_voice_processed_says_you_lose_21571.mp3";

function playSound(soundFile) {
  let audio = new Audio(soundFile);
  audio.play();
}

const colorGrid = generateGrid();

window.onload = function () {
  const table = document.getElementById("colorGrid");

  for (let i = 0; i < 4; i++) {
    const row = document.createElement("tr");

    for (let j = 0; j < 4; j++) {
      const cell = document.createElement("td");
      const select = document.createElement("select");
      select.id = `cell-${i}-${j}`;

      let colors = ["", "red", "blue", "green", "yellow"];
      colors.forEach((color) => {
        const option = new Option(color, color);
        option.className = color;
        select.options.add(option);
      });

      if (colorGrid[i][j] !== 0) {
        cell.className = colors[colorGrid[i][j]];
        cell.appendChild(document.createTextNode(colors[colorGrid[i][j]]));
      } else {
        select.addEventListener("change", function () {
          cell.className = this.value;
        });

        cell.appendChild(select);
      }

      row.appendChild(cell);
    }

    table.appendChild(row);
  }

  timer = setInterval(function () {
    sec++;
    if (sec === 60) {
      sec = 0;
      min++;
    }
    document.getElementById("timer").innerText = `${min < 10 ? "0" + min : min}:${sec < 10 ? "0" + sec : sec}`;
  }, 1000);
};

function checkSolution() {
  clearInterval(timer);
  let topScores = JSON.parse(localStorage.getItem("topScores")) || [];

  topScores.push(min * 60 + sec);
  topScores.sort((a, b) => a - b);

  if (topScores.length > 5) {
    topScores.length = 5;
  }

  localStorage.setItem("topScores", JSON.stringify(topScores));

  for (let i = 0; i < 4; i++) {
    const rowColors = new Set();
    const colColors = new Set();

    for (let j = 0; j < 4; j++) {
      let rowElement = document.getElementById(`cell-${i}-${j}`);
      let colElement = document.getElementById(`cell-${j}-${i}`);

      let rowColor;
      let colColor;
      
      if (rowElement.children[0] && rowElement.children[0].nodeName === "SELECT") {
        rowColor = rowElement.children[0].value;
      } else {
        rowColor = rowElement.className;
      }

      if (colElement.children[0] && colElement.children[0].nodeName === "SELECT") {
        colColor = colElement.children[0].value;
      } else {
        colColor = colElement.className;
      }

      if (rowColor && rowColors.has(rowColor)) {
        document.getElementById("result").textContent = "Same color detected in the row!";
        return;
      }

      if (colColor && colColors.has(colColor)) {
        document.getElementById("result").textContent = "Same color detected in the column!";
        return;
      }

      if (rowColor) {
        rowColors.add(rowColor);
      }

      if (colColor) {
        colColors.add(colColor);
      }
    }
  }

  // Check each 2x2 square
  for (let row = 0; row < 4; row += 2) {
    for (let col = 0; col < 4; col += 2) {
      const squareColors = new Set();

      for (let i = row; i < row + 2; i++) {
        for (let j = col; j < col + 2; j++) {
          let cellElement = document.getElementById(`cell-${i}-${j}`);
          let cellColor;
          
          if (cellElement.children[0] && cellElement.children[0].nodeName === "SELECT") {
            cellColor = cellElement.children[0].value;
          } else {
            cellColor = cellElement.className;
          }

          if (cellColor && squareColors.has(cellColor)) {
            document.getElementById("result").textContent = "Same color detected in a square!";
            return;
          }

          if (cellColor) {
            squareColors.add(cellColor);
          }
        }
      }
    }
  }

  document.getElementById("result").textContent = "Correct solution!";
  document.getElementById("result").classList.add("pulse");
  playSound(correctSound);
}

function viewTopScores() {
  let topScores = JSON.parse(localStorage.getItem("topScores")) || [];
  alert("Top Scores (in seconds):\n" + topScores.join("\n"));
}

