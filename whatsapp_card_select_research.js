// If a prompt is defined in the script, use dc.prompt to call it.
            // This prompt must be a valid dialog defined somewhere in your code!
            if (line.collect && line.action !== 'beginDialog') {
                try {

                    const madeoutgoing = await this.makeOutgoing(dc, line, step.values);

                    if (madeoutgoing.channelData.quick_replies && step.state.options.channel && (step.state.options.channel.indexOf('whatsapp') !== -1)) {
                        const choiceArray = madeoutgoing.channelData.quick_replies.map(x => {
                            switch (x.content_type) {
                                case 'text':
                                    return {
                                        value: x.payload,
                                        action: {
                                            type: 'postback',
                                            title: x.title,
                                            //value: x.payload
                                        },
                                        //synonyms: [x.title]
                                    }
                                    break;
                                case 'user_email':
                                    return {
                                        value: x.content_type,
                                        action: {
                                            type: 'postback',
                                            title: x.title,
                                            //value: x.content_type
                                        },
                                        synonyms: ['user_email']
                                    }
                                    break;
                                case 'user_phone_number':
                                    return {
                                        value: x.content_type,
                                        action: {
                                            type: 'postback',
                                            title: x.title,
                                            //value: x.content_type
                                        },
                                        synonyms: ['user_phone_number']
                                    }
                                    break;
                                default:
                                    break;
                            }
                        })
                        //const choicePromptOptions = ChoiceFactory.forChannel(dc.context, choiceArray, madeoutgoing.text);
                        const promptOptions = {
                            prompt: madeoutgoing.text,
                            choices: ChoiceFactory.toChoices(choiceArray),
                            style: ListStyle.list
                            // You can also include a retry prompt if you like,
                            // but there's no need to include the choices property in a text prompt
                        };
                        return await dc.prompt(this._promptchoice, promptOptions);
                    } else {
                        return await dc.prompt(this._prompt, await madeoutgoing);
                    }
                } catch (err) {
                    console.error(err);
                    await dc.context.sendActivity(`Failed to start prompt ${this._prompt}`);
                    return await step.next();
                }
                // If there's nothing but text, send it!
                // This could be extended to include cards and other activity attributes.
            }


            