let timer;
let sec = 0;
let min = 0;

const correctSound =
  "https://github.com/Nayagz/storage/blob/main/zapsplat_multimedia_game_sound_win_complete_game_congratulations_harp_glissando_with_fanfare_and_fireworks_79053.mp3";
const incorrectSound =
  "https://github.com/Nayagz/storage/blob/main/zapsplat_multimedia_male_voice_processed_says_you_lose_21571.mp3";

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
    document.getElementById("timer").innerText = `${
      min < 10 ? "0" + min : min
    }:${sec < 10 ? "0" + sec : sec}`;
  }, 1000);
  document.getElementById("checkButton").onclick = checkSolution;
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
      const rowColor = document.getElementById(`cell-${i}-${j}`).value;
      const colColor = document.getElementById(`cell-${j}-${i}`).value;

      if (rowColors.has(rowColor)) {
        document.getElementById("result").textContent =
          "Same color detected in the row!";
        return;
      }

      if (colColors.has(colColor)) {
        document.getElementById("result").textContent =
          "Same color detected in the column!";
        return;
      }

      rowColors.add(rowColor);
      colColors.add(colColor);
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
