/**
 * Copyright (c) InnoraG. All rights reserved.
 * Licensed under creative commons.
 */
// ----------------------------------------------------
// #REQUIRE DEFINITION START

const _ = require(`lodash`);
// const dialogUtils = require(`../utils-module`).Dialog;

// REQUIRE VALUES DEFINITION END
// ----------------------------------------------------

module.exports = function beforeontimoutestonTimeout(controller) {
  if (controller.plugins.cms) {
    // Initialize variable
    const script = `ontimoutest`;
    const thread = `on_timeout`;

    // fire before onboarding begins
    controller.plugins.cms.before(`ontimoutest`, `on_timeout`, async (convo, bot) => {
      // get userState current language
      const loclang = await controller.localizer.getLoclang(controller, bot);

      /* const es6var = `hardcoded : val {{ with interpol }}`;
      const cmstokens = [
        [`str_mustache_variable`, { es6var: `${es6var}` }],
        [`str_getting_started`, { anarana: `anaranaVal`, fanampiny: `fanampinyVal` }],
        [`str_getting_started1`, { anarana: `anaranaVal`, fanampiny: `fanampinyVal` }],
        [`str_getting_started2`, { anarana: `anaranaVal`, fanampiny: `fanampinyVal` }],
        [`str_getting_started3`, { anarana: `anaranaVal`, fanampiny: `fanampinyVal` }],
      ]; */

      const cmstokens = [
        [`str_distracted`, {}],
        [`str_timeoutsecondline`, {}],
      ];

      // ----------------------------------------------------
      // #CMSTOKENS VALUES DEFINITION START

      // CMSTOKENS VALUES DEFINITION END
      // ----------------------------------------------------

      // map all cms.ontimoutest.on_timeout mustache vars | pattern[0]/*pattern*/ | pattern[1]/*sprintf arguments*/
      cmstokens.forEach((i18nvar) => {
        convo.setVar(
          i18nvar[0],
          controller.localizer.t(`cms.${script}.${thread}.${i18nvar[0]}`, {
            ns: script,
            lng: loclang,
            ...i18nvar[1],
            interpolation: { prefix: `[[`, suffix: `]]` },
          })
        );
        _.set(controller.localcmsvars, `cms.${script}.${thread}.${i18nvar[0]}`, i18nvar[1]);
      });

      convo.setVar(
        `timestamp`,
        new Date().toLocaleString(`fr-FR`, {
          timeZone: `Africa/Nairobi`,
        })
      );

      controller.debug(`testing:before:beforeontimoutestonTimeout`)(
        `before ontimoutest all convo.vars : `,
        convo.vars
      );

      controller.debug(`testing:cms:debug`)(`debug pause ontimoutest`);

      // ------------------------------------------------------
      // #CUSTOM CODES/ACTIONS START

      // CUSTOM CODES/ACTIONS END
      // ------------------------------------------------------
    });
  }
};
