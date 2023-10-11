// Import local cms
const localcms = require(`botkit-cms`)();

localcms.useLocalStudio = function useLocalStudio(botkit) {
  const mutagen = require(`./own_botkit_mutagen.js`);
  return mutagen(localcms, botkit);
};

module.exports = localcms;
