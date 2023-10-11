/**
* this module if installed into a botkit v4+ app will enable "Bot Inspector" mode in Bot Framework Emulator
* This allows you to connect to the bot app running locally with emulator to inspect messages 
* as they come and go to the messaging platform.
* Read more here:
* https://github.com/Microsoft/botframework/blob/master/README.md#bot-inspector-new---preview
*/
// Import a platform-specific adapter for whatsapp. to be used for multiadapter
const { TwilioWhatsAppAdapter } = require('@botbuildercommunity/adapter-twilio-whatsapp');
const { ShowTypingMiddleware } = require(`botbuilder`);
// import botbuilder 4.4 library
const { UserState, AutoSaveStateMiddleware, InspectionMiddleware, InspectionState } = require('botbuilder')

module.exports = function (controller) {

    // Set up Whatapp Adapter taken from https://github.com/howdyai/botkit/blob/main/packages/testbot/multiadapter.js

    const whatsAppAdapter = new TwilioWhatsAppAdapter({
        accountSid: process.env.TWILIO_ACCOUNT_SID, // Account SID
        authToken: process.env.TWILIO_AUTH_TOKEN, // Auth Token
        phoneNumber: process.env.TWILIO_NUMBER, // The From parameter consisting of whatsapp: followed by the sending WhatsApp number (using E.164 formatting)
        endpointUrl: process.env.TWILIO_ENDPOINT_URL // Endpoint URL you configured in the sandbox, used for validation
    });

    // Bot Framework inspection middleware allows you to debug from the emulator
    whatsAppAdapter.use(controller.myGlobalInspector);
    //controller.userStateWts = new UserState(controller.storage);
    //controller.userLangPrefAccessorWts = controller.userStateWts.createProperty(`languagePreferencePropertyWts`);
    whatsAppAdapter.use(controller.myGlobalUserState);


    controller.ready(function () {
        // Make the Whatsapp adapter work
        // we do this by creating a SECOND webhook endpoint
        // this is what Botkit does internally, see:
        // https://github.com/howdyai/botkit/blob/master/packages/botkit/src/core.ts#L675

        // WhatsApp endpoint for Twilio
        controller.webserver.post('/api/whatsapp/messages', (req, res) => {
            whatsAppAdapter.processActivity(req, res, controller.handleTurn.bind(controller)).catch((err) => {
                console.error('Experienced an error inside the facebook turn handler', err);
                throw err;
            });
        });

        console.log(`Use the Whatsapp Channel with Inspect Mode on : http://localhost:${process.env.PORT || 3000}/api/whatsapp/messages`);

    });

}