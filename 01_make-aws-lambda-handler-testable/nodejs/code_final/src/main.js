const services = require("./services")

exports.handler = services.bootstrap(
    cost_center = process.env.COST_CENTER
);
