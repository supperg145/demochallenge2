const express = require("express");
const router = express.Router();
const userFunctions = require("../controller/userController.js");
const registerValidator = require("../middlewares/registerValidator.js");
const authentication = require("../middlewares/auth.js")
const messageBoardFunctions = require("../controller/messageBoardController.js")

/*function testCookie(req, res, next) {
  console.log(req.cookies); }
*/

//route for homepage/loginform
router.get("/",authentication.loginAuth, userFunctions.getHomePage);

//routes for user registering
router.get("/register", userFunctions.getRegisterPage);

router.post("/registerUser", registerValidator, userFunctions.registerUser);

//routes for login user
router.post("/login", userFunctions.loginUser);

//routers for about page
router.get("/about",authentication.isUserLoggedIn,  userFunctions.getAboutPage);

//logout
router.get("/logout", userFunctions.logOut)

//ROUTES FOR MESSAGE/COMMENTS

router.get("/messageboard",authentication.isUserLoggedIn, messageBoardFunctions.getMessageBoard)

//POST ROUTE FOR SENDING A MESSAGE TO THE BOARD
router.post("/postmessage",authentication.isUserLoggedIn, messageBoardFunctions.postMessage)



module.exports = router;
