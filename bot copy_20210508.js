//  __   __  ___        ___
// |__) /  \  |  |__/ |  |
// |__) \__/  |  |  \ |  |

// This is the main file for the mpbotika-botkit2019 bot.

// Import Botkit's core features
const { Botkit, BotkitTestClient } = require(`botkit`);
const { AutoSaveStateMiddleware, UserState } = require(`botbuilder`);
const { ShowTypingMiddleware } = require(`botbuilder`);
const { BotFrameworkAdapter } = require(`botbuilder`);
const { MessageFactory, CardFactory } = require('botbuilder');
const { TurnContext } = require('botbuilder');
const assert = require('assert');
const { DialogTurnStatus } = require('botbuilder-dialogs');

const {
  ApplicationInsightsTelemetryClient,
  ApplicationInsightsWebserverMiddleware,
} = require(`botbuilder-applicationinsights`);

const { BotkitCMSHelper } = require(`botkit-plugin-cms`);

// const localizer = require("./config/i18next_config");

// Import all tools
// const { Cmshelper } = require("./bot-helpers");
// const Cmshelper = require("./bot-helpers/lib/cmshelper");


const { MongoDbStorage } = require(`botbuilder-storage-mongodb`);

/*
console.log(
  `dikateny : `,
  localizer.t(`cms.key1_interval`, {
    ns: `arrnstst`,
    // lngs: [`mglng`, `mg`, `newlng`],
    lng: `mg`, // `mg`, `newlng`],
    // fallbackLng: [`fr`],
    defaultValue: `with def val init001`,
    postProcess: `interval`,
    count: 60,
  })
);
*/

// Load process.env values from .env file
require(`dotenv`).config();

const BOTGETSTARTED = `botgetstarted`;

let storage = null;
if (process.env.MONGO_URI) {
  storage = new MongoDbStorage({
    url: process.env.MONGO_URI,
  });
}

/*
const adapter = new FacebookAdapter({
    verify_token: process.env.FACEBOOK_VERIFY_TOKEN,
    access_token: process.env.FACEBOOK_ACCESS_TOKEN,
    app_secret: process.env.FACEBOOK_APP_SECRET,
})
*/

/*
const adapter = new BotFrameworkAdapter({
  appId: `27f5e72d-d644-4862-865b-ac940b9f5d38`,
  appPassword: `sB3:6sJQawB9QPu[SVc1tO.L?glk4B5y`,
});
*/
// curl -k -X POST https://login.microsoftonline.com/botframework.com/oauth2/v2.0/token -d "grant_type=client_credentials&client_id=27f5e72d-d644-4862-865b-ac940b9f5d38&client_secret=sB3:6sJQawB9QPu[SVc1tO.L?glk4B5y&scope=https%3A%2F%2Fapi.botframework.com%2F.default"

// emit events based on the type of facebook event being received
// adapter.use(new FacebookEventTypeMiddleware());


// boot controller with the built-in bot framework adapter that works with emulator and Azure bot service
// you could also pass in one of the above adapters as the "default" adapter and bind secondary as below...

const controller = new Botkit({
  debug: true,
  webhook_uri: `/api/messages`,
  adapterConfig: {
    appId: process.env.MicrosoftAppId,
    appPassword: process.env.MicrosoftAppPassword,
  },
  // adapter,
  webserver_middlewares: [(req, res, next) => {
    console.log('REQ < ', req.url, ' ', req.body.type, ' ', req.body.channelId);
    //console.log('RES > ', JSON.stringify(res, null, 2));
    next();
  }],
  storage,
});



// Import localizer
const localizer = require(`./config/i18next_config`);
controller.localizer = localizer;

// Import debug
const debug = require(`debug`);
controller.debug = debug;

// Setting Language Property as User State
controller.userState = new UserState(controller.storage);
controller.userLangPrefAccessor = controller.userState.createProperty(`languagePreferenceProperty`);
controller.adapter.use(new AutoSaveStateMiddleware(controller.userState));

// Setting automatic typing middleware
controller.typingMiddleware = new ShowTypingMiddleware(5000, 10000);
//controller.adapter.use(controller.typingMiddleware); // working in bot framework direct message

// Setting ApplicationInsights
// controller.webserver.use(ApplicationInsightsWebserverMiddleware);

const scripts = require(`./cms-scripts/scripts.json`);

// TODO make remote botkit cms work in real time when process.env.cms_uri and process.env.DYNO are true
//if (process.env.cms_uri) {
// Disable http request to botkit-cms when running on Heroku
//if (process.env.DYNO) {
// Mutation of apiRequest for local script usage
BotkitCMSHelper.prototype.apiRequest = function apiRequest() {
  return new Promise(resolve => {
    // var initscript = require(__dirname + '/scripts/scripts.json');
    // eslint-disable-next-line global-require
    resolve(scripts);
  });
};
//}

controller.usePlugin(
  new BotkitCMSHelper({
    uri: process.env.cms_uri,
    token: process.env.cms_token,
  })
);
//}

async function cmsinit() {
  await require(`./config/botkit-cms_config_init`)(controller);
};

cmsinit().then(() => {
  console.log(`botkit-cms_config_init Finished:${(new Error().stack.split("at ")[1]).trim().split(/\/|\\/).pop().trim(")")} - cms.qrpayload.default.str_sample_user_email result is : ${JSON.stringify(controller.localizer.t('cms.qrpayload.default.str_sample_user_email', { ns: 'qrpayload', lng: 'fr' }), null, 2)}`);



  //if (true || process.env.DYNO) {
  // controller.localcmsvar = [];
  //require(`./config/botkit-cms_config_init`)(controller);
  // controller.studio = cms;
  //}
  // Once the bot has booted up its internal services, you can use them to do stuff.

  /*
  // Activation of appInsight at DialogSet level
  const appInsightsClient = new ApplicationInsightsTelemetryClient(
    process.env.instrumentationKey || `777b36f3-e650-4f43-8b04-cf8f3da9049e`
  );
  controller.dialogSet.telemetryClient = appInsightsClient;
  */

  // # ----------- end of require botkit-cms_config_init

  controller.ready(() => {
    // load debugging features such as echo
    if (process.env.USERNAME === `1301921`) {
      controller.loadModules(`${__dirname}/debug-echo-delay`);
    }

    // load botkit middlewares hack
    controller.loadModules(`${__dirname}/features-middleware`);

    // load cms|developer generated interrups by starting dialog with interrupts
    controller.loadModules(`${__dirname}/features-interrupts`);

    // enable facebook channel with inspection
    controller.loadModules(`${__dirname}/channel-facebook`);

    // enable facebook channel menu and getstarted 
    controller.loadModules(`${__dirname}/features-facebookmenu`);

    // enable webchat channel with inspection
    controller.loadModules(`${__dirname}/channel-webchat`);

    // enable botframework channel with inspection
    controller.loadModules(`${__dirname}/channel-botframework`);

    // enable whatsapp channel with inspection
    controller.loadModules(`${__dirname}/channel-whatsapp`);

    // adaptive card samples
    controller.loadModules(`${__dirname}/features-adaptivecard`);

    controller.loadModules(`${__dirname}/features-cms`);
    controller.loadModules(`${__dirname}/features-dialogs`);

    //controller.debug(`boterror:${(new Error().stack.split("at ")[1]).trim().split(/\/|\\/).pop()}`)('just to test debug');

    /* catch-all that uses the CMS to trigger dialogs */
    if (controller.plugins.cms) {
      // controller.plugins.cms.loadScriptsFromFile()
      // controller.studio.loadAllScripts();

      controller.loadModules(`${__dirname}/features-conversationOn`);

      // # UNIT TESTING ONLY

      const myHandleTurn = async function handleTurn(turnContext) {
        debug('INCOMING ACTIVITY (manual handleTurn):', turnContext.activity);

        // Turn this turnContext into a Botkit message.
        const message = {
          // ...turnContext.activity,
          ...turnContext.activity.channelData, // start with all the fields that were in the original incoming payload. NOTE: this is a shallow copy, is that a problem?

          // if Botkit has further classified this message, use that sub-type rather than the Activity type
          type: (turnContext.activity.channelData && turnContext.activity.channelData.botkitEventType) ? turnContext.activity.channelData.botkitEventType : turnContext.activity.type,

          // normalize the user, text and channel info
          user: turnContext.activity.from.id,
          text: turnContext.activity.text,
          channel: turnContext.activity.conversation.id,

          value: turnContext.activity.value,

          // generate a conversation reference, for replies.
          // included so people can easily capture it for resuming
          reference: TurnContext.getConversationReference(turnContext.activity),

          // include the context possible useful.
          context: turnContext,

          // include the full unmodified record here
          incoming_message: turnContext.activity
        };

        // Stash the Botkit message in
        turnContext.turnState.set('botkitMessage', message);

        // Create a dialog context
        const dialogContext = await controller.dialogSet.createContext(turnContext);

        // Spawn a bot worker with the dialogContext
        const bot = await controller.spawn(dialogContext);

        return new Promise((resolve, reject) => {
          controller.middleware.ingest.run(bot, message, async (err, bot, message) => {
            if (err) {
              reject(err);
            } else {
              controller.middleware.receive.run(bot, message, async (err, bot, message) => {
                if (err) {
                  reject(err);
                } else {
                  let results = false;
                  try {
                    //results = await controller.plugins.cms.testTrigger(bot, message);
                  } catch (error) {
                    controller.debug(`boterror:${(new Error().stack.split("at ")[1]).trim().split(/\/|\\/).pop().trim(")")}`)(
                      `\`\`\`trigger result is : ${JSON.stringify(error, null, 2)}\n\`\`\``
                    );
                  }

                  if (results !== false) {
                    // do not continue middleware!
                    //return false;
                    resolve(false);
                  }
                  //return true;
                  resolve(true);
                }
              });
            }
          });
        });
      }

      const receiveCustom = new class MyReceive {
        async onTurn(context, next) {
          console.log(`Leading Edge`);
          await myHandleTurn(context);
          await next();
          console.log(`Trailing Edge`);
        }
      }

      //if (process.argv[1].indexOf('mocha') !== -1) {

        describe('Botkit dialog', function () {

          it('should test qrpayload', async () => {

            let msg;
            const client = new BotkitTestClient('test', controller, ['qrpayload'], null, [receiveCustom]);

            msg = await client.sendActivity('qrpayload');
            assert(msg.type === 'typing', 'no typing');

          });


        });

      //}

    }
  })
});
