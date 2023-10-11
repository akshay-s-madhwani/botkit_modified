/**
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */
const express = require('express');
const path = require('path');

module.exports = function(controller) {

    if (controller.adapter.name === 'Web Adapter') {

        //console.log('Loading sample Websocket features...');

        /**
         * Send a message to returning users
         */
        controller.on('welcome_back', async(bot, message) => {
            await bot.reply(message,'Welcome back, human.');
        });

        //controller.publicFolder('/',__dirname  + '/../public');
    // make public/index.html available as localhost/index.html
    // by making the /public folder a static/public asset
    controller.publicFolder('/', path.join(__dirname,'..','public'));

    console.log('Use the webchat with Inspect Mode on : http://localhost:' + (process.env.PORT || 3000));
    }
}