/**
* this module if installed into a botkit v4+ app will enable "Bot Inspector" mode in Bot Framework Emulator
* This allows you to connect to the bot app running locally with emulator to inspect messages 
* as they come and go to the messaging platform.
* Read more here:
* https://github.com/Microsoft/botframework/blob/master/README.md#bot-inspector-new---preview
*/
// Import a platform-specific adapter for facebook. to be used for multiadapter
const { FacebookAdapter, FacebookEventTypeMiddleware, FacebookAPI } = require('botbuilder-adapter-facebook');
const { ShowTypingMiddleware } = require(`botbuilder`);
// import botbuilder 4.4 library
const { AutoSaveStateMiddleware, InspectionMiddleware, InspectionState } = require('botbuilder')

module.exports = function (controller) {

    // Set up Facebook Adapter taken from https://github.com/howdyai/botkit/blob/main/packages/testbot/multiadapter.js
    const facebook_adapter = new FacebookAdapter({
        enable_incomplete: process.env.DYNO ? false : true,
        verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
        access_token: process.env.FACEBOOK_ACCESS_TOKEN,
        /* getAccessTokenForPage: async (pageId) => {
            // do something to fetch the page access token for pageId.
            return token;
        }, */
        app_secret: process.env.FACEBOOK_APP_SECRET,
        app_id: process.env.FACEBOOK_APP_ID,
        api_host: process.env.FACEBOOK_API_HOST,
        api_version: process.env.FACEBOOK_API_VERSION
    })

    // Bot Framework inspection middleware allows you to debug from the emulator
    let inspectionState = new InspectionState(controller.storage);
    let inspector = new InspectionMiddleware(inspectionState, undefined, controller.conversationState);

    // emit events based on the type of facebook event being received
    facebook_adapter.use(new FacebookEventTypeMiddleware());
    // facebook_adapter.use(new ShowTypingMiddleware(0,500));
    facebook_adapter.use(controller.myGlobalInspector);
    facebook_adapter.use(controller.myGlobalUserState);


    controller.ready(function () {
        // Make the Facebook adapter work
        // we do this by creating a SECOND webhook endpoint
        // and calling the facebook_adapter directly as below.
        // this is what Botkit does internally, see:
        // https://github.com/howdyai/botkit/blob/master/packages/botkit/src/core.ts#L675
        controller.webserver.post('/api/facebook', (req, res) => {
            facebook_adapter.processActivity(req, res, controller.handleTurn.bind(controller)).catch((err) => {
                console.error('Experienced an error inside the facebook turn handler', err);
                throw err;
            });
        });

        controller.webserver.get('/api/facebook', (req, res) => {
            if (req.query['hub.mode'] === 'subscribe') {
                if (req.query['hub.verify_token'] === process.env.FACEBOOK_VERIFY_TOKEN) {
                    res.send(req.query['hub.challenge']);
                } else {
                    res.send('OK');
                }
            }
        });

        console.log(`Use the Facebook Channel with Inspect Mode on : http://localhost:${process.env.PORT || 3000}/api/facebook`);

    });

}