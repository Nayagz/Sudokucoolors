let timer;
let sec = 0;
let min = 0;

const correctSound =
  "https://raw.githubusercontent.com/Nayagz/storage/main/zapsplat_multimedia_game_sound_win_complete_game_congratulations_harp_glissando_with_fanfare_and_fireworks_79053.mp3";
const incorrectSound =
  "https://raw.githubusercontent.com/Nayagz/storage/main/zapsplat_multimedia_male_voice_processed_says_you_lose_21571.mp3";

let colors = ["", "red", "blue", "green", "yellow"];

function playSound(soundFile) {
  let audio = new Audio(soundFile);
  audio.play();
}

function randomizeColorGrid() {
  let colorGrid = new Array(4).fill(0).map(() => new Array(4).fill(""));
  let positions = [];

  while (positions.length < 2) {
    let i = Math.floor(Math.random() * 4);
    let j = Math.floor(Math.random() * 4);

    if (!positions.some(([x, y]) => x === i && y === j)) {
      colorGrid[i][j] = colors[Math.floor(Math.random() * (colors.length - 1)) + 1]; // avoid using index 0
      positions.push([i, j]);
    }
  }
  return colorGrid;
}

let colorGrid = randomizeColorGrid();

window.onload = function () {
  const table = document.getElementById("colorGrid");

  for (let i = 0; i < 4; i++) {
    const row = document.createElement("tr");

    for (let j = 0; j < 4; j++) {
      const cell = document.createElement("td");
      const select = document.createElement("select");
      select.id = `cell-${i}-${j}`;

      colors.forEach((color) => {
        const option = new Option(color, color);
        option.className = color;
        select.options.add(option);
      });

      select.value = colorGrid[i][j];
      select.disabled = colorGrid[i][j] !== "";

      if (colorGrid[i][j] !== "") {
        select.value = colorGrid[i][j];
        cell.className = colorGrid[i][j];
        cell.style.backgroundColor = colorGrid[i][j];
      }

      select.addEventListener("change", function () {
        cell.className = this.value;
        cell.style.backgroundColor = this.value;
      });

      cell.appendChild(select);
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
  let cellsFilled = true;

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let element = document.getElementById(`cell-${i}-${j}`);
      if (element.value === "") {
        cellsFilled = false;
        break;
      }
    }
  }

  if (!cellsFilled) {
    document.getElementById("result").textContent = "Please fill all the cells before checking the solution!";
    playSound(incorrectSound);
    return;
  }

  let incorrect = false;
  
  // Checking each row for repeated colors
  for (let i = 0; i < 4; i++) {
    let rowColors = new Set();
    for (let j = 0; j < 4; j++) {
      let element = document.getElementById(`cell-${i}-${j}`);
      let color = element.value;
      if (rowColors.has(color)) {
        incorrect = true;
        break;
      } else {
        rowColors.add(color);
      }
    }
    if (incorrect) break;
  }

  // Checking each column for repeated colors
  if (!incorrect) {
    for (let j = 0; j < 4; j++) {
      let colColors = new Set();
      for (let i = 0; i < 4; i++) {
        let element = document.getElementById(`cell-${i}-${j}`);
        let color = element.value;
        if (colColors.has(color)) {
          incorrect = true;
          break;
        } else {
          colColors.add(color);
        }
      }
      if (incorrect) break;
    }
  }

  if (incorrect) {
    document.getElementById("result").textContent = "Incorrect solution!";
    playSound(incorrectSound);
  } else {
    document.getElementById("result").textContent = "Correct solution!";
    document.getElementById("result").classList.add("pulse");
    playSound(correctSound);

    // Stop Timer
    clearInterval(timer);

    let topScores = JSON.parse(localStorage.getItem("topScores")) || [];

    topScores.push(min * 60 + sec);
    topScores.sort((a, b) => a - b);

    if (topScores.length > 5) {
      topScores.length = 5;
    }

    localStorage.setItem("topScores", JSON.stringify(topScores));
  }
}
