import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("database connected ")
    );
    await mongoose.connect(`${process.env.MONGO_DB_CONNECTION}/Book`);
  } catch (error) {
    console.log(error.message);
  }
};
export default connectDB;
