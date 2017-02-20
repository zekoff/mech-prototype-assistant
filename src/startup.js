/* global Phaser */
var game = new Phaser.Game(800, 450);
var print = console.log.bind(console);
global.game = game;
global.mech = {};
global.print = print;
game.state.add('Load', require('./State/Load'));
game.state.add('Main', require('./State/Main'));
game.state.start('Load');