import mongoose from "mongoose";

const connectToMongoDB = async () => {
try {
    console.log("mongo_uri:", process.env.MONGO_DB_URI);
   const conn = await mongoose.connect(process.env.MONGO_DB_URI);

   console.log(`MongoDB Connected: ${conn.connection.host}`)
} catch (error) {
    console.log("Error connection to MongoDB: ", error.message)
    process.exit(1)
}

};

export default connectToMongoDB;
    