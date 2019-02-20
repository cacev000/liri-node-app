require('dotenv').config();

var keys = require('./keys');
var Spotify = require('node-spotify-api');

var spotify = new Spotify(keys.spotify);

// use the following commands to search
// 1. concert-this <artist/band name here>
// 2. spotify-this-song <song name here>
// 3. movie-this <movie name here>
// 4. do-what-it-says gets the txt file found inside the project and call any commands it has in it


// skip the first 2 arguments
process.argv.shift();
process.argv.shift();

// get third argument which is the command to be executed
var exeCommand = process.argv[0];

// get 4th argument and onward to search for the given information
var searchData = process.argv.slice(0).join(' ');

// console.log('Command: ' + exeCommand);
// console.log('Search Info: ' + searchData);

switch (exeCommand) {
    case 'concert-this':
        console.log('concert this');
        break;
    case 'spotify-this-song':
        console.log('spotify this song');
        spotify.search({
                type: 'track',
                query: searchData
            }).then(function(response) {
                console.log(response);
            })
            .catch(function(err) {
                console.log(err);
            });
        break;
    case 'movie-this':
        console.log('movie this');
        break;
    case 'do-what-it-says':
        console.log('do what it says');
        break;

    default:
        console.log('Oops! Seems like you provided an invalid command.')
        break;
}