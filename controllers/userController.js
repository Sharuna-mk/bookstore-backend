const Users = require("../models/userModel");
const jwt = require("jsonwebtoken");

//USER REGISTRATION
exports.userRegister = async (req, res) => {
  console.log("Inside Register Method");
  console.log(req.body);

  const { username, email, password } = req.body;
  try {
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      res.status(401).json("User already Exisiting...");
    } else {
      const newUser = new Users({ username, email, password });
      await newUser.save();
      res.status(200).json({ message: "Registration Successfull...", newUser });
    }
  } catch (error) {
    res.status(501).json("Sever Err" + error);
  }
};

exports.userLogin = async (req, res) => {
  console.log(req.body);

  const { email, password } = req.body;
  try {
    const existingUser = await Users.findOne({ email });
    if (existingUser) {
      //token generation
      if (existingUser.password == password) {
        const token = jwt.sign(
          { userMail: existingUser.email, role: existingUser.role },
          process.env.jwtKey
        );
        console.log(token);
        //token sent to client
        res.status(200).json({
          message: "Login Successfull",
          user: existingUser,
          token: token,
        });
      } else {
        res.status(401).json("Password Mismatch!");
      }
    } else {
      res.status(401).json("User not found! Please Register");
    }
  } catch (error) {
    res.status(501).json("Sever Err" + error);
  }
};

//google login

exports.googleLogin = async (req, res) => {
  console.log(req.body);

  const { username, email, password, photo } = req.body;
  try {
    const existingUser = await Users.findOne({ email });

    if (existingUser) {
      //token generation
      const token = jwt.sign(
        { userMail: existingUser.email, role: existingUser.role },
        process.env.jwtkey
      );
      console.log(token);
      //token sent to client
      res.status(200).json({ user: existingUser, token: token });
    } else {
      const newUser = new Users({ username, email, password, profile: photo });
      await newUser.save();
      //token generation
      const token = jwt.sign(
        { userMail: newUser.email, role: newUser.role },
        process.env.jwtkey
      );
      console.log(token);
      //token sent to client
      res.status(200).json({ user: newUser, token: token });
    }
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await Users.findOne({ _id: id });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.updateUser = async (req, res) => {
  const { username, profile } = req.body;
  const { email } = req.payload;
  const uploadedProfile = req.file ? req.file.filename : profile;
  try {
    const updateUser = await Users.findOneAndUpdate(
      { email },
      { username, password, profile: uploadedProfile },
      { new: true }
    );
    await updateadmin.save();
    res.status(200).json({ message: "Updated Successfully", updateUser });
  } catch (error) {
    res.status(500).json(error);
  }
};
//get users
exports.getUserList = async (req, res) => {
  try {
    const allUsers = await Users.find({ role: { $ne: "Admin" } });
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json("ERROR" + error);
  }
};

//update admin

exports.AdminProfileController = async (req, res) => {
  const { username, password, bio, profile } = req.body;
  //get email
  const email = req.payload;
  // get role
  const role = req.role;
  // update profile photo
  const uploadedProfile = req.file ? req.file.filename : profile;
  try {
    const updateadmin = await Users.findOneAndUpdate(
      { email },
      { username, password, profile: uploadedProfile, bio },
      { new: true }
    );
    await updateadmin.save();
    res.status(200).json({ message: "Updated Successfully", updateadmin });
  } catch (error) {
    res.status(500).json("ERROR" + error);
  }
};

exports.getAdmin = async (req, res) => {
  try {
    const admin = await Users.find({ role: "Admin" });
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json("ERROR" + error);
  }
};
