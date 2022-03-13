const AdminJS = require("adminjs");
const AdminJSExpress = require("@adminjs/express");
const AdminJSMongoose = require("@adminjs/mongoose");
const mongoose = require("mongoose");

AdminJS.registerAdapter(AdminJSMongoose);

const adminJs = new AdminJS({
  databases: [mongoose],
  rootPath: "/admin",
});

const router = AdminJSExpress.buildRouter(adminJs);

module.exports = router;
