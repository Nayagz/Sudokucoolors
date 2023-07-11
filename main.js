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
            const select = document.createElement("select");
            select.id = `cell-${i}-${j}`;

            let colors = ["", 1, 2, 3, 4]; // 1=red, 2=blue, 3=green, 4=yellow
            colors.forEach(color => {
                const option = new Option(color, color);
                select.options.add(option);
            });

            select.value = colorGrid[i][j];
            select.disabled = !!colorGrid[i][j];

            cell.appendChild(select);
            row.appendChild(cell);
        }

        table.appendChild(row);
    }
};

function checkSolution() {
    for (let i = 0; i < 4; i++) {
        const rowColors = new Set();
        const colColors = new Set();

        for (let j = 0; j < 4; j++) {
            const rowColor = document.getElementById(`cell-${i}-${j}`).value;
            const colColor = document.getElementById(`cell-${j}-${i}`).value;

            if (rowColors.has(rowColor) || colColors.has(colColor)) {
                document.getElementById("result").textContent = "Incorrect solution!";
                return;
            }

            rowColors.add(rowColor);
            colColors.add(colColor);
        }
    }

    document.getElementById("result").textContent = "Correct solution!";
}
