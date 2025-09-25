import userModel from "../../models/user.js"

 const userServices = {
//  
  createUser: async (insertObj) => {
    return await userModel.create(insertObj);
  },
  findUser: async (email) => {
    return await userModel.findOne({ $and: [{ email: email }, { status: { $ne: 'DELETE' } }] });
  },
  findUserById: async (id) => {
    return await userModel.findOne({ $and: [{ _id: id }, { status: { $ne: 'DELETE' } }] });
  },
  updateUserById: async (query, obj) => {
    return await userModel.findByIdAndUpdate(query, obj, { new: true });
  },
  findAll: async () => {
    return await userModel.find()
  },
  findAdmin: async (query) => {
    return await userModel.findOne(query);
  },
  paginate: async (query, page, limit) => {
    try {
      const options = {
        page: parseInt(page) || parseInt(1),
        limit: parseInt(limit) || parseInt(5),
      };
      const data = await userModel.paginate(query, options)
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

}
export default userServices;