document.addEventListener('DOMContentLoaded', () => {
    const teamsList = document.getElementById('teams-list');
    const teamDetails = document.getElementById('team-details');
    const backButton = document.getElementById('back-button');

    // Fetch the list of teams and display them
    fetch('/api/teams')
        .then(response => response.json())
        .then(teams => {
            teams.forEach(team => {
                const teamItem = document.createElement('div');
                teamItem.classList.add('team-item');
                teamItem.textContent = team.name;
                teamItem.addEventListener('click', () => {
                    showTeamDetails(team.name);
                });
                teamsList.appendChild(teamItem);
            });
        });

    // Function to fetch and display the team details
    function showTeamDetails(teamName) {
        fetch(`/api/teams/${teamName}`)
            .then(response => response.json())
            .then(teamData => {
                teamsList.style.display = 'none';
                teamDetails.style.display = 'block';
                backButton.style.display = 'block';

                teamDetails.innerHTML = `
                    <h2>${teamData.name}</h2>
                    <ul class="player-list">
                        ${teamData.players.map(player => `
                        <a class="nostyle" href="players.html?team=${teamData.name}&player=${player.id}">
                            <li>
                                <img src="${player.photo}" alt="${player.name}">
                                <p><strong>${player.name}</strong></p>
                                <div class="float-container">
                                    <div class="float-child">
                                        <div>
                                            <p>Skill: ${player.ratings.skill.toFixed(1)}<span style="color: #ffd700;">&#9733;</span></p>
                                            <p>Stamina: ${player.ratings.stamina.toFixed(1)}<span style="color: #ffd700;">&#9733;</span></p>
                                            <p>Pace: ${player.ratings.pace.toFixed(1)}<span style="color: #ffd700;">&#9733;</span></p>
                                        </div>
                                    </div>
                                    <div class="float-child">
                                        <div>
                                            <p>Passing: ${player.ratings.passing.toFixed(1)}<span style="color: #ffd700;">&#9733;</span></p>
                                            <p>Shooting: ${player.ratings.shooting.toFixed(1)}<span style="color: #ffd700;">&#9733;</span></p>
                                            <p>Defending: ${player.ratings.defending.toFixed(1)}<span style="color: #ffd700;">&#9733;</span></p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </a>
                        `).join('')}
                    </ul>
                `;
            });
    }

    // Back button functionality to return to the teams list
    backButton.addEventListener('click', () => {
        teamDetails.style.display = 'none';
        teamsList.style.display = 'block';
        backButton.style.display = 'none';
    });
});
