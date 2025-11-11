const express = require('express');
const router = express.Router();

const auth_modal = require('./userauth/userauth_modal');

router.post('/user-login', auth_modal.login_UserModal);

module.exports = router;
