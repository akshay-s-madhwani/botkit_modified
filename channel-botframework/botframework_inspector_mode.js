/**
* this module if installed into a botkit v4+ app will enable "Bot Inspector" mode in Bot Framework Emulator
* This allows you to connect to the bot app running locally with emulator to inspect messages 
* as they come and go to the messaging platform.
* Read more here:
* https://github.com/Microsoft/botframework/blob/master/README.md#bot-inspector-new---preview
*/
// import botbuilder 4.4 library
const { UserState, AutoSaveStateMiddleware, InspectionMiddleware, InspectionState, BotFrameworkAdapter } = require('botbuilder')

module.exports = function (controller) {

    // Bot Framework inspection middleware allows you to debug from the emulator
    let inspectionState = new InspectionState(controller.storage);
    let inspector = new InspectionMiddleware(inspectionState, undefined, controller.conversationState);

    //controller.userStateBfw = new UserState(controller.storage);
    //controller.userLangPrefAccessorBfw = controller.userStateBfw.createProperty(`languagePreferencePropertyBfw`);

    controller.ready(function () {
        // create an alternate adapter
        const botframework = new BotFrameworkAdapter({ // azure airtelmgprojects@gmail.com 2021botkit_api_botframework
            appId: process.env.MicrosoftAppId,
            appPassword: process.env.MicrosoftAppPassword,
      
            //appId: `2053aac8-9703-4ba7-8fda-70c24d676e36`,
            //appPassword: `2dOUsmyIqpDvx.4GRhe~-ia~.8363uqBUT`,
          });
        // use the same middleware instance!
        botframework.use(controller.myGlobalInspector)
        botframework.use(controller.myGlobalUserState);

        // set up an alternate route for the emulator to connect to
        controller.webserver.post('/api/botframework', (req, res) => {
            botframework.processActivity(req, res, controller.handleTurn.bind(controller)).catch((err) => {
                console.error('Experienced an error inside the botframework turn handler', err);
                throw err;
            });
        });
        console.log(`Use the Bot Framework Azure/Emulator with Inspect mode: http://localhost:${process.env.PORT || 3000}/api/botframework`);
    });

}