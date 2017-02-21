/* global game, Phaser, mech */

var Card = function(title, text, prototypeValue, tint) {
    Phaser.Group.call(this, game);
    game.add.existing(this);
    this.cardBackground = game.make.sprite(0,0,'pix');
    this.cardBackground.height = 150;
    this.cardBackground.width = 100;
    this.cardBackground.inputEnabled = true;
    var self = this;
    this.cardBackground.events.onInputUp.add(function(){
        mech.events.activateCard.dispatch(self);
    }, this);
    this.add(this.cardBackground);
    if (title) {
        this.title = game.make.text(2,2,title,{font:"10pt Arial",wordWrap:true,wordWrapWidth:100});
        this.add(this.title);
    }
    if (prototypeValue) this.prototypeValue = prototypeValue;
    this.modifier = 1;
    if (text) {
        this.textPrototype = text;
        this.text = game.make.text(2,50,text,{font:"7pt Arial",wordWrap:true,wordWrapWidth:100});
        this.prepareText();
        this.add(this.text);
    }
    if (tint) this.cardBackground.tint = tint;
};
Card.prototype = Object.create(Phaser.Group.prototype);
Card.constructor = Card;
Card.prototype.prepareText = function() {
    this.text.setText(this.textPrototype.replace("###", this.prototypeValue * this.modifier));
};
Card.prototype.incrementModifer = function(amount) {
    if (amount) this.modifier += amount;
    else this.modifier++;
};
Card.prototype.resetModifier = function(){
    this.modifier = 1;
};

module.exports = Card;