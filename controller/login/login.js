let mongoConnection = require('../../utils/connections');
const responseManager = require('../../utils/response.manager');
const usersModel = require('../../models/users.model');
const helper = require('../../utils/helper');
const constants = require('../../utils/constants');


exports.login = async (req, res) => {
    try {
        let { email, password } = req.body;
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let userdata = await primary.model(constants.MODELS.users, usersModel).findOne({ email: email }).lean();
        if(userdata != null){ 
            let decPassword = await helper.passwordDecryptor(userdata.password);
            console.log(decPassword)
            if(decPassword == password){
                let accessToken = await helper.generateAccessToken({ userid : userdata._id.toString() });
                return responseManager.onSuccess('login successfully!', {token : accessToken}, res);
            }else{
                return responseManager.onSuccess('Invalid email or password!',0, res);  
            }
            return responseManager.onSuccess('Invalid email or password!',0, res);
        }else{
            return responseManager.onSuccess('User Not Found!!!',0, res);
        }
    } catch (error) {
        console.error('Error in login api', error);
    }
}