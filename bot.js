var auth = {
  user: "andyjiang+@gmail.com",
  pass: "rainforestqa"
};

var page = require("webpage").create();
var creep = require("webpage").create();
var fs = require("fs");

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

    // Look at search page. List all the a.href links in the hello kitty etsy page
    window.setTimeout(function() {
      page.open("https://www.linkedin.com/vsearch/p?type=people&keywords=quality&orig=FCTD&rsid=282041601401844053108&pageKey=voltron_federated_search_internal_jsp&trkInfo=tarId%3A1401844048640&search=Search&openFacets=N,G,CC&f_G=us%3A84", function() {
        if (status === "success")
          console.log("Accessed search results page.");

        var links = [];
        var names = [];

        var collectLinks = function collectLinks () {
          // get links from page.
          names = page.evaluate(function() {
            var links = [];
            var anchorElements = document.querySelectorAll(".title");
            for (var i = 0; i < anchorElements.length; i++ ) {
              links.push(anchorElements[i].href);
              if (i == anchorElements.length - 1)
                return links;
            }
          });

          links.push.apply(links, names);

          // fs.appendFile('linkedIn.txt', names, function (err) {
          //   console.log(err);
          // });
          fs.write("linkedIn.txt", names, 'a');
    
          // creep.open(names[0], function (status) {
          //   console.log(status);
          //   creep.render('google.png');
          //   creep.close();
          // });

          // window.setTimeout(function() {
          //   creep.open(names[1], function (status) {
          //     console.log(status);
          //     creep.render('google2.png');
          //     creep.close();
          //   });
          // }, 2000);

          page.render('hanging.png');

          // Go to sites.
          // for (var i = 0; i < names.length; i++) {
          //   (function (i) {
          //     // console.log(names[i] + '\n\n');
          //     creep.open('https://www.google.com', function (status) {
          //       console.log('i am in ' + i);
          //       console.log(status);
          //       console.log(names[i]);
          //       var filename = 'name' + i + '.png';
          //       creep.render(filename);
          //       creep.close();
          //     });
          //   })(i);
          // }


          // Click on next.
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

            var next = document.querySelector('a[rel="next"]');
            click(next);
          });
        }

        var timerId = 0;
        if (timerId)
          window.clearInterval(timerId);
        
        timerId = window.setInterval(collectLinks, 10000);

        window.setTimeout(function() {
          if (timerId)
            window.clearInterval(timerId);

          console.log('\n\n\n\nfinal links:');
          console.log('\n' + links.length + '\n\n');

          page.render('linkedin-final.png');

          phantom.exit(0);
        }, 30000);

      });
    }, 4000);
  }
});