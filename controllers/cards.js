const Card = require('../models/cardsModel');
const {
  DEFAULT_ERROR,
  NOT_FOUND,
  OK,
  BAD_REQUEST,
} = require('../utils/constance');
// GET
const getCards = async (req, res) => {
  try {
    const cards = await Card.find();
    return res.status(OK).json(cards);
  } catch (error) {
    return res
      .status(DEFAULT_ERROR)
      .json({ error: 'An error occurred while retrieving the cards.' });
  }
};

// POST
const createCard = async (req, res) => {
  const { name, link } = req.body;
  const { _id } = req.user;
  // console.log(req.user._id);

  try {
    const card = new Card({
      name,
      link,
      owner: _id,
    });
    const savedCard = await card.save();
    return res.status(201).json(savedCard);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res
        .status(BAD_REQUEST)
        .send({ message: 'No user/card found with that id' });
    }
    return res
      .status(DEFAULT_ERROR)
      .json({ error: 'An error occurred while creating the card.' });
  }
};

// DELETE
const deleteCard = async (req, res) => {
  const { cardId } = req.params;

  try {
    const deletedCard = await Card.findByIdAndRemove(cardId);
    if (!deletedCard) {
      return res.status(NOT_FOUND).json({ error: 'Card not found.' });
    }
    return res.json(deletedCard);
  } catch (error) {
    if (error.name === 'CastError') {
      return res
        .status(BAD_REQUEST)
        .send({ message: 'No user/card found with that id' });
    }
    return res
      .status(DEFAULT_ERROR)
      .json({ error: 'An error occurred while creating the card.' });
  }
};

const likeCard = async (req, res) => {
  try {
    await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },

      { new: true },
    ).orFail(() => {
      const error = new Error('No user/card found with that id');
      error.statusCode = NOT_FOUND;
      throw error;
    });
    res.send({ message: 'like was added' });
  } catch (err) {
    if (err.statusCode === NOT_FOUND) {
      res.status(NOT_FOUND).send({ message: 'invalid card id' });
    } else if (err.name === 'CastError') {
      res
        .status(BAD_REQUEST)
        .send({ message: 'No user/card found with that id' });
    } else {
      res
        .status(DEFAULT_ERROR)
        .send({ message: 'An error has occurred on the server.' });
    }
  }
};

const dislikeCard = async (req, res) => {
  try {
    await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },

      { new: true },
    ).orFail(() => {
      const error = new Error('No user/card found with that id');
      error.statusCode = NOT_FOUND;
      throw error;
    });
    res.send({ message: 'like was removed' });
  } catch (err) {
    if (err.statusCode === NOT_FOUND) {
      res.status(NOT_FOUND).send({ message: 'invalid card id' });
    } else if (err.name === 'CastError') {
      res
        .status(BAD_REQUEST)
        .send({ message: 'No user/card found with that id' });
    } else {
      res
        .status(DEFAULT_ERROR)
        .send({ message: 'An error has occurred on the server.' });
    }
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
