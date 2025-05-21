const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return res.redirect(403, '/').send({//status(403).
        message: "No token provided!",
      });
    }
  
    jwt.verify(token, config.secret(), (err) => {if (err) {return res.redirect(401, '/').send({message: "Unauthorized!"})}})
    next()
  };

const authJwt = {
    verifyToken
};
module.exports = authJwt;
