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
  let count = 0;
  
  while (count < 2) {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (!colorGrid[i][j] && Math.random() < 0.25) {
          colorGrid[i][j] = colors[Math.floor(Math.random() * colors.length)];
          count++;
        }
        if (count >= 2) {
          return colorGrid;
        }
      }
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

      if (colorGrid[i][j] !== "") {
        select.value = colorGrid[i][j];
        cell.className = colorGrid[i][j];
      }

      select.addEventListener("change", function () {
        cell.className = this.value;
        if (document.querySelectorAll('select[value=""]').length === 0) {
          clearInterval(timer);
        }
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
  if (document.querySelectorAll('select[value=""]').length !== 0) {
    alert('Please fill all the cells before checking the solution!');
    return;
  }

  let topScores = JSON.parse(localStorage.getItem("topScores")) || [];

  topScores.push(min * 60 + sec);
  topScores.sort((a, b) => a - b);

  if (topScores.length > 5) {
    topScores.length = 5;
  }

  localStorage.setItem("topScores", JSON.stringify(topScores));

  let incorrect = false;
  let message = '';
  
  // Checking each row for repeated colors
  for (let i = 0; i < 4; i++) {
    let rowColors = new Set();
    for (let j = 0; j < 4; j++) {
      let element = document.getElementById(`cell-${i}-${j}`);
      let color = element.children[0].value;
      if (rowColors.has(color)) {
        incorrect = true;
        message = 'Same color detected in the row!';
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
        let color = element.children[0].value;
        if (colColors.has(color)) {
          incorrect = true;
          message = 'Same color detected in the column!';
          break;
        } else {
          colColors.add(color);
        }
      }
      if (incorrect) break;
    }
  }

  if (incorrect) {
    document.getElementById("result").textContent = message;
    playSound(incorrectSound);
  } else {
    document.getElementById("result").textContent = "Correct solution!";
    document.getElementById("result").classList.add("pulse");
    playSound(correctSound);
  }
}

function viewTopScores() {
  let topScores = JSON.parse(localStorage.getItem("topScores")) || [];
  alert("Top Scores (in seconds):\n" + topScores.join("\n"));
}
