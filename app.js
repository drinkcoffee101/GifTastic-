$(document).ready(function () {

  //array of search terms to include in the API query URL (ex: q=animals[i])
  var animals = [
    "dog", "cat", "rabbit", "hamster", "skunk", "goldfish",
    "bird", "ferret", "turtle", "sugar glider", "chinchilla",
    "hedgehog", "hermit crab", "gerbil", "pygmy goat", "chicken",
    "capybara", "teacup pig", "serval", "salamander", "frog"
  ];

  //a function that will generate a button for each string in the animals array 
  //take in 3 arguments
  //(1) arrayToUse = the animals array 
  //(2) classToAdd = .animal-buttons 
  //(3) areaToAddTo = the div with the ID of animal-buttons 
  function populateButtons(arrayToUse, classToAdd, areaToAddTo) {
    //empty the #animal-buttons div
    //this will prevent duplicate generation of buttons when called again 
    $(areaToAddTo).empty();

    //for each item in the passed in the animals array 
    for (var i = 0; i < arrayToUse.length; i++) {
      //declare a variable equal to an empty button
      var a = $("<button>");
      //add the passed in class to the button 
      a.addClass(classToAdd);
      //will give the button a data type equal to the animal
      //provides the ability to embed custom data attributes 
      a.attr("data-type", arrayToUse[i]);
      //give the button text equal to the animal 
      a.text(arrayToUse[i]);
      //add the button to the select area/div
      $(areaToAddTo).append(a);
    }

  }

  //a click event listener for the animal buttons
  //when something within the document with the 'animal-button' class is clicked perform this function 
  $(document).on("click", ".animal-button", function () {
    //clear any previously generated gifs from the div 
    $("#animals").empty();
    //removes the color scheme for a previously selected button 
    $(".animal-button").removeClass("active");
    //adds the '.active' color scheme to the button that was hit 
    $(this).addClass("active");

    //this variable is used to store the data value which should be equal to the type of animal 
    var type = $(this).attr("data-type");
    //this variable holds the api query link 
    //'q=' is the search query which will be passed the value of type (equal to type of animal for which the button was pressed)
    //'&' the api_key
    //limit set 10 gifs
    var queryURL = "http://api.giphy.com/v1/gifs/search?q=" + type + "&api_key=BkaUZZWcFij6J7AoQj3WtPb1R2p9O6V9&limit=10";

    //asynchronous data exhange method used to pull information from the api using the queryURL
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      //returns a promise and f succesful then the callback function wil be executed 
      .then(function (response) {
        // console.log(response.data)
        //this variable holds an array containing the 10 gis each with their own sub-data
        var results = response.data;

        //iterate through the results array
        for (var i = 0; i < results.length; i++) {
          //declare a variable that hold a new div with the class .animal-item
          var animalDiv = $("<div class=\"animal-item\">");

          //a variable to hold the rating of the gif 
          var rating = results[i].rating;

          //variable to hold a p tag containing the rating
          var p = $("<p>").text("Rating: " + rating);

          //varaible that stores the animated version of the gif
          var animated = results[i].images.fixed_height.url;
          //variable that stores the still image of the gif 
          var still = results[i].images.fixed_height_still.url;
          //varaible that stores an empty img tag
          var animalImage = $("<img>");
          //give the img tag a src attribute equal to the stil image
          animalImage.attr("src", still);
          //give the img tag a data attribute equal to the still gif image link
          animalImage.attr("data-still", still);
          //give the img tag a data attribute equal to the animated gif image link
          animalImage.attr("data-animate", animated);
          //used to define whether the image is still or moving
          animalImage.attr("data-state", "still");
          //add the animal-image class to the img tag
          animalImage.addClass("animal-image");

          //appends the rating of the gif to the new div containg the gif
          animalDiv.append(p);
          //appends the gif to the new div
          animalDiv.append(animalImage);

          //appends the gif and rating to the speficifed area on the page
          $("#animals").append(animalDiv);
        }
      });
  });

  //click event listener for the gifs of the animals containing the .animal-image class
  $(document).on("click", ".animal-image", function () {
    //store the current state of the gif (still or animate)
    var state = $(this).attr("data-state");

    //if the the state is equal to still 
    if (state === "still") {
      //set the img src link equal to the animated version of the gif 
      $(this).attr("src", $(this).attr("data-animate"));
      //set the state of the gif/img to 'animte'
      $(this).attr("data-state", "animate");
    }
    //when the state is equal to 'animte'
    else {
      //set the src img src link equal to the still version of the gif 
      $(this).attr("src", $(this).attr("data-still"));
      //set the state of the gif/img to 'still'
      $(this).attr("data-state", "still");
    }
  });

  //on click event listener for the 'add animal' section sumbit button 
  $("#add-animal").on("click", function (event) {
    //prevents the page from being reloaded 
    event.preventDefault();
    //variable that stores the input of the text 
    var newAnimal = $("input").val();
    

    //search term needs to be longer than 2 characters 
    if (newAnimal.length > 2) {
      animals.push(newAnimal);
    }

    //repopulate the animal buttons with the newAnimal 
    populateButtons(animals, "animal-button", "#animal-buttons");

  });

  //add the default animal buttons to the page by passing in the animals array, animal-button class, and the animal-buttons id
  populateButtons(animals, "animal-button", "#animal-buttons");
});
