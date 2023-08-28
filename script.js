let matrix2D = [];
let inputMode = "pencil"

let mouseDown = false;
document.body.onmousedown = () => (mouseDown = true)
document.body.onmouseup = () => (mouseDown = false)

const clearBtn = document.querySelector(".btn-clear");
const pencilBtn = document.querySelector(".btn-pencil");
const rubberBtn = document.querySelector(".btn-rubber");
const fillBtn = document.querySelector(".btn-fill");


const colourPicker = document.getElementById("colourPicker");
const gridRange = document.getElementById('grid-size-input');

function generateGrid(size = 16 ) {
    const gridContainer = document.getElementById('grid-container');

    gridContainer.innerHTML = '';

    gridContainer.style.gridTemplateColumns = `repeat(${size}, auto)`

    for (let i = 0; i < size * size; i += 1) {
        const div = document.createElement('div');
        div.classList.add('square')
        div.id = `square-${i}`
        div.addEventListener('mousedown', changeColour)
        div.addEventListener('mouseover', changeColour)
        gridContainer.appendChild(div);
    }
    matrix2D = generateMatrix(gridContainer.children, size);
}

clearBtn.addEventListener('click', function () {
    let squares = document.querySelectorAll(".square")
    squares.forEach(square => square.style.backgroundColor = "#ffffff")
})

gridRange.addEventListener('input', function () {
    this.setAttribute('value', this.value);
    document.getElementById('grid-size-label').textContent = `${this.value} x ${this.value}`
    generateGrid(Number(this.value));
})

const toggleButtons = [pencilBtn, rubberBtn, fillBtn];
toggleButtons.forEach(toggleButton => { toggleButton.addEventListener('click', function () {
    toggleButtons.forEach((toggleButton) => {toggleButton.classList.remove("toggled")})
    this.classList.add("toggled");
    inputMode = this.name;
})});

// change background colour of a square, dependent on the input mode
function changeColour(e) {
    if (e.type === 'mouseover'){
        if (mouseDown === false) {
            return
        }
    }

    if (inputMode === "pencil") {
        this.style.backgroundColor = colourPicker.value;
    } else if (inputMode === "rubber") {
        this.style.backgroundColor = "#ffffff";
    } else if (inputMode === "fill") {
        floodFill(this);
    }
}


// generate a matrix, with a rows array and column array filled with the .square divs
function generateMatrix(squaresArray, size) {
    let colsArray = [];
    let rowsArray = [];

    for (let i = 0; i < (size * size); i+=size) {
        let row = []

        for (let j = i; j < i + size; j++) {
            row.push(document.getElementById(`square-${j}`));
        }
        rowsArray.push(row);
    }

    for (let i = 0; i < size; i++) {
        let column = []
        for (let j = i; j < squaresArray.length; j += size) {
            column.push(squaresArray[j]);
        }
         colsArray.push(column);
    }

    return {rows: rowsArray, cols: colsArray};
}

// get the x and y coordinates in the 2D Matrix of the targeted square
function getCoordinates(targetSquareDiv) {
    let x;
    let y;

    for (const [index, row] of matrix2D.rows.entries()) {
        x = row.findIndex(squareDiv => squareDiv.id === targetSquareDiv.id);
        if (x !== -1) {
            y = index;
            break
        }
    }
    return {x,y}
}

// return an array of qualified neighbours (same colour) of a targeted square
function findNeighbours(targetSquare, originalColour, fillColour) {
    // array of possible neighbours in a circle around a div
    const coordinates = getCoordinates(targetSquare);
    const x = coordinates.x;
    const y = coordinates.y;

    const possibleNeighbours = [];
    if (x !== 0) {
        possibleNeighbours.push(matrix2D.rows[y][x - 1])
    }
    if (x !== matrix2D.rows.length - 1) {
        possibleNeighbours.push(matrix2D.rows[y][x + 1])
    }
    if (y !== 0) {
        possibleNeighbours.push(matrix2D.rows[y - 1][x])
    }
    if (y !== matrix2D.rows.length - 1) {
        possibleNeighbours.push(matrix2D.rows[y + 1][x])
    }

    const validNeighbours = [];
    possibleNeighbours.forEach(possibleNeighbour => {
        if (
            window.getComputedStyle(possibleNeighbour).backgroundColor === originalColour &&
            window.getComputedStyle(possibleNeighbour).backgroundColor !== fillColour
        ) {
            validNeighbours.push(possibleNeighbour)
        }
    });
    return validNeighbours;
}

// colour the surrounding area of a targeted square
function floodFill(target, originalColour, fillColour) {
    originalColour = window.getComputedStyle(target).backgroundColor;
    fillColour = colourPicker.value;

    if (originalColour === fillColour) {
        return
    }

    const queue = [target];

    while (queue.length > 0) {

        queue[0].style.backgroundColor = fillColour;

        const properNeighbours = findNeighbours(queue.shift(), originalColour, fillColour);

        for (const square of properNeighbours){
            queue.push(square);
            square.style.backgroundColor = fillColour;
        }
    }
}



generateGrid();