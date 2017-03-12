/* global game, mech, Phaser */
var Card = require('../Element/Card');
var Mask = require('../Element/Mask');
// var deck = require('../Deck/HighNoon');
// var deck = require('../Deck/Test');
var deck = require("../Deck/FanTheHammer");

module.exports = {
    create: function(){
        var i, j, c, temp;
        mech.drawPile = [];
        mech.discardPile = [];
        mech.hand = [];
        mech.activeCard = null;
        var background = game.add.sprite(0,0,'pix');
        background.tint = 0xffffff;
        background.height = 450;
        background.width = 800;

        // Add masks/groups and order appropriately
        mech.bottomGroup = new Phaser.Group(game);
        mech.activeMask = new Mask();
        mech.activeMask.off();
        mech.activeCard = new Phaser.Group(game);
        mech.inputMask = new Mask();
        mech.inputMask.off();

        // Build deck from card list, adding to discard pile as they're built
        var totalCardsInDeck = 0;
        while (deck.length > 0) {
            temp = deck.pop();
            totalCardsInDeck += temp.copies;
            for (i = 0; i < temp.copies; i++) {
                c = new Card(temp.title, temp.text, temp.value, temp.tint);
                c.x = 650; c.y = 400;
                mech.discardPile.push(c);
                mech.bottomGroup.addChild(c);
            }
        }

        // Set up and connect events
        mech.events = {};
        (mech.events.handEmpty = new Phaser.Signal()).add(function(){
            print("Hand is empty");
            for (j = 0; j < 5; j++) mech.events.draw.dispatch();
        });
        (mech.events.reshuffle = new Phaser.Signal()).add(function(){
            print("Reshuffling");
            for (;mech.discardPile.length > 0;) {
                c = mech.discardPile.pop();
                mech.drawPile.push(c);
                c.moveTo(50,400);
                c.prepareText();
            }
            Phaser.ArrayUtils.shuffle(mech.drawPile);
            for (var i = 0; i < mech.drawPile.length; i++)
                game.world.bringToTop(mech.drawPile[i]);
        });
        (mech.events.draw = new Phaser.Signal()).add(function(){
            print("Drawing card");
            if (mech.drawPile.length < 1) mech.events.reshuffle.dispatch();
            c = mech.drawPile.pop();
            c.moveTo(mech.hand.length * 150 + 20, 150);
            mech.hand.push(c);
        });
        (mech.events.discardHand = new Phaser.Signal()).add(function(){
            print("Discarding hand");
            var l = mech.hand.length;
            for (var i = 0; i < l; i++) mech.events.discardCard.dispatch(mech.hand[0]);
        });
        (mech.events.activateCard = new Phaser.Signal()).add(function(card){
            if (!card.cardActive) {
                card.cardActive = true;
                card.modifier = 0;
                card.moveTo(card.x,card.y-50);
            } else
                mech.events.discardCard.dispatch(card);
        });
        (mech.events.discardCard = new Phaser.Signal()).add(function(card){
            print('Discarding card');
            var index = mech.hand.indexOf(card);
            mech.hand.splice(index, 1);
            mech.discardPile.push(card);
            card.moveTo(650,400);
            card.cardActive = false;
            for (var i = 0; i < mech.hand.length; i++) mech.hand[i].moveTo(i * 150 + 20, 150);
            if (mech.hand.length < 1) mech.events.handEmpty.dispatch();
        });

        // Create discard button
        c = game.make.text(530,380,'DISCARD',{fill:'black',fillBackground:'black'});
        c.inputEnabled = true;
        c.events.onInputUp.add(function(){mech.events.discardHand.dispatch();});
        mech.bottomGroup.addChild(c);
        // Create draw button
        c = game.make.text(170,380,'DRAW',{fill:'black',fillBackground:'black'});
        c.inputEnabled = true;
        c.events.onInputUp.add(function(){mech.events.draw.dispatch();});
        mech.bottomGroup.addChild(c);

        // Draw a starting hand
        mech.events.handEmpty.dispatch();
    }
};