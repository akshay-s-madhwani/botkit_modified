/**
 * Copyright (c) InnoraG. All rights reserved.
 * Licensed under creative commons.
 */
// ----------------------------------------------------
// #REQUIRE DEFINITION START

const _ = require(`lodash`);
const dialogUtils = require(`../utils-module`).Dialog;

// REQUIRE VALUES DEFINITION END
// ----------------------------------------------------

module.exports = function beforeinterruptlangdialogdefault(controller) {
  if (controller.plugins.cms) {
    // Initialize variable
    const script = `interruptlangdialog`;
    const thread = `default`;

    // fire before onboarding begins
    controller.plugins.cms.before(`interruptlangdialog`, `default`, async (convo, bot) => {
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
        [`str_starthelp`, {}],
        [`str_askhelp`, {}],
        [`str_hrrm`, {}],
      ];

      // ----------------------------------------------------
      // #CMSTOKENS VALUES DEFINITION START

      // CMSTOKENS VALUES DEFINITION END
      // ----------------------------------------------------

      // map all cms.interruptlangdialog.default mustache vars | pattern[0]/*pattern*/ | pattern[1]/*sprintf arguments*/
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

      controller.debug(`testing:before:beforeinterruptlangdialogdefault`)(
        `before interruptlangdialog all convo.vars : `,
        convo.vars
      );

      controller.debug(`testing:cms:debug`)(`debug pause interruptlangdialog`);

      // ------------------------------------------------------
      // #CUSTOM CODES/ACTIONS START

      // convo.setVar(`results`, `KNOWLEDGE BASE EMPTY`);
      const newlang = convo.vars.message.matches.groups.lang.substring(0, 2); // message.matches[2];
      // const script = convo.dc.activeDialog.id;
      const text = bot._config.activity.text ? bot._config.activity.text : `no text val`;
      // const { thread } = convo.dc.activeDialog.state;
      if (controller.localizer.options.cmsinit.includes(newlang)) {
        // eslint-disable-next-line no-param-reassign
        // bot._config.activity.custlocale = lng;
        // const context = JSON.stringify(bot.getConfig(`context`));
        // const context = util.inspect(bot.getConfig(`context`), false, null, true /* enable colors */);
        // controller.debug(`testing:code:${script}`)(context);
        // create a turn context
        // const turnContext = new TurnContext(bot.controller.adapter, bot._config.activity);
        // let justsetlang = await controller.userLangPrefAccessor.get(bot._config.context);
        await controller.localizer.setLoclang(controller, bot, newlang);
        // justsetlang = await controller.userLangPrefAccessor.get(bot._config.context);
        /*
      controller.localizer
        .changeLanguage(lng)
        .then(() => {
          // t('key'); // -> same as i18next.t
          controller.debug(`testing:code:${script}`)(`${text} changed successfully to : ${lng}`);
          // eslint-disable-next-line no-param-reassign
        })
        .catch(err => {
          controller.debug(`catcherror:catch-${__filename.split(/[/\\]/).pop()}`)(
            `- ERROR in .changeLanguage(${lng}) : ${text} : ${err}`
          );
          convo.gotoThread(`lngchfailed`);
        });bot._config.dialogContext.stack[2].state.options.prompt
        */
        await dialogUtils.dialogTranslateStack(controller, bot, newlang);
        if (
          bot._config.dialogContext.stack &&
          bot._config.dialogContext.stack.length &&
          bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 3] &&
          bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 3].state.options
            .prompt
        ) {
          // await bot._config.dialogContext.continueDialog();
          /*
          bot._config.dialogContext.stack.pop();
          bot._config.dialogContext.stack.pop();
          bot._config.dialogContext.stack.pop();
          // eslint-disable-next-line no-param-reassign
          bot._config.dialogContext.activeDialog.state.stepIndex =
            bot._config.dialogContext.activeDialog.state.stepIndex > 0
              ? bot._config.dialogContext.activeDialog.state.stepIndex - 1
              : 0;

          await bot._config.dialogContext.continueDialog();
          await bot._config.dialogContext.endActiveDialog();
          */
          // await bot._config.dialogContext.endDialog();
        } else {
          convo.gotoThread(`lngchsuccess`);
        }
      } else {
        controller.debug(`catcherror:catch-${__filename.split(/[/\\]/).pop()}`)(
          `- ERROR in await controller.localizer.setLoclang(controller, bot, ${newlang}) : ${text} : Lang Unknown`
        );
        convo.gotoThread(`lngchunknown`);
      }

      // CUSTOM CODES/ACTIONS END
      // ------------------------------------------------------
    });
  }
};
