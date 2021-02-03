// import { GraphQLServer } from 'graphql-yoga'
// ... or using `require()`
const { GraphQLServer } = require('graphql-yoga')
const mongoose = require('mongoose')
const Idea = require('./models/idea.js');
const Client = require('./models/client.js');
const Dev = require('./models/dev.js');

mongoose.connect('mongodb://localhost:27017/DBTEST',{useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.once('open', () => {
    console.log("We have connected to the database boiz..")
});

const typeDefs = `
    type IdeaType{
        id: ID!
        title : String!
        client : ClientType
        interested_devs : [DevType]
        current_devs : [DevType]
    }
    type ClientType{
        id : ID!
        uid : ID!
        name : String
        ideas : [IdeaType]
    }
    type DevType{
        id : ID!
        uid : ID!
        name : String!
        github : String
        applied_jobs : [IdeaType]
        working_jobs : [IdeaType]
    }
    type Query{
        idea(id : ID!): IdeaType
        client(id : ID!): ClientType
        dev(id : ID!): DevType
        ideas : [IdeaType]
        clients : [ClientType]
        devs : [DevType]
    }
    type Mutation{
        addIdeas(title : String!, client : ID!): IdeaType
        removeIdeas(id : ID!): IdeaType
        addClient(name : String!): ClientType
        addDev(name : String!, github : String): DevType
        removeDev(id : ID!): DevType
        applyJob(idea : ID!, dev : ID!): DevType
        acceptDev(idea : ID!, dev : ID!): DevType
        fireDev(idea : ID!, dev: ID!): DevType
    }
`
const resolvers = {
  IdeaType : {
      client : (parent, args, ctx, info) => {
          return Client.findById(parent.client);
      },
      interested_devs : (parent, args, ctx, info) => {
          return Dev.find({applied_jobs:parent.id});
      },
      current_devs : (parent, args, ctx, info) => {
          return Dev.find({working_jobs:parent.id});
      }
  },
  ClientType : {
      ideas :  (parent, args, ctx, info) => {
          return Idea.find({client : parent.id});
      }
  },
  DevType : {
      applied_jobs : (parent, args, ctx, info) => {
          ideas = [];
          parent.applied_jobs.forEach(element => {
              ideas.push(Idea.findById(element));
          });
          return ideas;
      },
      working_jobs : (parent, args, ctx, info) => {
          ideas = [];
          parent.working_jobs.forEach(element =>{
              ideas.push(Idea.findById(element));
          });
          return ideas
      }
  },
  Query : {
      idea : (parent, args, ctx, info) => {
          return Idea.findById(args.id);
      },
      client : (parent, args, ctx, info) => {
          return Client.findById(args.id);
      },
      dev : (parent, args, ctx, info) => {
          return Dev.findById(args.id)
      },
      ideas : (parent, args, ctx, info) => {
          return Idea.find({});
      },
      clients : (parent, args, ctx, info) => {
          return Client.find({});
      },
      devs : (parent, args, ctx, info) => {
          return Dev.find({});
      },
  },
  Mutation : {
      addIdeas : (parent, args, ctx, info) => {
          let idea = new Idea({
              title : args.title,
              client : args.client,
          });
          saved = idea.save();
          console.log("added data...")
          console.log(saved);
          return saved;
      },
      removeIdeas : (parent, args, ctx, info) => {
          return Idea.findByIdAndDelete(args.id);
      },
      addClient : async (parent, args, ctx, info) => {
          let client = new Client({
              name : args.name,
          });
          return await client.save();
      },
      addDev : (parent, args, ctx, info) => {
          let dev = new Dev({
              name: args.name,
              github: args.github
          });
          return dev.save();
      },
      removeDev : (parent, args, ctx, info) => {
          return Dev.findByIdAndDelete(args.id);
      },
      applyJob : (parent, args, ctx, info) => {
          return Dev.findByIdAndUpdate(args.dev, {$addToSet:{applied_jobs : args.idea}}, {new : true});
      },
      acceptDev : (parent, args, ctx, info) => {
          return Dev.findByIdAndUpdate(args.dev, {$addToSet : {working_jobs : args.idea}, $pull: {applied_jobs : args.idea}}, {new:true});
      },
      fireDev : (parent, args, ctx, info) => {
          return Dev.findByIdAndUpdate(args.dev,{$pull : {working_jobs : args.idea}}, {new : true});
      }
  }
}


const server = new GraphQLServer({ typeDefs, resolvers })
server.start(() => console.log('Server is running on localhost:4000'))