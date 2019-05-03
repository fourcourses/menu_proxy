const express = require('express');
const nr = require('newrelic');
const path = require('path');
const axios = require('axios');
const redis = require('redis');
const redisClient = redis.createClient(6379, '172.31.14.169');
const app = express();
const port = 80;

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/restaurants/:id', express.static(path.join(__dirname, 'public')));

// const overview = axios.create({
//   baseURL: 'http://localhost:3001',
// });

// const reservations = axios.create({
//   baseURL: 'http://localhost:3002',
// });

const menu = axios.create({
  baseURL: 'http://ec2-54-183-59-210.us-west-1.compute.amazonaws.com',
});

// const reviews = axios.create({
//   baseURL: 'http://localhost:3004',
// });

// app.use('/api/restaurant/:rid', (req, res) => {
//   overview.get(`/api/restaurant/${req.params.id}`)
//     .then(response => res.json(response.data))
//     .catch(err => res.status(400).send(err));
// })

// app.use('/api/restaurant/:id', (req, res) => {
//   reservations.get(`/api/restaurant/${req.params.id}`)
//     .then(response => res.json(response.data))
//     .catch(err => res.status(400).send(err));
// })

app.get('/api/menu/:id', getCache);

const getCache = (req, res) => {
  let id = req.params.id;
  redisClient.mget(id, (err, result) => {
    if (result[0] !== null) {
      res.send(JSON.parse(result[0]));
    } else {
      fetchMenuFromDB(req, res);
    }
  });
};

const fetchMenuFromDB = (req, res) => {
  menu.get(`/menu/${req.params.id}`)
    .then(response => {
      res.json(response.data);
    })
    .then(() => redisClient.setex(parseInt(req.params.id), 3600, JSON.stringify(resultFormatted)))
    .catch(err => res.status(400).send(err));
};

// app.use('/api/restaurants/:id/reviews', (req, res) => {
//   reviews.get(`/api/restaurants/${req.params.id}/reviews`)
//     .then(response => res.json(response.data))
//     .catch(err => res.status(400).send(err));
// })

// app.use('/api/restaurants/:id/filters', (req, res) => {
//   reviews.get(`/api/restaurants/${req.params.id}/filters`)
//     .then(response => res.json(response.data))
//     .catch(err => res.status(400).send(err));
// })

app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});