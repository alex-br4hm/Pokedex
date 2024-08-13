const contentContainer = document.getElementById("contentContainer");
const popUpContainer = document.getElementById("popUpContainer");
const arrowLeft = document.getElementById("arrowLeft");
const arrowRight = document.getElementById("arrowRight");
const suggestionsWrapper = document.getElementById("suggestionsWrapper");
const userInputBar = document.getElementById("userSearchInput");
let allPokeData = [];
let pokeData = [];
let popUpPokemonId;
let listPostion = 0;
let allMatches = [];
let pokeURL = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";

/**
 * Fetches Pokémon data from the API in batches and processes it.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function fetchPokeData() {
   let pokemonData = await fetch(pokeURL);
   let pokemonDataAsJson = await pokemonData.json();
   let batchedRequests = [];
   const batchSize = 20; 

   for (let i = 0; i < pokemonDataAsJson.results.length; i += batchSize) {
       const batch = pokemonDataAsJson.results.slice(i, i + batchSize).map((pokemon) =>
           fetch(pokemon.url).then((response) => response.json())
       );
       batchedRequests.push(...await Promise.all(batch));
   }

   allPokeData = batchedRequests;
   buildPokeData();
}

/**
 * Processes all fetched Pokémon data and sorts it for rendering.
 * @async
 * @function
 * @returns {Promise<void>}
 */
async function buildPokeData() {
   const promises = allPokeData.map(async (_, index) => {
       await getPokeInformations(allPokeData, index);
   });

   await Promise.all(promises);
   
   pokeData.sort((a, b) => a.id_number - b.id_number);
   renderPokeCards();  
}

/**
 * Renders the Pokémon cards into the content container.
 * @function
 */
function renderPokeCards() {
   stopLoadingDataScreen();
   const html = pokeData.map((_, i) => renderPokeCardsHTML(i)).join('');
   contentContainer.innerHTML = html;
}

/**
 * Navigates the Pokémon details popup left or right.
 * @function
 * @param {string} direction - The direction to navigate ("left" or "right").
 * @param {number} i - The current index of the Pokémon in the popup.
 */
function stepLeftOrRight(direction, i) {   
   if (direction == "right") {
      i++;
      renderPopUpContainer(i);
   } else {
      i--;
      renderPopUpContainer(i);
   }
}

/**
 * Starts the loading screen animation.
 * @function
 */
function startLoadingDataScreen() {
   let loadingBall = document.getElementById("loadingBallWrapper");
   loadingBall.classList.remove("d-none");
   loadingText.textContent = "catch more wild data in the high grass";
}

/**
 * Stops the loading screen animation.
 * @function
 */
function stopLoadingDataScreen() {
   let loadingBall = document.getElementById("loadingBallWrapper");
   loadingBall.classList.add("d-none");
}

/**
 * Filters Pokémon based on user input and displays suggestions.
 * @function
 */
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

/**
 * Filters the Pokémon data based on the user's input.
 * @function
 * @param {string} userInput - The user's input in the search bar.
 * @returns {Array<Object>} The array of matched Pokémon.
 */
function filterByUserInput(userInput) {
   allMatches = pokeData.filter(
      (pokemon) =>
         pokemon.name.toLowerCase().includes(userInput.toLowerCase()) ||
         pokemon.ger_name.toLowerCase().includes(userInput.toLowerCase())
   );
   return allMatches;
}

/**
 * Retrieves and processes specific Pokémon information from the API.
 * @async
 * @function
 * @param {Array<Object>} data - The array of Pokémon data.
 * @param {number} i - The index of the Pokémon in the data array.
 * @returns {Promise<void>}
 */
async function getPokeInformations(data, i) {
   try {
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
      console.error("Error fetching Pokémon information:", error);
   }
}

/**
 * Retrieves specific species information for a given Pokémon.
 * @async
 * @function
 * @param {number} pokemonId - The ID of the Pokémon to fetch species information for.
 * @returns {Promise<Object>} The species information including flavor text and German name.
 */
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
       console.error("Error fetching Pokémon species information:", error);
       return {
           flavorText: "",
           germanName: "",
       };
   }
}

/**
 * Opens the Pokémon details popup for the selected Pokémon.
 * @function
 * @param {number} i - The index of the Pokémon in the pokeData array.
 */
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

/**
 * Closes the Pokémon details popup.
 * @function
 */
function closePopUp() {
   document.body.classList.remove("unscrollable");
   contentContainer.classList.remove("blured");
   popUpContainer.classList.add("d-none");
   contentContainer.classList.remove("space-to-right");
}

/**
 * Renders the content of the Pokémon details popup.
 * @async
 * @function
 * @param {number} i - The index of the Pokémon in the pokeData array.
 * @returns {Promise<void>}
 */
async function renderPopUpContainer(i) {
   popUpContainer.innerHTML = "";
   popUpPokemonId = pokeData[i].id_number - 1;
   let arrowLeftHTML = i > 0 ? renderArrowLeftHTML(i) : "";
   let arrowRightHTML = i < pokeData.length - 1 ? renderArrowRightHTML(i) : "";
   popUpContainer.innerHTML += renderPopUpContainerHTML(i, arrowLeftHTML, arrowRightHTML);
   const ctx = document.getElementById("myChart").getContext("2d");
   renderChart(i, ctx);
}
