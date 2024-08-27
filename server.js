const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Connect ke MongoDB
mongoose.connect('mongodb://localhost:27017/simpleCrudDB')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Connection error', error);
  });

// Mulai server
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

const Item = require('./models/Item');

// Create
app.post('/items', async (req, res) => {
   try {
      const newItem = new Item(req.body);
      const savedItem = await newItem.save();
      res.status(201).json(savedItem);
   } catch (error) {
      res.status(500).json({ message: 'Error creating item', error });
   }
});

// Read
app.get('/items', async (req, res) => {
   try {
      const items = await Item.find();
      res.status(200).json(items);
   } catch (error) {
      res.status(500).json({ message: 'Error fetching items', error });
   }
});

app.get('/items/:id', async (req, res) => {
   try {
      const item = await Item.findById(req.params.id);
      if (!item) return res.status(404).json({ message: 'Item not found' });
      res.status(200).json(item);
   } catch (error) {
      res.status(500).json({ message: 'Error fetching item', error });
   }
});

// Update
app.put('/items/:id', async (req, res) => {
   try {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
      res.status(200).json(updatedItem);
   } catch (error) {
      res.status(500).json({ message: 'Error updating item', error });
   }
});

// Delete
app.delete('/items/:id', async (req, res) => {
   try {
      const deletedItem = await Item.findByIdAndDelete(req.params.id);
      if (!deletedItem) return res.status(404).json({ message: 'Item not found' });
      res.status(200).json({ message: 'Item deleted successfully' });
   } catch (error) {
      res.status(500).json({ message: 'Error deleting item', error });
   }
});