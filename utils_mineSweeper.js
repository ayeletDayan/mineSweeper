window.addEventListener("contextmenu", e => e.preventDefault());

function level(size, mines) {
  gSize = size
  gMines = mines
}

function buildBoard() { //Builds the board Set mines at random locations Call setMinesNegsCount() Return the created boar
  for (var i = 0; i < gSize; i++) {
    gBoard[i] = []
    for (var j = 0; j < gSize; j++) {
      gBoard[i][j] = {
        in: EMPTY,
        out: '',
        isOpen: false
      }
    }
  }
  for (var i = 0; i < gMines; i++) {
    var idxI = getRandomInt(0, gSize)
    var idxJ = getRandomInt(0, gSize)
    gBoard[idxI][idxJ].in = MINE
  }
  for (var i = 0; i < gSize; i++) {
    for (var j = 0; j < gSize; j++) {
      if (gBoard[i][j].in !== MINE) {
        var neighbors = checkNeighbors(gBoard, i, j, gSize, gSize)
        if (neighbors) gBoard[i][j].in = neighbors
      }
    }
  }
}

function renderBoard(board) { //Render the board as a <table> to the page
  var strHTML = ''
  for (var i = 0; i < gSize; i++) {
    strHTML += '<tr>'
    for (var j = 0; j < gSize; j++) {
      strHTML += `<td "${i}"-"${j}" in: "${board[i][j].in} onmousedown="cellClicked(this,${i},${j},event.which)" class="cell">` + board[i][j].out + `</td>`
    }
    strHTML += '</tr>'
  }
  var elBoard = document.querySelector('.board')
  elBoard.innerHTML = strHTML
}

function stopper() {
  var now = (Date.now() - gTime) / 1000
  var elTime = document.querySelector('span')
  elTime.innerText = now
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function checkNeighbors(board, colIdx, rowIdx, MaxRowLength, MaxColLength) {
  var count = 0
  for (var i = colIdx - 1; i <= colIdx + 1; i++) {
    if (i < 0 || i > MaxColLength - 1) continue // not outside board
    for (var j = rowIdx - 1; j <= rowIdx + 1; j++) {
      if (j < 0 || j > MaxRowLength - 1) continue // not outside board           
      if (i === colIdx && j === rowIdx) continue // not on currCel
      if (board[i][j].in === MINE) count++
    }
  }
  return count
}

function renderLife() {
  var strHTML = ''
  for (var i = 0; i < gLife; i++) {
    strHTML += LIFE
  }
  var elLife = document.querySelector('.life')
  elLife.innerHTML = strHTML
}

function renderStart(isWin) {
  if (!isWin){
    var strHTML = '&#128552'
    var elLife = document.querySelector('.button')
    elLife.innerHTML = strHTML
  }
  else {
    var strHTML = '&#128512'
    var elLife = document.querySelector('.button')
    elLife.innerHTML = strHTML
  }
}