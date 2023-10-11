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

module.exports = function beforeinterruptlangdialoglngchsuccess(controller) {
  if (controller.plugins.cms) {
    // Initialize variable
    const script = `interruptlangdialog`;
    const thread = `lngchsuccess`;

    // fire before onboarding begins
    controller.plugins.cms.before(`interruptlangdialog`, `lngchsuccess`, async (convo, bot) => {
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

      const cmstokens = [[`str_lngsuccess`, {}]];

      // ----------------------------------------------------
      // #CMSTOKENS VALUES DEFINITION START

      // CMSTOKENS VALUES DEFINITION END
      // ----------------------------------------------------

      // map all cms.interruptlangdialog.lngchsuccess mustache vars | pattern[0]/*pattern*/ | pattern[1]/*sprintf arguments*/
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

      controller.debug(`testing:before:beforeinterruptlangdialoglngchsuccess`)(
        `before interruptlangdialog all convo.vars : `,
        convo.vars
      );

      controller.debug(`testing:cms:debug`)(`debug pause interruptlangdialog`);

      // ------------------------------------------------------
      // #CUSTOM CODES/ACTIONS START
      /*
      bot._config.dialogContext.stack.pop();
      bot._config.dialogContext.stack.pop();
      bot._config.dialogContext.stack.pop();
      // eslint-disable-next-line no-param-reassign
      bot._config.dialogContext.activeDialog.state.stepIndex =
        bot._config.dialogContext.activeDialog.state.stepIndex > 0
          ? bot._config.dialogContext.activeDialog.state.stepIndex - 1
          : 0;
          */
      // await bot._config.dialogContext.continueDialog();

      // CUSTOM CODES/ACTIONS END
      // ------------------------------------------------------
    });
  }
};
