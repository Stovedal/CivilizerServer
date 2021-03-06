const uuidv4 = require('uuid/v4')
const moment = require('moment')
const game1 = uuidv4()
const game2 = uuidv4()
const game3 = uuidv4()
const ts1 = moment().format()
const ts2 = moment().subtract(1.5, 'weeks').format()
const ts3 = moment().subtract(2, 'days').format()

module.exports = [
  {
    gameid: game1,
    civ: "Arabia",
    user: "Jesper",
    score: 167,
    timestamp: ts1,
  },
  {
    gameid: game1,
    civ: "Indonesia",
    user: "Johanna",
    score: 242,
    timestamp: ts1,
  },
  {
    gameid: game2,
    civ: "Indonesia",
    user: "Isak",
    score: 231,
    timestamp: ts2,
  },
  {
    gameid: game2,
    civ: "Arabia",
    user: "Linnea",
    score: 365,
    timestamp: ts2,
  },
  {
    gameid: game1,
    civ: "Australia",
    user: "Linnea",
    score: 321,
    timestamp: ts1,
  },
  {
    gameid: game2,
    civ: "Australia",
    user: "Isak",
    score: 111,
    timestamp: ts2,
  },
  {
    gameid: game3,
    civ: "Australia",
    user: "Isak",
    score: 256,
    timestamp: ts3,
  },
  {
    gameid: game3,
    civ: "Arabia",
    user: "Johanna",
    score: 467,
    timestamp: ts3,
  },
]
