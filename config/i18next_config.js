const localizer = require(`i18next`);
// const i18nextMiddleware = require('i18next-express-middleware');
const Backend = require(`i18next-fs-backend`);
const intervalPlural = require(`i18next-intervalplural-postprocessor`);
const fse = require(`fs-extra`);
const basedir = `${__dirname}/../localesnext`;
const debug = require(`debug`);
let lngdir;
try {
  lngdir = fse.readdirSync(basedir);
} catch (err) {
  // fse.ensureDirSync(basedir);
  debug(`catcherror:catch-${__filename.split(/[/\\]/).pop()}`)(
    `- ERROR in fse.readdirSync(${basedir}) : ${err}`
  );
}
// const app = express();
// const port = process.env.PORT || 8080;
// srcPath = `${__dirname}/../localesnext`;
// console.log(fse.readdir(`${__dirname}/../localesnext`));

localizer
  .use(Backend)
  // .use(i18nextMiddleware.LanguageDetector)
  .use(intervalPlural)
  .init({
    debug: process.env.DYNO ? false & process.env.USERNAME===`1301921` : true,
    // lng: `fr`,
    backend: {
      loadPath: `${__dirname}/../localesnext/{{lng}}/{{ns}}.json`,
      addPath: `${__dirname}/../localesnext/{{lng}}/{{ns}}.json`,
    },
    // fallbackLng: [`fr`, `mg`, `en`],
    // preload: [`fr`, `mg`, `en`],
    // whitelist: [`fr`, `en`, `mg`],
    load: `languageOnly`,
    // ns: [`translation`],
    // defaultNS: [`translation`],
    ns: [],
    defaultNS: [],
    fallbackLng: false,
    fallbackNS: false,
    whitelist: false,
    saveMissing: true,
    saveMissingTo: `current`,
    updateMissing: true,
    appendNamespaceToMissingKey: false,
    initImmediate: false, // do not change !! it is critical to initialization
    getAsync: true, // do not change !! it is critical to initialization
    nsSeparator: `¤`,
    deflng: `fr`,
    cmsinit: lngdir && lngdir.length ? lngdir : [`en`, `fr`, `mg`], // NEVER REMOVE THIS LINE AS USED TO INITIALIZE CMS TRANSLATIONS
    // interpolation: { prefix: `[[`, suffix: `]]` },
    // missingKeyHandler: function missingKeyHandler(lng, ns, key, fallbackValue) {
    //  console.log("lng, ns, key, fallbackValue : ",lng, ns, key, fallbackValue);
    // },
    // parseMissingKeyHandler: key => {
    // console.log();
    // return `No translation found for "${key}"`;
    // },
  });

// localizer.changeLanguage(localizer.options.deflng);
/**
 * Return locale lang based on :
 *
 * 1 - userState 'languagePreferenceProperty'
 *
 * 2 - incoming message activity locale
 *
 * 3 - default i18n init lang {deflng: 'fr'}
 *
 * @param {Botkit} controller Botkit
 * @param {BotWorker} bot BotWorker
 * @returns {Promise<string>} loclang
 */
localizer.getLoclang = async function getLoclang(controller, bot) {
  const tmp = await controller.userLangPrefAccessor.get(bot._config.context);
  const loclang =
    (await controller.userLangPrefAccessor.get(bot._config.context)) ||
    (bot._config.activity.locale &&
    controller.localizer.options.cmsinit.includes(bot._config.activity.locale.substring(0, 2))
      ? bot._config.activity.locale.substring(0, 2)
      : controller.localizer.options.deflng);
  return loclang;
  /*
  return (
    controller.languagePreference.get() ||
    (bot._config.activity.locale &&
    controller.localizer.options.cmsinit.includes(bot._config.activity.locale.substring(0, 2))
      ? bot._config.activity.locale.substring(0, 2)
      : controller.localizer.options.deflng)
  );
  */
};

/**
 * Set locale lang on userState 'languagePreferenceProperty':
 *
 * @param {Botkit} controller Botkit
 * @param {BotWorker} bot BotWorker
 * @param {string} lang in format 'fr' or 'en'
 * @returns void
 */
localizer.setLoclang = async function setLoclang(controller, bot, lang) {
  let loclang = await controller.userLangPrefAccessor.get(bot._config.context);
  await controller.userLangPrefAccessor.set(bot._config.context, lang);
  loclang = await controller.userLangPrefAccessor.get(bot._config.context);
  loclang = ``;

  /*
  return (
    controller.languagePreference.get() ||
    (bot._config.activity.locale &&
    controller.localizer.options.cmsinit.includes(bot._config.activity.locale.substring(0, 2))
      ? bot._config.activity.locale.substring(0, 2)
      : controller.localizer.options.deflng)
  );
  */
};


/**
 * Generate translation from code :
 *
 * @param {Botkit} controller Botkit
 * @param {BotWorker} bot BotWorker
 * @param {string} script like sampleEcho
 * @param {string} cmsfulltoken like str_sample_message
 * @param {object} paramObject like { value: `tobedefinedbycodevalue`, valname: `tobedefinedbycodevalname` }
 * @returns void
 */
localizer.getText = async function getText(controller, bot, script, str_token, paramObject={}) {
  //const script = 'sampleEcho';

  const loclang = await controller.localizer.getLoclang(controller, bot);

  const i18nvar = [[str_token, paramObject]];

  // `catalogue just ended! here are the results : ${results._status} at ${results.timestamp}`;
  const textreply = controller.localizer.t(`cms.${script}.default.${i18nvar[0][0]}`, {
    ns: script,
    lng: loclang,
    ...i18nvar[1],
    interpolation: { prefix: `[[`, suffix: `]]` },
  });
  return textreply;
};


module.exports = localizer;
