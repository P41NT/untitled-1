const mongoose = require('mongoose');
const { PubSub, GraphQLServer } = require("graphql-yoga");
const typeDefs = require('./api/typedefs');
const resolvers = require('./api/resolvers');

mongoose.connect('mongodb://localhost:27017/DB_TESTNG',{useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
    console.log("We have connected to the database boiz..")
});
const pubsub = new PubSub();

const server = new GraphQLServer({ typeDefs, resolvers , context : ({ req }) => {
    return {
        userId: req && req.headers.authorization ? getUserId : null
    }
}});

server.start({port: 6969}, () => console.log("Server Started on Port 6969"));