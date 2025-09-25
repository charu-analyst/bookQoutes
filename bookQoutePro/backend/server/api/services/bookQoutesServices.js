import bookQoutesModel from "../../models/bookQoutes.js"

 const bookQoutesServices = {
  
  createbookQoutes: async (insertObj) => {
    return await bookQoutesModel.create(insertObj);
  },
  findbookQoutes: async (email) => {
    return await bookQoutesModel.findOne({ $and: [{ email: email }, { status: { $ne: 'DELETE' } }] });
  },
  findbookQoutesById: async (id) => {
    return await bookQoutesModel.findOne({ $and: [{ _id: id }, { status: { $ne: 'DELETE' } }] });
  },
  updatebookQoutesById: async (query, obj) => {
    return await bookQoutesModel.findByIdAndUpdate(query, obj, { new: true });
  },
  findAllQoutes: async () => {
    return await bookQoutesModel.find()
  },
  findAdmin: async (query) => {
    return await bookQoutesModel.findOne(query);
  },
  paginate: async (query, page, limit) => {
    try {
      const options = {
        page: parseInt(page) || parseInt(1),
        limit: parseInt(limit) || parseInt(5),
      };
      const data = await bookQoutesModel.paginate(query, options)
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      return error;
    }
  },

}

export default bookQoutesServices;