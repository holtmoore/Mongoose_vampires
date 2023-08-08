const express = require('express');
const app = express();
const mongoose = require('mongoose');
const seedData = require('./models/seed_vampires');
const Vampire = require('./models/vampire');
const newVampiresData = require('./models/new_vampires');


// Configuration
const mongoURI = 'mongodb://localhost:27017/'+ 'vampires';
const db = mongoose.connection;

// Middleware
app.use(express.json());

// Connect to Mongo
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Connection Error/Success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('connected', () => console.log('mongo connected: ', mongoURI));
db.on('disconnected', () => console.log('mongo disconnected'));

db.on('open', () => {
    console.log('Connection made!');

    // Seed data
    Vampire.insertMany(seedData, (err, vampires) => {
        if (err) { 
            console.log(err); 
        } else {
            console.log("Added provided vampire data", vampires);

            // Create new vampires
            Vampire.create(newVampiresData, (err, newVampires) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Added new sample vampires", newVampires);
                }
            });
        }
    });
});
// Querying by comparison
async function fetchVampiresByComparison() {
    try {
      const femaleVampires = await Vampire.find({ gender: 'f' });
      console.log(femaleVampires);
  
      const vampiresWithMoreThan500Victims = await Vampire.find({ victims: { $gt: 500 } });
      console.log(vampiresWithMoreThan500Victims);
  
      const vampiresWithUpTo150Victims = await Vampire.find({ victims: { $lte: 150 } });
      console.log(vampiresWithUpTo150Victims);
  
      const vampiresNot210234Victims = await Vampire.find({ victims: { $ne: 210234 } });
      console.log(vampiresNot210234Victims);
  
      const vampiresBetween150and500Victims = await Vampire.find({ 
          victims: { $gt: 150, $lt: 500 } 
      });
      console.log(vampiresBetween150and500Victims);
  
      // This seems like a duplicate of the query above, so I'm just going to omit it
      // However, if it's different, you can use the same async/await pattern
  
    } catch (err) {
      console.error(err);
    }
  }
  
  // Call the function
  fetchVampiresByComparison();
  
// by exists or does not exist
async function fetchVampiresByExistence() {
    try {
      const vampiresWithTitle = await Vampire.find({ title: { $exists: true } });
      console.log(vampiresWithTitle);
  
      const vampiresWithoutVictims = await Vampire.find({ victims: { $exists: false } });
      console.log(vampiresWithoutVictims);
  
      const vampiresWithTitleAndNoVictims = await Vampire.find({ 
        title: { $exists: true }, 
        victims: { $exists: false } 
      });
      console.log(vampiresWithTitleAndNoVictims);
  
      const vampiresWithMoreThan1000Victims = await Vampire.find({ 
        victims: { $exists: true, $gt: 1000 } 
      });
      console.log(vampiresWithMoreThan1000Victims);
  
    } catch (err) {
      console.error(err);
    }
  }
  
  // Call the function
  fetchVampiresByExistence();
  
//   select with or

async function fetchVampires() {
    try {
      const vampiresFromSpecificLocations = await Vampire.find({
        $or: [
          { location: 'New York, New York, US' },
          { location: 'New Orleans, Louisiana, US' }
        ]
      });
      console.log(vampiresFromSpecificLocations);
  
      const broodingOrTragicVampires = await Vampire.find({
        $or: [
          { loves: 'brooding' },
          { loves: 'being tragic' }
        ]
      });
      console.log(broodingOrTragicVampires);
  
      const vampiresWithSpecificLikesOrVictims = await Vampire.find({
        $or: [
          { victims: { $gt: 1000 } },
          { loves: 'marshmallows' }
        ]
      });
      console.log(vampiresWithSpecificLikesOrVictims);
  
      const vampiresWithRedHairOrGreenEyes = await Vampire.find({
        $or: [
          { hair_color: 'red' },
          { eye_color: 'green' }
        ]
      });
      console.log(vampiresWithRedHairOrGreenEyes);
    } catch (err) {
      console.error(err);
    }
  }
  
 
  fetchVampires();
  
// Routes
app.get('/vampires', async (req, res) => {
    try {
        const vampires = await Vampire.find();
        res.json(vampires);
    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.post('/vampires', async (req, res) => {
    try {
        const newVampire = new Vampire(req.body);
        await newVampire.save();
        res.status(201).json(newVampire);
    } catch (err) {
        res.status(500).send(err.message);
    }
});





const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
