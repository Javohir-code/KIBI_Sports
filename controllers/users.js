const User = require("../models/User");
const config = require("../config/config");
const _ = require("lodash");
const client = require("twilio")(config.accountSID, config.authToken);

// @desc SignUp
// @route POST /user/signup
// @access Public
exports.registerUser = async (req, res, next) => {
  try {
    const user = new User(req.body);
    if (user.age < 18) {
      return res.status(400).json({ warning: "Age must be above 18" });
    }
    if (user.msisdn.includes("+") == true) {
      user.msisdn = user.msisdn.substring(1);
    }
    await user.save();
    return res.status(201).send(user);
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ error: "This email or phone number already exists" });
    }
    return res.status(400).json({ message: "Unable to Signup" });
  }
};

// @desc Login User
// @route POST /user/login
// @access Public
exports.loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ msisdn: req.body.msisdn });
    if (!user) {
      throw new Error("Unable to login");
    }

    const data = await client.verify
      .services(config.serviceID)
      .verifications.create({
        to: `+${user.msisdn}`,
        channel: "sms",
      });
    return res
      .status(200)
      .send(_.pick(data, ["to", "channel", "status", "dateCreated"]));
  } catch (error) {
    return res.status(400).send(error);
  }
};

// @desc Verify the code
// @route GET /user/verify
// @access Public
exports.verifyUser = async (req, res, next) => {
  try {
    const user = await User.findOne({ msisdn: req.query.msisdn });
    if (!user) {
      throw new Error("Unable to login");
    }
    const info = await client.verify
      .services(config.serviceID)
      .verificationChecks.create({
        to: `+${user.msisdn}`,
        code: req.query.code,
      });
    if (info.status == "approved") {
      const token = user.generateAuthToken();
      return res
        .header("auth-user", token)
        .send(_.pick(info, ["to", "channel", "status", "dateCreated"]));
    }
  } catch (error) {
    return res.status(400).send("ERROR", error);
  }
};

// @desc Update User Data
// @route GET /user/update/:id
// @access Private
exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: req.body.age,
        msisdn: req.body.msisdn,
        email: req.body.email,
      },
      { new: true }
    );
    return res.status(200).send(user);
  } catch (error) {
    return res.status(404).json({ message: "Customer not Found!" });
  }
};

// @desc Delete User Data
// @route GET /user/delete/:id
// @access Private
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id);
    return res.status(200).send(user);
  } catch (error) {
    return res.status(404).json({ message: "Customer not Found!" });
  }
};
