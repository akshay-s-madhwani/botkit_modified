/* eslint-disable no-param-reassign */
/* eslint-disable no-multi-assign */
// Import botkit-cms as local module including configuration override of botkit_mutagen.js
const localcms = require(`../func-override/botkit-cms_require`);
const util = require(`util`);

module.exports = function botkitCmsConfigInit(controller) {

  const scriptFile = `${__dirname}/../cms-scripts/scripts.json`;
  localcms.useLocalStudio(controller);
  localcms
    .loadScriptsFromFile(scriptFile)
    .then(async (results) => {
      controller.debug(`testing:cms:inspect`)(
        `Dialogs custom loaded from loadScriptsFromFile(scriptFile) inspect : `,
        util.inspect(results, false, null, true) //* enable colors *)
      );
    })
    .catch(err => {
      controller.debug(`catcherror:catch-${__filename.split(/[/\\]/).pop()}`)(
        `- ERROR in localcms.loadScriptsFromFile(${scriptFile}) : ${err}`
      );
    });

};
