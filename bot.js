var auth = {
  user: "andyjiang+@gmail.com",
  pass: "mengfei8*"
};

var page = require("webpage").create();
var names = [];

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

    // Look at search page. List all the a.href links in the hello kitty etsy page
    window.setTimeout(function() {
      console.log("Saving all contact URLs to array.");
      page.open("https://www.linkedin.com/vsearch/p?type=people&keywords=quality&orig=FCTD&rsid=282041601401844053108&pageKey=voltron_federated_search_internal_jsp&trkInfo=tarId%3A1401844048640&search=Search&openFacets=N,G,CC&f_G=us%3A84", function() {
        if (status === "success")
          console.log("Accessed search results page.");

        var anchorElements = document.querySelectorAll(".title");
        for (var i = 0; i < anchorElements.length; i++ ) {
          names.push(anchorElements[i].href);
        }
      });
    }, 6000);
 
    // Go to a contact.
    window.setTimeout(function() {
      console.log("Going to Andy's Linkedin account.");
      page.open("https://www.linkedin.com/in/andyjiang", function(status) {
        if (status === "success")
          console.log("On Andy's Linkedin page. Can he see me?");
        
        page.render('linkedin.png');
      });
    }, 6000);

    // window.setTimeout(function() {
    //   console.log("Get names");
    //   names = page.evaluate(function() {
    //     var all = document.querySelectorAll(".conx-list li");
    //     var list = [];
    //     for (var i = all.length - 1; i >= 0; i--) {
    //       var item = all[i];
    //       if (item.hasOwnProperty("id")) {
    //         var nameInputs = item.getElementsByTagName("input");
    //         if (nameInputs.length > 0) {
    //           console.log(nameInputs[0].value, item.id);
    //           list.push({
    //             name: nameInputs[0].value,
    //             href: "http://www.linkedin.com/profile/view?id=" + item.id
    //           });
    //         }
    //       }
    //     }
    //     console.log("Got " + list.length + " names");
    //     return list;
    //   });
 
    //   var a = new ParallelRunner(names, visitAndEndorse, 3);
    //   a.start();
 
    // }, 6000);
  }
});