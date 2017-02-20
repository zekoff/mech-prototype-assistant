/* global game, Phaser */

var Mask = function() {
    Phaser.Sprite.call(this, game, 0, 0, 'pix');
    game.add.existing(this);
    this.height = 450;
    this.width = 800;
    this.alpha = 0;
    this.inputEnabled = true;
    this.events.onInputUp.add(function(){
        print("mask clicked");
    }, this);
};
Mask.prototype = Object.create(Phaser.Sprite.prototype);
Mask.constructor = Mask;

module.exports = Mask;