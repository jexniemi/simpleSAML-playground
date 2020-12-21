# Based on

https://medium.com/disney-streaming/setup-a-single-sign-on-saml-test-environment-with-docker-and-nodejs-c53fc1a984c9


# Instructions

## 1. Set up docker identity provider

```
$ docker pull kristophjunge/test-saml-idp
```

```
$ docker run -p 8080:8080 -p 8443:8443  -e SIMPLESAMLPHP_SP_ENTITY_ID= saml-poc -e SIMPLESAMLPHP_SP_ASSERTION_CONSUMER_SERVICE=http://localhost:4300/login/callback -d kristophjunge/test-saml-idp
```

-e SIMPLESAMLPHP_SP_ENTITY_ID=saml-poc: This passes in an argument to our docker container. This defines the Globally Unique Identifier for the service provider. We’ll use this value in our SP code later

-e SIMPLESAMLPHP_SP_ASSERTION_CONSUMER_SERVICE=http://localhost:4300/login/callback: This is another argument we’re passing into the docker container. We’re telling it where to redirect to after a successful login. When we build out the Service Provider, it will be on port 4300 at our localhost.

## 2. Set up certificates

Create a public and private cert for our application with opennSSL. 

```
$ openssl req -x509 -newkey rsa:4096 -keyout certs\key.pem -out certs\cert.pem -nodes -days 900
```

We’ll encrypt our SAML requests with our private key, and the IdP will use the public key to decrypt them. The IdP will encrypt the responses with its private key, and we’ll use its public key to decrypt the responses.


## 3. Run application


Make sure the Docker IdP is running, certificates have been create and run 
```
$ node index.js
```

Go to `localhost:4300/login`, and the application should take you to the IdP's login, and back to the callback after login.


## Check browser's dev tools 

Should have three values:

* PHPSESSIDIDP: This is a session identifier set by the IdP.
* SimpleSAMLAuthTokenIdp: This is a User identifier set by the IdP.
* connect.sid: This is the session identification token set by our express-session plugin.

