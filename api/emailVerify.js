// const { findOne } = require("../Model/userSchema");
const handleError = require("../handleError");
const User = require("../Model/userSchema");
const user_email_verify = async (req, res) => {
  try {
    const mail = req.params.mail;
    const val = String(mail)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    if (!val) {
      res.status(404).send({ message: "email is not valid" });
      return;
    }
    const user = await User.findOne(
      {
        email: mail,
      },
      {
        name: 1,
        email: 1,
      }
    );
    if (user) {
      res.status(200).send({
        message: "found an account associated with this email",
        name: user.name,
      });
    } else {
      res.status(404).send({
        message: "No Account Associated with this email",
      });
    }
  } catch (err) {
    res.status(400).send(handleError(err));
  }
};
module.exports = user_email_verify;
