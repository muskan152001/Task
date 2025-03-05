//middleware/keycloak.js
const session = require("express-session");
const Keycloak = require("keycloak-connect");
require("dotenv").config();



const memoryStore = new session.MemoryStore();

const keycloak = new Keycloak({ store: memoryStore }, {
  realm: process.env.KEYCLOAK_REALM,
  "auth-server-url": process.env.KEYCLOAK_AUTH_SERVER_URL,
  "ssl-required": "external",
  resource: process.env.KEYCLOAK_CLIENT_ID,
  credentials: {
    secret: process.env.KEYCLOAK_CLIENT_SECRET,
  },
  "confidential-port": 0,
});

module.exports = { keycloak, memoryStore };
