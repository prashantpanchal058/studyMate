import mongoose from "mongoose";

const mongoURI = process.env.MONGODB_URL || "mongodb://localhost:27017/studyFinder";

const connectToMongo = async()=>{
    await mongoose.connect(mongoURI)
    .then(()=>console.log("database is connected."));
}

export default connectToMongo;