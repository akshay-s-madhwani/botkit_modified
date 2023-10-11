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

module.exports = function onchangeqrpayloadquestion2(controller) {
  if (controller.plugins.cms) {
    // Initialize variable
    const script = `qrpayload`;
    const thread = `default`;

    // fire before onboarding begins
    controller.plugins.cms.onChange(`qrpayload`, `question_2`, async (nv, convo, bot) => {
      // get userState current language
      const loclang = await controller.localizer.getLoclang(controller, bot);

      controller.debug(`testing:cms:qrpayload`)(
        `A new value got set for question_2 inside qrpayload : `,
        nv
      );

      const i18nvar = [[`str_valuegotset`, { valname: `question_2`, value: nv }]];

      // {{vars.str_valuegotset:en|Value [[value]] of [[valname]] well received§fr|Valeur [[value]] de [[valname]] bien reçu§mg|Voaray ny [[valname]] mitentina [[value]]~}}
      const strValuegotset = controller.localizer.t(`cms.${script}.${thread}.${i18nvar[0][0]}`, {
        ns: script,
        lng: loclang,
        ...i18nvar[0][1],
        interpolation: { prefix: `[[`, suffix: `]]` },
      });

      if (process.env.USERNAME === `1301921`) {
        await bot.say(`Shows on Local Debug run only :\n${strValuegotset}`);
      }

      convo.setVar(
        `timestamp`,
        new Date().toLocaleString(`fr-FR`, {
          timeZone: `Africa/Nairobi`,
        })
      );

      controller.debug(`testing:onchange:onchangeqrpayloadquestion2`)(
        `onchange question_2 all convo.vars : `,
        convo.vars
      );

      controller.debug(`testing:cms:debug`)(`debug pause qrpayload`);

      // ------------------------------------------------------
      // #CUSTOM CODES/ACTIONS START

      // CUSTOM CODES/ACTIONS END
      // ------------------------------------------------------
    });
  }
};
