let express = require("express");
let router = express.Router();

const RegisterCtrl = require('../../../controller/login/register')
const LoginCtrl = require('../../../controller/login/login')


router.post('/register', RegisterCtrl.register);
router.post('/login',LoginCtrl.login);


module.exports = router;
