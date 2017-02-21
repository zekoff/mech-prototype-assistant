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
                c.x = 650;
                c.y = 400;
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
            // transfer discard to draw
            for (;mech.discardPile.length > 0;) {
                c = mech.discardPile.pop();
                mech.drawPile.push(c);
                c.x = 50;
                c.y = 400;
                c.prepareText();
            }
            // shuffle
            Phaser.ArrayUtils.shuffle(mech.drawPile);
            for (i = 0; i < mech.drawPile.length; i++)
                game.world.bringToTop(mech.drawPile[i]);
        });
        (mech.events.draw = new Phaser.Signal()).add(function(){
            print("Drawing card");
            // if draw pile empty, shuffle discard into draw pile
            if (mech.drawPile.length < 1) mech.events.reshuffle.dispatch();
            // transfer card from draw pile to hand
            c = mech.drawPile.pop();
            game.tweens.create(c).to({x:mech.hand.length * 110 + 20, y: 200},300,Phaser.Easing.Cubic.InOut,true);
            mech.hand.push(c);
        });
        (mech.events.discardHand = new Phaser.Signal()).add(function(){
            print("Discarding hand");
            // discard everything left in hand
            while (mech.hand.length > 0) {
                c = mech.hand.pop();
                c.x = 650;
                c.y = 400;
                c.incrementModifer();
                mech.discardPile.push(c);
            }
            mech.events.handEmpty.dispatch();
        });
        (mech.events.activateCard = new Phaser.Signal()).add(function(card){
            card.modifier = 0;
            game.tweens.create(card).to({y:card.y-50},300,Phaser.Easing.Cubic.InOut,true);
        });

        // Create discard button
        c = game.make.text(530,380,'DISCARD',{fill:'white',fillBackground:'black'});
        c.inputEnabled = true;
        c.events.onInputUp.add(function(){mech.events.discardHand.dispatch();});
        mech.bottomGroup.addChild(c);
        // Create draw button
        c = game.make.text(170,380,'DRAW',{fill:'white',fillBackground:'black'});
        c.inputEnabled = true;
        c.events.onInputUp.add(function(){mech.events.draw.dispatch();});
        mech.bottomGroup.addChild(c);

        // Draw a starting hand
        mech.events.handEmpty.dispatch();
    }
};