import jwt, { TokenExpiredError } from "jsonwebtoken";
import { notAuth } from "./handle_errors";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return notAuth("Require Login!!", res);
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      const isChecked = err instanceof TokenExpiredError;
      if (!isChecked) return notAuth(" Token invalid", res, isChecked);
      if (isChecked) return notAuth(" Token expired", res, isChecked);
    }
    req.user = decode;
    next();
  });
};

//dsdsd
module.exports = verifyToken;
