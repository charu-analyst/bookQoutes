import Joi from 'joi'
import bcrypt from 'bcrypt'
import userServices from '../services/userServices.js';
const{createUser,findUser,findUserById,updateUserById}=userServices;
import * as commonFunction from '../../common/utils.js';
import responseMessages from '../../../assets/responseMessages.js'

export class userController {
   // Create new user
  async userSignup(req, res, next) {
    const schema = Joi.object({
      userName: Joi.string().min(2).max(30).required(),
      email: Joi.string().required(),
      password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
     confPassword: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
    });
    try {
      const validatedBody = await schema.validateAsync(req.body);
      const {
        userName,
        email,
        password,
        confPassword,
      } = validatedBody;
      if(password!=confPassword){
         return res.status(200).json({statusCode:'403',responseMessages:responseMessages.CONFIRM_PASSWORD_NOT_MATCHED});
      }
      validatedBody.password = bcrypt.hashSync(validatedBody.password, 10);
      const user = await findUser(email);
      if (user) {
          return res.status(200).json({statusCode:'403',responseMessages:responseMessages.USER_ALREADY_EXIST});
        }
      const result = await createUser(validatedBody);
      return  res.status(200).json({statusCode:'201',responseMessages:responseMessages.USER_CREATED});
    } catch (error) {
      console.log("Error", error);
      return next(error);
    }
  }

 //signin user
  async userLogin(req, res, next) {
    const fields = Joi.object({
      email: Joi.string().required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });
    try {
      const validate = await fields.validateAsync(req.body);
      const userResult = await findUser(validate.email);
      if (!userResult) {
        return res.status(200).json({statusCode:'404',responseMessages:responseMessages.NOT_FOUND});
      } else {
        const compare = bcrypt.compareSync(
          validate.password,
          userResult.password
        );
        if (compare == false) {
          return res.status(200).json({statusCode:'402',responseMessages:responseMessages.INVALID_PASSWORD});
        }
        const token = await commonFunction.getToken({ _id: userResult._id });
        console.log("token==",token);
        
       return  res.status(200).json({statusCode:'200',responseMessages:responseMessages.LOGIN_SUCCESS,token});
      }
    } catch (error) {
      console.log("Error", error);
      return next(error);
    }
  }
  
 //get user profile detail
  async getProfile(req, res, next) {
    try {
      const userDetail = await findUserById({_id:req.userId});
        if (!userDetail) {
        return res.status(200).json({statusCode:'404',responseMessages:responseMessages.USER_NOT_FOUND});
      } 
      return res.status(200).json({statusCode:'200',responseMessages:responseMessages.USER_DETAILS,userDetail});
        
    } catch (error) {
      console.log("Error", error);
      return next(error);
    }
  }

  
  
}
export default new userController();
