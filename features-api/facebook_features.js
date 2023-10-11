/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

module.exports = function facebookFeatures(controller) {
  if (controller.adapter.name === `Facebook Adapter`) {
    /**
     * Detect when a message has a sticker attached
     */
    controller.hears(async message => message.sticker_id, `message`, async (bot, message) => {
      await bot.reply(message, `Cool sticker.`);
    });

    controller.on(`facebook_postback`, async (bot, message) => {
      await bot.reply(message, `I heard you posting back a post_back about ${message.text}`);
    });

    controller.ready(async () => {
      // example of proactive message
      const bot = await controller.spawn(process.env.FACEBOOK_PAGE_ID);
      bot.startConversationWithUser(process.env.FACEBOOK_ADMIN_USER).then(async () => {
        const res = await bot.say(`Hello human`);
        console.log(`results of proactive message`, res);
      });

      let res = await bot.api.callAPI(`/me/messenger_profile`, `delete`, {
        fields: [`persistent_menu`],
      });
      console.log(`results of delete menu`, res);

      res = await bot.api.callAPI(`/me/messenger_profile`, `post`, {
        persistent_menu: [
          {
            locale: `default`,
            composer_input_disabled: false,
            call_to_actions: [
              {
                title: `Menu Botika 🏪`,
                type: `nested`,
                call_to_actions: [
                  {
                    type: `postback`,
                    title: `Voir le Catalogue 🗂`, // Pict OK
                    payload: `P_VLC`,
                  },
                  {
                    type: `postback`,
                    title: `Vendre sur MPBotika💶`, // Pict OK
                    payload: `P_VSM`,
                  },
                  {
                    type: `postback`,
                    title: `Voir Votre Panier 🗑`, // Pict OK
                    payload: `P_VVP`,
                  },
                  {
                    type: `postback`,
                    title: `Rechercher Produit 🔎`, // Pict OK
                    payload: `P_RPA`,
                  },
                  {
                    type: `postback`,
                    title: `Joindre le Groupe 🌐`, // Pict OK
                    payload: `P_JGP`,
                  },

                  // {
                  // type: 'postback',
                  // title: "Event e-Tapakila 🎫",
                  // payload: 'INFO_EVENT_MENU_DUMMY_DUMMY'
                  // },
                ],
              },
              {
                title: `Menu Mon Compte 💰`,
                type: `nested`,
                call_to_actions: [
                  {
                    type: `postback`,
                    title: `Proforma à Payer 📃`, // Pict OK
                    payload: `P_PAP`,
                  },
                  {
                    type: `postback`,
                    title: `Achats en Cours 🛍`, // Pict OK
                    payload: `P_AEC`,
                  },
                  {
                    type: `postback`,
                    title: `Produits en Ligne 📊`, // Pict OK
                    payload: `P_PEL`,
                  },
                  {
                    type: `postback`,
                    title: `Ventes en Cours 📈`, // Pict OK
                    payload: `P_VEC`,
                  },
                  {
                    type: `postback`,
                    title: `Joindre le Groupe 🌐`, // Pict OK
                    payload: `P_JGP`,
                  },

                  // {
                  //   type: 'postback',
                  //   title: 'Mes Achats Passés',
                  //   payload: 'P_MAP'
                  // },
                  // {
                  //   type: 'postback',
                  //   title: 'Mes Ventes Passées',
                  //   payload: 'P_MVP'
                  // },
                ],
              },
              {
                title: `Autres Services ⚒`,
                type: `nested`,
                call_to_actions: [
                  {
                    type: `postback`,
                    title: `Actus Divers 📻`,
                    payload: `P_ADV`,
                  },
                  {
                    type: `postback`,
                    title: `Joindre le Groupe 🌐`, // Pict OK
                    payload: `P_JGP`,
                  },
                  // {
                  //   type: 'postback',
                  //   title: 'Cours de Change 💶',
                  //   payload: 'PERSISTENT_MENU_CHANGE'
                  // },
                  {
                    type: `postback`,
                    title: `Video Mode d'Emploi`,
                    payload: `P_VME`,
                  },
                ],
              },
            ],
          },
        ],
      });
      console.log(`results of set menu`, res);
    });
  }
};
