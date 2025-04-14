class Player {
    constructor(name, team) {
        this.name = name;
        this.score = 0;
        this.team = team;
    }

    attemptShot(successRate) {
        if (Math.random() < successRate) {
            this.score += 3;
        }
    }
}

function generateSuccessRate(roundNumber) {
    return Math.min(0.3 + (roundNumber - 1) * 0.1, 0.9);
}

function playRound(players, roundNumber) {
    const successRate = generateSuccessRate(roundNumber);
    players.forEach(player => {
        for (let i = 0; i < 5; i++) {
            player.attemptShot(successRate);
        }
    });
}

function rankPlayers(players) {
    return [...players].sort((a, b) => b.score - a.score);
}

function isTie(rankedPlayers) {
    return rankedPlayers.length > 1 && rankedPlayers[0].score === rankedPlayers[1].score;
}

function displayRankings(players, roundNumber) {
    const roundsContainer = document.getElementById('rounds-container');
    const roundDiv = document.createElement('div');
    roundDiv.className = 'mb-4';

    const roundHeader = document.createElement('h5');
    roundHeader.textContent = `Round ${roundNumber} Results`;
    roundDiv.appendChild(roundHeader);

    const rankingsList = document.createElement('ul');
    rankingsList.className = 'list-group';

    const rankedPlayers = rankPlayers(players);
    rankedPlayers.forEach((player, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            <span>${index + 1}. ${player.name}</span>
            <span class="badge bg-primary rounded-pill">${player.score} points</span>
        `;
        rankingsList.appendChild(listItem);
    });

    roundDiv.appendChild(rankingsList);
    roundsContainer.appendChild(roundDiv);
}

function showTiebreaker(players, roundNumber) {
    const tiebreakerMessage = document.getElementById('tiebreaker-message');
    tiebreakerMessage.textContent = `Tiebreaker needed between: ${players.map(p => p.name).join(', ')}`;
    tiebreakerMessage.classList.remove('d-none');

    const round2Message = document.getElementById('round2-message');
    round2Message.textContent = `Round ${roundNumber} Begins!`;
    round2Message.classList.remove('d-none');
}

function showTiebreakerResults(players, roundNumber) {
    const roundsContainer = document.getElementById('rounds-container');
    const roundDiv = document.createElement('div');
    roundDiv.className = 'mb-4';

    const roundHeader = document.createElement('h5');
    roundHeader.textContent = `Tiebreaker Round ${roundNumber} Results`;
    roundDiv.appendChild(roundHeader);

    const tiebreakerList = document.createElement('ul');
    tiebreakerList.className = 'list-group';

    const rankedPlayers = rankPlayers(players);
    rankedPlayers.forEach(player => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            <span>${player.name}</span>
            <span class="badge bg-primary rounded-pill">${player.score} points</span>
        `;
        tiebreakerList.appendChild(listItem);
    });

    roundDiv.appendChild(tiebreakerList);
    roundsContainer.appendChild(roundDiv);
}

function showChampion(winner) {
    const championMessage = document.getElementById('champion-message');
    championMessage.textContent = `🏆 The champion is ${winner.name} with ${winner.score} points! 🏆`;
    championMessage.classList.remove('d-none');
}

function resetOutputs() {
    document.getElementById('tiebreaker-message').classList.add('d-none');
    document.getElementById('round2-message').classList.add('d-none');
    document.getElementById('champion-message').classList.add('d-none');
    document.getElementById('rounds-container').innerHTML = '';
}

function resetGame() {
    resetOutputs();
    document.getElementById('player-list').innerHTML = '';
}

function playGame() {
    const playerItems = document.getElementById('player-list').children;
    if (playerItems.length < 2) {
        alert("You need at least 2 players to start the game!");
        return;
    }

    resetOutputs();

    const players = Array.from(playerItems).map(item => new Player(item.textContent, ''));

    let roundNumber = 1;
    playRound(players, roundNumber);
    displayRankings(players, roundNumber);

    let rankedPlayers = rankPlayers(players);
    roundNumber++;

    while (isTie(rankedPlayers)) {
        const tiedPlayers = rankedPlayers.filter(p => p.score === rankedPlayers[0].score);
        showTiebreaker(tiedPlayers, roundNumber);

        tiedPlayers.forEach(player => player.score = 0);
        playRound(tiedPlayers, roundNumber);
        showTiebreakerResults(tiedPlayers, roundNumber);

        rankedPlayers = rankPlayers(tiedPlayers);
        roundNumber++;
    }

    showChampion(rankedPlayers[0]);
}

document.addEventListener('DOMContentLoaded', function () {
    const app = document.getElementById('app');

    const container = document.createElement('div');
    container.className = 'container mt-3';
    app.appendChild(container);

    const header = document.createElement('h2');
    header.className = 'text-center mb-4';
    header.textContent = 'Basketball Game';
    container.appendChild(header);

    const inputCard = document.createElement('div');
    inputCard.className = 'card mb-4';
    container.appendChild(inputCard);

    const inputCardBody = document.createElement('div');
    inputCardBody.className = 'card-body';
    inputCard.appendChild(inputCardBody);

    const inputGroup = document.createElement('div');
    inputGroup.className = 'input-group mb-3';
    inputCardBody.appendChild(inputGroup);

    const playerInput = document.createElement('input');
    playerInput.id = 'player-name-input';
    playerInput.className = 'form-control';
    playerInput.placeholder = 'Player Name';
    inputGroup.appendChild(playerInput);

    const addButton = document.createElement('button');
    addButton.id = 'add-player-button';
    addButton.className = 'btn btn-primary';
    addButton.textContent = 'Add Player';
    addButton.addEventListener('click', function () {
        const name = playerInput.value.trim();
        if (name) {
            const playerList = document.getElementById('player-list');
            const item = document.createElement('li');
            item.className = 'list-group-item';
            item.textContent = name;
            playerList.appendChild(item);
            playerInput.value = '';
        }
    });
    inputGroup.appendChild(addButton);

    const playerList = document.createElement('ul');
    playerList.id = 'player-list';
    playerList.className = 'list-group mb-3';
    inputCardBody.appendChild(playerList);

    const gameControls = document.createElement('div');
    gameControls.className = 'input-group mb-3';
    inputCardBody.appendChild(gameControls);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'btn-group w-100';
    gameControls.appendChild(buttonGroup);

    const playButton = document.createElement('button');
    playButton.id = 'play-button';
    playButton.className = 'btn btn-success';
    playButton.textContent = 'Play Game';
    playButton.addEventListener('click', playGame);
    buttonGroup.appendChild(playButton);

    const resetButton = document.createElement('button');
    resetButton.id = 'reset-button';
    resetButton.className = 'btn btn-danger';
    resetButton.textContent = 'Reset Game';
    resetButton.addEventListener('click', resetGame);
    buttonGroup.appendChild(resetButton);

    const outputCard = document.createElement('div');
    outputCard.className = 'card mb-4';
    container.appendChild(outputCard);

    const outputCardBody = document.createElement('div');
    outputCardBody.className = 'card-body';
    outputCard.appendChild(outputCardBody);

    const resultsHeader = document.createElement('h3');
    resultsHeader.className = 'text-center mb-3';
    resultsHeader.textContent = 'Game Results';
    outputCardBody.appendChild(resultsHeader);

    const tiebreakerMsg = document.createElement('div');
    tiebreakerMsg.id = 'tiebreaker-message';
    tiebreakerMsg.className = 'alert alert-warning mb-3 d-none';
    outputCardBody.appendChild(tiebreakerMsg);

    const round2Msg = document.createElement('div');
    round2Msg.id = 'round2-message';
    round2Msg.className = 'alert alert-info mb-3 d-none';
    outputCardBody.appendChild(round2Msg);

    const roundsContainer = document.createElement('div');
    roundsContainer.id = 'rounds-container';
    outputCardBody.appendChild(roundsContainer);

    const championMsg = document.createElement('div');
    championMsg.id = 'champion-message';
    championMsg.className = 'alert alert-success text-center fw-bold d-none';
    outputCardBody.appendChild(championMsg);
});