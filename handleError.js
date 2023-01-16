const errorCode = require("./errorCode");

const handleError = (err) => {
  if (Object.keys(err).includes("code")) {
    //MongoDb error
    if (err.code in errorCode) {
      return {
        code: err.code,
        message: `there was a ${errorCode[err.code]} error`,
        causedBy: err.keyPattern,
      };
    }
    return {
      code: err.code,
      message: "unknown error",
      causedBy: err.keyPattern,
    };
  } else if ("errors" in err) {
    // mongoose error
    return {
      type: err.name,
      message: err.message,
      causedBy: err.errors,
    };
  } else if (err.name == "JsonWebTokenError") {
    return {
      type: err.name,
      message: err.message ?? "Invalid cookie",
      causedBy: "JsonWebToken",
    };
  } else if (err.kind == "ObjectId" && err.name == "CastError") {
    return {
      type: err.name,
      message: "invalid id provided ",
      causedBy: err.path ?? "ObjectId",
    };
  } else if (!("message" in err)) {
    return { message: "unkown error" };
  }
  return { message: err.message };
};
module.exports = handleError;
