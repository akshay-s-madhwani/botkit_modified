
//const { BotkitConversation } = require(`botkit`);

const BOTGETSTARTED = `botgetstarted`;

// eslint-disable-next-line func-names
module.exports = function (controller) {

    controller.on(`conversationUpdate`, async (bot, message) => {
        // check to see if this is the bot or another user.
        const isBot = message.incoming_message.membersAdded.filter(member => {
            return member.id === message.incoming_message.recipient.id;
        });
        if (isBot.length === 1) {
            await bot.beginDialog(BOTGETSTARTED);
        } else {
            await bot.reply(message, `Bienvenue à toi`);
        }
    });

}