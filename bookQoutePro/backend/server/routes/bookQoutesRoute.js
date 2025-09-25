import express from 'express';
import bookQoutesController from '../api/controller/bookQoutesController.js';
import  authMiddleware  from '../common/auth.js'; 
 
const router = express.Router();

// Public routes
router.get('/quotesList', bookQoutesController.getAllQuotes);        
router.get('/random', bookQoutesController.getRandomQuotes);  
router.get('/:id', bookQoutesController.getQuoteById);  
router.put('/:id/like', bookQoutesController.likeQuote);   
router.put('/:id/unlike', bookQoutesController.unlikeQuote);

router.use(authMiddleware.verifyToken); 
router.post('/createQuotes', bookQoutesController.createQuote);


export default router;