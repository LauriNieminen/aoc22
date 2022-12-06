/*
The first column is what your opponent is going to play: A for Rock, B for Paper, and C for Scissors
The second column, you reason, must be what you should play in response: X for Rock, Y for Paper, and Z for Scissors.
The score for a single round is the score for the shape you selected (1 for Rock, 2 for Paper, and 3 for Scissors) plus the score for the outcome of the round (0 if you lost, 3 if the round was a draw, and 6 if you won)

For example, suppose you were given the following strategy guide:

A Y
B X
C Z
This strategy guide predicts and recommends the following:

In the first round, your opponent will choose Rock (A), and you should choose Paper (Y). This ends in a win for you with a score of 8 (2 because you chose Paper + 6 because you won).
In the second round, your opponent will choose Paper (B), and you should choose Rock (X). This ends in a loss for you with a score of 1 (1 + 0).
The third round is a draw with both players choosing Scissors, giving you a score of 3 + 3 = 6.
In this example, if you were to follow the strategy guide, you would get a total score of 15 (8 + 1 + 6).

input is in test.txt and in input.txt
*/

const fs = require('fs')
const input = fs.readFileSync('./input.txt', 'utf-8').split('\n')

//"The first column is what your opponent is going to play: A for Rock, B for Paper, and C for Scissors. The second column, you reason, must be what you should play in response: X for Rock, Y for Paper, and Z for Scissors.
// The score for a single round is the score for the shape you selected (1 for Rock, 2 for Paper, and 3 for Scissors) plus the score for the outcome of the round (0 if you lost, 3 if the round was a draw, and 6 if you won).
// What would your total score be if everything goes exactly according to your strategy guide?

// function that scores a shape
// 1 for rock (A or X), 2 for paper (B or Y), 3 for scissors (C or Z)
const scoreShape = shape => {
  switch (shape) {
    case 'A':
      return 1
    case 'B':
      return 2
    case 'C':
      return 3
    case 'X':
      return 1
    case 'Y':
      return 2
    case 'Z':
      return 3

    default:
      return 0
  }
}

// function that maps opponent shape to playe shape: A -> X, B -> Y, C -> Z
const mapShape = shape => {
  switch (shape) {
    case 'A':
      return 'X'
    case 'B':
      return 'Y'
    case 'C':
      return 'Z'
  }
}

// function that scores a round of rock paper scissors
const scoreRound = (player, opponent) => {
  // map opponent shape to player shape, name it mappedOpponentShape
  const mappedOpponentShape = mapShape(opponent)
  // play rock paper scissors between mapped opponent shape and player shape
  // if player wins, give 6 points plus the score of the shape
  if (
    (mappedOpponentShape === 'X' && player === 'Y') ||
    (mappedOpponentShape === 'Y' && player === 'Z') ||
    (mappedOpponentShape === 'Z' && player === 'X')
  ) {
    return 6 + scoreShape(player)
  }
  // in case of ties player gets 3 points plus points depending on shape
  if (mappedOpponentShape === player) {
    return 3 + scoreShape(player)
  }
  // if player loses, give 0 points plus the score of the shape
  return 0 + scoreShape(player)
}


// play each row of the input, sum up the player score
const playGame = input => {
  let playerScore = 0
  input.forEach(row => {
    const [opponentShape, playerShape] = row.split(' ')
    playerScore += scoreRound(playerShape, opponentShape)
  })
  return playerScore
}

console.log(playGame(input))
// sum scores

// play each row of the input, choose player shape according to seconds column, sum up the player score
const playGame2 = input => {
  let playerScore = 0
  input.forEach(row => {
    const [opponentShape, playerShape] = row.split(' ')
    // pick new player shape according to second column: if the second column is X, play to lose, if it is Y, play to tie, if it is Z, play to win
    playerScore += scoreRound(playerShape, opponentShape)
  })
  return playerScore
}

console.log(playGame2(input))
