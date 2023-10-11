/**
 * Copyright (c) InnoraG. All rights reserved.
 * Licensed under creative commons.
 */
// ----------------------------------------------------
// #REQUIRE DEFINITION START

// const _ = require(`lodash`);
// const dialogUtils = require(`../utils-module`).Dialog;

// REQUIRE VALUES DEFINITION END
// ----------------------------------------------------

module.exports = function afterlngtest(controller) {
  if (controller.plugins.cms) {
    // Initialize variable
    const script = `lngtest`;
    // const thread = `replaceThread`;

    // fire before onboarding begins
    controller.plugins.cms.after(`lngtest`, async (results, bot) => {
      // get userState current language
      const loclang = await controller.localizer.getLoclang(controller, bot);

      const i18nvar = [[`str_afterscriptdone`, {}]];

      // `catalogue just ended! here are the results : ${results._status} at ${results.timestamp}`;
      const strAfterscriptdone = controller.localizer.t(`cms.${script}.${i18nvar[0][0]}`, {
        ns: script,
        lng: loclang,
        ...i18nvar[1],
        interpolation: { prefix: `[[`, suffix: `]]` },
      });

      controller.debug(`testing:after:afterlngtest`)(
        `lngtest${strAfterscriptdone}`,
        `\`\`\`${controller.util.inspect(results, false, null, true)}\n\`\`\``
      );

      controller.debug(`testing:cms:debug`)(`debug pause lngtest`);

      // ------------------------------------------------------
      // #CUSTOM CODES/ACTIONS START

      // await dialogUtils.dialogStepBack(bot, controller);

      // CUSTOM CODES/ACTIONS END
      // ------------------------------------------------------
    });
  }
};
