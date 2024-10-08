const template = (collectionName, schema) => `
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');



// Initialize Express app
const app = express();
const port = 5000; // Define your port here

app.use(cors());

// Middleware
app.use(bodyParser.json());

// Serve the schema
app.get('/api/schema', (req, res) => {
    fs.readFile('schema.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading schema');
        }
        res.send(JSON.parse(data));
    });
});


app.get('/api/items', async (req, res) => {
    try {
        const items = await ${collectionName}.find(); // Use the dynamically defined model
        res.json(items);
    } catch (error) {
        res.status(500).send('Server error');
    }
});


// Define the schema for ${collectionName}
const ${collectionName}Schema = new mongoose.Schema(${JSON.stringify(schema, null, 2)});
const ${collectionName} = mongoose.model('${collectionName}', ${collectionName}Schema);

// CRUD operations
// Create
app.post('/api/${collectionName}', async (req, res) => {
    try {
        const newItem = new ${collectionName}(req.body);
        await newItem.save();
        res.status(201).send(newItem);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Read all
app.get('/api/${collectionName}', async (req, res) => {
    try {
        const items = await ${collectionName}.find();
        res.status(200).send(items);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Read one
app.get('/api/${collectionName}/:id', async (req, res) => {
    try {
        const item = await ${collectionName}.findById(req.params.id);
        if (!item) {
            return res.status(404).send('Item not found');
        }
        res.status(200).send(item);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Update
app.put('/api/${collectionName}/:id', async (req, res) => {
    try {
        const item = await ${collectionName}.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!item) {
            return res.status(404).send('Item not found');
        }
        res.status(200).send(item);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Delete
app.delete('/api/${collectionName}/:id', async (req, res) => {
    try {
        const item = await ${collectionName}.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).send('Item not found');
        }
        res.status(200).send(item);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Database connection
mongoose.connect('mongodb://localhost:27017/json-crud-framework', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));

// Start the server
app.listen(port, () => {
    console.log(\`Server is running on http://localhost:\${port}\`);
});
`;

module.exports = template;
