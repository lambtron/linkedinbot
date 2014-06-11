// Find names and save to MongoDB.

'use strict';

// Import models.
require('./app/lib/db_connect');
var LinkedInUser = require('./app/models/linkedin_user');

// Phantom.
var phantom = require('phantom');
var _page;

var auth = {
  user: "andyjiang+@gmail.com",
  pass: "rainforestqa"
};

phantom.create(function (ph) {
  ph.createPage(function (page) {
    _page = page;

    // Look at search page. List all the a.href links in the hello kitty etsy page
    _page.open("http://www.linkedin.com/people/connections", function(status) {
      if (status === "success") {
        _page.evaluate(function() {
          function click(el) {
            var ev = document.createEvent("MouseEvent");
            ev.initMouseEvent(
              "click",
              true /* bubble */ , true /* cancelable */ ,
              window, null,
              0, 0, 0, 0, /* coordinates */
              false, false, false, false, /* modifier keys */
              0 /*left*/ , null
            );
            el.dispatchEvent(ev);
          }

          var button = document.querySelector("#register-custom-nav a");
          click(button);
        });
        setTimeout(function() {
          _page.evaluate(function() {
            document.querySelector("#session_key-login").value = 'andyjiang@gmail.com';
            document.querySelector("#session_password-login").value = 'mengfei8*';
            document.querySelector("#login").submit();
     
            console.log("Login submitted!");
          });
        }, 1400);
      }
    });
    
    // console.log("Navigating to search results.");
    // _page.open("https://www.linkedin.com/vsearch/p?type=people&keywords=quality&orig=FCTD&rsid=282041601401844053108&pageKey=voltron_federated_search_internal_jsp&trkInfo=tarId%3A1401844048640&search=Search&openFacets=N,G,CC&f_G=us%3A84", function(status) {
    //   if (status === "success")
    //     console.log("Success.");

    //   _page.evaluate(function() {
    //     // function click(el) {
    //     //   var ev = document.createEvent("MouseEvent");
    //     //   ev.initMouseEvent(
    //     //     "click",
    //     //     true /* bubble */ , true /* cancelable */ ,
    //     //     window, null,
    //     //     0, 0, 0, 0, /* coordinates */
    //     //     false, false, false, false, /* modifier keys */
    //     //     0 /*left*/ , null
    //     //   );
    //     //   el.dispatchEvent(ev);
    //     // }

    //     // var button = document.querySelector('.page-link[title="Next Page"]');

    //     // Add to LinkedInUser.
    //     // function scrapeAndNext () {
    //     //   var anchorElements = document.querySelectorAll(".title");
    //     //   for (var i = 0; i < anchorElements.length; i++ ) {
    //     //     LinkedInUser.upsertUser(anchorElements[i].href);

    //     //     // At end of anchorElements, click next.
    //     //     if (i == anchorElements.length - 1)
    //     //       click(button);
    //     //   }
    //     // }

    //     // setInterval(scrapeAndNext(), 6000);
    //     // scrapeAndNext();

    //     return document.querySelector(".title");
    //   }, function(result) {
    //     console.log(result);
    //   }, "")
    // });
  });
});