const jwt = require("jsonwebtoken");
const handleError = require("../handleError");
const User = require("../Model/userSchema");
const verify = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; //getting the token
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    //vertifyToken have all the info(collection)
    const rootUser = await User.findOne(
      {
        _id: verifyToken._id,
        "tokens.token": token,
      },
      {
        name: 1,
        email: 1,
      }
    );
    if (rootUser) {
      req.token = token;
      req.rootUser = rootUser;
      req.rootEmail = rootUser.email;
      req.rootID = rootUser._id;
      next();
      return;
    }
    res.status(400).send({ message: "unauthorized !! need to login first" });
  } catch (err) {
    res.status(400).send(handleError(err));
  }
};
module.exports = verify;
