const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');

const {
  login,
  createUser,
} = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.post('/signin', login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    avatar: Joi.string().default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }).unknown(true),
}), createUser);

app.use('/', auth, require('./routes/users'));
app.use('/', auth, require('./routes/cards'));

app.use(errors);
app.use('*', (req, res) => {
  res.status(404).send({ message: 'Страница не найдена.' });
});

app.use((err, req, res, next) => {
  res.status(err.statusCode).send({ message: err.message });

  if (err.statusCode === undefined) {
    const { statusCode = 500, message } = err;

    res
      .status(statusCode)
      .send({
        message: statusCode === 500
          ? 'На сервере произошла ошибка'
          : message,
      });
  }
});

app.listen(PORT);
