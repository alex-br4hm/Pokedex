const contentContainer = document.getElementById("contentContainer");
const popUpContainer = document.getElementById("popUpContainer");
let pokeName;
let pokeId;
let pokePic;
let pokeType;
let pokeType2;
let formattedId;
let statHP;
let statAttack;
let statDefense;
let statSpeed;
let pokeText;

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
   for (let i = 1; i <= 10; i++) {
      const data = await getData(i);
      console.log(data);
      if (data) {
         getPokeInformations(data);
         contentContainer.innerHTML += `${renderPokeCardsHTML(i)}`;
      } else {
         console.log(`Data for Pokémon with order ${i} could not be retrieved.`);
      }
   }
}

function renderPokeCardsHTML(i) {
   return `
   <div class="pokemon-card ${pokeType}" onclick="openPopUp(${i})">
      <div class="card-name-id-wrapper">
      <div class="poke-name">${pokeName}</div>
      <div class="poke-id">${formattedId}</div>
      </div>
      <div class="poke-pic-wrapper">
         <img class="poke-pic" src="${pokePic}" alt="${pokeName}">
      </div>
      <div class="poke-type-wrapper">
         <div class="${pokeType} poke-type">${pokeType}</div>
         ${pokeType2 ? `<div class="${pokeType2} poke-type">${pokeType2}</div>` : ""}
      </div>
   </div>
   `;
}

function getPokeInformations(data) {
   pokeName = capitalizeFirstLetter(data.forms[0].name);
   pokeId = data.id;
   formatePokeId();
   pokePic = data.sprites.other.dream_world.front_default;
   pokeType = data.types[0].type.name;
   pokeType2 = data.types[1] ? data.types[1].type.name : null;
   statHP = data.stats[0].base_stat;
   statAttack = data.stats[1].base_stat;
   statDefense = data.stats[2].base_stat;
   statSpeed = data.stats[5].base_stat;
   return;
}

async function getMoreInformation(i) {
   pokeText = await getFirstFlavorText(i);
   return;
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

function openPopUp(i) {
   popUpContainer.classList.remove("d-none");
   renderPopUpContainer(i);
}

function closePopUp() {
   popUpContainer.classList.add("d-none");
}

async function renderPopUpContainer(i) {
   const data = await getData(i);
   popUpContainer.innerHTML = "";
   if (data) {
      getPokeInformations(data, i);
      await getMoreInformation(i);
      popUpContainer.innerHTML += `
       <div class="poke-pu-wrapper">
            <h2>${pokeName}</h2>
            <img class="close-icon" src="./src/assets/img/close_icon.png" onclick="closePopUp()" alt="" />
            <div class="stats">HP: ${statHP}</div>
            <div class="stats">Attack: ${statAttack}</div>
            <div class="stats">Defense: ${statDefense}</div>
            <div class="stats">Speed: ${statSpeed}</div>
            <img src="${pokePic}" class=" ${pokeType}" alt="" />
            <div class="flavor-text">
            ${pokeText}
            </div>
         </div>
      `;
   } else {
      console.log(`Data for Pokémon with order ${i} could not be retrieved.`);
   }
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
         const firstFlavorText = flavorTextEntries[0].flavor_text;
         // console.log(firstFlavorText);
         return firstFlavorText;
      } else {
         console.log("No flavor text entries found.");
         return null;
      }
   } catch (error) {
      console.error("Error fetching data:", error);
   }
}

// getFirstFlavorText(1);
