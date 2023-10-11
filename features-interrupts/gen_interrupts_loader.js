/* eslint-disable no-unused-vars */
const { BotkitConversation } = require(`botkit`);
const dialogUtils = require(`../utils-module`).Dialog;
const _ = require(`lodash`);

module.exports = function interruptionsLoader(controller) {
  /*
  const dialog = new BotkitConversation(`HELPDIALOG`, controller);

  dialog.ask(`What can I help with?`, [], `subject`);
  dialog.say(`HRRM! What do I know about {{vars.subject}}?`);
  dialog.addAction(`display_results`);

  dialog.before(`display_results`, async (convo, bot) => {
    convo.setVar(`results`, `KNOWLEDGE BASE EMPTY`);
  });
  */
  // dialog.addMessage(`Here is what I know: {{vars.results}}`, `display_results`);

  // controller.addDialog(dialog);
  // §en|Here is what I know: §mg|Ito no mba haiko:
  // hear the word help, and interrupt whatever is happening to handle it first.

  const trigger2dialogs = [
    { patterns: [], events: [`message`, `direct_message`], dialog: `interrupts` },
    {
      patterns: [new RegExp(/^help$/i), new RegExp(/^aide$/i), new RegExp(/^vonjy$/i)],
      events: [`message`, `direct_message`],
      dialog: `interrupthelpdialog`,
    },
    {
      patterns: [
        new RegExp(/^teny$/i),
        new RegExp(/^lang$/i),
        new RegExp(/^langue$/i),
        new RegExp(/(lang|teny|langue)\s+(?<lang>\S\S)/i),
      ],
      events: [`message`, `direct_message`],
      dialog: `interruptlangdialog`,
    },
    {
      patterns: [new RegExp(/^quit$/i), new RegExp(/^hiala$/i), new RegExp(/^quitter$/i)],
      events: [`message`, `direct_message`],
      dialog: `interruptquitdialog`,
    },
    {
      patterns: [`interrupted_lang_change`],
      events: [`message`, `direct_message`],
      dialog: `interrupted_lang_change`,
    },
  ];

  trigger2dialogs.forEach((trigger2dialog) => {
    controller.interrupts(
      /* async message => {return message.intent === `help`;} */
      trigger2dialog.patterns,
      trigger2dialog.events,
      async (bot, message) => {
        // await bot.reply(message, `I heard you need help more than anything else!`);
        if (trigger2dialog.dialog === `interruptlangdialog`) {
          if (message.text == `lang`) _.set(message, `matches.groups.lang`, `en`);
          if (message.text == `langue`) _.set(message, `matches.groups.lang`, `fr`);
          if (message.text == `teny`) _.set(message, `matches.groups.lang`, `mg`);

          if (
            _.has(message, `matches.groups.lang`) &&
            controller.localizer.options.cmsinit.includes(
              message.matches.groups.lang.substring(0, 2)
            )
          ) {
            await changeLangShort(message, controller, bot);
            if (!(await dialogUtils.dialogStepBack(controller, bot, 1))) {
              await bot.beginDialog(`interrupted_lang_change`, {
                message,
                newlang: message.matches.groups.lang.substring(0, 2),
              });
            }
          } else if (_.has(message, `matches.groups.lang`)) {
            await bot.beginDialog(`langunknowndialog`, {
              message,
              newlang: message.matches.groups.lang.substring(0, 2),
            });
          }
        } else if (trigger2dialog.dialog === `interruptquitdialog`) {
          if (message.text == `quit`) _.set(message, `matches.groups.lang`, `en`);
          if (message.text == `quitter`) _.set(message, `matches.groups.lang`, `fr`);
          if (message.text == `hiala`) _.set(message, `matches.groups.lang`, `mg`);

          await changeLangShort(message, controller, bot);
          await bot.cancelAllDialogs();
          await bot.beginDialog(trigger2dialog.dialog, {
            message,
            newlang: message.matches.groups.lang.substring(0, 2),
          });
        } else if (trigger2dialog.dialog === `interrupthelpdialog`) {
          if (message.text == `help`) _.set(message, `matches.groups.lang`, `en`);
          if (message.text == `aide`) _.set(message, `matches.groups.lang`, `fr`);
          if (message.text == `vonjy`) _.set(message, `matches.groups.lang`, `mg`);

          await changeLangShort(message, controller, bot);
          //if (!(await dialogUtils.dialogStepBack(controller, bot, 1))) {
          await bot.beginDialog(trigger2dialog.dialog, {
            message,
            newlang: message.matches.groups.lang.substring(0, 2),
          });
          //}
        } else {
          await bot.beginDialog(trigger2dialog.dialog, { message });
        }
      }
    );
  });
};

async function changeLangShort(message, controller, bot) {
  if (
    _.has(message, `matches.groups.lang`) &&
    controller.localizer.options.cmsinit.includes(message.matches.groups.lang.substring(0, 2))
  ) {
    await controller.localizer.setLoclang(
      controller,
      bot,
      message.matches.groups.lang.substring(0, 2)
    );
    await dialogUtils.dialogTranslateStack(
      controller,
      bot,
      message.matches.groups.lang.substring(0, 2)
    );
  }
}
