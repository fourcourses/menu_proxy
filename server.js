const express = require('express');
const morgan = require('morgan');
const path = require('path');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/restaurants/:id', express.static(path.join(__dirname, 'public')));

const overview = axios.create({
  baseURL: 'http://localhost:3001',
});

// const reservations = axios.create({
//   baseURL: 'http://localhost:3002',
// });

const menu = axios.create({
  baseURL: 'http://localhost:3003',
});

const reviews = axios.create({
  baseURL: 'http://localhost:3004',
});

app.use('/api/restaurant/:rid', (req, res) => {
  overview.get(`/api/restaurant/${req.params.id}`)
    .then(response => res.json(response.data))
    .catch(err => res.status(400).send(err));
})

// app.use('/api/restaurant/:id', (req, res) => {
//   reservations.get(`/api/restaurant/${req.params.id}`)
//     .then(response => res.json(response.data))
//     .catch(err => res.status(400).send(err));
// })

app.use('/api/menu/:id', (req, res) => {
  menu.get(`/api/menu/${req.params.id}`)
    .then(response => res.json(response.data))
    .catch(err => res.status(400).send(err));
})

app.use('/api/restaurants/:id/reviews', (req, res) => {
  reviews.get(`/api/restaurants/${req.params.id}/reviews`)
    .then(response => res.json(response.data))
    .catch(err => res.status(400).send(err));
})

app.use('/api/restaurants/:id/filters', (req, res) => {
  reviews.get(`/api/restaurants/${req.params.id}/filters`)
    .then(response => res.json(response.data))
    .catch(err => res.status(400).send(err));
})

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});