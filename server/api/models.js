const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IdeaSchema = new Schema({
    title: String,
    client : String,
})

const DevSchema = new Schema({
    uid : String,
    name : String,
    github : String,
    email : String,
    password : String,
    applied_jobs : Array,
    working_jobs : Array
})

const ClientSchema = new Schema({
    uid : String,
    name : String,
    email : String,
    password : String
})

const MessageSchema =  new Schema({
    message: String,
    senderId: String,
    receiverId: String,
    timestamp: Number
  });

Idea = mongoose.model('Idea', IdeaSchema)
Dev = mongoose.model('Dev', DevSchema)
Client = mongoose.model('Client', ClientSchema)
Message = mongoose.model('Message', MessageSchema)

module.exports = { Idea, Dev, Client, Message };