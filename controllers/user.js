const User= require("../models/user.js");


module.exports.renderSignUpForm=(req,res)=>{
    res.render("users/signup.ejs");
}


module.exports.signup=async(req,res)=>{

    try{
        let {username,password,email} =req.body;
        const newUser= new User({email,username});
        const registerUser=  await User.register(newUser,password);// database m user ko save krayega
        console.log(registerUser);
        req.login(registerUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        }
    );

    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
   
}

module.exports.renderLogInForm=(req,res)=>{
    res.render("users/login.ejs");
}


module.exports.login=async(req,res)=>{
    req.flash("success","Welcome  back to wanderlust! You are logged in!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
          return  next(err);
        }
        req.flash("success","you are logged out!")
        res.redirect("/listings");
    })
}
