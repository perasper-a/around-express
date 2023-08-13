const User = require('../models/usersModel');
const {
  DEFAULT_ERROR,
  NOT_FOUND,
  BAD_REQUEST,
  OK,
} = require('../utils/constance');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (error) {
    res.status(DEFAULT_ERROR).json({ message: 'Error' });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (user) {
      res.status(OK).json(user);
    } else {
      res.status(NOT_FOUND).json({ message: 'User ID not found' });
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res
        .status(BAD_REQUEST)
        .json({ message: 'No user/card found with that id' });
    } else {
      res.status(DEFAULT_ERROR).json({ message: 'Error retrieving user' });
    }
  }
};

// Create a new user
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  const newUser = new User({
    name,
    about,
    avatar,
  });
  newUser
    .save()
    .then((savedUser) => {
      res.status(OK).json(savedUser);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(BAD_REQUEST).send({ message: 'Invalid data' });
      }
      return res.status(DEFAULT_ERROR).json({ message: 'Error creating user' });
    });
};

const updateProfile = async (req, res) => {
  try {
    const { name, about } = req.body;
    const newUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => {
      const error = new Error('No user/card found with that id');
      error.statusCode = NOT_FOUND;
      throw error;
    });
    res.send(newUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({
        message: 'invalid data passed to the methods for creating a user ',
      });
    } else if (err.statusCode === NOT_FOUND) {
      res.status(NOT_FOUND).send({ message: 'there is no such user' });
    } else {
      res
        .status(DEFAULT_ERROR)
        .send({ message: 'An error has occurred on the server.' });
    }
  }
};
const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const newUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    ).orFail(() => {
      const error = new Error('No user/card found with that id');
      error.statusCode = NOT_FOUND;
      throw error;
    });
    res.send(newUser);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(BAD_REQUEST).send({
        message:
          'invalid data passed to the methods for updating a user avatar ',
      });
    } else if (err.statusCode === NOT_FOUND) {
      res.status(NOT_FOUND).send({ message: 'there is no such user' });
    } else {
      res
        .status(DEFAULT_ERROR)
        .send({ message: 'An error has occurred on the server.' });
    }
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
