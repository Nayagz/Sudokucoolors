let colors = ["red", "blue", "green", "yellow"];
let grid = [
    ["red", "", "", ""],
    ["", "blue", "", ""],
    ["", "", "green", ""],
    ["", "", "", "yellow"]
];

window.onload = function() {
    let gridElement = document.getElementById("grid");

    for(let i = 0; i < 4; i++) {
        for(let j = 0; j < 4; j++) {
            let cell = document.createElement("div");

            if(grid[i][j] === "") {
                let select = document.createElement("select");
                select.id = `cell-${i}-${j}`;

                let defaultOption = new Option("Select color", "", true, true);
                defaultOption.disabled = true;
                select.options.add(defaultOption);

                colors.forEach(color => {
                    let option = new Option("", color);
                    option.style.backgroundColor = color;
                    select.options.add(option);
                });

                select.style.display = "block";
                cell.appendChild(select);
            } else {
                cell.style.backgroundColor = grid[i][j];
            }

            gridElement.appendChild(cell);
        }
    }
};

function checkSolution() {
    for(let i = 0; i < 4; i++) {
        let rowColors = [];
        let columnColors = [];

        for(let j = 0; j < 4; j++) {
            let rowColor = grid[i][j];
            if(rowColor === "") {
                rowColor = document.getElementById(`cell-${i}-${j}`).value;
            }
            if(rowColors.includes(rowColor)) {
                document.getElementById("message").textContent = "Incorrect solution!";
                return;
            }
            rowColors.push(rowColor);

            let columnColor = grid[j][i];
            if(columnColor === "") {
                columnColor = document.getElementById(`cell-${j}-${i}`).value;
            }
            if(columnColors.includes(columnColor)) {
                document.getElementById("message").textContent = "Incorrect solution!";
                return;
            }
            columnColors.push(columnColor);
        }
    }

    document.getElementById("message").textContent = "Correct solution!";
}
