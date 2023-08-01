const { PORT = 3000 } = process.env;
const express = require('express');

const app = express();
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

// use
app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use((req, res) => {
  res.status(404).send({ message: 'The requested resource was not found' });
});

// listeners
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
