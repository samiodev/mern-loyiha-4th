const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../keys");
const login = require("../middleware/login");

router.post("/signup", (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!email || !password || !name) {
    res
      .status(422)
      .json({ error: "Hamma inputlar to'ldirilgan bo'lishi kerak" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (savedUser) {
      return res
        .status(422)
        .json({ error: "Bunday email manzil ro'yhatdan o'tgan" });
    }

    bcrypt.hash(password, 10).then((hashedPass) => {
      const user = new User({
        email,
        name,
        password: hashedPass,
        pic,
      });
      user
        .save()
        .then((user) => {
          res.json({ msg: "Siz muvaffaqiyatli ro'yhatdan o'tdingiz" });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res
      .status(422)
      .json({ error: "Iltimos parol va email manzilingizni kiriting" });
  }
  User.findOne({ email: email }).then((savedUser) => {
    if (!savedUser) {
      return res.status(422).json({ error: "parol va email manzilingiz xato" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((doMatch) => {
        if (doMatch) {
          // res.json({msg: "successfully signed in"})
          const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
          const { _id, name, email, followers, following, pic } = savedUser;
          res.json({
            token: token,
            user: { _id, name, email, followers, following, pic },
          });
        } else {
          return res.status(422).json({ error: "Parolingiz xato" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

module.exports = router;
