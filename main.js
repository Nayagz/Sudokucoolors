let timer;
let sec = 0;
let min = 0;

const colorGrid = [
    [1, 0, 0, 0],
    [0, 2, 0, 0],
    [0, 0, 3, 0],
    [0, 0, 0, 4]
];

window.onload = function() {
    const table = document.getElementById("colorGrid");

    for (let i = 0; i < 4; i++) {
        const row = document.createElement("tr");

        for (let j = 0; j < 4; j++) {
            const cell = document.createElement("td");
            const colorPicker = document.createElement("input");

            colorPicker.type = "color";
            colorPicker.id = `cell-${i}-${j}`;

            let colors = ["#000000", "#FF0000", "#0000FF", "#008000", "#FFFF00"];
            colorPicker.value = colors[colorGrid[i][j]];
            colorPicker.disabled = !!colorGrid[i][j];

            colorPicker.addEventListener('change', function() {
                cell.style.backgroundColor = this.value;
            });

            cell.appendChild(colorPicker);
            row.appendChild(cell);
        }

        table.appendChild(row);
    }

    timer = setInterval(function() {
        sec++;
        if (sec === 60) {
            sec = 0;
            min++;
        }
        document.getElementById('timer').innerText = `${min < 10 ? '0' + min : min}:${sec < 10 ? '0' + sec : sec}`;
    }, 1000);
};

function checkSolution() {
    clearInterval(timer);
    let topScores = JSON.parse(localStorage.getItem('topScores')) || [];

    topScores.push(min * 60 + sec);
    topScores.sort((a, b) => a - b);

    if (topScores.length > 5) {
        topScores.length = 5; // Only keep top 5
    }

    localStorage.setItem('topScores', JSON.stringify(topScores));

    for (let i = 0; i < 4; i++) {
        const rowColors = new Set();
        const colColors = new Set();

        for (let j = 0; j < 4; j++) {
            const rowColor = document.getElementById(`cell-${i}-${j}`).value;
            const colColor = document.getElementById(`cell-${j}-${i}`).value;

            if (rowColors.has(rowColor)) {
                document.getElementById("result").textContent = "Same color detected in the row!";
                return;
            }

            if (colColors.has(colColor)) {
                document.getElementById("result").textContent = "Same color detected in the column!";
                return;
            }

            rowColors.add(rowColor);
            colColors.add(colColor);
        }
    }
    
    document.getElementById("result").textContent = "Correct solution!";
}

function viewTopScores() {
    let topScores = JSON.parse(localStorage.getItem('topScores')) || [];
    alert('Top Scores (in seconds):\n' + topScores.join('\n'));
}
