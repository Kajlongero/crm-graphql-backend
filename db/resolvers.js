const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const signToken = require('../utils/jwt.sign');
const verifyToken = require('../utils/jwt.verify');
const { UserModel } = require("../models/user.model");

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
    }
  }
}

module.exports = { resolvers };