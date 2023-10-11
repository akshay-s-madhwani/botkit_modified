module.exports = function (controller) {


    controller.middleware.interpret.use((bot, message, next) => {
        // do something with bot or message
        // always call next, or your bot will freeze!
        next();
    });

}