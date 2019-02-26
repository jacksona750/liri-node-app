require("dotenv").config();
const fs = require('fs');

var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
var axios = require('axios');
var moment = require('moment');
moment().format();
var command = process.argv[2];
var topic = process.argv.slice(3).join(" ");

if (command === "concert-this"){
    getBandInfo()
}
else if (command === "spotify-this-song"){
    getSongInfo()
}
else if (command === "movie-this"){
    getMovieInfo()
}
else if (command === "do-what-it-says") {
    readRandomFile()
}
// Concert-this function
function getBandInfo(){
    axios.get("https://rest.bandsintown.com/artists/" + topic + "/events?app_id=codingbootcamp").then(
        function(response){
            var results = response.data;
            if (results.length === 0){
                console.log("That band isn't touring right now.")
            } else {
            for (var i = 0; i < results.length; i++){
                var eventList = results[i];
                var venue = eventList.venue.name;
                var city = eventList.venue.city;
                var region = eventList.venue.region;
                var country = eventList.venue.country;
                var eventDate = moment(eventList.datetime).format("MM/DD/YYYY");
                console.log("\n------------\n" + 
                            "\nVenue: " + venue + 
                            "\nLocation: " + city + ", " + region + ", " + country + 
                            "\nEvent Time: " + eventDate +
                            "\n------------\n")
                logInfo();            
            }
            }
        }
    )
    .catch(function(err) {
        console.log(err);
    })
};    

// Spotify-this-song function
function getSongInfo(){
    if (topic === ""){
        topic = "The Sign";
        console.log(topic)
    }

    spotify.search({ 
        type: 'track', 
        query: topic,
        limit: 1
    }).then(function(response) {
        var artist = response.tracks.items[0].artists[0].name;
        var song = response.tracks.items[0].name;
        var preViewLink = response.tracks.items[0].external_urls.spotify;
        var album = response.tracks.items[0].album.name;
        console.log("\n------------\n" +
                    "\nArtist: " + artist +
                    "\nSong Title: " + song +
                    "\nPreview Song: " + preViewLink +
                    "\nAlbum Name: " + album +
                    "\n------------\n")
        logInfo();   
  })
  .catch(function(err) {
    console.log(err);
  });
}

// Movie-this function
function getMovieInfo(){
    if (topic === ""){
        topic = "Mr Nobody";
        console.log(topic)
    }
        
    axios.get("http://www.omdbapi.com/?t=" + topic + "&y=&plot=short&apikey=trilogy").then(
        function(response) {
            var results = response.data;
            var title = results.Title;
            var year = results.Year;
            var imdbRating = results.imdbRating;
            var rtRating = results.Ratings[1].Value;
            var country = results.Country;
            var language = results.Language;
            var plot = results.Plot;
            var actors = results.Actors

            console.log("\n------------\n" + 
                        "\nTitle: " + title + 
                        "\nYear: " + year +
                        "\nimdb Rating: " + imdbRating +
                        "\nRotten Tomatoes Rating: " + rtRating +
                        "\nCountry:" + country + 
                        "\nLanguage: " + language +
                        "\nPlot: " + plot + 
                        "\nActors: " + actors +
                        "\n------------\n")         
            logInfo();               
        }
    )
    .catch(function(err) {
        console.log(err);
    })
};

// do-what-it-says function
function readRandomFile (){
    fs.readFile("random.txt", "utf8", function(err, data) {
        if (err) {
            return console.log(err);
        };

        var dataArr = data.split(",");
        command = dataArr[0];
        topic = dataArr[1];
        console.log("\n------------\n" +
                    "\nRandom Command: " + dataArr[0] +
                    "\nRandom Topic: " + dataArr[1] +
                    "\n------------\n");
        logInfo();
    });
}

function logInfo (){
    fs.appendFile("log.txt", command + ", " + topic + "\n", function(err) {
        if(err){
            return console.log(err);
        }
        console.log("This information has been logged!");
    })
};