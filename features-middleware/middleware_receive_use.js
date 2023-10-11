const { isInt } = require("prettier");

module.exports = function (controller) {

    controller.middleware.receive.use(async function (bot, message, next) {

        // do something with bot or message
        if (!(Number.isInteger(message.text) && message.text > 0) &&
            bot._config.dialogContext.stack.length > 0 &&
            bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].id &&
            bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].id.indexOf('_choice_prompt') !== -1 &&
            !(message.text <= bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].state.options.choices.length)) {
            bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].state.options.choices.push(
                {
                    value: message.text,
                    action: {
                        type: "postback",
                        title: message.text,
                        value: message.text,
                    },
                    synonyms: [
                        message.text,
                    ],
                })
        }
        console.log('INC  <    ', global.req_url, ' ', message.incoming_message.channelId, ' ', message.incoming_message.type, ' ', message.incoming_message.text);

        // always call next, or your bot will freeze!
        // If channel is whatsapp and prompt is choice_prompt and choice style is none and incoming text is digit less than choices


        if (bot._config.dialogContext.stack.length > 0 &&
            bot._config.activity.channelId.indexOf('whatsapp') !== -1 &&
            bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].id.indexOf('_choice_prompt') !== -1 &&
            bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].state &&
            bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].state.options &&
            typeof (bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].state.options.style) !== 'undefined') {
            const intPatterns = bot._controller._interrupts.message.map(int => int.pattern);
            //const dmPatterns = bot._controller._interrupts.direct_message.map(int => int.pattern)
            const interruptRegexString = new RegExp([...intPatterns].join('|'));
            if (/^\d+$/.test(message.incoming_message.text) &&
                message.incoming_message.text <= bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].state.options.choices.length &&
                message.incoming_message.text > 0) {
                // restore digit to text
                message.incoming_message.text = bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].state.options.choices[message.incoming_message.text - 1].value;
                message.text = message.incoming_message.text;
                console.log('allow repeat');
                bot._config.dialogContext.stack.whatsapp_reprompt = true;
            } else if (interruptRegexString.test(message.incoming_message.text)) {
                console.log('allow repeat');
                bot._config.dialogContext.stack.whatsapp_reprompt = true;
            } else {
                // stop prompt dialog if not digit or not interrupt incoming message
                await bot._config.dialogContext.endDialog();
                bot._config.dialogContext.stack.whatsapp_reprompt = false;
            }
            // processIfInterruptDialog(bot, message);
        } else if (bot._config.dialogContext.stack.length > 0 &&
            bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].id.indexOf('_prompt') !== -1 &&
            bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].state &&
            bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].state.options &&
            bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].state.options.prompt &&
            bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].state.options.prompt.channelData &&
            bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].state.options.prompt.channelData.attachment &&
            bot._config.dialogContext.stack[bot._config.dialogContext.stack.length - 1].state.options.prompt.channelData.attachment.type === 'template') {
            // remove prompt dialog for template on non whatsapp channel
            await bot._config.dialogContext.endDialog()
        }

        next();
    });

}
async function processIfInterruptDialog(bot, message) {
    const mesPatterns = bot._controller._interrupts.message.map(int => int.pattern);
    //const dmPatterns = bot._controller._interrupts.direct_message.map(int => int.pattern)
    const interrupLists = new RegExp([...mesPatterns].join('|'));
    if (interrupLists.test(message.incoming_message.text)) {
        // maintain prompt dialog if interrupt incoming message
        console.log('allow repeat');
        bot._config.dialogContext.stack.whatsapp_reprompt = true;
    } else {
        // stop prompt dialog if not digit or not interrupt incoming message
        await bot._config.dialogContext.endDialog();
        bot._config.dialogContext.stack.whatsapp_reprompt = false;
    }
}

