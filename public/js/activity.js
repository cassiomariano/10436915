// Deep Sea Mystery game logic

const tiles = document.querySelectorAll('.tile');
const counter = document.getElementById('counter');
const winMessage = document.getElementById('win-message');
const resetButton = document.getElementById('reset-btn');

let tilesLeft = 9;

// hide tile on click and update the counter
tiles.forEach(function (tile) {
  tile.addEventListener('click', function () {
    tile.style.visibility = 'hidden';
    tilesLeft = tilesLeft - 1;
    counter.textContent = tilesLeft;

    // show the creature and the Play Again button
    if (tilesLeft === 0) {
      winMessage.textContent = 'Well done! You found the Giant Pacific Octopus!. Curiously it has three hearts and blue blood!';
      resetButton.style.display = 'inline-block';
    }
  });
});

// show all the tiles and reset the counter
resetButton.addEventListener('click', function () {
  tiles.forEach(function (tile) {
    tile.style.visibility = 'visible';
  });
  tilesLeft = 9;
  counter.textContent = tilesLeft;
  winMessage.textContent = '';
  resetButton.style.display = 'none';
});