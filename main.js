let colorGrid = [
    ["red", "", "", ""],
    ["", "blue", "", ""],
    ["", "", "green", ""],
    ["", "", "", "yellow"]
];

window.onload = function() {
    let table = document.getElementById("colorGrid");

    for(let i = 0; i < 4; i++) {
        let row = document.createElement("tr");

        for(let j = 0; j < 4; j++) {
            let cell = document.createElement("td");

            if(colorGrid[i][j] === "") {
                let select = document.createElement("select");
                select.id = `cell-${i}-${j}`;

                let defaultOption = new Option("Select color", "", true, true);
                defaultOption.disabled = true;
                select.options.add(defaultOption);

                ["red", "blue", "green", "yellow"].forEach(color => {
                    let option = new Option(color, color);
                    select.options.add(option);
                });

                cell.appendChild(select);
            } else {
                cell.style.backgroundColor = colorGrid[i][j];
            }

            row.appendChild(cell);
        }

        table.appendChild(row);
    }
};

function checkSolution() {
    for(let i = 0; i < 4; i++) {
        let rowColors = [];
        let columnColors = [];

        for(let j = 0; j < 4; j++) {
            let rowColor = colorGrid[i][j];
            if(rowColor === "") {
                rowColor = document.getElementById(`cell-${i}-${j}`).value;
            }
            if(rowColors.includes(rowColor)) {
                document.getElementById("result").textContent = "Incorrect solution!";
                return;
            }
            rowColors.push(rowColor);

            let columnColor = colorGrid[j][i];
            if(columnColor === "") {
                columnColor = document.getElementById(`cell-${j}-${i}`).value;
            }
            if(columnColors.includes(columnColor)) {
                document.getElementById("result").textContent = "Incorrect solution!";
                return;
            }
            columnColors.push(columnColor);
        }
    }

    document.getElementById("result").textContent = "Correct solution!";
}
