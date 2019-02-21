require('dotenv').config();

var keys = require('./keys');
var axios = require('axios');
var moment = require('moment');
var fs = require('fs');

var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

// skip the first 2 arguments
process.argv.shift();
process.argv.shift();

// get third argument which is the command to be executed
var exeCommand = process.argv[0];

// get 4th argument and onward to search for the given information
var searchData = process.argv.slice(1).join(' ');

function run() {
    switch (exeCommand) {
        case 'concert-this':
            exeConcert();
            break;
        case 'spotify-this-song':
            exeSpotify();
            break;
        case 'movie-this':
            searchMovie();
            break;
        case 'do-what-it-says':
            console.log('do what it says');
            executeFile();
            break;
    
        default:
            console.log('Oops! Seems like you provided an invalid command.')
            break;
    }
}

function executeFile() {
    fs.readFile('./random.txt', function (err, data) {
        if (err) {
            console.log(err);
        }

        var splitData = data.toString().split(',');
        exeCommand = splitData[0];
        searchData = splitData[1];
        run();
    });
}

function searchMovie() {
    var url = 'http://www.omdbapi.com/?apikey=1972ef62&t=' + searchData;

    if (searchData === '') {
        searchData = 'Mr. Nobody';
    }

    axios.get(url).then(function (response) {
        var movie = response.data;

        console.log('Title: ' + movie.Title);
        console.log('Year: ' + movie.Year);
        console.log('IMDB rating: ' + movie.imdbRating);
        console.log('Rotten Tomatoes rating: ' + movie.Ratings[2].Value);
        console.log('Produced in: ' + movie.Country);
        console.log('Language: ' + movie.Language);
        console.log('Plot: ' + movie.Plot);
        console.log('Actors: ' + movie.Actors);
        console.log('---------------');
    }).catch(function (error) {
        console.log(error);
    });
}

function exeSpotify() {
    if (searchData === '') {
        searchData = 'The Sign';
    }

    spotify.search({
        type: 'track',
        query: searchData
    }).then(function (response) {
        var foundItems = response.tracks.items;
        foundItems.forEach(function (item) {
            console.log('Artist: ' + item.artists[0].name);
            console.log('Song: ' + item.name);
            console.log('Album: ' + item.album.name);
            console.log('Spotify URL: ' + item.external_urls.spotify);
            console.log('----------------------------');
        });
    }).catch(function (err) {
        console.log(err);
    });
}

function exeConcert() {
    var url = "https://rest.bandsintown.com/artists/" + searchData + "/events?app_id=codingbootcamp";

    axios.get(url).then(function (response) {
        response.data.forEach(function (item) {
            console.log('Name of the venue: ' + item.venue.name);
            console.log('Venue location: ' + item.venue.city + ', ' + item.venue.region);
            console.log('Date of the Event: ' + moment().format(item.datetime, 'MM/DD/YYYY'));
            console.log('-------------------');
        });
    }).catch(function (error) {
        console.log(error);
    });
}

run();