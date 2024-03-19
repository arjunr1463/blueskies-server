const AdminUser = require("../models/adminUser");
const jwt = require("jsonwebtoken");

//create
const createadminuser = async (req, res) => {
  try {
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(req.body.email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const mobileRegex = /^(\+\d{1,3}[- ]?)?\d{10}$/;
    if (!mobileRegex.test(req.body.mobile)) {
      return res.status(400).json({ message: "Invalid mobile number format" });
    }
    const userExists = await AdminUser.findOne({
      $or: [{ email: req.body.email }, { mobile: req.body.mobile }],
    });
    if (userExists) {
      if (userExists.email === req.body.email) {
        return res.status(400).json({ message: "Email already exists" });
      } else if (userExists.mobile === req.body.mobile) {
        return res.status(400).json({ message: "Mobile already exists" });
      }
    }
    const newUser = new AdminUser({
      name: req.body.name,
      email: req.body.email,
      mobile: req.body.mobile,
      password: req.body.password,
      confirmpassword: req.body.password,
      issuperadmin: req.body.issuperadmin,
    });
    const savedUser = await newUser.save();
    res
      .status(200)
      .json({ message: "User created successfully", user: savedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//login
const adminuserLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await AdminUser.findOne({ email });
    if (!user) {
      return res.status(400).send({ error: "Login failed. Email not found." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .send({ error: "Login failed. Incorrect password." });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.send({ token });
  } catch (error) {
    res.status(400).send({ error: "Login failed. Please try again." });
  }
};

const adminuserLogout = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).send("Access Denied");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    decoded.exp = Math.floor(Date.now() / 1000) - 10;
    const expiredToken = jwt.sign(decoded, process.env.JWT_SECRET);

    res.send({
      message: "Token has been expired",
      expiredToken,
    });
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
};

const AdminChangePassword = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await AdminUser.findById(userId);
    if (!user) return res.status(404).send({ message: "User not found" });
    if (!req.body.oldpassword) {
      return res.status(400).send({ error: "Please fill old password" });
    } else if (!req.body.newpassword) {
      return res.status(400).send({ error: "Please fill new password" });
    } else {
      if (req.body.oldpassword === user.confirmpassword) {
        await AdminUser.findOneAndUpdate(
          (user.password = req.body.newpassword),
          (user.confirmpassword = req.body.newpassword)
        );
        res.status(200).json("Password successfully changed");
        user.save();
      } else {
        return res.status(400).send({ error: "old password is incorrect" });
      }
    }
  } catch (err) {
    res.status(500).json("Something went wrong");
  }
};

const getSingleAdmin = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const user = await AdminUser.findById(userId);
    res.json(user);
  } catch {
    res.status(500).json("Something went wrong");
  }
};

const getallAdmin = async (req, res) => {
  try {
    const adminUsers = await AdminUser.find({});
    res.status(200).json(adminUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteadmin = async (req, res) => {
  try {
    const userId = req.params.userid;
    const user = await AdminUser.findById(userId);
    if (!user || !user.issuperadmin) {
      return res
        .status(403)
        .json({ message: "Only superadmins can perform this action" });
    }
    const adminUser = await AdminUser.findById(req.params.id);
    if (!adminUser) {
      return res.status(404).json({ message: "Admin user not found" });
    }
    await adminUser.deleteOne();
    res.status(200).json({ message: "Admin user deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createadminuser,
  adminuserLogin,
  adminuserLogout,
  AdminChangePassword,
  getallAdmin,
  deleteadmin,
  getSingleAdmin,
};
