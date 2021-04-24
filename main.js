
"use strict";
var pantry = new Set([]);
var recipes = undefined;
var itemselecting = 0;
var selecteditem1 = "none";
var selecteditem2 = "none";

window.onload = function () {
    this.init();
};

function init() {
    qsa(".transition-button").forEach((button) => {
        button.addEventListener('click', () => {
            toggleViews();
        });
    });

    id("background-select").addEventListener("change", function () {
        let index = id('background-select').options.selectedIndex;
        let value = id('background-select').options[index].value;
        changeBackgroundColor(value);
    });
    
    id('combine-button').addEventListener('click', mix);
    let ingredientList = qsa(".pantry-ingredients");
    let ingredients;
    for (let i = 0; i < ingredientList.length; i++) {
        ingredients = ingredientList[i].children;
        for (let j = 0; j < ingredients.length; j++) {
            ingredients[j].addEventListener('click', selectItem);
        }
    }
    loadRecipes();
}

function toggleViews() {
    id('welcome-page').classList.toggle("hidden");
    id('game-page').classList.toggle("hidden");
}

function changeBackgroundColor(color) {
    document.body.style.backgroundColor = color;
}

function mix() {
    let result = check();
    // If there is a new item, add it to the pantries and show it in the result colum
    if (result != null && selecteditem1 != "none" && selecteditem2 != "none") { 
        // If we don't already have it in our pantry, add it
        if (!pantry.has(result.Product)) {
            let ingredientList = qsa(".pantry-ingredients");
            for (let i = 0; i < ingredientList.length; i++) {
                let newIngredient = generateNewIngredient(result);
                newIngredient.addEventListener('click', selectItem)
                ingredientList[i].appendChild(newIngredient);
            }
        }
        pantry.add(result.Product);
        // Show the Result
        let newIngredient = generateNewIngredient(result);
        id('dish').appendChild(newIngredient);
        let dishName = document.createElement("p");
        dishName.innerHTML = newIngredient.alt;
        id('dish').appendChild(dishName);
    } else {
        // Otherwise show the trash
        let newIngredient = document.createElement("img");
        newIngredient.src = "http://clipart-library.com/images/rTjRjb6TR.jpg";
        id('dish').innerHTML="";
        id('dish').appendChild(newIngredient);
        let dishName = document.createElement("p");
        dishName.innerHTML = "EW! This is not a dish!";
        id('dish').appendChild(dishName);
    }
    // Reset the workspace
    selecteditem1 = "none";
    selecteditem2 = "none";
    id("workspace-ingredient1").src = "";
    id("workspace-ingredient2").src = "";
    id("workspace-ingredient1").alt = "";
    id("workspace-ingredient2").alt = "";
}

// Generates the new item to be added to the product or pantry
function generateNewIngredient(result) {
    let newIngredient = document.createElement("img");
    newIngredient.alt = result.Product;
    newIngredient.src = result.Image;
    return newIngredient;
}

// Assigns selected items and shows them
function selectItem() {
    id('dish').innerHTML = "";
    if (itemselecting == 0) {
        selecteditem1 = this.alt;
        id("workspace-ingredient1").src = this.src;
        id("workspace-ingredient1").alt = this.alt;

    } else {
        selecteditem2 = this.alt;
        id("workspace-ingredient2").src = this.src;
        id("workspace-ingredient2").alt = this.alt;
    }
    itemselecting = (itemselecting + 1) % 2;
}

// Checks to see if the proposed recipe makes a dish. Will return null if not. 
function check() {
    for (let i = 0; i < recipes.length; i++) {
        let ingredientForRecipe = recipes[i].Ingredients;
        if (((ingredientForRecipe[0].toLowerCase() == selecteditem1.toLowerCase()) && (ingredientForRecipe[1].toLowerCase() == selecteditem2.toLowerCase())) || 
            ((ingredientForRecipe[1].toLowerCase() == selecteditem1.toLowerCase()) && (ingredientForRecipe[0].toLowerCase() == selecteditem2.toLowerCase()))
        ) {
            return recipes[i];
        }
    }
    return;
}

function loadRecipes() {
    fetch('https://gist.githubusercontent.com/LexiShew/7a0f616523e7272270281a4ad6115ace/raw/751630f01d26f23f16df2774ad7abdb2e5ec5b3a/ingredients.JSON')
  .then(response => {
    return response.json()
  })
  .then(data => {
    // recipes is an array of objects that correspond to products.  
    recipes = data.IngredientsList.Recipes; 

  })
  .catch(err => {
    alert("Evacuate the Kitchen. Nothing can be made here");
  })
}


// helper methods
function id(name) {
    return document.getElementById(name);
}

function qs(query) {
    return document.querySelector(query);
}

function qsa(query) {
    return document.querySelectorAll(query);
}
