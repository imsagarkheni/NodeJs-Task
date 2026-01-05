let mongoConnection = require('../../utils/connections');
const responseManager = require('../../utils/response.manager');
const usersModel = require('../../models/users.model');
const helper = require('../../utils/helper');
const constants = require('../../utils/constants');


exports.register = async (req, res) => {
    try {
        const { name, mobile, email, password } = req.body;
        let primary = mongoConnection.useDb(constants.DEFAULT_DB);
        let userdata = await primary.model(constants.MODELS.users, usersModel).findOne( { email: email }).lean();
        if(userdata != null){
            return responseManager.badrequest({ message: 'User already exist with same email, Please try again...' }, res);
        }else {
            let ecnPassword = await helper.passwordEncryptor(password);
                let obj = {
                    email : email,
                    mobile:mobile,
                    password : ecnPassword,
                    name : name
                };
                await primary.model(constants.MODELS.users, usersModel).create(obj);
                return responseManager.onSuccess('User Registered successfully!', 1, res);
                }
        } catch (error) {
            console.error('Error in register api', error);
        }
}