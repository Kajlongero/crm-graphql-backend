const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const signToken = require('../utils/jwt.sign');
const verifyToken = require('../utils/jwt.verify');
const { UserModel } = require("../models/user.model");
const { ClientModel } = require("../models/client.model");
const { ProductModel } = require("../models/product.model");
const { OrderModel } = require("../models/order.model");

const resolvers = {
  Query: {
    getUserByToken: async (_, { token }, ctx, inf) => {
      try{
        const verify = verifyToken(token);
        const userData = await UserModel.findById(verify.sub);
        
        return userData;
      }catch(e){
        console.error(e);
      }
    },
    getAllUsers: async () => {
      try{

        const users = await UserModel.find();

        return users;

      }catch(e){
        console.error(e);
      }
    },
    getAllProducts: async () => {
      try{
        const allProducts = await ProductModel.find();  

        return allProducts;
      }catch(e){
        console.error(allProducts);
      }
    },
    getProductById: async (_, { id }) => {
      try{
        const product = await ProductModel.findById(id);

        if(!product) throw new Error('product does not exists');

        return product;
      }catch(e){
        console.error(e);
      }
    },
    getAllClients: async () => {
      try{
        const clients = await ClientModel.find();
        return clients;
      }catch(e){
        console.error(e);
      }
    },
    getClientsBySeller: async (_, {}, ctx, inf) => {
      try{
        const { sub } = ctx.user;
        const clientsBySeller = await ClientModel.find({
          seller: sub,
        });
        return clientsBySeller;
      }catch(e){
        console.error(e);
      }
    },
    getClientById: async (_, { id }, ctx) => {
      try{
        if(!ctx.user) throw new Error('unauthorized');

        const { sub } = ctx.user;

        const client = await ClientModel.findById(id);
        if(!client) throw new Error('client not found');
 
        if(client.seller.toString() !== sub.toString()) throw new Error('you do not have permissions to view information about this client');

        return client;
      }catch(e){
        console.error(e);
      }
    },
    getAllOrders: async () => {
      try{

        const allOrders = await OrderModel.find();
        return allOrders;

      }catch(e){
        console.error(e);
      }
    },
    getOrdersBySeller: async (_, { }, ctx) => {
      if(!ctx.user) throw new Error('unauthorized');
      const { sub } = ctx.user;
      try{
        const orders = await OrderModel.find({ seller: sub });
        return orders;
      }catch(e){
        console.error(e);
      }
    },
    getOrderById: async (_, { id }, ctx) => {
      if(!ctx.user) throw new Error('unauthorized');

      const { sub } = ctx.user;

      try{
        const order = await OrderModel.findById(id);
        if(!order) throw new Error('order does not exists');
        if(order.seller.toString() !== sub.toString()) throw new Error('unauthorized');

        return order;
      }catch(e){
        throw new Error(e);
      }

    },
    getOrderByStatus: async (_, { status }, ctx) => {
      if(!ctx.user) throw new Error('unauthorized');
      const { sub } = ctx.user;

      const orders = await OrderModel.find({ 
        seller: sub,
        status: status,
      });

      return orders;
    },
    bestClients: async () => {
      const clients = await OrderModel.aggregate([
        {$match: {status: 'COMPLETED'}},
        {$group: {
          _id: '$client',
          total: { $sum: '$total' }
        }},
        {
          $lookup: {
            from: 'clients',
            localField: '_id',
            foreignField: '_id',
            as: 'client',
          },
        },
        {
          $sort: { total: -1 },
        }
      ]);
      return clients;
    },
    bestSellers: async () => {
      const sellers = await OrderModel.aggregate([
        {$match: { status: 'COMPLETED' }},
        {$group: {
          _id: '$seller',
          total: { $sum: '$total' }
        }},
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'seller'
          }
        },
        { 
          $sort: {
            total: -1
          }
        },
        {
          $limit: 3
        }
      ]);
      return sellers;
    }
  },
  Mutation: {
    addUser: async (_, { input }, ctx, inf) => {
      try{
        const { email, password } = input;

        const verifyEmail = await UserModel.findOne({
          email: email
        });
        if(verifyEmail) throw new Error('email already exists');
  
        const hashPassword = await bcrypt.hash(password, 10);
  
        const user = new UserModel({ ...input, password: hashPassword, role: 'seller' });
        await user.save();
  
        return user;
      }catch(e){
        console.error(e);
      }
    },
    authenticate: async (_, { input }, ctx, inf) => {
      const { email, password } = input;

      const userExists = await UserModel.findOne({ email });
      if(!userExists) throw new Error('invalid email or password');

      const samePassword = await bcrypt.compare(password, userExists.password);
      if(!samePassword) throw new Error('invalid email or password');

      const token = signToken(userExists, '7d');
      return {
        token: token,
      };
    },
    createProduct: async (_, { input }, ctx, inf) => {
      try{
        const newProduct = ProductModel(input);
        const saved = await newProduct.save();

        return saved;
      }catch(e){
        console.error(e);
      }
    },
    updateProduct: async (_, { id, input }, ctx) => {
      try{
        const product = await ProductModel.findById(id);
        if(!product) throw new Error('product does not exists');

        const editProduct = await ProductModel.findOneAndUpdate({ _id: id }, input, {
          new: true,
        });

        return editProduct;
      }catch(e){
        console.error(e);
      }
    },
    deleteProduct: async (_, { id }, ctx) => {
      try{
        const product = await ProductModel.findById(id);

        if(!product) throw new Error('product does not exists');

        await ProductModel.findByIdAndDelete({ _id: id });

        return "deleted successfully";
      }catch(e){
        console.error(e);
      }
    },
    addClient: async (_, { input }, ctx) => {
      try{
        const { email } = input;
        const verifyEmail = await ClientModel.findOne({ email });
  
        if(verifyEmail) throw new Error('client already registered')

        const user = ctx.user;

        const client = new ClientModel({ ...input, seller: user.sub });
        await client.save();

        return client;
      }catch(e){
        console.error(e);
      }
    },
    updateClient: async (_, { id, input }, ctx) => {
      
      if(!ctx.user) throw new Error('unauthorized');
      const { sub } = ctx.user;

      const client = await ClientModel.findById(id);
      if(client.seller.toString() !== sub.toString()) throw new Error('unauthorized');

      const clientUpdated = await ClientModel.findByIdAndUpdate(id, input, {
        new: true,
      });

      return clientUpdated;
    },
    deleteClient: async (_, { id }, ctx) => {
      if(!ctx.user) throw new Error('unauthorized');
      const { sub } = ctx.user;

      const client = await ClientModel.findById(id);
      if(client.seller.toString() !== sub.toString()) throw new Error('unauthorized');

      await ClientModel.findByIdAndDelete(id);

      return "deleted successfully";
    },
    newOrder: async (_, { input }, ctx) => {
      if(!ctx.user) throw new Error('unauthorized');
      const { sub } = ctx.user;

      const { client, order } = input;

      const existClient = await ClientModel.findOne({ _id: client });
      if(!existClient) throw new Error('client not exists');

      if(existClient.seller.toString() !== sub.toString()) 
        throw new Error('client is not assigned to this seller');
    
      for await (const product of order) {
        const { id } = product;

        const fetchedProduct = await ProductModel.findById(id);

        if(parseInt(fetchedProduct.stock) < parseInt(product.quantity)) 
          throw new Error(`the product '${fetchedProduct.name}' exceeds the available stock`);
      }

      for await (const product of order) {
        const { id } = product;
        const fetchedProduct = await ProductModel.findById(id);

        await ProductModel.findByIdAndUpdate(id, {stock: fetchedProduct.stock - product.quantity});
      }

      const newOrder = new OrderModel({ ...input, seller: sub });
      newOrder.save();

      return newOrder;
    },
    updateOrder: async (_, { id, input }, ctx) => {
      if(!ctx.user) throw new Error('unauthorized');
      const { sub } = ctx.user;

      const order = await OrderModel.findById(id);
      if(!order) throw new Error('order does not exists');
      
      const client = await ClientModel.findById(input.client);
      if(!client) throw new Error('client does not exists');
      
      if(order.seller.toString() !== sub.toString()) throw new Error('unauthorized');

      // we check if the sum of the order and the product actual stock is minor than the input
      // if true, it throws an error because product quantity to update is more than the stock
      // if flase, continue
      // after that we should change the product stock quantity and update the product stock quantity
      // and obviously change the total
      for await (const product of order.order) {
        const fetchedProduct = await ProductModel.findById(product.id);
        const productOnOrder = order.order.findIndex(p => p.id === product.id);

        const actualQuantity = order.order[productOnOrder].quantity + fetchedProduct.stock;
        const productOnInput = input.order[input.order.findIndex(p => p.id === product.id)].quantity;

        if(actualQuantity < productOnInput)
          throw new Error(`the product '${fetchedProduct.name}' exceeds the available stock`);
      }

      for await (const product of order.order) {
        const fetchedProduct = await ProductModel.findById(product.id);
        const productOnOrder = order.order.findIndex(p => p.id === product.id);

        const actualQuantity = order.order[productOnOrder].quantity + fetchedProduct.stock;
        const productOnInput = input.order[input.order.findIndex(p => p.id === product.id)].quantity;

        await ProductModel.findByIdAndUpdate(fetchedProduct.id, { 
          stock: parseInt(actualQuantity - productOnInput),
        });
      }
      const updated = await OrderModel.findByIdAndUpdate(id, input, {
        new: true,
      });

      return updated;
    },
    deleteOrder: async (_, { id }, ctx) => {
      if(!ctx.user) throw new Error('unauthorized');
      const { sub } = ctx.user;

      const order = await OrderModel.findById(id);
      if(!order) throw new Error('order does not exists');

      if(order.seller.toString() !== sub.toString()) throw new Error('unauthorized');

      for await (const product of order.order) {
        const productFetched = await ProductModel.findById(product.id);
        
        await ProductModel.findByIdAndUpdate(product.id, { 
          stock: parseInt(productFetched.stock + product.quantity), 
        });
      }

      await OrderModel.findByIdAndDelete(id);
      return "deleted successfully";
    },
  }
}

module.exports = { resolvers };