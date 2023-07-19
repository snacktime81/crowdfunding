//const { User, Post, Hashtag } = require('../models');

exports.renderMain = async (req, res, next) => {
  try {
    res.render('index');
  } catch (err) {
    console.error(err);
    next(err);
  }
}
