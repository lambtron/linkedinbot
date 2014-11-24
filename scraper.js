var auth = {
  user: "andyjiang+@gmail.com",
  pass: "rainforestqa"
};

var fs = require("fs");

var page = new WebPage(),
  url = 'https://www.linkedin.com/vsearch/p?type=people&keywords=quality&orig=FCTD&rsid=282041601401844053108&pageKey=voltron_federated_search_internal_jsp&trkInfo=tarId%3A1401844048640&search=Search&openFacets=N,G,CC&f_G=us%3A84',
  stepIndex = 0;

/**
 * From PhantomJS documentation:
 * This callback is invoked when there is a JavaScript console. The callback may accept up to three arguments:
 * the string for the message, the line number, and the source identifier.
 */
page.onConsoleMessage = function(msg, line, source) {
  console.log('console:' + source + '/' + line + '> ' + msg);
};

/**
 * From PhantomJS documentation:
 * This callback is invoked when there is a JavaScript alert. The only argument passed to the callback is the string for the message.
 */
page.onAlert = function(msg) {
  console.log('alert!!> ' + msg);
};
/**
 * Get error reason.
 */
page.onResourceError = function(resourceError) {
    page.reason = resourceError.errorString;
    page.reason_url = resourceError.url;
};

/**
 * Universal click function.
 */
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

// Log in.
page.open("https://www.linkedin.com/uas/login", function(status) {
  if (status === "success") {
    page.evaluate(function(auth) {
      document.querySelector("#session_key-login").value = auth.user;
      document.querySelector("#session_password-login").value = auth.pass;
      document.querySelector("#login").submit();

      console.log("Login submitted!");
    }, auth);

    console.log(" ..logging in.");

    // Callback is executed each time a page is loaded...
    window.setTimeout(function() {
      console.log("Navigating to search result.");
      page.open(url, function(status) {
        if (status === 'success') {
          // Collect links. Then go to next page.
          var loop = function loop() {
            // Save screenshot for debugging purposes
            page.render("data/img/step " + stepIndex+++".png");

            // State is initially empty. State is persisted between page loads and can be used for identifying which page we're on.
            console.log('============================================');
            console.log('Page ' + stepIndex + '');
            console.log('============================================');

            // var links = page.evaluate(function() {
            //   var links = [];
            //   var anchorElements = document.querySelectorAll("a.title");
            //   for (var i = 0; i < anchorElements.length; i++) {
            //     if (anchorElements[i] && anchorElements[i].href != "")
            //       links.push(anchorElements[i].href);
            //     if (i == anchorElements.length - 1)
            //       return links;
            //   }
            // });

            var links = [0,1,2,3,4,5,6,7,8,9];

            // CREEP.
            function peek(index, cb) {
              page.evaluate(function(index) {
                var anchorElements = document.querySelectorAll("a.title");

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

                click(anchorElements[index]);
              }, index);

              // Wait 10 seconds
              window.setTimeout(function (){
                page.render('profile-' + stepIndex + '-' + index + '.png');
                page.goBack();
              }, 10000);

              // Go back
              window.setTimeout(function () {
                cb.apply();
              }, 5000);
            }

            function process () {
              if (links.length > 0) {
                var link = links[0];
                var linksJSON = JSON.stringify(links).replace(link + ',', '');
                links = JSON.parse(linksJSON);
                peek(link, process);
              } else {
                console.log('over');
              }
            }

            // console.log(links[0]);
            process();

            // fs.write("data/txt/linkedIn-" + stepIndex + ".txt", links, 'w');

            // Click on next.
            page.evaluate(function(click) {
              var next = document.querySelector('a[rel="next"]');
              click(next);
            }, click);
          };

          var timerId = 0;
          if (timerId)
            window.clearInterval(timerId);

          loop();
          timerId = window.setInterval(loop, 150000);
        }
      });
    }, 5000);
  }
  else {
    console.log("Error opening url \"" + page.reason_url + "\": " + page.reason);
  }
});
