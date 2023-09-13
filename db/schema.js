const typeDefs = `

  # User

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

  # Product

  type Product {
    id        : ID
    name      : String
    stock     : Int
    price     : Float
    createdAt : String
  }

  input ProductInput {
    name      : String!
    stock     : Int!
    price     : Float!
  }

  # Clients

  input ClientInput {
    firstName: String!
    lastName: String!
    company: String!
    email: String!
    phone: String
  }

  type Client {
    id: ID
    firstName: String
    lastName: String
    company: String
    email: String
    phone: String
    seller: ID
  }

  # Querys

  type Query {
    # Users
    getUserByToken(token: String!) : User 
    
    #Products
    getAllProducts: [Product]
    getProductById(id: ID!) : Product
  }

  # Mutations

  type Mutation {
    # <!- users 
      addUser(input: UserInput!): User
      authenticate(input: AuthInput!) : Token
    # -!>
    # <!- products 
    createProduct(input: ProductInput!): Product
    updateProduct(id: ID!, input: ProductInput) : Product
    deleteProduct(id: ID!): String
    # -!>
    # <!- clients
    addClient(input: ClientInput!) : Client 
    # -!>
  }
`

module.exports = { typeDefs };