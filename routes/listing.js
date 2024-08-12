
const express= require("express");
const router= express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn,isOwner,validListing } = require("../middleware.js");
const listingController=require("../controllers/listing.js");

const multer  = require('multer');
const{storage}=require("../cloudConfig.js")
const upload = multer({ storage }); // files ko nikalega or automatically uploads folder m save karega





//validators schema for listings




  router.route("/")
  .get(wrapAsync(listingController.index ) )//index route
  .post(
      isLoggedIn,
      // validListing,
      upload.single('listing[image]'),//req.file m data strore kradega
      wrapAsync(  listingController.createListing)//create route

   );
 

   router.get("/new", isLoggedIn,listingController.renderNewForm);//new route

   router.route("/:id")
   .get(  wrapAsync(listingController.showListing))//show route
   .put(isLoggedIn,isOwner, upload.single('listing[image]'),validListing, wrapAsync(listingController.updateListing))//update route
   .delete(isLoggedIn,isOwner,wrapAsync(  listingController.deleteListing)//delete route

   );


    
  // Edit route
  router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm)

  );
  

  module.exports=router;