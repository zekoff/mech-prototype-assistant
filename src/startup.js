/* global Phaser */
var game = new Phaser.Game();
var print = console.log.bind(console);
global.game = game;
global.print = print;
game.state.add('intro', require('./state/intro'));
game.state.start('load');