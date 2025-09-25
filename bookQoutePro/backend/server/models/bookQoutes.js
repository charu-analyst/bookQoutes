import mongoose from 'mongoose';
mongoose.pluralize(null)
const quoteSchema = new mongoose.Schema({
  text: {
    type: String,
  },
  author: {
    type: String,
  },
  bookTitle: {
    type: String,
  },
  likeCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  likes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',   
      },
    },
  ],
  category: {
    type: String,
    default: 'General',
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  gradient:{type:String,default:"from-pink-600 to-rose-600"},
  status: {
    type: String,
    enum: ['ACTIVE', 'DELETE', 'BLOCK'],
    default: 'ACTIVE',
  },
}, { timestamps: true }); 

const QuoteModel = mongoose.model('Quote', quoteSchema);
export default QuoteModel;
