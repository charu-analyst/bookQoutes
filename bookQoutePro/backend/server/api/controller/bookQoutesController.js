import Joi from 'joi'
import bookQoutesServices from '../services/bookQoutesServices.js';
const { createbookQoutes, findbookQoutes, findbookQoutesById, updatebookQoutesById, findAllQoutes,  } = bookQoutesServices;

import  userServices  from '../services/userServices.js';
const { createUser, findUser, findUserById, updateUserById } = userServices;

import responseMessages from '../../../assets/responseMessages.js';

export class bookQoutesController {
  
  // Get all quotes with pagination and filtering 1
  async getAllQuotes(req, res, next) {
    try {
     
      const quotes = await findAllQoutes();

      if (!quotes || quotes.length === 0) {
        return res.status(200).json({
          statusCode: '200',
          responseMessages: responseMessages.NO_QUOTES_FOUND || 'No quotes found',
          data: []
        });
      }

      return res.status(200).json({
        statusCode: '200',
        responseMessages: responseMessages.QUOTES_FETCHED_SUCCESSFULLY || 'Quotes fetched successfully',
        data: quotes,
      });

    } catch (error) {
      console.log("Error in getAllQuotes:", error);
      return next(error);
    }
  }

  // Get random quotes 2
  async getRandomQuotes(req, res, next) {
    try {
      const count = Math.min(parseInt(req.query.count) || 10, 50);
      const category = req.query.category;
      
      const filter = { isActive: true };
      if (category && category !== 'all') {
        filter.category = category;
      }

      const quotes = await findAllQoutes(filter, { random: true, limit: count });

      if (!quotes || quotes.length === 0) {
        return res.status(200).json({
          statusCode: '200',
          responseMessages: responseMessages.NO_QUOTES_FOUND || 'No quotes found',
          data: []
        });
      }

      return res.status(200).json({
        statusCode: '200',
        responseMessages: responseMessages.RANDOM_QUOTES_FETCHED || 'Random quotes fetched successfully',
        data: quotes
      });

    } catch (error) {
      console.log("Error in getRandomQuotes:", error);
      return next(error);
    }
  }


  // Get single quote by ID 3
  async getQuoteById(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          statusCode: '400',
          responseMessages: responseMessages.INVALID_QUOTE_ID || 'Quote ID is required'
        });
      }

      const quote = await findbookQoutesById({ _id: id, isActive: true });

      if (!quote) {
        return res.status(404).json({
          statusCode: '404',
          responseMessages: responseMessages.QUOTE_NOT_FOUND || 'Quote not found'
        });
      }

      return res.status(200).json({
        statusCode: '200',
        responseMessages: responseMessages.QUOTE_FETCHED_SUCCESSFULLY || 'Quote fetched successfully',
        data: quote
      });

    } catch (error) {
      console.log("Error in getQuoteById:", error);
      return next(error);
    }
  }

  // Create new quote
  async createQuote(req, res, next) {
    try {
      const { text, author, bookTitle, category, tags,gradient } = req.body;

      // Validation
      if (!text || !author || !bookTitle) {
        return res.status(400).json({
          statusCode: '400',
          responseMessages: responseMessages.REQUIRED_FIELDS_MISSING || 'Text, author, and book title are required'
        });
      }

      if (text.length > 500) {
        return res.status(400).json({
          statusCode: '400',
          responseMessages: responseMessages.TEXT_TOO_LONG || 'Quote text cannot exceed 500 characters'
        });
      }

      const quoteData = {
        text: text.trim(),
        author: author.trim(),
        bookTitle: bookTitle.trim(),
        category: category || 'General',
        tags: tags || [],
        userId: req.userId, 
        isActive: true,
        likeCount: 0,
        gradient:gradient.trim()
      };

      const newQuote = await createbookQoutes(quoteData);

      if (!newQuote) {
        return res.status(500).json({
          statusCode: '500',
          responseMessages: responseMessages.QUOTE_CREATION_FAILED || 'Failed to create quote'
        });
      }

      return res.status(201).json({
        statusCode: '201',
        responseMessages: responseMessages.QUOTE_CREATED_SUCCESSFULLY || 'Quote created successfully',
        data: newQuote
      });

    } catch (error) {
      console.log("Error in createQuote:", error);
      return next(error);
    }
  }

  

  // Like a quote 4
  async likeQuote(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          statusCode: '400',
          responseMessages: responseMessages.INVALID_QUOTE_ID || 'Quote ID is required'
        });
      }

      const quote = await findbookQoutesById({ _id: id, isActive: true });
      if (!quote) {
        return res.status(404).json({
          statusCode: '404',
          responseMessages: responseMessages.QUOTE_NOT_FOUND || 'Quote not found'
        });
      }

      

      const updatedQuote = await updatebookQoutesById({ _id: id }, { $inc: { 
        likeCount: 1 
      }});

      if (!updatedQuote) {
        return res.status(500).json({
          statusCode: '500',
          responseMessages: responseMessages.LIKE_FAILED || 'Failed to like quote'
        });
      }

      return res.status(200).json({
        statusCode: '200',
        responseMessages: responseMessages.QUOTE_LIKED_SUCCESSFULLY || 'Quote liked successfully',
        data: updatedQuote
      });

    } catch (error) {
      console.log("Error in likeQuote:", error);
      return next(error);
    }
  }

  // Unlike a quote 5
  async unlikeQuote(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          statusCode: '400',
          responseMessages: responseMessages.INVALID_QUOTE_ID || 'Quote ID is required'
        });
      }

      const quote = await findbookQoutesById({ _id: id, isActive: true });
      if (!quote) {
        return res.status(404).json({
          statusCode: '404',
          responseMessages: responseMessages.QUOTE_NOT_FOUND || 'Quote not found'
        });
      }

    

      const updatedQuote = await updatebookQoutesById({ _id: id }, {$inc: { 
        likeCount: -1 
      },});

      if (!updatedQuote) {
        return res.status(500).json({
          statusCode: '500',
          responseMessages: responseMessages.UNLIKE_FAILED || 'Failed to unlike quote'
        });
      }

      return res.status(200).json({
        statusCode: '200',
        responseMessages: responseMessages.QUOTE_UNLIKED_SUCCESSFULLY || 'Quote unliked successfully',
        data: updatedQuote
      });

    } catch (error) {
      console.log("Error in unlikeQuote:", error);
      return next(error);
    }
  }

  // Soft delete quote
  async deleteQuote(req, res, next) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          statusCode: '400',
          responseMessages: responseMessages.INVALID_QUOTE_ID || 'Quote ID is required'
        });
      }

      const quote = await findbookQoutesById({ _id: id, isActive: true });
      if (!quote) {
        return res.status(404).json({
          statusCode: '404',
          responseMessages: responseMessages.QUOTE_NOT_FOUND || 'Quote not found'
        });
      }

      const updateData = {
        isActive: false,
        deletedAt: new Date(),
        updatedAt: new Date()
      };

      const deletedQuote = await updatebookQoutesById({ _id: id }, updateData);

      if (!deletedQuote) {
        return res.status(500).json({
          statusCode: '500',
          responseMessages: responseMessages.QUOTE_DELETE_FAILED || 'Failed to delete quote'
        });
      }

      return res.status(200).json({
        statusCode: '200',
        responseMessages: responseMessages.QUOTE_DELETED_SUCCESSFULLY || 'Quote deleted successfully'
      });

    } catch (error) {
      console.log("Error in deleteQuote:", error);
      return next(error);
    }
  }

}

export default new bookQoutesController();



