
// require('./config/config');
var auth = {
  user: "andyjiang+@gmail.com",
  pass: "rainforestqa"
};

// Import models.
require('./app/lib/db_connect');
var LinkedInUser = require('./app/models/linkedin_user');


var page = require("webpage").create();

page.open("http://www.linkedin.com/people/connections", function(status) {
  if (status === "success") {
    page.evaluate(function() {
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

      console.log("Clicking on login button");
      click(button);
    });

    window.setTimeout(function() {
      page.evaluate(function(auth) {
        document.querySelector("#session_key-login").value = auth.user;
        document.querySelector("#session_password-login").value = auth.pass;
        document.querySelector("#login").submit();
 
        console.log("Login submitted!");
      }, auth);
    }, 1400);
 
    // Start a loop and feed it with URLs to hit.
    window.setTimeout(function() {
      console.log("Going to Andy's Linkedin account.");
      page.open("https://www.linkedin.com/in/andyjiang", function(status) {        

      });
    }, 6000);
  }
});