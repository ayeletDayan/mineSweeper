'use strict'
var gSize
var gMines
var gTimeInterval
var gTime
var gLife = 3
var gOpenCells = 0
var gFlagCount = 0

const MINE = '&#128163'
const EMPTY = '&#127808'
const FLAG = '&#128681'
const LIFE = '&#128151'

var gBoard = []

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
    gOpenCells = 0
    gFlagCount = 0
    buildBoard()
    renderBoard(gBoard)
    renderLife()
}

function start() {
    initGame()
}

function cellClicked(elCell, i, j, ev) { //Called when a cell (td) is clicked
    if (gBoard[i][j].isOpen) return
    if (!gGame.isOn) {
        if (gBoard[i][j].in === MINE) return
        gTime = Date.now()
        gTimeInterval = setInterval(stopper, 10)
        gGame.isOn = true
    }
    if (ev === 3) {
        if (gBoard[i][j].out === FLAG) {
            gBoard[i][j].out = ''
            gFlagCount--
        }
        else {
            gBoard[i][j].out = FLAG
            renderBoard(gBoard)
            gFlagCount++
        }
    }
    else if (gBoard[i][j].in === EMPTY) {
        gBoard[i][j].out = EMPTY
        gOpenCells++
        for (var k = i - 1; k <= i + 1; k++) {
            if (k < 0 || k > gSize - 1) continue // not outside board
            for (var l = j - 1; l <= j + 1; l++) {
                if (l < 0 || l > gSize - 1) continue // not outside board           
                if (k === i && l === j) continue // not on currCel
                if (gBoard[k][l].in === EMPTY) {
                    gBoard[k][l].out = EMPTY
                    gBoard[k][l].isOpen = true
                    renderBoard(gBoard)
                    gOpenCells++
                }
            }
        }
    }
    else {
        gBoard[i][j].out = gBoard[i][j].in
        gBoard[i][j].isOpen = true
        renderBoard(gBoard)
        gOpenCells++
        if (gBoard[i][j].out === MINE)
            gLife--
        renderLife()
    }
    checkGameOver()
}

function checkGameOver() { //Game ends when all mines are marked, and all the other cells are shown
    if ((gSize === 4 && gLife === 1) || (gLife === 0)) {
        renderStart(false)
        console.log('game over')
        clearInterval(gTimeInterval)
    }
    else if ((gOpenCells + gFlagCount) === (gSize * gSize)) {
        renderStart(true)
        console.log('You Win!')
        clearInterval(gTimeInterval)
    }
}

function expandShown(board, elCell,
    i, j) {
    //When user clicks a cell with no mines around, we need to open not only that cell, but also its neighbors. NOTE: start with a basic implementation that only opens the non-mine 1st degree neighbors BONUS: if you have the time later, try to work more like the real algorithm (see description at the Bonuses section below)

}