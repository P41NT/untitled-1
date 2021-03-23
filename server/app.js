const { requiresAuth } = require('express-openid-connect');
const { auth } = require('express-openid-connect');//for express,idk if it is there for yoga as well,just trying
const mongoose = require('mongoose');
const { PubSub, GraphQLServer } = require("graphql-yoga");
const jwt = require('jsonwebtoken');
const typeDefs = require('./api/typedefs');
const resolvers = require('./api/resolvers');

mongoose.connect('mongodb://localhost:27017/TESTDB_',{useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
    console.log("We have connected to the database boiz..")
});
const pubsub = new PubSub();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'joe mama so fat',
  baseURL: 'http://localhost:3000',
  clientID: 'NHOQJT7yUwfsW5XoleUZIuSZdgvQaSQ3',
  issuerBaseURL: 'https://dev-zewzy-p4.us.auth0.com'
};



const server = new GraphQLServer({ 
    typeDefs,
    resolvers, 
    context:{ pubsub },
});

server.use(auth(config));

server.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});
server.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});


server.start({port: 6969}, () => console.log("Server Started on Port 6969"));