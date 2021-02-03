const typedefs = `
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
        name : String!
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
        messages(uid:ID!) : [Message]
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

        createMessage(senderID: ID! receiverID: ID! message: String! timestamp: Float!): Message!
    }
    type Subscriptions{
        newMessage(recieverId = ID!) : Message
    }
`
module.exports = typedefs;


// type Message {
//     id: ID!
//     message: String!
//     senderID: ID!
//     receiverId: ID!
//     timestamp: Float!
// }