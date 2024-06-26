const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

let tasks = [];

app.post('/login', (req, res) => {
  res.json({token: 'dummy-token'});
});

app.get('/tasks', (req, res) => {
  res.json(tasks);
});

app.post('/tasks', (req, res) => {
  const task = req.body;
  tasks.push(task);
  res.json(task);
});

app.put('/tasks/:id', (req, res) => {
  const id = req.params.id;
  const updatedTask = req.body;
  tasks = tasks.map(task => (task.id === id ? updatedTask : task));
  res.json(updatedTask);
});

app.delete('/tasks/:id', (req, res) => {
  const id = req.params.id;
  tasks = tasks.filter(task => task.id !== id);
  res.json({id});
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
