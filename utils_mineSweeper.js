window.addEventListener("contextmenu", e => e.preventDefault());

function level(size, mines) {
  gSize = size
  gMines = mines
  var score = (size === 4) ? localStorage.beginnerBestScore : (size === 8) ? localStorage.mediumBestScore : localStorage.expertBestScore
  var elBestScore = document.querySelector('.bestScore')
  elBestScore.innerHTML = score / 1000
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
    var idxI = getRandomInt(0, gSize - 1)
    var idxJ = getRandomInt(0, gSize - 1)
    if (gBoard[idxI][idxJ].in === MINE) i--
    else gBoard[idxI][idxJ].in = MINE
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

function startTime() {
  gTime = Date.now()
  gTimeInterval = setInterval(stopper, 100)
  gGame.isOn = true
}

function stopper() {
  var now = (Date.now() - gTime) / 1000
  var elTime = document.querySelector('.time')
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

function renderObject(sum, object, value) {
  var strHTML = ''
  for (var i = 0; i < sum; i++) {
    strHTML += object
  }
  var elLife = document.querySelector(value)
  elLife.innerHTML = strHTML
}

function renderStart(isWin) {
  if (!isWin) {
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

function openEmptyNeighbors(i, j) {
  for (var k = i - 1; k <= i + 1; k++) {
    if (k < 0 || k > gSize - 1) continue // not outside board
    for (var l = j - 1; l <= j + 1; l++) {
      if (l < 0 || l > gSize - 1) continue // not outside board           
      if (k === i && l === j) continue // not on currCel
      if (!gBoard[k][l].isOpen && gBoard[k][l].in === EMPTY) {
        gBoard[k][l].out = EMPTY
        gBoard[k][l].isOpen = true
        gOpenCells++
        openEmptyNeighbors(k, l)
      }
    }
  }
  renderBoard(gBoard)
}

function hint() {
  if (gHint === 0) return
  var elHint = document.querySelector('.hint')
  elHint.innerHTML = 'Hint'
  isHint = true
}

function showHint(colIdx, rowIdx) {
  var hintCells = []
  for (var i = colIdx - 1; i <= colIdx + 1; i++) {
    if (i < 0 || i > gSize - 1) continue // not outside board
    for (var j = rowIdx - 1; j <= rowIdx + 1; j++) {
      if (j < 0 || j > gSize - 1) continue // not outside board
      if (gBoard[i][j].out === '') {
        gBoard[i][j].out = gBoard[i][j].in
        hintCells.push({ i, j })
      }
    }
  }
  isHint = false
  gHint--
  renderObject(gHint, HINT, '.hint')
  renderBoard(gBoard)
  setTimeout(function () {
    hideHint(hintCells)
  }, 1000);
}

function hideHint(cells) {
  for (var i = 0; i < cells.length; i++) {
    gBoard[cells[i].i][cells[i].j].out = ''
    gBoard[cells[i].i][cells[i].j].isOpen = false
    renderBoard(gBoard)
  }
}

function safeClick() {
  if (gSafeClick === 0) return
  var idxI = getRandomInt(0, gSize - 1)
  var idxJ = getRandomInt(0, gSize - 1)
  if (!gBoard[idxI][idxJ].isOpen && gBoard[idxI][idxJ].in !== MINE) {
    gBoard[idxI][idxJ].out = gBoard[idxI][idxJ].in
    renderBoard(gBoard)
  }
  else safeClick()

  gSafeClick--

  var strHTML = ''
  strHTML += (gSafeClick === 2) ? '2 Safe Click' : (gSafeClick === 1) ? '1 Safe Click' : 'No Safe Click'
  var elsafeClick = document.querySelector('.safe-Click')
  elsafeClick.innerHTML = strHTML

  setTimeout(function () {
    gBoard[idxI][idxJ].out = ''
    renderBoard(gBoard)
  }, 1000);

}

function undo() {
  // if game over and all the mines are showen, so it can cover then again but i think we should not alow it... i didn't finish all the condition for this issue
  if ((gSize === 4 && gLife === 1) || (gLife === 0)) {
    for (var i = 0; i < gSize; i++) {
      for (var j = 0; j < gSize; j++) {
        if (gBoard[i][j].in === MINE) gBoard[i][j].out = ''
      }
    }
  }
    console.log('undo')
    console.log(gUndoArr)
    gBoard[gUndoArr[gUndoArr.length - 1].i][gUndoArr[gUndoArr.length - 1].j].out = ''
    gBoard[gUndoArr[gUndoArr.length - 1].i][gUndoArr[gUndoArr.length - 1].j].isOpen = false
    closeEmptyNeighbors(gUndoArr[gUndoArr.length - 1].i, gUndoArr[gUndoArr.length - 1].j)
    renderBoard(gBoard)
    gUndoArr.pop(1)
    gOpenCells--
  }

  function closeEmptyNeighbors(i, j) {
    for (var k = i - 1; k <= i + 1; k++) {
      if (k < 0 || k > gSize - 1) continue // not outside board
      for (var l = j - 1; l <= j + 1; l++) {
        if (l < 0 || l > gSize - 1) continue // not outside board           
        if (k === i && l === j) continue // not on currCel
        if (gBoard[k][l].out === EMPTY) {
          gBoard[k][l].out = ''
          gBoard[k][l].isOpen = false
          gOpenCells--
          closeEmptyNeighbors(k, l)
        }
      }
    }
    renderBoard(gBoard)
  }

  function sevenBoom() {
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

    switch (gSize) {
      case 4: {
        gBoard[1][2].in = MINE
        gBoard[3][1].in = MINE
        break
      }
      case 8:
        {
          gBoard[0][6].in = MINE
          gBoard[1][5].in = MINE
          gBoard[2][4].in = MINE
          gBoard[3][3].in = MINE
          gBoard[4][2].in = MINE
          gBoard[5][1].in = MINE
          gBoard[6][0].in = MINE
          gBoard[6][7].in = MINE
          gBoard[7][6].in = MINE
          break
        }
      case 12:
        gBoard[0][6].in = MINE
        gBoard[1][1].in = MINE
        gBoard[1][8].in = MINE
        gBoard[2][3].in = MINE
        gBoard[2][10].in = MINE
        gBoard[3][5].in = MINE
        gBoard[4][0].in = MINE
        gBoard[4][7].in = MINE
        gBoard[5][9].in = MINE
        gBoard[5][2].in = MINE
        gBoard[6][4].in = MINE
        gBoard[6][11].in = MINE
        gBoard[7][6].in = MINE
        gBoard[8][1].in = MINE
        gBoard[8][8].in = MINE
        gBoard[9][3].in = MINE
        gBoard[9][10].in = MINE
        gBoard[10][5].in = MINE
        gBoard[11][0].in = MINE
        gBoard[11][7].in = MINE
        break
    }

    for (var i = 0; i < gSize; i++) {
      for (var j = 0; j < gSize; j++) {
        if (gBoard[i][j].in !== MINE) {
          var neighbors = checkNeighbors(gBoard, i, j, gSize, gSize)
          if (neighbors) gBoard[i][j].in = neighbors
        }
      }
    }

    renderBoard(gBoard)
  }