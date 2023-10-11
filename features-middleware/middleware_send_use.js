const { BotkitConversation } = require('botkit');
const { TextPrompt, WaterfallDialog, ChoicePrompt, ChoiceFactory, ListStyle } = require('botbuilder-dialogs');
const { writeJSONSync } = require('fs-extra');
require('dotenv').config('../');
const Shopify = require('../shopify_api');
const shopify = new Shopify(process.env.SHOPIFY_ADMIN_ACCESS_TOKEN || "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")

module.exports = async function (controller) {

    const ONBOARDING_PROMPT = 'onboarding_prompt';
    const PROFILE_DIALOG = 'profile_dialog';
    const ONBOARDING_DIALOG = 'onboarding_dialog';
    const CONFIRM_DIALOG = 'confirm_dialog';
    const START_OVER = 'start_over';

    /**
     * Create a TextPrompt that will be used by the profile dialog
     */

    //await bot._config.dialogContext.continueDialog();
    controller.middleware.send.use(async (bot, message, next) => {
        // controller.dialogSet.dialogs.botgetstarted._controller.dialogSet.dialogs.botgetstarted.script
        // do something with bot or message
        /* if (!(bot._config.reference.channelId.indexOf('whatsapp') !== -1) && message.channelData.quick_replies) {
            const choiceArray = message.channelData.quick_replies.map(x => {
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
                    default:
                        break;
                }
            })
            const choicePromptOptions = ChoiceFactory.forChannel(bot._config.dialogContext.context, choiceArray, message.text);
            const promptOptions = {
                prompt: message.text,
                choices: ChoiceFactory.toChoices(choiceArray),
                style: ListStyle.list
                // You can also include a retry prompt if you like,
                // but there's no need to include the choices property in a text prompt
            };
            const choiceName = bot._config.dialogContext.stack[bot._config.dialogContext.stack.length-1].id+'_choice_prompt_in_bot';
            const choicePrompt = new ChoicePrompt(choiceName);
            await controller.addDialog(choicePrompt);
            await bot._config.dialogContext.replaceDialog(choiceName);    
            await bot._config.dialogContext.prompt(choiceName, promptOptions);
        } else {
            await bot._config.dialogContext.prompt(this._prompt, message);
        } */

        // always call next, or your bot will freeze!
        // writeJSONSync('./controller.json',controller ,{spaces: 2} )
        // writeJSONSync('./bot.json',bot ,{spaces: 2} )
        // controller.plugins.cms.evaluateTrigger(message.text)
        // .then(async command=>{
        //         // let functionResult = await Shopify.fetchProducts('generic',4);
        //         // let formattedResult = Shopify.convertIntoTemplate('fb','generic',functionResult)
        //         // console.debug(formattedResult)
        //         let attachments = command.script[0].script.filter(i=>i['fb_attachments'] && elements in i.fb_attachments);
        //         attachments.forEach(async(i,j)=>{
        //           let {meta} = i;
        //           action = shopify.getMethod(meta.function);
        //           if(!action) { return null}
        //           meta.raw_data = await action('generic' , 10);
        //           let parsed_data = shopify.convertIntoTemplate('fb','generic',meta.raw_data);
        //           meta.keys = Object.keys(parsed_data);
        //           meta.selected_keys = parsed_data;
        //           i.elements = []
        //           parsed_data.map(item=>{
        //             item.buttons = meta.buttons
        //             i.elements.push(...item)
        //           })
        //           i.meta = meta;
        //         })

        //         command.script[0].script.forEach((i,j)=>{
        //           if(i['fb_attachment']){
        //             i['fb_attachment'].elements = attachments.pop()
        //           }
        //         })
        // })
                  // let functionResult = await Shopify.fetchProducts('generic',4);
                // let formattedResult = Shopify.convertIntoTemplate('fb','generic',functionResult)
                // console.debug(formattedResult)
                
                
                // console.log("Original Attachment ", message.attachments && message.attachments.length ? message.attachments[0].content )
                writeJSONSync(`./message_${Math.random()}.json`,message)
                console.log("Channel Data Attachment ", message.channelData.attachment)
                if(message.channelData.attachment && 'template' === message.channelData.attachment.type){
                  let {attachment} = message.channelData;
                  if(attachment.payload.template_type === 'generic' && 'metadata' in attachment.payload && 'function' in attachment.payload.metadata){
                  let {metadata} = attachment.payload;
                  action = shopify.getMethod(metadata.function);
                  if(!action) { return null}
                  metadata.raw_data = await action('generic' ,3);
                  let parsed_data = shopify.convertIntoTemplate('fb','generic',metadata.raw_data, { buttons:metadata.buttons});
                  metadata.keys = Object.keys(parsed_data[0]);
                  metadata.selected_keys = parsed_data;
                  attachment.payload.elements = JSON.parse(JSON.stringify(parsed_data))
                  attachment.payload.elements = attachment.payload.elements.map(i =>{
                    i = {...i , buttons:JSON.parse(JSON.stringify(metadata.buttons))}
                    if( 'images' in i && i.images.length){
                    i['image_url'] = i.images[0].url;
                    i['item_url'] = i.images[0].url;

                }else{
                    i['image_url'] = "";
                    i['item_url'] = "";
                }
                i.buttons = i.buttons.map(button=>{
                    if('value' in button){
                        i.button['payload'] = i.button['value']
                        delete i.button['value'];
                    }
                    return button;
                });
                
                delete i.images;
                delete i.metadata;
                delete i.text;
                console.log(i)
                return i;
                  })

                //   console.log(attachment.payload)
                  
                //   parsed_data.map(item=>{
                //     item.buttons = metadata.buttons
                //     attachment.elements.push(...item)
                //   })
                //   attachment.metadata = metadata;
                message.channelData.attachment = attachment;
                delete message.channelData.attachment.payload.metadata;
                delete message.channelData.attachment.metadata;
                  
                  message.attachments = parsed_data.map(i =>{
                    i.buttons = i.buttons.map(button=>{
                        if('payload' in  button){
                            button['value'] = button['payload']
                            delete button['payload'];
                        }
                        if("webview_height_ratio" in  button){
                            delete button["webview_height_ratio"]
                        }
                    
                        return button;
                    });

                      return {
                          contentType:'application/vnd.microsoft.card.hero',
                          content:i
                        }
                    })
                    
                    message.channelData.attachments = message.attachments;
                    // console.log(message.attachments[0].content)
                }
            }
            
            // message.text ? message.text = "Holy" : null;
                
                
        
        
        
        console.log('OUT     > ', bot._config.reference.conversation.id.toString().substring(0, global.req_url.length + bot._config.reference.channelId.length + 3) + '  ', bot._config.reference.channelId + '  ', message.type + '  ', message.text);

        controller.debug('botkit')('OUTGOING ACTIVITY: ', JSON.stringify(message, null, 2));
        await next();
    });

}

