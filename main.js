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

const colorGrid = [
  [1, 0, 0, 0],
  [0, 2, 0, 0],
  [0, 0, 3, 0],
  [0, 0, 0, 4],
];

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
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let element = document.getElementById(`cell-${i}-${j}`);
      if (element.children[0] && element.children[0].nodeName === "SELECT" && element.children[0].value === "") {
        alert('Please fill all the cells before checking the solution!');
        return;
      }
    }
  }

  // Stop Timer
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
        playSound(incorrectSound);
        return;
      }

      if (colColor && colColors.has(colColor)) {
        document.getElementById("result").textContent = "Same color detected in the column!";
        playSound(incorrectSound);
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
            playSound(incorrectSound);
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
