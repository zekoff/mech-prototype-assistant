/* global game, Phaser, mech */

var Card = function(title, text, prototypeValue, tint) {
    Phaser.Group.call(this, game);
    game.add.existing(this);
    this.cardActive = false;
    this.cardBackground = game.make.sprite(0,0,'pix');
    this.cardBackground.height = 210;
    this.cardBackground.width = 140;
    this.cardBackground.inputEnabled = true;
    var self = this;
    this.cardBackground.events.onInputUp.add(function(){
        mech.events.activateCard.dispatch(self);
    }, this);
    this.add(this.cardBackground);
    if (title) {
        this.title = game.make.text(5,5,title,{font:"13pt Arial",wordWrap:true,wordWrapWidth:130});
        this.add(this.title);
    }
    if (prototypeValue) this.prototypeValue = prototypeValue;
    this.modifier = 1;
    if (text) {
        this.textPrototype = text;
        this.text = game.make.text(5,60,text,{font:"10pt Arial",wordWrap:true,wordWrapWidth:130});
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
Card.prototype.moveTo = function(newX,newY){
    game.tweens.create(this).to({x:newX, y: newY},300,Phaser.Easing.Cubic.InOut,true);
};

module.exports = Card;