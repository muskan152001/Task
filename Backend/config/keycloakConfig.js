//config/keycloakConfig.js
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables

const Keycloak = require("keycloak-connect");
const session = require("express-session");

const memoryStore = new session.MemoryStore();

const keycloakConfig = {
  clientId: process.env.KEYCLOAK_CLIENT_ID,
  bearerOnly: true,
  serverUrl: process.env.KEYCLOAK_SERVER_URL,
  realm: process.env.KEYCLOAK_REALM,
  credentials: {
    secret: process.env.KEYCLOAK_CLIENT_SECRET,
  },
};

const keycloak = new Keycloak({ store: memoryStore }, keycloakConfig);

module.exports = keycloak;
