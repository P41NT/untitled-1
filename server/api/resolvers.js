const { PubSub, withFilter } = require("graphql-yoga");
const { Idea, Client, Dev, Message } = require('./models')

const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const {secret} = require('../auth/utils');
const jwt = require('jsonwebtoken');

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
        clients : async (parent, args, ctx, info) => {
            return Client.find({});
        },
        devs : (parent, args, ctx, info) => {
            return Dev.find({});
        },
        // messages : (parent, args, ctx, info) =>{
        //     uid = args.uid;
        //     return Message.find({$or : [{recieverId : uid}, {senderId: uid}]})
        // }
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
            const password = await bcrypt.hash(args.password, 10);
            const result = await Client.findOne({ email: args.email }).select("email").lean();
            if (result) {
                throw new Error("Account with E-Mail exists.")
            }
            let client = new Client({
                name : args.name,
                uid : uuidv4(),
                email : args.email,
                password: password
            });
            const user =  await client.save();
            const token = jwt.sign({userId : user.uid}, secret);
            return {client:user, token : token};
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
        clientLogin : async (parent, args, ctx, info) => {
            const client = await Client.findOne({email : args.email});
            if(!client) throw new Error("Invalid User");
            const valid = await bcrypt.compare(args.password, client.password);
            if(!valid) throw new Error("Invalid password");
            const token = await jwt.sign({userId:client.uid}, secret)
            client_payload = {token : token, client : client}
            return {token, client}
        }
    }
}
const pubsub = new PubSub();
module.exports = resolvers;