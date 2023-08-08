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
// Querying by 
Vampire.find({ gender: 'f' }, (err, vampires) => {
    if (err) console.log(err);
    console.log(vampires);
});

Vampire.find({ victims: { $gt: 500 } }, (err, vampires) => {
    if (err) console.log(err);
    console.log(vampires);
});

Vampire.find({ victims: { $lte: 150 } }, (err, vampires) => {
    if (err) console.log(err);
    console.log(vampires);
});

Vampire.find({ victims: { $ne: 210234 } }, (err, vampires) => {
    if (err) console.log(err);
    console.log(vampires);
});

Vampire.find({ 
    victims: { $gt: 150, $lt: 500 } 
}, (err, vampires) => {
    if (err) console.log(err);
    console.log(vampires);
});

Vampire.find({ 
    victims: { $gt: 150, $lt: 500 } 
}, (err, vampires) => {
    if (err) console.log(err);
    console.log(vampires);
});



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
