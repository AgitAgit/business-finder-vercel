const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

function parseCookie(cookie) {
  try{
    let result = {};
      if(cookie){
        // console.log("cookie: ", cookie);
        const cookies = cookie.split("; ");
        // console.log("cookies",cookies);
        cookies.forEach((cookie) => {
          const pair = cookie.split("=");
          result[`${pair[0]}`] = pair[1];
        });
        // console.log("cookie parser result:",result);
      }
      return result;
    } catch (error){
      console.log(error);
      return null;
    }
}

async function authUser(req, res, next) {
    try {
        let token;
        let decoded;
        if(req.body.token){
          token = req.body.token;
        }
        else if(req.headers.jwtAuthorization){
            token = req.headers.jwtAuthorization;
        }
        else{
            const cookieObject = parseCookie(req.headers.cookie);
            token = cookieObject.jwt;
        }
        try{
          decoded = jwt.verify(token, "secretKey");
        } catch (error) {
          return res.status(400).json({message: "invalid token..."});
        }
        req.user = decoded.user;
        console.log("authUser says: request by user:", decoded.user);
        next();
    } catch (error) {
      next(error);
  }
}

module.exports = { authUser };
