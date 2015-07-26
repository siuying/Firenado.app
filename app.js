var pirateship = require('pirateship');
 
pirateship.search(pirateship.categories.video.tv, 'Human', (results)  => {
    console.log(results);
}, (error) => {
    console.error(error);
});