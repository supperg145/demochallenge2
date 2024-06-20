const User = require("../model/user.js");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

getHomePage = (req, res) => {
  res.render("homePage", {
    loginError: "",
  });
};

getRegisterPage = (req, res) => {
  const errors = validationResult(req);
  const errorMessages = errors.array();
  if (!errors.isEmpty()) {
    console.log(errorMessages);
    res
      .status(400)
      .render("register", { errors: errorMessages, hashWrong: "" });
  } else {
    res.render("register", { errors: errorMessages, hashWrong: "" });
  }
};

registerUser = async (req, res) => {
  //validate the user input using express-validator
  const errors = validationResult(req);
  const errorMessages = errors.array();
  console.log(errorMessages);
  if (!errors.isEmpty()) {
    console.log(errorMessages);
    res
      .status(400)
      .render("register", { errors: errorMessages, hashWrong: "" });
  }

  const { firstName, lastName, email, password } = req.body;

  await User.findOne({ email: email }).then((existingUser) => {
    if (existingUser) {
      const errorMessages = [{ path: "email", msg: "Email already in use" }];
      res
        .status(400)
        .render("register", { errors: errorMessages, hashWrong: "" });
    } else {
      const hash = bcrypt.hashSync(password, 10);
      if (!hash) {
        res.render("register", {
          errors: errorMessages,
          hashWrong: "Something went wrong",
        });
      } else {
        let userObj = {
          ...req.body,
          password: hash,
          messages:[]
        };
        const user = new User(userObj);

        user
          .save()
          .then(() => res.redirect(`/about`))
          .catch((err) => console.log(err));
      }
    }
  });
};

loginUser = async (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.render("homePage", {
      loginError: "All fields are required",
    });
  } else {
    let existUser = await User.findOne({ email: req.body.email });
    if (!existUser) {
      res.render("homePage", {
        loginError: "Email does not exist please register first.",
      });
    } else {
      let correctPassword = bcrypt.compareSync(
        req.body.password,
        existUser.password
      );

      if (!correctPassword) {
        res.render("homePage", {
          loginError: "Password is not correct",
        });
      } else {
        //Create user token
        let userDataForToken = {
          id: existUser._id,
          firstName: existUser.firstName,
          lastName: existUser.lastName,
          email: existUser.email,
        }
        let userToken = jwt.sign({user: userDataForToken}, process.env.SECRET_TOKEN)
        /*console.log(existUser);
        console.log(userDataForToken)
        console.log(userToken)*/
        res.cookie("userToken", userToken)
        res.redirect("/about")
        //Redirect to new page
      }
    }
  }
};

getAboutPage = (req, res) => {
  res.render("about", {});
};

logOut = (req, res) => {
  res.clearCookie("userToken");
  res.redirect("/")
}

module.exports = {
  getHomePage,
  getRegisterPage,
  registerUser,
  getAboutPage,
  loginUser,
  logOut
};
