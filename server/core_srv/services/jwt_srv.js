var jwt = require('jsonwebtoken');
const encdrpyt = require("../../core_srv/services/enc_dec_srv");

module.exports.genJWTToken = async (userData) => {
  try {
    const token = jwt.sign({
      data: userData
    }, 'asdadasdadaadaada', { expiresIn: 60 * 10 });
    return token;
  } catch (Err) {
    throw new Error(Err.message);
  }
}

module.exports.verifyJWTToken = async (tokenData) => {
  try {
    const decoded = jwt.verify(tokenData, 'asdadasdadaadaada');
    return decoded;
  } catch (Err) {
    throw new Error(Err.message);
  }
}

module.exports.bypassFn = async (req, res, next) => {
  try {
    if (req.method == 'POST') {
      if (!['/add-product', '/bulk-Upld-product', '/upd-product'].includes(req.url)) {
        if (!req.body?.data) {
          return res.status(401).send('Required Encrypt Values')
        }
        let dataSet = await encdrpyt.decryptFn(req.body.data);
        req.body = dataSet;
      }
    }

    if (!['/user-login'].includes(req.url)) {
      let resData = await this.verifyJWTToken(req.headers.authorization);
      req.headers.userdata = JSON.parse(resData.data)
    }
    next();
  } catch (Err) {
    return res.status(401).send(Err.message);
  }
}
