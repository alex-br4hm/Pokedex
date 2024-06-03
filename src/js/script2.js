const contentContainer = document.getElementById("contentContainer");
const popUpContainer = document.getElementById("popUpContainer");
let arrowLeft = document.getElementById("arrowLeft");
let arrowRight = document.getElementById("arrowRight");
let pokeData = [];
let isAllDataLoaded = false;
let popUpPokemonId;
let listPostion = 0;

async function getData(pokeOrder) {
   const url = `https://pokeapi.co/api/v2/pokemon/${pokeOrder}/`;
   try {
      const response = await fetch(url);
      if (!response.ok) {
         throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();

      return data;
   } catch (error) {
      console.error(error);
      return null;
   }
}
function getAllDatasDummy() {}

async function getAllData() {
   for (let i = 1; i <= 50; i++) {
      const data = await getData(i);

      if (data) {
         getPokeInformations(data, i);
      } else {
         console.log(`Data for Pokémon with order ${i} could not be retrieved.`);
      }
   }
   stopLoadingDataScreen();
   renderPokeCards();
}

async function loadMoreData() {
   isAllDataLoaded = true;
   startLoadingDataScreen();
   for (let i = 51; i <= 151; i++) {
      const data = await getData(i);
      if (data) {
         getPokeInformations(data, i);
      } else {
         console.log(`Data for Pokémon with order ${i} could not be retrieved.`);
      }
   }
   stopLoadingDataScreen();
   renderPokeCards();
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
   loadingText.textContent = "WHATS THAT?";
   setTimeout(() => {
      loadingText.textContent = "There is more wild Data.";
   }, 3000);
   setTimeout(() => {
      loadingText.textContent = "I'll try to catch that too!";
   }, 6000);
}

function stopLoadingDataScreen() {
   let loadingBall = document.getElementById("loadingBallWrapper");
   loadingBall.classList.add("d-none");
}

function renderPokeCards() {
   contentContainer.innerHTML = "";
   for (let i = 0; i < pokeData.length; i++) {
      contentContainer.innerHTML += ` ${renderPokeCardsHTML(i)}
      `;
   }
}

function renderPokeCardsHTML(i) {
   return `
   <div class="pokemon-card ${pokeData[i].maintype}" onclick="openPopUp(${i})">
      <div class="card-name-id-wrapper">
      <div class="poke-name">${pokeData[i].name}</div>
      <div class="poke-id">${pokeData[i].id}</div>
      </div>
      <div class="poke-pic-wrapper">
         <img class="poke-pic" src="${pokeData[i].picture}" alt="${pokeData[i].name}">
      </div>
      <div class="poke-type-wrapper">
         <div class="${pokeData[i].maintype} poke-type">${pokeData[i].maintype}</div>
         ${pokeData[i].subtype ? `<div class="${pokeData[i].subtype} poke-type">${pokeData[i].subtype}</div>` : ""}
      </div>
   </div>
   `;
}

let allMatches = [];

function searchPokemon() {
   let suggestionsWrapper = document.getElementById("suggestionsWrapper");
   let userInput = document.getElementById("userSearchInput").value.toLowerCase();
   if (userInput.length > 1) {
      suggestionsWrapper.innerHTML = "";
      filterByUserInput(userInput);
      if (allMatches.length != 0) {
         document.body.classList.add("unscrollable");
         contentContainer.classList.add("blured");

         for (let i = 0; i < Math.min(allMatches.length, 5); i++) {
            suggestionsWrapper.innerHTML += `
            <div class="suggestion ${allMatches[i].maintype}" onclick="openPopUp(${allMatches[i].listposition})">${allMatches[i].name}<img src="${allMatches[i].picture}" alt=""></div>
            `;
         }
      } else {
         document.getElementById("userSearchInput").value = "";
         alert("No Pokemon could be found.");
      }
   } else {
      document.body.classList.remove("unscrollable");
      contentContainer.classList.remove("blured");
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
   const germanName = await getGermanName(i);

   pokeName = capitalizeFirstLetter(data.forms[0].name);
   pokeId = data.id;
   pokeData.push({
      "name": capitalizeFirstLetter(data.name),
      "ger_name": germanName,
      "id": formatePokeId(),
      "listposition": listPostion++,
      "picture": data.sprites.other.dream_world.front_default,
      "maintype": data.types[0].type.name,
      "subtype": data.types[1] ? data.types[1].type.name : null,
      "hp": data.stats[0].base_stat,
      "attack": data.stats[1].base_stat,
      "defense": data.stats[2].base_stat,
      "speed": data.stats[5].base_stat,
   });
}

function formatePokeId() {
   if (pokeId < 10) {
      formattedId = `#00${pokeId}`;
   } else if (pokeId < 100) {
      formattedId = `#0${pokeId}`;
   } else {
      formattedId = `#${pokeId}`;
   }
   return formattedId;
}

function capitalizeFirstLetter(string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}

async function openPopUp(i) {
   popUpPokemonId = i;
   await renderPopUpContainer(i);
   popUpContainer.classList.remove("d-none");
   document.body.classList.add("unscrollable");
   contentContainer.classList.add("blured");
}

function closePopUp() {
   document.body.classList.remove("unscrollable");
   contentContainer.classList.remove("blured");
   popUpContainer.classList.add("d-none");
}

window.addEventListener("click", function (event) {
   if (event.target === popUpContainer) {
      document.body.classList.remove("unscrollable");
      contentContainer.classList.remove("blured");
      popUpContainer.classList.add("d-none");
   }
});

async function getMoreInformation(i) {
   pokeText = await getFirstFlavorText(i + 1);
   pokeText = pokeText.replace(/[\n\f]/g, " ");
   return pokeText;
}

async function renderPopUpContainer(i) {
   await getMoreInformation(i);
   popUpContainer.innerHTML = "";

   let arrowLeftHTML =
      i > 0
         ? `<img class="arrow-icon arrow-left" id="arrowLeft" src="./src/assets/img/arrow_icon.png" onclick="stepLeftOrRight('left', ${i})" alt="" />`
         : "";

   let arrowRightHTML =
      i < pokeData.length - 1
         ? `<img class="arrow-icon arrow-right" id="arrowRight" src="./src/assets/img/arrow_icon.png" onclick="stepLeftOrRight('right', ${i})" alt="" />`
         : "";

   popUpContainer.innerHTML += `
       <div class="poke-pu-wrapper ${pokeData[i].maintype}PU">
            <h2>${pokeData[i].name}</h2>
            <img class="close-icon" src="./src/assets/img/close_icon.png" onclick="closePopUp()" alt="" />
            ${arrowLeftHTML}
            ${arrowRightHTML}
            <img src="${pokeData[i].picture}" class="poke-pu-pic" alt="Picture of ${pokeData[i].name}" />
            <div class="poke-pu-information-wrapper">
                <div class="poke-type-wrapper">
                    <div class="${pokeData[i].maintype}PU poke-type">${pokeData[i].maintype}</div>
                    ${
                       pokeData[i].subtype
                          ? `<div class="${pokeData[i].subtype}PU poke-type">${pokeData[i].subtype}</div>`
                          : ""
                    }
                </div>
                <div class="flavor-text">
                    ${pokeText}
                </div>
                <div ></div>
                <div class="stats">HP: ${pokeData[i].hp}</div>
                <div class="stats">Attack: ${pokeData[i].attack}</div>
                <div class="stats">Defense: ${pokeData[i].defense}</div>
                <div class="stats">Speed: ${pokeData[i].speed}</div>
            </div>
       </div>
   `;
}

async function getFirstFlavorText(pokemonOrder) {
   const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonOrder}/`;
   try {
      const response = await fetch(url);
      if (!response.ok) {
         throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const flavorTextEntries = data.flavor_text_entries;
      if (flavorTextEntries && flavorTextEntries.length > 0) {
         const firstFlavorText = flavorTextEntries[3].flavor_text;
         return firstFlavorText;
      } else {
         console.log("No flavor text entries found.");
         return null;
      }
   } catch (error) {
      console.error("Error fetching data:", error);
   }
}

async function getGermanName(pokemonOrder) {
   const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonOrder}/`;
   try {
      const response = await fetch(url);
      if (!response.ok) {
         throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      const LanguageEntries = data.names;
      // console.log(LanguageEntries);
      const germanName = LanguageEntries[5].name;
      return germanName;
   } catch (error) {
      console.error("Error fetching data:", error);
   }
}

// getFirstFlavorText(1);

function checkScrollPosition() {
   let scrollPositionY = window.scrollY;
   let viewportHeight = window.innerHeight;
   var documentHeight = document.documentElement.scrollHeight;
   let targetElement = document.getElementById("arrowUp");
   if (scrollPositionY > viewportHeight / 2) {
      targetElement.classList.remove("d-none");
   } else {
      targetElement.classList.add("d-none");
   }
   if (scrollPositionY > 1000 && viewportHeight + scrollPositionY >= documentHeight && isAllDataLoaded === false) {
      loadMoreData();
   }
}

window.addEventListener("scroll", checkScrollPosition);
checkScrollPosition();

let loadingText = document.getElementById("loadingText");
setTimeout(() => {
   loadingText.textContent = "IT'S WILD DATA!";
}, 2500);
setTimeout(() => {
   loadingText.textContent = "I will try to catch it!";
}, 5000);

window.addEventListener("keydown", function (event) {
   if (event.key === "ArrowLeft") {
      if (popUpPokemonId > 0) {
         popUpPokemonId--;
         stepLeftOrRight("left", popUpPokemonId + 1);
      }
   }
});

window.addEventListener("keydown", function (event) {
   if (event.key === "ArrowRight") {
      if (popUpPokemonId < pokeData.length - 1) {
         popUpPokemonId++;
         stepLeftOrRight("right", popUpPokemonId - 1);
      }
   }
});
