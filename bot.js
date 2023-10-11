/** @TODO 
 * 
 * 
Twilio Whatsapp REQUEST :

POST /api/whatsapp/messages HTTP/1.1
Host: e495f457ee57.ngrok.io
Content-Type: application/x-www-form-urlencoded
X-Twilio-Signature: WR46gPv++GXErwmlhVSiLOS541s=
I-Twilio-Idempotency-Token: b44a1653-7d1e-415c-9b4f-16c2b444f66c
Accept: *\/*
Content-Length: 373
User-Agent: TwilioProxy/1.1
connection: close
X-Forwarded-Proto: https
X-Forwarded-For: 54.87.21.68

SmsMessageSid=SM2b5d477b019c4b40db8913c45a619c24&NumMedia=0&ProfileName=Ronni&SmsSid=SM2b5d477b019c4b40db8913c45a619c24&WaId=261331500063&SmsStatus=received&Body=Final+echo+nock+record&To=whatsapp%3A%2B14155238886&NumSegments=1&MessageSid=SM2b5d477b019c4b40db8913c45a619c24&AccountSid=AC6c052941e00067bdecd68b80874c5529&From=whatsapp%3A%2B261331500063&ApiVersion=2010-04-01

HTTP/1.1 200 OK
X-Powered-By: Express
Date: Mon, 24 May 2021 09:09:18 GMT
Connection: close
Content-Length: 0


Twilio Whatsapp RESPONSE :

Bot Fully Ready to Shine
INC  <     /api/whatsapp/messages   whatsapp   message   Final echo nock record
OUT     >  whatsapp:+261331500063   whatsapp   message   Echo: Final echo nock record

<<<<<<-- cut here -->>>>>>

nock('https://api.twilio.com:443', {"encodedQueryParams":true})
  .post('/2010-04-01/Accounts/AC6c052941e00067bdecd68b80874c5529/Messages.json', "To=whatsapp%3A%2B261331500063&From=whatsapp%3A%2B14155238886&Body=Echo%3A%20Final%20echo%20nock%20record")
  .reply(201, {"sid":"SMccb92dd078524ffd85cbf6bad60b5f06","date_created":"Mon, 24 May 2021 09:09:09 +0000","date_updated":"Mon, 24 May 2021 09:09:09 +0000","date_sent":null,"account_sid":"AC6c052941e00067bdecd68b80874c5529","to":"whatsapp:+261331500063","from":"whatsapp:+14155238886","messaging_service_sid":null,"body":"Echo: Final echo nock record","status":"queued","num_segments":"1","num_media":"0","direction":"outbound-api","api_version":"2010-04-01","price":null,"price_unit":null,"error_code":null,"error_message":null,"uri":"/2010-04-01/Accounts/AC6c052941e00067bdecd68b80874c5529/Messages/SMccb92dd078524ffd85cbf6bad60b5f06.json","subresource_uris":{"media":"/2010-04-01/Accounts/AC6c052941e00067bdecd68b80874c5529/Messages/SMccb92dd078524ffd85cbf6bad60b5f06/Media.json"}}, [
  'Date',
  'Mon, 24 May 2021 09:09:09 GMT',
  'Content-Type',
  'application/json; charset=utf-8',
  'Content-Length',
  '810',
  'Connection',
  'close',
  'Twilio-Concurrent-Requests',
  '1',
  'Twilio-Request-Id',
  'RQ4ba622daa39dc6533a975e5c916ef307',
  'Twilio-Request-Duration',
  '0.201',
  'Access-Control-Allow-Origin',
  '*',
  'Access-Control-Allow-Headers',
  'Accept, Authorization, Content-Type, If-Match, If-Modified-Since, If-None-Match, If-Unmodified-Since',
  'Access-Control-Allow-Methods',
  'GET, POST, DELETE, OPTIONS',
  'Access-Control-Expose-Headers',
  'ETag',
  'Access-Control-Allow-Credentials',
  'true',
  'X-Powered-By',
  'AT-5000',
  'X-Shenanigans',
  'none',
  'X-Home-Region',
  'us1',
  'X-API-Domain',
  'api.twilio.com',
  'Strict-Transport-Security',
  'max-age=31536000'
]);
<<<<<<-- cut here -->>>>>>
 
*/

//  __   __  ___        ___
// |__) /  \  |  |__/ |  |
// |__) \__/  |  |  \ |  |

// This is the main file for the mpbotika-botkit2021 bot.
/**
- * search for "._" to modify or initialize missing lang
- * search for ".js dynfunc_" to modify dynamic qr or carrousel
- * additional debugging is done via if (process.env.USERNAME === `1301921`) {
- * always reload one time without DYNO before uploading to production to regenerate files
- */

// Crawling and testing with botium
/** @BotFrameworkVersion : Working ! Integrate proxy ! ATTENTION !! It delete existing result folder
 * cd E:\MyDoc\DevProjects\botium-testing\botium-cli ; rm -R .\crawler-result-botframework\ ; docker run -v E:\MyDoc\DevProjects\botium-testing\botium-cli:/app/workdir -it --rm -p 45100:45100  botium/botium-cli crawler-run --config ./botium-botkit-botframework.json --numberOfWelcomeMessages 1 --waitForPrompt 1000 --depth 5 --output ./crawler-result-botframework --entryPoints 'qrpayload'
 * 
 * node E:\MyDoc\DevProjects\cloned-botkit-cli\botium-cli\bin\botium-cli.js crawler-run  --config E:\MyDoc\DevProjects\botium-testing\botium-cli\botium-botkit-botframework.json --numberOfWelcomeMessages 1 --waitForPrompt 1000 --depth 5 --output E:\MyDoc\DevProjects\botium-testing\botium-cli\crawler-result-botframework --entryPoints 'qrpayload' -v
 * 
 * node E:\MyDoc\DevProjects\cloned-botkit-cli\botium-cli\bin\botium-cli.js  run --config E:\MyDoc\DevProjects\botium-testing\botium-cli\botium-botkit-botframework.json --convos E:\MyDoc\DevProjects\botium-testing\botium-cli\crawler-result-botframework\scripts -v
 * 
 */

/** @BotkitFacebookWebhook : Working ! REQUIRES botium-cli inbound-proxy
 * node E:\MyDoc\DevProjects\cloned-botkit-cli\botium-cli\bin\botium-cli.js crawler-run --config E:\MyDoc\DevProjects\botium-testing\botium-cli\botium-botkit-facebook.json  --numberOfWelcomeMessages 0 --waitForPrompt 1000  --depth 5 --output E:\MyDoc\DevProjects\botium-testing\botium-cli\crawler-result-botkit-facebook --entryPoints 'qrpayload' -v
 * 
 * node E:\MyDoc\DevProjects\cloned-botkit-cli\botium-cli\bin\botium-cli.js  run --config E:\MyDoc\DevProjects\botium-testing\botium-cli\botium-botkit-facebook.json --convos E:\MyDoc\DevProjects\botium-testing\botium-cli\crawler-result-botkit-facebook\scripts
 * 
 */

/** @BotkitTwilioWhatsapp : Testing
 * node E:\MyDoc\DevProjects\cloned-botkit-cli\botium-cli\bin\botium-cli.js crawler-run --config E:\MyDoc\DevProjects\botium-testing\botium-cli\botium-botkit-twiliowhatsapp.json  --numberOfWelcomeMessages 0 --waitForPrompt 1000  --depth 5  --output E:\MyDoc\DevProjects\botium-testing\botium-cli\crawler-result-botkit-twiliowhatsapp --entryPoints 'qrpayload' -v
 * 
 */

// postgresql testing

// Import Botkit's core features
const { Botkit, BotkitTestClient } = require(`botkit`);
const { AutoSaveStateMiddleware, UserState, InspectionMiddleware, InspectionState } = require(`botbuilder`);
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

const util = require('util');
// const { Cmshelper } = require("./bot-helpers");
// const Cmshelper = require("./bot-helpers/lib/cmshelper");


const { MongoDbStorage } = require(`botbuilder-storage-mongodb`);
// const { PostgresStorage } = require(`botbuilder-storage-postgres`);

// const { Pool, Client } = require('pg');
const { exit } = require('process');
const connectionString = process.env.POSTGRES_URI
let pgpoolOptions
// if (process.env.POSTGRES_URI.indexOf('localhost') !== -1 ) {
//   pgpoolOptions = {
//     connectionString
//   }
// } else {
//   pgpoolOptions = {
//     connectionString,
//     ssl: {
//       rejectUnauthorized: false
//     }
//   }
// }

// const client = new Client(pgpoolOptions);

// client.connect();

// client.query(`DELETE FROM bk21state
// WHERE ctid  IN 
//   (
//   SELECT ctid FROM bk21state ORDER BY ctid DESC OFFSET 9000
//   )`, (err, res) => {
//   if (err == 'error: relation "bk21state" does not exist') {
//     console.log('State table not existing -- Creation');
//   } else if (err) {
//     console.log('State table cleanup failed ', err);
//     exit()
//   }
//   client.end();

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

  // if (process.env.POSTGRES_URI) {
  //   storage = new PostgresStorage({
  //     uri: process.env.POSTGRES_URI,
  //     collection: "bk21state",
  //     logging: true
  //   });
  // }

  // storage = null;
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

  // Import a platform-specific adapter for web.

  const { WebAdapter } = require('botbuilder-adapter-web');

  const webadapter = new WebAdapter({});
  const shopify = require('./shopify_api');

  const controller = new Botkit({
    
    webhook_uri: process.env.ENDPOINT || `/api/messages`,
    adapterConfig: {
      appId: process.env.MicrosoftAppId,
      appPassword: process.env.MicrosoftAppPassword,
    },
    adapter: webadapter,
    webserver_middlewares: [(req, res, next) => {
      global.req_url = req.url;
      //global.channel_id = req.body.channelId;
      //console.log('INC  <    ', req.url, ' ', req.body.channelId, ' ', req.body.type, ' ', req.body.text);
      //console.log('RES > ', JSON.stringify(res, null, 2));
      next();
    }],
    storage,
    //disable_webserver: true
  });

  const Shopify = new shopify(process.env.SHOPIFY_ADMIN_ACCESS_TOKEN)
  console.log('State DB Cleanup Done');


  // Import localizer
  const localizer = require(`./config/i18next_config`);
  controller.localizer = localizer;

  // Import debug
  const debug = require(`debug`);
  controller.debug = debug;
  controller.util = util;

  // Setting Language Property as User State
  controller.userState = new UserState(controller.storage);
  controller.userLangPrefAccessor = controller.userState.createProperty(`languagePreferenceProperty`);
  controller.myGlobalUserState = new AutoSaveStateMiddleware(controller.userState);
  controller.adapter.use(controller.myGlobalUserState);

  controller.inspectionState = new InspectionState(controller.storage);
  controller.myGlobalInspector = new InspectionMiddleware(controller.inspectionState, undefined, controller.conversationState);
  controller.adapter.use(controller.myGlobalInspector);
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
  
    var triggers = [];
  BotkitCMSHelper.prototype.enrichMessage = function enrichMessage(message_text) {
    return new Promise(function(resolve, reject) {
        var query = {
            text: message_text
        };
  
        // endpoint in the form of
        // https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/<APPID>?subscription-key=<SUBID>&verbose=true&timezoneOffset=-360&q=
        if (process.env.LUIS_ENDPOINT) {
            var luis_uri = process.env.LUIS_ENDPOINT + query.text;
            request(luis_uri, function(error, response, body) {
                if (error) {
                    console.error('Error communicating with LUIS', error);
                    resolve(query);
                } else {
                    var luis_results = {};
  
                    try {
                        luis_results = JSON.parse(body);
                    } catch(err) {
                        console.error('Error parsing LUIS response', err);
                        return resolve(query);
                    }
  
                    if (!luis_results.intents) {
                        console.warn('No intents returned from LUIS.ai.  Key may be invalid');
                        resolve(query);
                    } else {
                        if (String(luis_results.Message) === 'The request is invalid.') {
                            console.warn('No intents returned from LUIS.ai.  Key may be invalid');
                            resolve(query);
                        } else {
  
                            query.luis = luis_results;
  
                            query.intents = [];
                            query.entities = [];
  
                            luis_results.intents.forEach(function(i) {
                                query.intents.push(i);
                            });
  
                            luis_results.entities.forEach(function(e) {
                                query.entities.push(e);
                            });
  
                            resolve(query);
                        }
                    }
                }
            });
        } else {
            resolve(query);
        }
    })
  }
  

  BotkitCMSHelper.prototype.evaluateTrigger = function evaluateTrigger() {
    return new Promise(function(resolve, reject) {
      var res = [];

      BotkitCMSHelper.enrichMessage(message_text).then(function(query) {

          // if any intents were detected, check if they match a trigger...
          if (query.intents && query.intents.length) {
              // check intents first
              for (var t = 0; t < triggers.length; t++) {
                  var trigger = triggers[t].trigger;
                  if (trigger.type == 'intent') {
                      for (var i = 0; i < query.intents.length; i++) {
                          var intent = query.intents[i];
                          if (Number(intent.score) >= INTENT_CONFIDENCE_THRESHOLD) {
                              if (intent.intent === trigger.pattern) {
                                  res.push(triggers[t].script);
                              }
                          }
                      }
                  }
              }
          }

          // check regular expressions
          for (var t = 0; t < triggers.length; t++) {
              var trigger = triggers[t].trigger;
              if (trigger.type == 'regexp') {

                  var found = false;
                  try {
                      var test = new RegExp(trigger.pattern,'i');
                      found = query.text.match(test);
                  } catch(err) {
                      console.error('ERROR IN TRIGGER REGEX', err);
                  }

                  if (found !== false && found !== null) {
                      res.push(triggers[t].script);
                  }
              }
          }

          // check keywords
          for (var t = 0; t < triggers.length; t++) {
              var trigger = triggers[t].trigger;

              if (trigger.type == 'string') {

                  var found = false;
                  try {
                      var test = new RegExp('^' + trigger.pattern + '\\b','i');
                      found = query.text.match(test);
                  } catch(err) {
                      console.error('ERROR IN TRIGGER REGEX', err);
                  }

                  if (found !== false && found !== null) {
                      res.push(triggers[t].script);
                  }
              }
          }

          // check for no results...
          if (!res.length) {
              // find a script set with is_fallback true
              for (var s = 0; s < scripts.length; s++) {
                  if (scripts[s].is_fallback === true) {
                      res.push(s);
                  }
              }
          }

          if (res.length) {

              // this is the script that will be triggered.
              var triggered = scripts[res[0]];

              // copy entities from LUIS into the conversation script
              if (query.entities && query.entities.length) {
                  query.entities.forEach(function(e) {
                      var ne = {
                          name: e.type,
                          value: e.entity,
                          type: 'entity'
                      };
                      var cv = triggered.variables.filter(function(v) {
                          return v.name === ne.name && v.value === ne.value && v.type === ne.type;
                      });
                      if (cv.length === 0) {
                          triggered.variables.push(ne);
                      }
                  });
              }

              // if LUIS results exist, pass them down to the bot.
              if (query.luis) {
                  triggered.luis = query.luis;
              }

              resolve(triggered);
          } else {
              reject();
          }
      }).catch(reject);
  });
  }
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
    // console.log(`botkit-cms_config_init Finished:${(new Error().stack.split("at ")[1]).trim().split(/\/|\\/).pop().trim(")")} - cms.qrpayload.default.str_sample_user_email result is : ${JSON.stringify(controller.localizer.t('cms.qrpayload.default.str_sample_user_email', { ns: 'qrpayload', lng: 'fr' }), null, 2)}`);



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
      // controller.on('message', async (bot,msg)=>{
      //   console.debug(msg)
      //   controller.plugins.cms.loadAllScripts(bot)
      //   controller.plugins.cms.evaluateTrigger(msg.text)
      //   .then(async command=>{
                // // let functionResult = await Shopify.fetchProducts('generic',4);
                // // let formattedResult = Shopify.convertIntoTemplate('fb','generic',functionResult)
                // // console.debug(formattedResult)
                // let attachments = command.script[0].script.filter(i=>i['fb_attachments'] && elements in i.fb_attachments);
                // attachments.forEach(async(i,j)=>{
                //   let {meta} = i;
                //   action = shopify.getMethod(meta.function);
                //   if(!action) { return null}
                //   meta.raw_data = await action('generic' , 10);
                //   let parsed_data = shopify.convertIntoTemplate('fb','generic',meta.raw_data);
                //   meta.keys = Object.keys(parsed_data);
                //   meta.selected_keys = parsed_data;
                //   i.elements = []
                //   parsed_data.map(item=>{
                //     item.buttons = meta.buttons
                //     i.elements.push(...item)
                //   })
                //   i.meta = meta;
                // })

                // command.script[0].script.forEach((i,j)=>{
                //   if(i['fb_attachment']){
                //     i['fb_attachment'].elements = attachments.pop()
                //   }
                // })
      //           try{
      //           // await controller.plugins.cms.testTrigger(bot , msg)
      //           }catch(e){
      //             console.log(e)
      //           }
      //   })
      // })
      // if (process.env.USERNAME === `1301921`) {
      //   controller.loadModules(`${__dirname}/features-debug-echo-delay`);
      // }

      // // enable webchat channel with inspection
      controller.loadModules(`${__dirname}/channel-webchat`);

      // enable botframework channel with inspection
      controller.loadModules(`${__dirname}/channel-botframework`);
      // controller.loadModules(`${__dirname}/botframework-features`);

      

      // load cms|developer generated interrups by starting dialog with interrupts
      // controller.loadModules(`${__dirname}/features-interrupts`);

      if (process.argv[1].indexOf('mocha') === -1) {

        // enable facebook channel with inspection
        controller.loadModules(`${__dirname}/channel-facebook`);

        // enable telegram channel with inspection
        // controller.loadModules(`${__dirname}/channel-telegram`);

        // enable facebook channel menu and getstarted 
        controller.loadModules(`${__dirname}/features-facebookmenu`);

        // enable whatsapp channel with inspection
        // controller.loadModules(`${__dirname}/channel-whatsapp`);
      }

      // adaptive card samples
      controller.loadModules(`${__dirname}/features-adaptivecard`);

      // controller.loadModules(`${__dirname}/features-dialogs`);

      // controller.debug(`boterror:${(new Error().stack.split("at ")[1]).trim().split(/\/|\\/).pop()}`)('just to test debug');

      /* catch-all that uses the CMS to trigger dialogs */
      if (controller.plugins.cms) {
        // controller.plugins.cms.loadScriptsFromFile()
        // controller.studio.loadAllScripts();

        controller.loadModules(`${__dirname}/features-conversationOn`);

        console.log('Bot Fully Ready to Shine')
        // # UNIT TESTING ONLY
// load botkit middlewares hack
controller.loadModules(`${__dirname}/features-middleware`);
        controller.myHandleTurn = async function myHandleTurn(turnContext) {
          // controller.debug(`botkit:${(new Error().stack.split("at ")[1]).trim().split(/\/|\\/).pop().replace(')', '')}`)('INCOMING ACTIVITY (manual handleTurn):', turnContext.activity);

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

          // const trigger_results = await controller.trigger(message.type, bot, message);

          return new Promise(async (resolve, reject) => {
            controller.middleware.ingest.run(bot, message, async (err, bot, message) => {
              if (err) {
                reject(err);
              } else {
                controller.middleware.receive.run(bot, message, async (err, bot, message) => {
                  if (err) {
                    reject(err);
                  } else {
                    const interrupt_results = await controller.listenForInterrupts(bot, message);

                    if (interrupt_results === false) {
                      // Continue dialog if one is present
                      const dialog_results = await dialogContext.continueDialog();
                      console.debug('OUT  > Diloags', dialog_results)
                      if (dialog_results && dialog_results.status === DialogTurnStatus.empty) {
                        //const trigger_results = await controller.trigger(message.type, bot, message);

                        await new Promise((resolve, reject) => {
                          controller.middleware.interpret.run(bot, message, async (err, bot, message) => {
                            if (err) {
                              return reject(err);
                            }
                            const listen_results = await controller.listenForTriggers(bot, message);

                            //const listen_results = false;
                            if (listen_results !== false) {
                              resolve(listen_results);
                              //resolve();
                            } else {
                              // Trigger event handlers
                              const trigger_results = await controller.trigger(message.type, bot, message);

                              resolve(trigger_results);
                              //resolve();
                            }
                          });
                        });

                      }
                    }

                    // make sure changes to the state get persisted after the turn is over.
                    await controller.saveState(bot);
                    resolve();
                  }
                });
              }
            });
          });
        }

        controller.receiveCustom = new class MyReceive {
          async onTurn(context, next) {
            //console.log(`Leading Edge`);
            await controller.handleTurn(context);
            await next();
            //console.log(`Trailing Edge`);
          }
        }

        if (process.argv[1].indexOf('mocha') !== -1) {

          describe('Botkit dialog', function () {

            it('should test whatsapp version qrpayload', async () => {

              let msg;
              const client = new BotkitTestClient('whatsapp', controller, ['qrpayload', 'interrupthelpdialog'], null, [controller.receiveCustom]);

              //msg = await client.getNextReply(); // next
              if (true /* set true to generate mocha tests */) {

                // const sequence = ['vonjy', undefined, undefined, undefined, undefined, 'tsisy', 'misaotra nanampy']

                const sequence = [2, undefined, undefined, 'tsisy', 'misaotra nanampy']

                msg = await client.sendActivity('qrpayload');
                console.log(`msg = await client.sendActivity('qrpayload');`);

                for (let index = 0, counter = 0; typeof (msg) !== 'undefined'; index++) {
                  switch ((msg.type)) {
                    case 'typing':
                      console.log(`assert(msg.type === '${msg.type}' && msg.channelId === '${msg.channelId}', 'type ${msg.type} or channel ${msg.channelId} error');`);
                      msg = await client.getNextReply();
                      console.log(`msg = await client.getNextReply();`);
                      break;

                    case 'message':
                      switch (typeof (msg.inputHint)) {
                        case 'undefined':
                          console.log(`assert(msg.type === '${msg.type}' && msg.text === '${msg.text}', 'type ${msg.type} or text ${msg.text} error');`);
                          msg = await client.getNextReply();
                          console.log(`msg = await client.getNextReply();`);

                          break;

                        default:

                          switch (client.dialogTurnResult.status) {
                            case 'complete':
                              console.log(`assert(msg.type === '${msg.type}' && msg.text === '${msg.text}', 'type ${msg.type} or text ${msg.text} error');`);
                              msg = await client.getNextReply();
                              console.log(`msg = await client.getNextReply();`);

                              break;

                            default:
                              console.log(`assert(msg.type === '${msg.type}' && msg.text === '${msg.text.replace("\r\n", '')}', 'type ${msg.type} or text ${msg.text.replace("\r\n", '')} error');`);
                              msg = (sequence[counter]) ? await client.sendActivity(`${sequence[counter]}`) : await client.getNextReply();
                              console.log('msg = (sequence[counter]) ? await client.sendActivity(`${sequence[counter]}`) : await client.getNextReply(); // ', sequence[counter++]);

                              break;
                          }
                          break;
                      }
                      break;

                    default:

                      console.log(`assert(msg.type === '${msg.type}' && msg.text === '${msg.text.replace("\r\n", '')}', 'type ${msg.type} or text ${msg.text.replace("\r\n", '')} error');`);
                      msg = await client.getNextReply();
                      console.log(`msg = await client.getNextReply();`);

                      break;
                  }


                }

              }

              msg = await client.sendActivity('qrpayload');
              assert(msg.type === 'message' && msg.text === 'Echo: qrpayload', 'type message or text Echo: qrpayload error');
              msg = await client.getNextReply();
              assert(msg.type === 'typing' && msg.channelId === 'whatsapp', 'type typing or channel whatsapp error');
              msg = await client.getNextReply();
              assert(msg.type === 'message' && msg.text === 'This is the qrpayload script. Customize me from CMS!', 'type message or text This is the qrpayload script. Customize me from CMS! error');
              msg = await client.sendActivity(`${(msg.suggestedActions && msg.suggestedActions.actions) ? "1" : "Just any string"}`);
              assert(msg.type === 'message' && msg.text === 'Echo: 1', 'type message or text Echo: 1 error');
              msg = await client.getNextReply();
              assert(msg.type === 'message' && msg.text === 'Valeur 1 de qrval bien reçu', 'type message or text Valeur 1 de qrval bien reçu error');
              msg = await client.getNextReply();
              assert(msg.type === 'typing' && msg.channelId === 'whatsapp', 'type typing or channel whatsapp error');
              msg = await client.getNextReply();
              assert(msg.type === 'message' && msg.text === 'Thank you for 1 inputs', 'type message or text Thank you for 1 inputs error');
              msg = await client.sendActivity(`${(msg.suggestedActions && msg.suggestedActions.actions) ? "1" : "Just any string"}`);
              assert(msg.type === 'message' && msg.text === 'Echo: 1', 'type message or text Echo: 1 error');
              msg = await client.getNextReply();
              assert(msg.type === 'message' && msg.text === 'Valeur 1 de question_2 bien reçu', 'type message or text Valeur 1 de question_2 bien reçu error');
              msg = await client.getNextReply();
              assert(msg.type === 'typing' && msg.channelId === 'whatsapp', 'type typing or channel whatsapp error');
              msg = await client.getNextReply();
              assert(msg.type === 'message' && msg.text === 'Thank you for your last reply otherwise I would trigger again', 'type message or text Thank you for your last reply otherwise I would trigger again error');
              msg = await client.getNextReply();
              /*
  msg = await client.sendActivity('qrpayload');
  console.log(`console.log('>> qrpayload');
  msg = await client.sendActivity('qrpayload');
  console.log('<<                                   ', msg.type, ':', msg.text , ':' , util.inspect(msg.channelData, {depth: null ,breakLength : Infinity}));
  assert(msg.type === '${msg.type}' && msg.text === '${msg.text.replace("\n",'')}' && msg.channelData === ${util.inspect(msg.channelData, {depth: null ,breakLength : Infinity})}', 'error msg.type not ${msg.type} and msg.text not ${msg.text} and msg.channelData not ${util.inspect(msg.channelData, {depth: null ,breakLength : Infinity})}');
  ${(msg.type=='typing')?`if (msg.type == 'typing') msg = await client.getNextReply();`:''}`);
  
  if (msg.type == 'typing') msg = await client.getNextReply(); // next
  
  console.log(`console.log('<<                                   ', msg.type, ':', msg.text , ':' , util.inspect(msg.channelData, {depth: null ,breakLength : Infinity}));
  assert(msg.type === '${msg.type}' && msg.text === '${msg.text.replace("\n",'')}' && msg.channelData === ${util.inspect(msg.channelData, {depth: null ,breakLength : Infinity})}', 'error msg.type not ${msg.type} and msg.text not ${msg.text} and msg.channelData not ${util.inspect(msg.channelData, {depth: null ,breakLength : Infinity})}');
  ${(msg.type=='typing')?`if (msg.type == 'typing') msg = await client.getNextReply();`:''}`);
  
  msg = await client.sendActivity('1');
  console.log(`console.log('>> 1');
  msg = await client.sendActivity('1');
  console.log('<<                                   ', msg.type, ':', msg.text , ':' , util.inspect(msg.channelData, {depth: null ,breakLength : Infinity}));
  assert(msg.type === '${msg.type}' && msg.text === '${msg.text.replace("\n",'')}' && msg.channelData === ${util.inspect(msg.channelData, {depth: null ,breakLength : Infinity})}', 'error msg.type not ${msg.type} and msg.text not ${msg.text} and msg.channelData not ${util.inspect(msg.channelData, {depth: null ,breakLength : Infinity})}');
  ${(msg.type=='typing')?`if (msg.type == 'typing') msg = await client.getNextReply();`:''}`);
  
  if (msg.type == 'typing') msg = await client.getNextReply(); // next
  
  console.log(`console.log('<<                                   ', msg.type, ':', msg.text , ':' , util.inspect(msg.channelData, {depth: null ,breakLength : Infinity}));
  assert(msg.type === '${msg.type}' && msg.text === '${msg.text.replace("\n",'')}' && msg.channelData === ${util.inspect(msg.channelData, {depth: null ,breakLength : Infinity})}', 'error msg.type not ${msg.type} and msg.text not ${msg.text} and msg.channelData not ${util.inspect(msg.channelData, {depth: null ,breakLength : Infinity})}');
  ${(msg.type=='typing')?`if (msg.type == 'typing') msg = await client.getNextReply();`:''}`);
  
  msg = await client.sendActivity('1');
  console.log(`console.log('>> 1');
  msg = await client.sendActivity('1');
  console.log('<<                                   ', msg.type, ':', msg.text , ':' , util.inspect(msg.channelData, {depth: null ,breakLength : Infinity}));
  assert(msg.type === '${msg.type}' && msg.text === '${msg.text.replace("\n",'')}' && msg.channelData === ${util.inspect(msg.channelData, {depth: null ,breakLength : Infinity})}', 'error msg.type not ${msg.type} and msg.text not ${msg.text} and msg.channelData not ${util.inspect(msg.channelData, {depth: null ,breakLength : Infinity})}');
  ${(msg.type=='typing')?`if (msg.type == 'typing') msg = await client.getNextReply();`:''}`);
  
  if (msg.type == 'typing') msg = await client.getNextReply(); // next
  
  console.log(`console.log('<<                                   ', msg.type, ':', msg.text , ':' , util.inspect(msg.channelData, {depth: null ,breakLength : Infinity}));
  assert(msg.type === '${msg.type}' && msg.text === '${msg.text.replace("\n",'')}' && msg.channelData === ${util.inspect(msg.channelData, {depth: null ,breakLength : Infinity})}', 'error msg.type not ${msg.type} and msg.text not ${msg.text} and msg.channelData not ${util.inspect(msg.channelData, {depth: null ,breakLength : Infinity})}');
  ${msg.type=='typing'?'msg = await client.getNextReply();':''}`);
  */
            });


          });

          run();

        }

      }
    })
  });
// })