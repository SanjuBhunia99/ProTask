 import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
},
    { timestamps: true }
);

 const userModel = mongoose.models.user || mongoose.model("user", userSchema);

 export default userModel;

// import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true
//     },
//     password: {
//       type: String,
//       required: true
//     },
//     refreshToken: {
//       type: String
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.model("User", userSchema);
