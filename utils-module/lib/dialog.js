const _ = require(`lodash`);
/**
 * Translate values in stack
 *
 * @param {BotWorker} bot
 * @param {Botkit} controller
 * @param {string} loclang
 */
exports.dialogTranslateStack = async function dialogTranslateStack(controller, bot, newlang) {
  // const loclang = await controller.localizer.getLoclang(controller, bot);
  if (bot._config.dialogContext.stack.length > 1) {
    // bot._config.dialogContext.stack.pop();

    bot._config.dialogContext.stack.forEach((stack, index) => {
      if (stack.state.thread) {
        /*
      bot._config.dialogContext.activeDialog.state.stepIndex =
        bot._config.dialogContext.stack[oDialogStackMaxId - 1].state.stepIndex;
        */
        // eslint-disable-next-line no-param-reassign
        // bot._config.dialogContext.activeDialog.state.stepIndex =
        //   bot._config.dialogContext.activeDialog.state.stepIndex > 0
        //     ? bot._config.dialogContext.activeDialog.state.stepIndex - step
        //     : 0;
        const script = stack.id;
        const { thread } = stack.state;
        const varTokens = Object.keys(stack.state.values)
          .filter(x => x.indexOf(`str_`) === -1)
          .map(x => ({ [x]: stack.state.values[x] }));
        Object.keys(stack.state.values).forEach(i18nvar => {
          const cmsi18FullKey = `cms.${script}.${thread}.${i18nvar}`;
          if (i18nvar.indexOf(`str_`) !== -1 && _.has(controller.localcmsvars, cmsi18FullKey)) {
            // eslint-disable-next-line no-param-reassign
            bot._config.dialogContext.stack[index].state.values[i18nvar] = controller.localizer.t(
              cmsi18FullKey,
              {
                ns: script,
                // fallbackLng: [`en`, `fr`],
                lng: newlang,
                // lngs: [`en`, `fr`],
                // fallbackLng: false,
                ...(controller.localcmsvars.cms[`${script}`][`${thread}`][`${i18nvar}`]
                  ? controller.localcmsvars.cms[`${script}`][`${thread}`][`${i18nvar}`]
                  : {}),
                ...varTokens,
                interpolation: { prefix: `[[`, suffix: `]]` },
              }
            );
          }
        });
        // await bot._config.dialogContext.continueDialog();
      }
    });
  }
  controller.debug(`testing:cms:debug`)(`debug pause interruptlangdialog`);
};

/**
 * Step dialog in by step
 *
 * @param {BotWorker} bot
 * @param {Botkit} controller
 * @param {number} step
 * @return {boolean} true if continuedialog
 */
exports.dialogStepBack = async function dialogStepBack(controller, bot, step = 1) {
  // const loclang = await controller.localizer.getLoclang(controller, bot);
  if (bot._config.dialogContext.stack.length > 1) {
    bot._config.dialogContext.stack.pop();
    // bot._config.dialogContext.stack.pop();
    // bot._config.dialogContext.stack.pop();
    // bot._config.dialogContext.stack.forEach((stack, index) => {
    //  if (stack.state.thread) {
    /*
      bot._config.dialogContext.activeDialog.state.stepIndex =
        bot._config.dialogContext.stack[oDialogStackMaxId - 1].state.stepIndex;
        */
    if (bot._config.dialogContext.activeDialog.state.stepIndex) {
      // eslint-disable-next-line no-param-reassign
      bot._config.dialogContext.activeDialog.state.stepIndex =
        bot._config.dialogContext.activeDialog.state.stepIndex > 0
          ? bot._config.dialogContext.activeDialog.state.stepIndex - step
          : 0;
    }
    await bot._config.dialogContext.continueDialog();

    return true;
    //  }
    // });
  }else{
    return false;
  }
  controller.debug(`testing:cms:debug`)(`debug pause interruptlangdialog`);
};
