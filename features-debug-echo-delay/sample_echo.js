/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

module.exports = function sampleEcho(controller) {
  controller.hears(`sample delay`, `message`, async (bot, message) => {
    const script = 'sampleEcho';

    const loclang = await controller.localizer.getLoclang(controller, bot);

    const i18nvar = [[`str_sample_message`, {}]];

    // `catalogue just ended! here are the results : ${results._status} at ${results.timestamp}`;
    const textreply = controller.localizer.t(`cms.${script}.default.${i18nvar[0][0]}`, {
      ns: script,
      lng: loclang,
      ...i18nvar[1],
      interpolation: { prefix: `[[`, suffix: `]]` },
    });
    
    // const textreply = controller.localizer.getText(controller,bot,script,`str_sample_message`)
    await bot.reply(message, { type: `typing`});
    //await bot.reply(message, 'Ohh I am the bot and I love you !!');

    await bot.reply(message, { type: `delay`, value: 7000 });
    await bot.reply(message, textreply);
  });

  controller.on(`message`, async (bot, message) => {
    await bot.reply(message, `Debug only - Echo: ${message.text}`);
  });
};
