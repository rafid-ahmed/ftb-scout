document.addEventListener('DOMContentLoaded', () => {
    const teamsList = document.getElementById('teams-list');
    const teamDetails = document.getElementById('team-details');
    const backButton = document.getElementById('back-button');

    // Function to fetch the list of teams and display them
    async function fetchAndDisplayTeams() {
        try {
            const response = await fetch('/api/teams', {
                headers: {
                    'ngrok-skip-browser-warning': 'true' // Add the ngrok header
                }
            });
            const teams = await response.json();
            teamsList.innerHTML = '';
            teams.forEach(team => {
                const teamItem = document.createElement('div');
                teamItem.classList.add('team-item');
                teamItem.textContent = team.name;
                teamItem.addEventListener('click', () => {
                    showTeamDetails(team.name);
                });
                teamsList.appendChild(teamItem);
            });
        } catch (error) {
            console.error('Error fetching teams:', error);
        }
    }

    // Function to fetch and display the team details
    async function showTeamDetails(teamName) {
        try {
            const response = await fetch(`/api/teams/${teamName}`, {
                headers: {
                    'ngrok-skip-browser-warning': 'true' // Add the ngrok header
                }
            });
            const teamData = await response.json();
            teamsList.style.display = 'none';
            teamDetails.style.display = 'block';

            teamDetails.innerHTML = `
                <h2>${teamData.name}</h2>
                <ul class="player-list">
                    ${teamData.players.map(player => `
                    <a class="nostyle" href="players.html?team=${teamData.name}&player=${player.id}">
                        <li>
                            <img src="${player.photo}" alt="${player.name}">
                            <p><strong>${player.name}</strong></p>
                            <div class="float-ov-container">
                                <div class="float-ov-child">
                                    <div>
                                        <p>Skill: ${player.ratings.skill.toFixed(0)}<span style="color: #ffd700;">&#9733;</span></p>
                                        <p>Stamina: ${player.ratings.stamina.toFixed(0)}<span style="color: #ffd700;">&#9733;</span></p>
                                        <p>Pace: ${player.ratings.pace.toFixed(0)}<span style="color: #ffd700;">&#9733;</span></p>
                                    </div>
                                </div>
                                <div class="float-ov-child">
                                    <div>
                                        <p>Passing: ${player.ratings.passing.toFixed(0)}<span style="color: #ffd700;">&#9733;</span></p>
                                        <p>Shooting: ${player.ratings.shooting.toFixed(0)}<span style="color: #ffd700;">&#9733;</span></p>
                                        <p>Defending: ${player.ratings.defending.toFixed(0)}<span style="color: #ffd700;">&#9733;</span></p>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </a>
                    `).join('')}
                </ul>
            `;

            // Create back button element
            const backButton = document.createElement('button');
            backButton.id = 'back-button';
            backButton.textContent = 'Back to Teams';

            // Back button functionality to return to the teams list
            backButton.addEventListener('click', () => {
                teamDetails.style.display = 'none';
                teamsList.style.display = 'block';
                backButton.style.display = 'none';
            });

            // Append back button to team details
            teamDetails.appendChild(backButton);
        } catch (error) {
            console.error('Error fetching team details:', error);
        }
    }

    // Initially fetch and display teams
    fetchAndDisplayTeams();
});
