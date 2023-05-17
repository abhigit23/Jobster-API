const userModel = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthorizedError } = require("../errors");

const register = async (req, res) => {
  const user = await userModel.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
      token,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    throw new BadRequestError("Please provide email and password");

  // compare email
  const user = await userModel.findOne({ email }); // find email from user schema
  if (!user) throw new UnauthorizedError("Invalid Email"); // if user not found in user schema then throw error

  // compare password
  const isPassCorrect = await user.comparePass(password);
  if (!isPassCorrect) throw new UnauthorizedError("Invalid Password");
  const token = user.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
      token,
    },
  });
};
const updateUser = async (req, res) => {
  const { name, lastName, email, location } = req.body;
  console.log(req.user);
  if (!name || !lastName || !email || !location)
    throw new BadRequestError("Please fill all fields");

  const user = await userModel.findOne({ _id: req.user.userId });
  
  user.name = name;
  user.lastName = lastName;
  user.email = email;
  user.location = location;

  await user.save();

  const token = user.createJWT(); // Create token for new name(to replace the old name associated with old token)
  res.status(StatusCodes.OK).json({
    user: {
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      location: user.location,
      token,
    },
  });
};
module.exports = { register, login, updateUser };
