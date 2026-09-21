// Deep Sea Mystery game
// Click a tile to hide it. When all tiles are gone, the creature is revealed.

// Get the parts of the page we need
const tiles = document.querySelectorAll('.tile');
const counter = document.getElementById('counter');
const winMessage = document.getElementById('win-message');
const resetButton = document.getElementById('reset-btn');

let tilesLeft = 9;

// When a tile is clicked, hide it and update the counter
tiles.forEach(function (tile) {
  tile.addEventListener('click', function () {
    tile.style.visibility = 'hidden';
    tilesLeft = tilesLeft - 1;
    counter.textContent = tilesLeft;

    // All tiles gone: show the answer and the Play Again button
    if (tilesLeft === 0) {
      winMessage.textContent = 'Well done! It is a Giant Pacific Octopus. It has three hearts and blue blood!';
      resetButton.style.display = 'inline-block';
    }
  });
});

// Play Again: show all the tiles and reset the counter
resetButton.addEventListener('click', function () {
  tiles.forEach(function (tile) {
    tile.style.visibility = 'visible';
  });
  tilesLeft = 9;
  counter.textContent = tilesLeft;
  winMessage.textContent = '';
  resetButton.style.display = 'none';
});