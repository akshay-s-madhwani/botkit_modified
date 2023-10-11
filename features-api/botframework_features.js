// const request = require(`request`);
const { CardFactory } = require(`botbuilder`);

module.exports = function botframeworkfeatures(controller) {
  controller.hears(`dm me`, `message`, async (bot, message) => {
    // huzzah
    await bot.startConversationWithUser(message.reference);
    await bot.say(`Hello! (in private`);
  });

  controller.hears(`update me`, `message`, async (bot, message) => {
    const reply = await bot.reply(message, `reply`);
    await controller.adapter.updateActivity(bot.getConfig(`context`), {
      text: `UPDATED!`,
      ...message.incoming_message,
      ...reply,
    });
  });

  controller.hears(`delete me`, `message`, async (bot, message) => {
    const reply = await bot.reply(message, `delete this!`);

    await controller.adapter.deleteActivity(bot.getConfig(`context`), {
      ...message.incoming_message,
      activityId: reply.id,
    });
  });

  controller.hears(`members`, `message`, async (bot, message) => {
    const members = await controller.adapter.getConversationMembers(bot.getConfig(`context`));
    bot.reply(message, JSON.stringify(members));
  });

  controller.hears(`conversations`, `message`, async (bot, message) => {
    const channels = await controller.adapter.getChannels(bot.getConfig(`context`));
    await bot.reply(message, JSON.stringify(channels));
  });

  controller.hears(`card`, `message`, async (bot, message) => {
    await bot.reply(message, {
      attachments: [
        {
          contentType: `application/vnd.microsoft.card.hero`,
          content: {
            buttons: [
              {
                type: `imBack`,
                title: `say hey`,
                value: `hey`,
              },
              {
                type: `imBack`,
                title: `say what up`,
                value: `what up`,
              },
              {
                type: `invoke`,
                title: `invoke`,
                value: { command: `alpha` },
              },
            ],
            subtitle: `subtitle is this`,
            text: `text of cards`,
            title: `this is the card`,
          },
        },
      ],
    });

    await bot.reply(message, {
      attachmentLayout: `carousel`,
      attachments: [
        CardFactory.heroCard(`title1`, [`imageUrl1`], [`button1`]),
        CardFactory.heroCard(`title2`, [`imageUrl2`], [`button2`]),
        CardFactory.heroCard(`title3`, [`imageUrl3`], [`button3`]),
      ],
    });
  });

  controller.on(`invoke`, async (bot, message) => {
    // make sure to send back a special invoke response.
    // depends on the type of invoke!
    await bot.reply(message, {
      type: `invokeResponse`,
      value: {
        status: 200,
        body: {},
      },
    });

    console.log(`***************************************************************************`);
    console.log(JSON.stringify(message, null, 2));
    console.log(`***************************************************************************`);
    await bot.reply(message, `Got it: ${JSON.stringify(message.value)}`);
  });
};
