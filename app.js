const express = require('express');
const app = express();
const mongoose = require('mongoose');
const seedData = require('./models/seed_vampires');
const Vampire = require('./models/vampire');
const newVampiresData = require('./models/newvampires');


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

  Vampire.insertMany(seedData)
      .then(vampires => {
          console.log("Added provided vampire data", vampires);
          return Vampire.create(newVampiresData);
      })
      .then(newVampires => {
          console.log("Added new sample vampires", newVampires);
      })
      .catch(err => {
          console.error(err);
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
  
    
  
    } catch (err) {
      console.error(err);
    }
  }
  
  
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
  
//   Select objects that match one of several values
  async function fetchVampiresByPreference() {
    try {
      
      const vampiresFrillyFashion = await Vampire.find({
        loves: { $in: ['frilly shirtsleeves', 'frilly collars'] }
      });
      console.log(vampiresFrillyFashion);
  
      
      const vampiresLoveBrooding = await Vampire.find({
        loves: 'brooding'
      });
      console.log(vampiresLoveBrooding);
  

      const vampiresVariedInterests = await Vampire.find({
        loves: { $in: ['appearing innocent', 'trickery', 'lurking in rotting mansions', 'R&B music'] }
      });
      console.log(vampiresVariedInterests);
  
    
      const vampiresFancyCloaks = await Vampire.find({
        loves: 'fancy cloaks',
        $and: [{ loves: { $nin: ['top hats', 'virgin blood'] } }]
      });
      console.log(vampiresFancyCloaks);
  
    } catch (err) {
      console.error(err);
    }
  }

// Negative Selection
async function fetchVampiresWithNegativeSelectionCriteria() {
    try {
      const ribbonLoversWithoutBrownEyes = await Vampire.find({ 
        loves: 'ribbons',
        eye_color: { $ne: 'brown' }
      });
      console.log("Vampires who love ribbons but do not have brown eyes:", ribbonLoversWithoutBrownEyes);
  
      const notFromRome = await Vampire.find({ 
        location: { $ne: 'Rome' }
      });
      console.log("Vampires not from Rome:", notFromRome);
  
      const notLovingCertainThings = await Vampire.find({
        loves: {
          $nin: [
            'fancy cloaks',
            'frilly shirtsleeves',
            'appearing innocent',
            'being tragic',
            'brooding'
          ]
        }
      });
      console.log("Vampires not loving certain things:", notLovingCertainThings);
  
      const withLessVictims = await Vampire.find({
        victims: { $lte: 200 }
      });
      console.log("Vampires with less or equal to 200 victims:", withLessVictims);
  
    } catch (err) {
      console.error(err);
    }
  }
// Replace
  async function replaceVampires() {
    try {
      await Vampire.findOneAndReplace({ name: 'Claudia' }, {
        name: 'Eve',
        portrayed_by: 'Tilda Swinton'
      });
      console.log("Replaced Claudia with Eve.");
  
      await Vampire.findOneAndReplace({ gender: 'm' }, {
        name: 'Guy Man',
        is_actually: 'were-lizard'
      });
      console.log("Replaced the first male vampire with Guy Man.");
  
    } catch (err) {
      console.error(err);
    }
  }
// Update
  async function updateVampires() {
    try {
     
      await Vampire.updateOne({ name: 'Guy Man' }, { gender: 'f' });
      console.log("Updated Guy Man's gender to 'f'.");
  
      
      await Vampire.updateOne({ name: 'Eve' }, { gender: 'm' });
      console.log("Updated Eve's gender to 'm'.");
  
     
      await Vampire.updateOne({ name: 'Guy Man' }, { $set: { hates: ['clothes', 'jobs'] } });
      console.log("Updated Guy Man's hates array with 'clothes' and 'jobs'.");
  
      
      await Vampire.updateOne({ name: 'Guy Man' }, { $push: { hates: ['alarm clocks', 'jackalopes'] } });
      console.log("Updated Guy Man's hates array to include 'alarm clocks' and 'jackalopes'.");
  
      
      await Vampire.updateOne({ name: 'Eve' }, { $rename: { 'name': 'moniker' } });
      console.log("Renamed Eve's name field to 'moniker'.");
  
      
      await Vampire.updateMany({ gender: 'f' }, { gender: 'fems' });
      console.log("Updated all female vampires' gender to 'fems'.");
  
    } catch (err) {
      console.error(err);
    }
  }
// Remove
  async function removeVampires() {
    try {
      await Vampire.deleteOne({ hair_color: 'brown' });
      console.log("Removed a vampire with brown hair color.");
  
      await Vampire.deleteMany({ eye_color: 'blue' });
      console.log("Removed all vampires with blue eyes.");
  
    } catch (err) {
      console.error(err);
    }
  }
  

  removeVampires();
  updateVampires();
  replaceVampires();
  fetchVampiresWithNegativeSelectionCriteria();
  fetchVampiresByPreference();
  fetchVampires();
  fetchVampiresByExistence();
  fetchVampiresByComparison();
  
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
