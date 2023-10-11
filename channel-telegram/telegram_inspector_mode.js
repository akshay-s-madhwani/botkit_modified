/**
* this module if installed into a botkit v4+ app will enable "Bot Inspector" mode in Bot Framework Emulator
* This allows you to connect to the bot app running locally with emulator to inspect messages 
* as they come and go to the messaging platform.
* Read more here:
* https://github.com/Microsoft/botframework/blob/master/README.md#bot-inspector-new---preview
*/
// Import a platform-specific adapter for facebook. to be used for multiadapter
const { TelegramAdapter, TelegramEventTypeMiddleware, TelegramAPI } = require('botkit-adapter-telegram');
const { ShowTypingMiddleware } = require(`botbuilder`);
// import botbuilder 4.4 library
const { AutoSaveStateMiddleware, InspectionMiddleware, InspectionState } = require('botbuilder')

module.exports = async function (controller) {

    // Set up Telegram Adapter taken from https://www.npmjs.com/package/botkit-adapter-telegram
    const telegram_adapter = new TelegramAdapter({
        access_token: process.env.TELEGRAM_TOKEN,
        webhook_url_host_name: process.env.TELEGRAM_WEBHOOK_URL_HOST_NAME
    });

    // Bot Framework inspection middleware allows you to debug from the emulator
    let inspectionState = new InspectionState(controller.storage);
    let inspector = new InspectionMiddleware(inspectionState, undefined, controller.conversationState);

    // emit events based on the type of facebook event being received
    telegram_adapter.use(new TelegramEventTypeMiddleware());
    // facebook_adapter.use(new ShowTypingMiddleware(0,500));
    telegram_adapter.use(controller.myGlobalInspector);
    telegram_adapter.use(controller.myGlobalUserState);


    await controller.ready(async function () {

        const url = `${process.env.TELEGRAM_WEBHOOK_URL_HOST_NAME}/api/telegram`
        console.log('Setup webhook for incoming messages from telegram: ', url);

        const telegramAPI = new TelegramAPI(process.env.TELEGRAM_TOKEN);

        // Make the Telegram adapter work
        // we do this by creating a SECOND webhook endpoint
        // and calling the facebook_adapter directly as below.
        // this is what Botkit does internally, see:
        // https://github.com/howdyai/botkit/blob/master/packages/botkit/src/core.ts#L675
        controller.webserver.post('/api/telegram', (req, res) => {
            telegram_adapter.processActivity(req, res, controller.handleTurn.bind(controller)).catch((err) => {
                console.error('Experienced an error inside the telegram turn handler', err);
                throw err;
            });
        });

        controller.webserver.get('/api/telegram', (req, res) => {
            res.send('Telegram Channel endpoint alive');
            /* if (req.query['hub.mode'] === 'subscribe') {
                if (req.query['hub.verify_token'] === process.env.FACEBOOK_VERIFY_TOKEN) {
                    res.send(req.query['hub.challenge']);
                } else {
                    res.send('OK');
                }
            } */
        });

        /**
 * Delete previous webhook before assigning a new one. For now lets assume our bot can only have 1 webhook
 */
        //(async () => {

        const webHookInfoForIncomingMessage = await telegramAPI.callAPI("getWebhookInfo", "POST")
        console.log('GET INFO ON CURRENT WEBHOOK', webHookInfoForIncomingMessage);

        const webHookDeleteForIncomingMessage = await telegramAPI.callAPI("deleteWebhook", "POST")
        console.log('DELETE CURRENT WEBHOOK', webHookDeleteForIncomingMessage);

        const webHookSetForIncomingMessage = await telegramAPI.callAPI("setWebhook", "POST", { url })
        console.log('SET NEW WEBHOOK', webHookSetForIncomingMessage);

        //})();

        console.log(`Use the Telegram Channel with Inspect Mode on : http://localhost:${process.env.PORT || 3000}/api/telegram`);

    });

}