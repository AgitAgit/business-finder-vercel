const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel.js");

const secretKey = "secretKey";

async function getAllUsers(req, res, next) {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

async function getUserByUsername(req, res, next){
  try {
    const { username } = req.params;
    const user = await User.findOne({ username: username});
    res.json({ message: { foundUser: user } });
  } catch (error) {
    next(error);
  }
}


async function addUser(req, res, next) {
  try {
    const { name, email, password, plan } = req.body;
    const hashedPass = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      plan,
      password: hashedPass,
      plainPassword:password
    });
    const result = await user.save();
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body; 
    if (!email || !password)
      return res
    .status(400)
    .json({ message: "email and password are required...", login:false});
    const storedUser = await User.findOne({ email }); //check if the user exists and extract it from the db
    // console.log("stored user:", storedUser);
    if (!storedUser)
      return res.json({ message: `could not find user with email ${email}`, login:false});
    const isValid = bcrypt.compareSync(password, storedUser.password); //use bcrypt to test if the login password matches the stored one
    if (!isValid)
      return res.json({ message: "Invalid password...", login:false });
    const token = jwt.sign(
      //generate a jwt token with payload containing the mongo id, name, email, and user plan. 
      {
        user: {
          _id: storedUser._id,
          name: storedUser.name,
          email: storedUser.email, 
          plan: storedUser.plan,
        },
      },
      secretKey,
      { expiresIn: "1h" }
    );
    console.log("a user has logged in...");
    res.status(200)
    .cookie("jwt",token)
    .json({ message: `User with email ${email} logged in successfully.`, login:true, user:storedUser, token:token });
    } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {

  } catch (error) {
    next(error);
  }
}

async function updateUserData(req, res, next) {
  try {
    const { userWithNewData } = req.body
    const existingUser = await User.findOne({username:userWithNewData.username});
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    const updatedUser = await User.findByIdAndUpdate(existingUser._id, userWithNewData);
    
    res.status(201).json({ message: "User updated successfully!", updatedUser });
  } catch (error) {
    next(error);
  }
}

async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const result = await User.findByIdAndDelete(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  addUser,
  getAllUsers,
  getUserByUsername,
  login,
  logout,
  updateUserData,
  deleteUser,
};

// export const deleteUserById = async function (req, res, next) {
  //   try {
//     const reply = await User.findByIdAndDelete(req.params.id);
//     res.json({ message: "delete successful", reply });
//     next();
//   } catch (error) {
  //     next(error);
  //   }
  // };

  // async function getUserData(req, res, next) {
  //   try {
  //     const userId = req.params.id ? req.params.id : req.user.userId;
  
  //     const user = await User.findById(userId);
  
  //     const userPosts = await Post.find({ authorId: userId });
  //     const followers = await Follower.countDocuments({ userId });
  //     const following = await Follower.countDocuments({ followerId: userId });
  
  //     const userPostData = userPosts.map((post) => ({
  //       _id: post._id,
  //       postImageUrl: post.postImageUrl,
  //     }));
  
  //     res.json({ user, Posts: userPostData, followers, following });
  //   } catch (error) {
  //     console.log(error);
  //     next(error);
  //   }
  // }
