const typeDefs = `
  type User {
    id         : ID
    email      : String
    firstName  : String  
    lastName   : String
    createdAt  : String
  }
  input UserInput {
    email     : String!
    password  : String!
    firstName : String!
    lastName  : String! 
  }

  input AuthInput {
    email     : String!
    password  : String!
  }

  type Token {
    token: String
  }

  type Query {
    getUserByToken(token: String!) : User 
  }

  type Mutation {
    addUser(input: UserInput!): User
    authenticate(input: AuthInput!) : Token
  }
`

module.exports = { typeDefs };