const { BotkitConversation } = require(`botkit`);

// eslint-disable-next-line func-names
module.exports = function (controller) {

    controller.on('picture_message', async(bot, message) => {
        bot.reply(message, 'Nice pic!');
    });

    controller.on(`message,direct_message`, async (bot, message) => {
        let results = false;
        try {
            if (process.argv[1].indexOf('mocha') !== -1) {
                // console.log('debug tmp pause');
                results = undefined;
                if (message.incoming_message.serviceUrl.indexOf('test.com') === -1) {
                    results = await controller.plugins.cms.testTrigger(bot, message);
                }
                // do not testTrigger in test mode
            } else {
                if (message.incoming_message.attachments && message.incoming_message.attachments.length > 0) {
                    // TODO : include attachment in cms message format
                    // console.log('attachments length', message.incoming_message.attachments.length);
                    message.text = message.text + ' [media_url_' + message.incoming_message.attachments.length + ']';
                }
                results = await controller.plugins.cms.testTrigger(bot, message);
            }
        } catch (error) {
            controller.debug(`boterror:${(new Error().stack.split("at ")[1]).trim().split(/\/|\\/).pop().trim(")")}`)(
                `\`\`\`trigger result is : ${JSON.stringify(error, null, 2)}\n\`\`\``
            );
        }

        if (results !== false) {
            // do not continue middleware!
            return false;
        }
        return true;
    });

}