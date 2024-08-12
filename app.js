if(process.env.NODE_ENV !="production"){
  require('dotenv').config();
  
}



const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride= require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError= require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");



const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


const dburl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(dburl)
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); // for parsing,we can send files in form like photos pdf
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// app.get("/", (req, res) => {
//   res.send("hii,i am root");
// });

console.log("55")

const store = MongoStore.create({
  mongoUrl: dburl,
  crypto:{
    secret:process.env.SECRET,
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
  console.log("error in MONGO SESSION STORE", error);
})

const sessionOptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized :true,
  cookie:{
    expires:Date.now() +7 * 24 * 60 * 60 * 1000,
    maxAge:7 * 24 * 60 * 60 * 1000,
    httpOnly:true,
  }
};


console.log("82")



app.use(session(sessionOptions));//middleware
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//ek seeion ke liye sirf ek hi bar log in krna pdega
passport.serializeUser(User.serializeUser());//store
passport.deserializeUser(User.deserializeUser());//static method for session support


console.log("96")

app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  if(req.user) res.locals.currUser=req.user;
  else res.locals.currUser="";
  next();
});

//demo
app.get("/demouser",async(req,res)=>{

  let fakeUser = new User({
    email:"maneesh@123gmail.com",
    username:"suyash",
  });

  let registerUser=  await User.register(fakeUser,"helloworld");//static method for stroing data in to db
  res.send(registerUser);
})

// 



app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);

console.log("125")
app.use("/",userRouter);




console.log("130")





//middleware

app.all("*",(req,res,next)=>{
next(new ExpressError(404,"Page not found"));
});


app.use((err,req,res,next)=>{
  let{statusCode=500,message="Something went wrong"} =err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
})

app.listen(8080, () => {
  console.log("server is listening on port 8080");
});   
