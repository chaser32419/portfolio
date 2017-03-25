//Displays Messages and hits
var view = {
    displayMessage: function(msg) {
        var messageArea = document.getElementById("messageArea");
        messageArea.innerHTML = msg;
    },
    displayHit: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "hit");
    },
    displayMiss: function(location) {
        var cell = document.getElementById(location);
        cell.setAttribute("class", "miss");
    }
};

//Holds the state of the game
var model = {
    boardSize: 7,
    numShips: 3,
    shipLength: 3,
    shipsSunk: 0,
    ships: [{
            locations: ["0", "0", "0"],
            hits: ["", "", ""]
        },
        {
            locations: ["0", "0", "0"],
            hits: ["", "", ""]
        },
        {
            locations: ["0", "0", "0"],
            hits: ["", "", ""]
        },
        {
            locations: ["0", "0", "0"],
            hits: ["", "", ""]
        },
        {
            locations: ["0", "0", "0"],
            hits: ["", "", ""]
        }
    ],
    fire: function(guess) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = this.ships[i];
            var index = ship.locations.indexOf(guess);
            if (index >= 0) {
                if (ship.hits[index] !== "hit") {
                    ship.hits[index] = "hit";
                    view.displayHit(guess);
                    view.displayMessage("HIT!");
                    if (this.isSunk(ship)) {
                        this.shipsSunk++;
                        view.displayMessage("You sank my battleship!");
                    }
                    return true;
                } else {
                    view.displayMessage("That location has already been hit.");
                    return false;
                }
            }
        }
        view.displayMiss(guess);
        view.displayMessage("You missed.");
        return false;
    },
    isSunk: function(ship) {
        for (var i = 0; i < this.shipLength; i++) {
            if (ship.hits[i] !== "hit") {
                return false;
            }
        }
        return true;
    },
    generateShipLocations: function() {
        var locations;
        for (var i = 0; i < this.numShips; i++) {
            do {
                locations = this.generateShip();
            } while (this.collision(locations));
            this.ships[i].locations = locations;
        }
    },
    generateShip: function() {
        var direction = Math.floor(Math.random() * 2);
        var row;
        var col;
        if (direction === 1) {
            row = Math.floor(Math.random() * this.boardSize);
            col = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
        } else {
            row = Math.floor(Math.random() * (this.boardSize - (this.shipLength + 1)));
            col = Math.floor(Math.random() * this.boardSize);
        }
        var newShipLocations = [];
        for (var i = 0; i < this.shipLength; i++) {
            if (direction === 1) {
                newShipLocations.push(row + "" + (col + i));
            } else {
                newShipLocations.push((row + i) + "" + col);
            }
        }
        return newShipLocations;
    },
    collision: function(locations) {
        for (var i = 0; i < this.numShips; i++) {
            var ship = model.ships[i];
            for (var j = 0; j < locations.length; j++) {
                if (ship.locations.indexOf(locations[j]) >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
};

//Takes the players guesses and talks to the model and view objects
var controller = {
    guesses: 0,
    processGuess: function(guess) {
        var location = parseGuess(guess);
        if (location) {
            this.guesses++;
            var hit = model.fire(location);
            if (hit && model.shipsSunk === model.numShips) {
                view.displayMessage("You sank all my battleships, in " + this.guesses + " guesses, your accuracy is " +
                    Math.round(((model.shipLength * model.numShips) / this.guesses) * 100) + "%!");
                alert("You sank all my battleships, in " + this.guesses + " guesses, your accuracy is " +
                    Math.round(((model.shipLength * model.numShips) / this.guesses) * 100) + "%!");
                if (confirm("Would you like to reset and play again?")) {
                    document.location.reload();
                }
            }
        }
    }
};
//parses player input for validity and converts the letters to numbers
function parseGuess(guess) {
    var alphabet = ["A", "B", "C", "D", "E", "F", "G"];
    if (guess === null || guess.length !== 2) {
        alert("Oops, please enter a letter and a number on the board.");
    } else {
        var firstChar = guess.charAt(0).toUpperCase();
        var row;
        switch (firstChar) {
            case "A":
            case "B":
            case "C":
            case "D":
            case "E":
            case "F":
            case "G":
                row = alphabet.indexOf(firstChar);
                break;
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
                row = firstChar;

        }
        var column = guess.charAt(1);
        if (isNaN(row) || isNaN(column)) {
            alert("Oops, that isn't on the board.");
        } else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
            alert("Oops, that's off the board.");
        } else {
            return row + column;
        }
    }
    return null;
}

//initializes the gome state and event handlers
function init() {
    var fireButton = document.getElementById("fireButton");
    fireButton.onclick = handleFireButton;
    var guessInput = document.getElementById("guessInput");
    guessInput.onkeypress = handleKeyPress;
    model.generateShipLocations();
    view.displayMessage("Click on the cell you wish to shoot or type the cell into the field below.");
    events();
}

//processes player input when the fire button is pressed
function handleFireButton() {
    var guessInput = document.getElementById("guessInput");
    var guess = guessInput.value;
    controller.processGuess(guess);
    guessInput.value = "";
}

//processes player input when the enter/return key is pressed
function handleKeyPress(e) {
    var fireButton = document.getElementById("fireButton");
    if (e.keyCode === 13) {
        fireButton.click();
        return false;
    }
}

//adds on click evenr to the table for the cells
function events() {
    var table = document.getElementsByTagName("table")[0];
    table.addEventListener("click", function(e) {
        controller.processGuess(e.target.id);
    });
}

window.onload = init;
