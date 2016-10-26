'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

var cookieParser = require('cookie-parser');
var ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;
var session = require('express-session');

/**
 * Flash messages
 *
 * Setting the failureFlash option to true instructs Passport to flash an
 * error message using the message given by the strategy's verify callback,
 * if any. This is often the best approach, because the verify callback
 * can make the most accurate determination of why authentication failed.
 */
var flash      = require('express-flash');

// Passport configurators
var loopbackPassport = require('loopback-component-passport');
var PassportConfigurator = loopbackPassport.PassportConfigurator;
var passportConfigurator = new PassportConfigurator(app);

// Load provider configurations
var config = {};
try {
  config = require('./providers.json');
} catch (err) {
  console.error('Please configure your passport strategy in `providers.json`.');
  console.trace(err);
  process.exit(1); // fatal
}

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;
});

// access token is only available after boot
app.middleware('auth', loopback.token({
  model: app.models.accessToken,
}));

/**
 * @TODO: Consolidate the following session logic according to current Loopback
 * best practices and conventions.
 */

app.middleware('session:before', cookieParser('kitty'));
app.middleware('session', session({
  secret: 'kitty', // @TODO: Automate secure session cookie secret generation.
  saveUninitialized: true,
  resave: true,
}));

app.use(cookieParser('kitty'));
app.use(session({
  secret: 'kitty', // @TODO: Automate secure session cookie secret generation.
  saveUninitialized: true,
  resave: true,
}));

// initialize Passport
passportConfigurator.init();

// set up related models
passportConfigurator.setupModels({
  userModel: app.models.user,
  userIdentityModel: app.models.userIdentity,
  userCredentialModel: app.models.userCredential,
});

// configure Passport strategies for third-party auth providers
for (var s in config) {
  var c = config[s];
  c.session = c.session !== false;
  passportConfigurator.configureProvider(s, c);
}

/**
 * @TODO: Consolidate the following logout routes according to current Loopback
 * best practices and conventions.
 */

// logout route
app.get('/auth/logout', function(req, res, next) {
  req.logout();
  res.redirect('/');
});

// another logout route
app.get('/logout', function(req, res, next) {
  //return 401:unauthorized if accessToken is not present
  if (!req.accessToken) return res.sendStatus(401);

  var User = app.models.User;

  User.logout(req.accessToken.id, function(err) {
    if (err) return next(err);
    res.redirect('/'); // redirect on successful logout
  });
});

// authentication test route
app.get('/test-auth', ensureLoggedIn('/auth/google'), function(req, res, next) {
  res.send('It worked.');
});

// Flash messages for Passport errors
app.use(flash());

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}
