const express = require("express")
const router=express.Router({mergeParams:true});
const User=require("../models/user.js")
const wrapAsync = require("../utils/wrapAsync")
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

// Google login start
router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google callback
router.get("/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/");
  }
);

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local",{failureRedirect:"/login", failureFlash : true }),userController.login)



router.get("/logout",userController.logout )

module.exports=router;