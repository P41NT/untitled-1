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
        email: String!
        password : String!
        ideas : [IdeaType]
    }
    type DevType{
        id : ID!
        uid : ID!
        name : String!
        email: String!
        password : String!
        github : String
        applied_jobs : [IdeaType]
        working_jobs : [IdeaType]
    }
    typr DevTypePayload {
        token : String
        user : DevType
    }
    type Query{
        idea(id : ID!): IdeaType
        client(id : ID!): ClientType
        dev(id : ID!): DevType
        ideas : [IdeaType]
        clients : [ClientType]
        devs : [DevType]
    }
    type ClientTypePayload{
        token : String!
        client : ClientType
    }
    type Mutation{
        addIdeas(title : String!, client : ID!): IdeaType
        removeIdeas(id : ID!): IdeaType
        addClient(name : String!, password : String!, email : String!): ClientTypePayload
        addDev(name : String!, github : String): DevType
        removeDev(id : ID!): DevType
        applyJob(idea : ID!, dev : ID!): DevType
        acceptDev(idea : ID!, dev : ID!): DevType
        fireDev(idea : ID!, dev: ID!): DevType
        devLogin(email: String!, password: String!): DevTypePayload
        clientLogin(email: String!, password: String!): ClientTypePayload
    }
`
module.exports = typedefs;