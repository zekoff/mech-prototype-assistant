/* global game */
module.exports = {
    preload: function(){
        game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
        game.load.baseURL = './assets/';
        game.load.image('pix');
    },
    create: function(){
        game.state.start('Main');
    }
};