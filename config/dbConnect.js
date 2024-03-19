const { default: mongoose } = require("mongoose");

const dbconnect = () => {
  try {
    mongoose.set("strictQuery", true);
    mongoose.connect(process.env.Mongo_URL);
    console.log("Database Connection successfull");
  } catch (error) {
    console.log("Database error");
  }
};
module.exports = dbconnect;
