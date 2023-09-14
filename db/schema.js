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

  # Orders 

  input OrderProductInput {
    id: ID
    quantity: Int
  }

  enum OrderStatus {
    PENDING
    COMPLETED
    CANCELLED
  }

  input OrderInput {
    order: [OrderProductInput]!
    total: Float!
    status: OrderStatus!
    client: ID!
  }

  type OrderGroup {
    id: ID
    quantity: Int
  }

  type Order {
    id: ID
    order: [OrderGroup]
    total: Float
    status: OrderStatus
    client: ID
    seller: ID
    createdAt: String
  }

  # Querys

  type Query {
    # Users
    getAllUsers: [User]
    getUserByToken(token: String!) : User 
    
    #Products
    getAllProducts: [Product]
    getProductById(id: ID!) : Product

    # Clients
    getAllClients: [Client]
    getClientsBySeller: [Client]
    getClientById(id: ID!): Client
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
    updateClient(id: ID!, input: ClientInput) : Client
    deleteClient(id: ID!) : String
    # -!>
    # <!- orders
    newOrder(input: OrderInput!) : Order
    # -!>
  }
`

module.exports = { typeDefs };