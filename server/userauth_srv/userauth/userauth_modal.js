const dbFn = require("../../core_srv/services/dbexecutable");
const encdec_srv = require("../../core_srv/services/enc_dec_srv");
const jwt_srv = require("../../core_srv/services/jwt_srv");

module.exports.login_UserModal = async (req, res) => {
  try {
    const { userEmail, userPass } = req.body;

    if (userEmail && userPass) {
      if (!(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(userEmail)) {
        return res
          .status(401)
          .send({ message: "Invalid Email Pattern" });
      }

      if (!(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/).test(userPass)) {
        return res
          .status(401)
          .send({ message: "Invalid Password Pattern" });
      }
    } else {
      return res
        .status(401)
        .send({ message: "Unknown paramaters" });
    }

    let authresult = await dbFn.dbExecutableQuery(
      "SELECT usr_id, usr_name, usr_password_hash FROM authdetails WHERE usr_email = ? AND isactive = 1;",
      [userEmail]
    );

    if (authresult.length == 0) {
      return res
        .status(401)
        .send({ message: "Invalid credentials" });
    }

    if (authresult.length == 1) {
      let match = await encdec_srv.compareHash(userPass, authresult[0].usr_password_hash);
      if (match) {
        delete authresult[0].usr_password_hash
        authresult[0].auth_token = await jwt_srv.genJWTToken(JSON.stringify(authresult[0]))
        let maindata = authresult[0]
        res
          .status(200)
          .send({ data:  maindata , message: "User Authentication Successfully" });
      } else {
        res
          .status(601)
          .send({ message: "Error occur while hash check" });
      }
    }
  } catch (Err) {
    res
      .status(601)
      .json({ message: "Something went wrong", error: Err.message });
  }
};
