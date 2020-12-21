var express = require("express");
var session = require('express-session');s
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var saml = require('passport-saml');
var fs = require('fs'); /* used to load certs from disk */

var app = express();
app.use(cookieParser()); /* cookies required to tell whether user is authenticated or not */

/* bodydparser is used to turn body of a request into a JS object */
app.use(bodyParser.urlencoded({ extended: false })) //* take care of format `application/x-www/form-urlencoded` */
app.use(bodyParser.json()) /* take care of JSON format */
app.use(session({secret: 'secret' /* sign sessionID*/, 
                 resave: false, /* whether to save session value back into the session store after every request, even if it was not changed*/
                 saveUninitialized: true,}));


/* Passport requires that we add functions 
to serialize and deserialize the user, so that is the first thing 
we’ll do */

passport.serializeUser(function(user, done) {
  console.log('-----------------------------');
  console.log('serialize user');
  console.log(user);
  console.log('-----------------------------');
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('-----------------------------');
  console.log('deserialize user');
  console.log(user);
  console.log('-----------------------------');
  done(null, user);
});

/* Set up samlStrategy, so Passport knows how to create requests and process the login */
var samlStrategy = new saml.Strategy({
  // CONNFIG
   /* URL in our application (service provider), 
   where the IdP will post back to after a succesful user authentication*/
  callbackUrl: 'http://localhost/login/callback',
  /* URL in the IdP that we will send our request to in order to let the user authenticate,
  SIMPLESAMLPHP_SP_ASSERTION_CONSUMER_SERVICE in Docker command */
  entryPoint: 'http://localhost:8080/simplesaml/saml2/idp/SSOService.php',
  issuer: 'saml-poc', /* Globally unique identifier of our application, SIMPLESAMLPHP_SP_ENTITY_ID in Docker command */
  identifierFormat: null, /* specific format that can be request from IdP, likely IdP provides value that must be used */
  validateInResponseTo: false, /* determines if the incomingn SALM responses need to be validated or not, false for simplicity */
  disableRequestedAuthnContext: true,
  /* Set up certs */
  decryptionPvk: fs.readFileSync(__dirname + '/certs/key.pem', 'utf8'),
  privateCert: fs.readFileSync(__dirname + '/certs/key.pem', 'utf8'),
}, function(profile, done) {
    return done(null, profile);
});

passport.use('samlStrategy', samlStrategy);
app.use(passport.initialize({}));
app.use(passport.session({})); /* middleware that allows for persistent login - keep track of users */

app.get('/',
function(req, res) {
    res.send('Test Home Page');
  }
);

app.get('/login',
    function (req, res, next) {
        console.log('-----------------------------');
        console.log('/Start login handler');
        next();
    },
    passport.authenticate('samlStrategy'),
);

app.post('/login/callback',
    function (req, res, next) {
        console.log('-----------------------------');
        console.log('/Start login callback ');
        next();
    },
    passport.authenticate('samlStrategy'),
    function (req, res) {
        console.log('-----------------------------');
        console.log('login call back dumps');
        console.log(req.user);
        console.log('-----------------------------');
        res.send('Log in Callback Success');
    }
);

app.get('/metadata',
    function(req, res) {
        res.type('application/xml'); 
        res.status(200).send(
          samlStrategy.generateServiceProviderMetadata(
             fs.readFileSync(__dirname + '/certs/cert.pem', 'utf8'), 
             fs.readFileSync(__dirname + '/certs/cert.pem', 'utf8')
          )
        );
    }
);


var server = app.listen(4300, function () {
  console.log('Listening on port %d', server.address().port)
});