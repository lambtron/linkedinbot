var auth = {
  user: "andyjiang+@gmail.com",
  pass: "rainforestqa"
};

var fs = require("fs");

var page = new WebPage(),
  names = [],
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

// FS to array.
function readLines(input, cb) {
  var remaining = '';

  input.on('data', function(data) {
    remaining += data;
    var index = remaining.indexOf('\n');
    while (index > -1) {
      var line = remaining.substring(0, index);
      remaining = remaining.substring(index + 1);
      cb(line);
      index = remaining.indexOf('\n');
    }
  });

  input.on('end', function() {
    if (remaining.length > 0) {
      cb(remaining);
    }
  });
}

function creep(names) {
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
        var peek = function peek() {
          for (var i = 0; i < names.length; i++) {
            console.log("Navigating to " + names[i]);
            page.open(names[i], function(status) {
              console.log("Inside.");
            });
          }
        };

        var timerId = 0;
        if (timerId)
          window.clearInterval(timerId);

        peek();
        window.setInterval(peek, 10000);
      }, 5000);
    }
  });
}


var input = fs.createReadStream('data/txt/linkedin-1.txt');
readLines(input, creep);
