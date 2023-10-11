/**
 * Copyright (c) InnoraG. All rights reserved.
 * Licensed under creative commons.
 */
// ----------------------------------------------------
// #REQUIRE DEFINITION START

const _ = require(`lodash`);
// const dialogUtils = require(`../utils-module`).Dialog;

// REQUIRE VALUES DEFINITION END
// ----------------------------------------------------

module.exports = function beforedyncardefault(controller) {
  if (controller.plugins.cms) {
    // Initialize variable
    const script = `dyncar`;
    const thread = `default`;

    // fire before onboarding begins
    controller.plugins.cms.before(`dyncar`, `default`, async (convo, bot) => {
      // get userState current language
      const loclang = await controller.localizer.getLoclang(controller, bot);

      /* const es6var = `hardcoded : val {{ with interpol }}`;
      const cmstokens = [
        [`str_mustache_variable`, { es6var: `${es6var}` }],
        [`str_getting_started`, { anarana: `anaranaVal`, fanampiny: `fanampinyVal` }],
        [`str_getting_started1`, { anarana: `anaranaVal`, fanampiny: `fanampinyVal` }],
        [`str_getting_started2`, { anarana: `anaranaVal`, fanampiny: `fanampinyVal` }],
        [`str_getting_started3`, { anarana: `anaranaVal`, fanampiny: `fanampinyVal` }],
      ]; */

      const cmstokens = [
        [
          `str_dyncarstart`,
          { anarana: `tobedefinedbycodeanarana`, fanampiny: `tobedefinedbycodefanampiny` },
        ],
      ];

      // ----------------------------------------------------
      // #CMSTOKENS VALUES DEFINITION START

      // CMSTOKENS VALUES DEFINITION END
      // ----------------------------------------------------

      // map all cms.dyncar.default mustache vars | pattern[0]/*pattern*/ | pattern[1]/*sprintf arguments*/
      cmstokens.forEach((i18nvar) => {
        convo.setVar(
          i18nvar[0],
          controller.localizer.t(`cms.${script}.${thread}.${i18nvar[0]}`, {
            ns: script,
            lng: loclang,
            ...i18nvar[1],
            interpolation: { prefix: `[[`, suffix: `]]` },
          })
        );
        _.set(controller.localcmsvars, `cms.${script}.${thread}.${i18nvar[0]}`, i18nvar[1]);
      });

      convo.setVar(
        `timestamp`,
        new Date().toLocaleString(`fr-FR`, {
          timeZone: `Africa/Nairobi`,
        })
      );

      controller.debug(`testing:before:beforedyncardefault`)(
        `before dyncar all convo.vars : `,
        convo.vars
      );

      controller.debug(`testing:cms:debug`)(`debug pause dyncar`);

      // ------------------------------------------------------
      // #CUSTOM CODES/ACTIONS START

      await bot.say({ type: `typing` });
      await bot.say({ type: `delay`, value: 3000 });
      await bot.say({
        channelData: {
          attachment: {
            elements: [
              {
                buttons: [
                  {
                    payload: `payload`,
                    title: `Button`,
                    type: `postback`,
                  },
                ],
                title: `dynfunc_dyncar_testcarousel`,
              },
              {
                buttons: [
                  {
                    payload: `payload`,
                    title: `Button`,
                    type: `postback`,
                  },
                  {
                    payload: `+12125555555`,
                    title: `Call Us`,
                    type: `phone_number`,
                  },
                  {
                    title: `Open Link`,
                    type: `web_url`,
                    url: `http://botkit.ai`,
                    webview_height_ratio: `full`,
                  },
                ],
                image_url: `image`,
                item_url: `url`,
                subtitle: `second subtitel`,
                title: `second Item`,
              },
            ],
            template_type: `generic`,
          },
        },
        attachmentLayout: `carousel`,
        attachments: [
          {
            content: {
              buttons: [
                {
                  title: `Button`,
                  type: `postBack`,
                  value: `payload`,
                },
              ],
              images: [
                {
                  url: `white2.jpg`,
                },
              ],
              title: `before dyncar_testcarousel`,
            },
            contentType: `application/vnd.microsoft.card.hero`,
          },
          {
            content: {
              buttons: [
                {
                  title: `Button`,
                  type: `postBack`,
                  value: `payload`,
                },
                {
                  title: `Call Us`,
                  type: `call`,
                  value: `+12125555555`,
                },
                {
                  title: `Open Link`,
                  type: `openUrl`,
                  value: `http://botkit.ai`,
                },
              ],
              images: [
                {
                  url: `image`,
                },
              ],
              subtitle: `second subtitel`,
              text: `second subtitel`,
              title: `second Item`,
            },
            contentType: `application/vnd.microsoft.card.hero`,
          },
        ],
      });

      // CUSTOM CODES/ACTIONS END
      // ------------------------------------------------------
    });
  }
};
