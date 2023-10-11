const { BotkitConversation } = require(`botkit`);

// eslint-disable-next-line func-names
module.exports = function(controller) {
  const DIALOG_ID = `langunknowndialog__`;
  const welcome = new BotkitConversation(DIALOG_ID, controller);
  // start the typing indicator
  welcome.addMessage({ type: `typing` }, `typing`);
  welcome.addMessage({ type: `delay`, value: 3000 }, `typing`);
  // welcome.addAction(`typing`);
  //   welcome.addMessage({ type: `typing` }, `typing`);

  welcome.addMessage({
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
  // welcome.say(`Hey then typing!`);
  // welcome.addAction(`typing`);

  welcome.say({ type: `typing` });
  // welcome.say({ type: `delay`, value: 3000 });
  welcome.say(`Hey then typing with delay!`);
  // welcome.addAction(`typing`);
  welcome.ask(`What would you like the quick reply to say?`, [], `reply_title`);
  welcome.say({
    text: `Here is changed your dynamic button:`,
    quick_replies: async (template, vars) => {
      return qrUnknown(vars);
    },
  });
  /*  welcome.ask(
    {
      text: [`Check this out...`],
      quick_replies: [
        {
          title: `Foo`,
          payload: `foo`,
        },
        {
          title: `Bar`,
          payload: `bar`,
        },
      ],
    },
    async (answer, convo, bot) => {
      // noop.
    },
    { key: `waterfall_results` }
  );

  welcome.say(`What is up??`);
  welcome.ask(
    `what is your name`,
    async (answer, convo, bot) => {
      // noop
      // answer contains the user's answer
      // as does convo.vars.name
    },
    { key: `name` }
  );

  welcome.say(`hrrm!`);
  welcome.say(`ok, {{vars.name}}!`);
  welcome.ask(
    `yes or no`,
    [
      {
        pattern: `yes`,
        async handler(answer, convo, bot) {
          console.log(`YES HANDLER`);
          console.log(convo);
          return await convo.gotoThread(`foo`);
        },
      },
      {
        pattern: `no`,
        async handler(answer, convo, bot) {
          console.log(` NO HANDLER`);
          await convo.gotoThread(`bar`);
        },
      },
      {
        default: true,
        handler: async (answer, convo, bot) => {
          console.log(`FALLBACK HANDLER`);
          await convo.repeat();
          // do nothing
        },
      },
    ],
    { key: `answer` }
  );

  welcome.say(`HUH WHAT DOES {{vars.answer}} MEAN?`);

  welcome.addMessage(`YES!!! {{vars.foo}} {{vars.bar}}`, `foo`);
  welcome.addMessage(`NOOOOOO`, `bar`);

  welcome.onChange(`name`, async (response, convo, bot) => {
    await bot.say(`NO! NEVER!!!`);
    await convo.gotoThread(`bar`);
  });

  welcome.before(`foo`, async (convo, bot) => {
    // set a variable
    convo.vars.foo = `this was set in a before handler!`;
  });

  welcome.before(`bar`, async (convo, bot) => {
    // redirect the thread
    convo.vars.bar = `YOU HAVE BEEN REDIRECTED HERE.`;

    // you can send adhoc messages you want using bot.say
    await bot.say(`I refuse to accept that answer.`);

    await convo.gotoThread(`foo`);
  });

  welcome.after(async (results, bot) => {
    console.log(`welcome completed`, results);
    await bot.say(`welcome.after(async (results, bot) => {`);
  });

  // controller.cms.after('tacos', async(results, bot) => {
  //     console.log('AFTER TACOS!!!!!!');
  //     await bot.beginDialog('menu');
  // });
*/
  controller.addDialog(welcome);
  /*
  controller.afterDialog(welcome, async (bot, results) => {
    console.log(`WELCOME DIALOG HAS COMPLETED WITH RESULTS`, results);
    await bot.say(
      `WELCOME SCRIPT COMPLETE, FULL RESULTS:\n\n\`\`\`${JSON.stringify(results, null, 2)}\n\`\`\``
    );
  });
*/
  /*
  controller.hears([`welcome`], `message`, async (bot, message) => {
    await bot.beginDialog(DIALOG_ID, {});
  });

  controller.on(`conversationUpdate`, async (bot, message) => {
    // check to see if this is the bot or another user.
    const is_bot = message.incoming_message.membersAdded.filter(member => {
      return member.id === message.incoming_message.recipient.id;
    });
    if (is_bot.length === 0) {
      await bot.beginDialog(DIALOG_ID);
    }
  });
  */
};
function qrUnknown(vars) {
  switch (vars.reply_title) {
    case `2`:
      return [
        { title: vars.reply_title, payload: vars.reply_title },
        { title: vars.reply_title, payload: vars.reply_title },
      ];
    // break;
    case `3`:
      return [
        { title: vars.reply_title, payload: vars.reply_title },
        { title: vars.reply_title, payload: vars.reply_title },
        { title: vars.reply_title, payload: vars.reply_title },
      ];
    // break;
    default:
      return [{ title: vars.reply_title, payload: vars.reply_title }];
    // break;
  }
}
