import faker from "@faker-js/faker";
const emoji = require("./random-emoji")

/*
* MAP
*  o_o x-x
* |X..............|
* |X..............|
* |X..............|
* |X..............|
* |X..............|
* |X..............|
* */

const playerAmount = 20;
const mapSize = 15;
const checkInterval = 1500;
const playerDeltaInterval = 500;

// Tools
const replaceAt = (string: string, index: number, replacement: string) =>
    string.substr(0, index) + replacement + string.substr(index + replacement.length)

// Types
type Player = {
    position: number,
    isAlive: boolean,
    name: string,
    emoji: string,
}

type Game = {
    players: Player[],
    eyesIsOpen: boolean
}

// print game
const printGame = (game: Game) => {
    console.clear();// clear console
    // print god
    if (game.eyesIsOpen) {
        console.log("O.O");
    } else {
        console.log("-.-");
    }

    // print players
    for (const player of game.players) {
        const emptyLine = `|${".".repeat(mapSize)}|   ${player.name}`;
        const playerLine = replaceAt(emptyLine, player.position, player.isAlive ? player.emoji: "🪦");
        console.log(playerLine)
    }
}

// game loop
const gameLoop = (game: Game) => {
    // god
    const godIntervalId = setInterval(() => {
        const playerAlive = game.players.filter(player => player.isAlive);
        if (playerAlive.length === 0) {
            clearInterval(godIntervalId);
            console.log("God wins!");
            process.exit(0);
        } /*else if (playerAlive.length === 1) {
            clearInterval(godIntervalId);
            console.log(`Player ${playerAlive[0].name} wins!`);
            process.exit(0);
        }*/

        const playerFinish = game.players.filter(player => player.position === mapSize);
        if (playerFinish.length >= 1) {
            clearInterval(godIntervalId);
            const playersNames = playerFinish.map(player => player.name).join(", ");
            console.log(`Player ${playersNames} wins!`);
            process.exit(0);
        }

        if (!game.eyesIsOpen) {
            console.log("check")
        } else {
            console.log("no check")
        }
        game.eyesIsOpen = !game.eyesIsOpen;
        printGame(game)
    }, checkInterval)


    for (const player of game.players) {
        const playerMove = async () => {
            if (!player.isAlive) return;
            if (player.position === mapSize) return;
            player.position += 1
            if (game.eyesIsOpen) player.isAlive = false
            printGame(game)
            await new Promise(resolve => {
                const intervalId = setInterval(() => {
                    if (!game.eyesIsOpen) {
                        clearInterval(intervalId);
                        resolve(true)
                    }
                }, playerDeltaInterval)
            }) // wait closing eyes
            setTimeout(playerMove, Math.random() * playerDeltaInterval)
        }
        setTimeout(playerMove, Math.random() * playerDeltaInterval)
    }
}

// main
(() => {
    const game: Game = {
        players: [],
        eyesIsOpen: false
    }

    for (let i = 0; i < playerAmount; i++) {
        game.players.push({
            position: 1,
            isAlive: true,
            name: faker.name.firstName(),
            emoji: emoji()
        })
    }

    gameLoop(game);
})()
