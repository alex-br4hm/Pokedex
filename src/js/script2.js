const contentContainer = document.getElementById("contentContainer");
const popUpContainer = document.getElementById("popUpContainer");
const arrowLeft = document.getElementById("arrowLeft");
const arrowRight = document.getElementById("arrowRight");
const suggestionsWrapper = document.getElementById("suggestionsWrapper");
const userInputBar = document.getElementById("userSearchInput");
let allPokeData = [];

let pokeData = [];
let isAllDataLoaded = false;
let popUpPokemonId;
let listPostion = 0;
let allMatches = [];
let pokeURL = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";

async function fetchPokeData() {
   let pokemonData = await fetch(pokeURL);
   let pokemonDataAsJson = await pokemonData.json();
   let pokemonDetailsPromises = pokemonDataAsJson.results.map((pokemon) =>
      fetch(pokemon.url).then((response) => response.json())
   );
   allPokeData = await Promise.all(pokemonDetailsPromises);
   buildPokeData();
   
}

async function buildPokeData() {
    allPokeData.forEach((_, index) => {
       getPokeInformations(allPokeData, index);  
   });
 
   const intervalId = setInterval(() => {
      if (pokeData.length== 151) {
      pokeData.sort((a, b) => a.id_number - b.id_number);
      renderPokeCards();
      clearInterval(intervalId);
      }
   }, 100);
}

function renderPokeCards() {
   stopLoadingDataScreen();
   console.log(pokeData.length)
   contentContainer.innerHTML = "";
   for (let i = 0; i < pokeData.length; i++) {
      console.log('he');
      contentContainer.innerHTML += ` ${renderPokeCardsHTML(i)}
      `;
   }
}

function stepLeftOrRight(direction, i) {   
   if (direction == "right") {
      i++;
      renderPopUpContainer(i);
   } else {
      i--;
      renderPopUpContainer(i);
   }
}

function startLoadingDataScreen() {
   let loadingBall = document.getElementById("loadingBallWrapper");
   loadingBall.classList.remove("d-none");
   loadingText.textContent = "catch more wild data in the high grass";
}

function stopLoadingDataScreen() {
   let loadingBall = document.getElementById("loadingBallWrapper");
   loadingBall.classList.add("d-none");
}

function searchPokemon() {
   let userInput = document.getElementById("userSearchInput").value.toLowerCase();
   if (userInput.length > 1) {
      suggestionsWrapper.innerHTML = "";
      filterByUserInput(userInput);
      if (allMatches.length != 0) {
         suggestionsWrapper.classList.remove("d-none");
         for (let i = 0; i < Math.min(allMatches.length, 5); i++) {
            suggestionsWrapper.innerHTML += searchPokemonHTML(i);
         }
      } else {
         suggestionsWrapper.classList.add("d-none");
      }
   } else {
      suggestionsWrapper.innerHTML = "";
   }
}

function filterByUserInput(userInput) {
   allMatches = pokeData.filter(
      (pokemon) =>
         pokemon.name.toLowerCase().includes(userInput.toLowerCase()) ||
         pokemon.ger_name.toLowerCase().includes(userInput.toLowerCase())
   );
   return allMatches;
}

async function getPokeInformations(data, i) {
   try {
      // const info = await getPokemonInfo(i);
      // const flavorText = info.flavorText;
      // const germanName = info.germanName;
      // pokeName = capitalizeFirstLetter(data.forms[0].name);

      let speciesInfo = await getPokemonSpeciesInfo(data[i].id);

      pokeId = data[i].id;
      pokeData.push({
         "name": data[i].name,
         "ger_name": speciesInfo.germanName,
         "id_number": pokeId,
         "id": formatePokeId(),
         "listposition": listPostion++,
         "picture": data[i].sprites.other.dream_world.front_default,
         "maintype": data[i].types[0].type.name,
         "subtype": data[i].types[1] ? data[i].types[1].type.name : null,
         "hp": data[i].stats[0].base_stat,
         "attack": data[i].stats[1].base_stat,
         "defense": data[i].stats[2].base_stat,
         "special_attack": data[i].stats[3].base_stat,
         "special_defense": data[i].stats[4].base_stat,
         "speed": data[i].stats[5].base_stat,
         "flavor_text": formateFlavorText(speciesInfo.flavorText),
      });
   } catch (error) {
      console.error("Fehler beim Abrufen der Pokémon-Informationen:", error);
   }
}

async function getPokemonSpeciesInfo(pokemonId) {
   const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}/`;
   try {
       const response = await fetch(speciesUrl);
       if (!response.ok) {
           throw new Error(`HTTP error! Status: ${response.status}`);
       }
       const data = await response.json();
       const flavorTextEntries = data.flavor_text_entries;
       const flavorText = flavorTextEntries.find(entry => entry.language.name === "en")?.flavor_text || "";
       const germanNameEntry = data.names.find(entry => entry.language.name === "de");
       const germanName = germanNameEntry ? germanNameEntry.name : "";

       return {
           flavorText,
           germanName,
       };
   } catch (error) {
       console.error("Fehler beim Abrufen der Pokémon-Species-Informationen:", error);
       return {
           flavorText: "",
           germanName: "",
       };
   }
}



function openPopUp(i) {
   popUpPokemonId = i;
   clearUserInput();
   renderPopUpContainer(i);
   suggestionsWrapper.classList.add("d-none");
   popUpContainer.classList.remove("d-none");
   document.body.classList.add("unscrollable");
   contentContainer.classList.add("blured");
   contentContainer.classList.add("space-to-right");
}

function closePopUp() {
   document.body.classList.remove("unscrollable");
   contentContainer.classList.remove("blured");
   popUpContainer.classList.add("d-none");
   contentContainer.classList.remove("space-to-right");
}

async function renderPopUpContainer(i) {
   popUpContainer.innerHTML = "";
   popUpPokemonId = pokeData[i].id_number - 1;
   let arrowLeftHTML = i > 0 ? renderArrowLeftHTML(i) : "";
   let arrowRightHTML = i < pokeData.length - 1 ? renderArrowRightHTML(i) : "";
   popUpContainer.innerHTML += renderPopUpContainerHTML(i, arrowLeftHTML, arrowRightHTML);
   const ctx = document.getElementById("myChart").getContext("2d");
   renderChart(i, ctx);
}
