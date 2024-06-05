const contentContainer = document.getElementById("contentContainer");
const popUpContainer = document.getElementById("popUpContainer");
const arrowLeft = document.getElementById("arrowLeft");
const arrowRight = document.getElementById("arrowRight");
const suggestionsWrapper = document.getElementById("suggestionsWrapper");
const userInputBar = document.getElementById("userSearchInput");
let pokeData = [];
let isAllDataLoaded = false;
let popUpPokemonId;
let listPostion = 0;
let allMatches = [];

async function fetchData(pokeOrder) {
   try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeOrder}/`);
      if (!response.ok) {
         throw new Error(`Error: ${response.status}`);
      }
      return await response.json();
   } catch (error) {
      console.error(error);
      return null;
   }
}

async function getPokeData() {
   const totalPokemons = 151;
   const batchSize = 50;
   for (let i = 1; i <= totalPokemons; i += batchSize) {
      const batchPromises = [];
      for (let j = i; j < Math.min(i + batchSize, totalPokemons + 1); j++) {
         batchPromises.push(fetchData(j));
      }
      try {
         const batchResults = await Promise.all(batchPromises);
         batchResults.forEach((data, index) => {
            if (data) {
               getPokeInformations(data, i + index);
            } else {
               console.log(`Data for PokÃ©mon with order ${i + index} could not be retrieved.`);
            }
         });
      } catch (error) {
         console.error("Error fetching data:", error);
      }
      await new Promise((resolve) => setTimeout(resolve, 10)); // Wait before next batch
   }
   setTimeout(() => {
      stopLoadingDataScreen();
      renderPokeCards();
   }, 2000);
}

function renderPokeCards() {
   pokeData.sort((a, b) => a.id_number - b.id_number);
   contentContainer.innerHTML = "";
   for (let i = 0; i < pokeData.length; i++) {
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
            suggestionsWrapper.innerHTML += `
            <div class="suggestion ${allMatches[i].maintype}" onclick="openPopUp(${allMatches[i].id_number - 1})">
            <div class="search-name-wrapper">
            <div>${allMatches[i].ger_name}</div>
            <div>(${allMatches[i].name})</div>
            </div>
            <img src="${allMatches[i].picture}" alt=""></div>
            `;
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
      const info = await getPokemonInfo(i);
      const flavorText = info.flavorText;
      const germanName = info.germanName;
      pokeName = capitalizeFirstLetter(data.forms[0].name);
      pokeId = data.id;
      pokeData.push({
         "name": capitalizeFirstLetter(data.name),
         "ger_name": germanName,
         "id_number": pokeId,
         "id": formatePokeId(),
         "listposition": listPostion++,
         "picture": data.sprites.other.dream_world.front_default,
         "maintype": data.types[0].type.name,
         "subtype": data.types[1] ? data.types[1].type.name : null,
         "hp": data.stats[0].base_stat,
         "attack": data.stats[1].base_stat,
         "defense": data.stats[2].base_stat,
         "special_attack": data.stats[3].base_stat,
         "special_defense": data.stats[4].base_stat,
         "speed": data.stats[5].base_stat,
         "flavor_text": formateFlavorText(flavorText),
      });
   } catch (error) {
      console.error("Fehler beim Abrufen der Pokémon-Informationen:", error);
   }
}

function openPopUp(i) {
   suggestionsWrapper.classList.add("d-none");
   clearUserInput();
   renderPopUpContainer(i);
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
   let arrowLeftHTML = i > 0 ? renderArrowLeftHTML(i) : "";
   let arrowRightHTML = i < pokeData.length - 1 ? renderArrowRightHTML(i) : "";
   popUpContainer.innerHTML += renderPopUpContainerHTML(i, arrowLeftHTML, arrowRightHTML);
   const ctx = document.getElementById("myChart").getContext("2d");
   renderChart(i, ctx);
}

async function getPokemonInfo(pokemonOrder) {
   const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonOrder}/`;
   try {
      const response = await fetch(url);
      if (!response.ok) {
         throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const flavorTextEntries = data.flavor_text_entries;
      const germanName = data.names.find((entry) => entry.language.name === "de").name;
      return { flavorText: flavorTextEntries[3].flavor_text, germanName };
   } catch (error) {
      console.error("Error fetching data:", error);
   }
}
