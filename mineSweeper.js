'use strict'
var gSize
var gMines
var gBoard = []
var gTimeInterval
var gTime
var gLife = 3
var gHint = 3
var gOpenCells = 0
var gFlagCount = 0
var isHint
var gHintInterval
var bestScore = {
    beginner: 0,
    medium: 0,
    expert: 0
}
var gSafeClick = 3
var gUndoArr = []

const MINE = '&#128163'
const EMPTY = '&#127808'
const FLAG = '&#128681'
const LIFE = '&#128151'
const HINT = '&#10067'


var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}

function initGame() { //This is called when page loads
    renderStart(true)
    gGame.isOn = false
    clearInterval(gTimeInterval)
    var elTime = document.querySelector('span')
    elTime.innerText = '00:00'
    gLife = 3
    gHint = 3
    gSafeClick = 3
    gOpenCells = 0
    gFlagCount = 0
    var gUndoArr = []
    buildBoard()
    renderBoard(gBoard)
    renderObject(gLife, LIFE, '.life')
    renderObject(gHint, HINT, '.hint')
    document.querySelector('.safe-Click').innerHTML = '3 Safe Click'
}

function start() {
    initGame()
}

function cellClicked(elCell, i, j, ev) { //Called when a cell (td) is clicked
    //hint    
    if (isHint) showHint(i, j)
    //game
    if (!gGame.isOn && ev !== 3 && gBoard[i][j].in === MINE) return
    if (gBoard[i][j].isOpen) return
    if (!gGame.isOn && ev === 3) {
        startTime()
        gGame.isOn = true
        gBoard[i][j].out = FLAG
        gUndoArr.push({i: i,j: j, in: gBoard[i][j].in, out:  gBoard[i][j].out})        
        gFlagCount++
    }
    if (!gGame.isOn && gBoard[i][j].in !== MINE) {
        startTime()
        gGame.isOn = true
    }
    if (ev === 3) {
        if (gBoard[i][j].out === FLAG) {
            gBoard[i][j].out = ''
            gUndoArr.push({i: i,j: j, in: gBoard[i][j].in, out:  gBoard[i][j].out})
            gFlagCount--
        }
        else {
            gBoard[i][j].out = FLAG
            gUndoArr.push({i: i,j: j, in: gBoard[i][j].in, out:  gBoard[i][j].out})
            gFlagCount++
        }
        renderBoard(gBoard)
    }
    else if (gBoard[i][j].out === FLAG) return
    else if (gBoard[i][j].in === EMPTY) {
        gBoard[i][j].out = EMPTY
        gUndoArr.push({i: i,j: j, in: gBoard[i][j].in, out:  gBoard[i][j].out})
        renderBoard(gBoard)
        openEmptyNeighbors(i, j)
    }
    else {
        gBoard[i][j].out = gBoard[i][j].in
        gUndoArr.push({i: i,j: j, in: gBoard[i][j].in, out:  gBoard[i][j].out})
        gBoard[i][j].isOpen = true
        renderBoard(gBoard)
        gOpenCells++
        if (gBoard[i][j].out === MINE) {
            gLife--
            renderObject(gLife, LIFE, '.life')
        }
    }
    checkGameOver()    
}

function checkGameOver() { //Game ends when all mines are marked, and all the other cells are shown
    if ((gSize === 4 && gLife === 1) || (gLife === 0)) {
        renderStart(false)
        //all mines should be revealed
        for (var i = 0; i < gSize; i++) {
            for (var j = 0; j < gSize; j++) {
                if (gBoard[i][j].in === MINE) gBoard[i][j].out = MINE
            }
        }
        renderBoard(gBoard)
        console.log('game over')
        clearInterval(gTimeInterval)
    }
    else if ((gOpenCells + gFlagCount) === (gSize * gSize)) {
        renderStart(true)
        console.log('You Win!')
        clearInterval(gTimeInterval)
        var score = Date.now() - gTime
        checkBestScore(score)
    }
}

function checkBestScore(newScore) {
    switch (gSize) {
        case 4:
            if (!bestScore.beginner || newScore < bestScore.beginner) {
                bestScore.beginner = newScore
                localStorage.beginnerBestScore = newScore
            }
            break
        case 8:
            if (!bestScore.medium || newScore < bestScore.medium) {
                bestScore.medium = newScore
                localStorage.mediumBestScore = newScore
            }
            break
        case 12:
            if (!bestScore.expert || newScore < bestScore.expert) {
                bestScore.expert = newScore
                localStorage.expertBestScore = newScore
            }

            break
    }
}
