const mongoose = require("mongoose");
const connect = async (dbName = "contact") => {
  try {
    const res11 = await mongoose.connect(process.env.URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected !!");
    return { status: 1 };
  } catch (err) {
    console.log(err);
    return { status: 0, err };
  }
};
module.exports = connect;
