const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/photos', express.static(path.join(__dirname, 'public', 'photos')));

// Set up multer for photo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/photos');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// MongoDB connection
mongoose.connect('mongodb://mongo:27017/sports-teams', { useNewUrlParser: true, useUnifiedTopology: true });

const playerSchema = new mongoose.Schema({
    id: Number,
    name: String,
    photo: String,
    comments: [String],
    ratings: {
      skill: { type: Number, default: 0 },
      stamina: { type: Number, default: 0 },
      pace: { type: Number, default: 0 },
      physical: { type: Number, default: 0 },
    },
    totalRatings: {
      skill: { type: Number, default: 0 },
      stamina: { type: Number, default: 0 },
      pace: { type: Number, default: 0 },
      physical: { type: Number, default: 0 },
    },
    ratingCounts: {
      skill: { type: Number, default: 0 },
      stamina: { type: Number, default: 0 },
      pace: { type: Number, default: 0 },
      physical: { type: Number, default: 0 },
    },
  });
  

const teamSchema = new mongoose.Schema({
  name: String,
  players: [playerSchema],
});

const Team = mongoose.model('Team', teamSchema);

// Initialize teams and players
async function initializeTeams() {
  const count = await Team.countDocuments();
  if (count === 0) {
    const teams = [
      { name: 'Phoenix Infernos', players: [] },
      { name: 'Green Gladiators', players: [] },
      { name: 'Munich Red Hunters', players: [] },
    ];

    var fs = require('fs');
    var array = fs.readFileSync('players.csv').toString().split("\n");

    var j = 0;
    teams.forEach(team => {
      for (let i = 1; i <= 12; i++) {
        team.players.push({ id: i, name: array[j++], photo: `photos/player${i}.jpg`, comments: [] });
      }
    });

    await Team.insertMany(teams);
  }
}

initializeTeams();

// API to get all teams with only names
app.get('/api/teams', async (req, res) => {
  const teams = await Team.find({}, 'name');
  res.json(teams);
});

// API to get a team with players by team name
app.get('/api/teams/:teamName', async (req, res) => {
  const { teamName } = req.params;
  const team = await Team.findOne({ name: teamName });
  if (team) {
    res.json(team);
  } else {
    res.status(404).send('Team not found');
  }
});

// API to get a player by team name and player id
app.get('/api/teams/:teamName/players/:playerId', async (req, res) => {
  const { teamName, playerId } = req.params;
  const team = await Team.findOne({ name: teamName });
  if (team) {
    const player = team.players.find(p => p.id === parseInt(playerId));
    if (player) {
      res.json(player);
    } else {
      res.status(404).send('Player not found');
    }
  } else {
    res.status(404).send('Team not found');
  }
});

// API to add a comment and update ratings for a player
app.post('/api/teams/:teamName/players/:playerId', async (req, res) => {
    const { teamName, playerId } = req.params;
    const { comment, ratings } = req.body;
  
    const team = await Team.findOne({ name: teamName });
    if (team) {
      const player = team.players.find(p => p.id === parseInt(playerId));
      if (player) {
        if (comment) {
          player.comments.push(comment);
        }
        if (ratings) {
          for (let key of ['skill', 'stamina', 'pace', 'physical']) {
            if (ratings[key] !== undefined) {
              player.totalRatings[key] += ratings[key];
              player.ratingCounts[key] += 1;
              player.ratings[key] = player.totalRatings[key] / player.ratingCounts[key];
            }
          }
        }
        await team.save();
        res.status(201).json(player);
      } else {
        res.status(404).send('Player not found');
      }
    } else {
      res.status(404).send('Team not found');
    }
  });  

// API to upload player photo
app.post('/api/upload', upload.single('photo'), (req, res) => {
  res.json({ filePath: `photos/${req.file.filename}` });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
