const { PubSub, withFilter } = require("graphql-yoga");
const { Idea, Client, Dev, Message } = require('./models')

const bcrypt = require('bcrypt');

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
            return Client.find({client : parent.id});
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
        messages : (parent, args, ctx, info) =>{
            uid = args.uid;
            return Message.find({$or : [{recieverId : uid}, {senderId: uid}]})
        }
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
        },
    }
}
const pubsub = new PubSub();
module.exports = resolvers;