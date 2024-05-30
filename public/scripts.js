document.addEventListener('DOMContentLoaded', async () => {
    // Fetch player information
    await fetchPlayerInfo();
    await fetchPlayerAndComments();
  
    // Add event listeners to the stars
    addStarListeners();
    
    // Handle form submission
    document.getElementById('comment-rating-form').addEventListener('submit', async (event) => {
      event.preventDefault();
      await submitCommentAndRatings();
    });
});

async function fetchPlayerInfo() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const teamName = urlParams.get('team');
      const playerId = urlParams.get('player');
      const response = await fetch(`/api/teams/${teamName}/players/${playerId}`);
      const player = await response.json();
  
      // Update player name
      document.getElementById('player-name').textContent = player.name;
  
      // Update player image
      document.getElementById('player-image').src = player.photo;

      // Populate stars with average ratings
      // setStarRating('skill-stars', player.ratings.skill);
      // setStarRating('stamina-stars', player.ratings.stamina);
      // setStarRating('pace-stars', player.ratings.pace);
      // setStarRating('passing-stars', player.ratings.passing);
      // setStarRating('shooting-stars', player.ratings.shooting);
      // setStarRating('defending-stars', player.ratings.defending);
    } catch (error) {
      console.error('Error fetching player information:', error);
    }
}
  
function addStarListeners() {
    const starContainers = document.querySelectorAll('.stars');
    starContainers.forEach(container => {
      container.addEventListener('click', (event) => {
        if (event.target.classList.contains('star')) {
          const stars = container.querySelectorAll('.star');
          const value = event.target.getAttribute('data-value');
          stars.forEach(star => {
            star.classList.toggle('selected', star.getAttribute('data-value') <= value);
          });
        }
      });
    });
}

function setStarRating(starContainerId, rating) {
    const stars = document.querySelectorAll(`#${starContainerId} .star`);
    stars.forEach(star => {
      star.classList.toggle('selected', star.getAttribute('data-value') <= rating);
    });
}
  
function getStarRating(starContainerId) {
    const stars = document.querySelectorAll(`#${starContainerId} .star`);
    let rating = undefined;
    stars.forEach(star => {
      if (star.classList.contains('selected')) {
        rating = parseInt(star.getAttribute('data-value'));
      }
    });
    return rating;
}
  
async function submitCommentAndRatings() {
    try {
      const comment = document.getElementById('comment').value;
      const skill = getStarRating('skill-stars');
      const stamina = getStarRating('stamina-stars');
      const pace = getStarRating('pace-stars');
      const passing = getStarRating('passing-stars');
      const shooting = getStarRating('shooting-stars');
      const defending = getStarRating('defending-stars');
  
      const urlParams = new URLSearchParams(window.location.search);
      const teamName = urlParams.get('team');
      const playerId = urlParams.get('player');
  
      await fetch(`/api/teams/${teamName}/players/${playerId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment, ratings: { skill, stamina, pace, passing, shooting, defending } }),
      });
  
      fetchPlayerAndComments();
    } catch (error) {
      console.error('Error submitting comment and ratings:', error);
    }
}
  
async function fetchPlayerAndComments() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const teamName = urlParams.get('team');
      const playerId = urlParams.get('player');
      const response = await fetch(`/api/teams/${teamName}/players/${playerId}`);
      const player = await response.json();
  
      // Update rating summary
      const ratingSummary = `
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
      `;
      document.getElementById('rating-summary').innerHTML = ratingSummary;
  
      // Update comments
      const commentsList = document.getElementById('comments');
      commentsList.innerHTML = '';
      player.comments.forEach(comment => {
        const li = document.createElement('li');
        li.textContent = comment;
        commentsList.appendChild(li);
      });
    } catch (error) {
      console.error('Error fetching player comments and ratings:', error);
    }
}
