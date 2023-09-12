const bcrypt = require('bcrypt');
const { UserModel } = require("../models/user.model");

const resolvers = {
  Query: {
    getRandom: () => 'Random',
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
  
        const user = new UserModel({ ...input, password: hashPassword });
        await user.save();
  
        return user;
      }catch(e){
        console.error(e);
      }
    }
  }
}

module.exports = { resolvers };