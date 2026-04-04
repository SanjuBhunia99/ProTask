//  import mongoose from "mongoose";

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         require: true
//     },
//     email: {
//         type: String,
//         require: true,
//         lowercase: true,
//         unique: true
//     },
//     password: {
//         type: String,
//         required: true
//     }
// },
//     { timestamps: true }
// );

//  const userModel = mongoose.models.user || mongoose.model("user", userSchema);

//  export default userModel;

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // ✅ fixed
    },
    email: {
      type: String,
      required: true, // ✅ fixed
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema); // ✅ fixed

export default User;