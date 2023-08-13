const express = require('express');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

const router = express.Router();

// gets
router.get('/', getCards);

// Post
router.post('/', createCard);

// Delete
router.delete('/:cardId', deleteCard);

// put
router.put('/:cardId/likes', likeCard);

// delete
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
