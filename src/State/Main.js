/* global game */
var Card = require('../Element/Card');
var Mask = require('../Element/Mask');

module.exports = {
    create: function(){
        new Mask();
        var card = new Card("test title", "some card text", 0xFFCCCC);
        game.tweens.create(card).to({x:350, y:200, height: 225, width: 150}).start();
    }
};