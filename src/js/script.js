const contentContainer = document.getElementById("contentContainer");
let pokeName;
let pokeId;
let pokePic;
let pokeType;
let pokeType2;
let formattedId;

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

async function getAllData() {
   for (let i = 1; i <= 151; i++) {
      const data = await getData(i);
      console.log(data);
      if (data) {
         getPokeInformationCard(data);
         contentContainer.innerHTML += `${renderPokeCardsHTML()}`;
      } else {
         console.log(`Data for Pokémon with order ${i} could not be retrieved.`);
      }
   }
}

function renderPokeCardsHTML() {
   return `
   <div class="pokemon-card ${pokeType}">
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

function getPokeInformationCard(data) {
   pokeName = capitalizeFirstLetter(data.forms[0].name);
   pokeId = data.id; // Keep pokeId as a number initially
   formatePokeId();
   pokePic = data.sprites.other.dream_world.front_default;
   pokeType = data.types[0].type.name;
   pokeType2 = data.types[1] ? data.types[1].type.name : null;
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

getAllData();
