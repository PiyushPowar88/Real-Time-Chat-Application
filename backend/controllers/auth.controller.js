import bcryptjs from "bcryptjs";
import User from "../models/userModel.js";
import generateTokenAndCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, confirmPassword, gender } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password don't match" });
    }

    const user = await User.findOne({ username }); //find user from database

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    //Hash password Here
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // avtar

    const boyProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const girlProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      gender,
      profilePic: gender === "male" ? boyProfilePic : girlProfilePic,
    });

    if (newUser) {
      //Generate JWT token here
      generateTokenAndCookie(newUser._id, res);

      await newUser.save();

      // Update this line in your controller
      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName, // Make sure this matches the model field
        username: newUser.username,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ error: "Invaild user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  try {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    const isPasswordCorrect = await bcryptjs.compare(password, user?.password || "");
  
if (!user || !isPasswordCorrect ) {
    return res.status(400).json({error: "Invalid username or password"});
}

generateTokenAndCookie(user._id, res);

res.status(200).json({
    _id: user._id,
    fullName: user.fullName,
    username: user.username,
    profilePic: user.profilePic,
});

} catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt","", {maxAge:0})
    res.status(200).json({ message:"Logged out successfully"});
  } catch (error) {
    console.log("Error in logout controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
