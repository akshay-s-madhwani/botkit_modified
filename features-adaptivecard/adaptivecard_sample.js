const request = require('request');
const { CardFactory} = require('botbuilder');

// Import AdaptiveCard content.
const FlightItineraryCard = require('./resources/FlightItineraryCard.json');
const ImageGalleryCard = require('./resources/ImageGalleryCard.json');
const LargeWeatherCard = require('./resources/LargeWeatherCard.json');
const RestaurantCard = require('./resources/RestaurantCard.json');
const SolitaireCard = require('./resources/SolitaireCard.json');

// Create array of AdaptiveCard content, this will be used to send a random card to the user.
const CARDS = [
    FlightItineraryCard,
    ImageGalleryCard,
    LargeWeatherCard,
    RestaurantCard,
    SolitaireCard
];

module.exports = function(controller) {

    controller.hears('adaptive', 'message', async(bot, message) => {
        const randomlySelectedCard = CARDS[Math.floor((Math.random() * CARDS.length - 1) + 1)];

        await bot.reply(message,{
            text: 'Here is an Adaptive Card:',
            attachments: [CardFactory.adaptiveCard(randomlySelectedCard)]
        });

    });

}