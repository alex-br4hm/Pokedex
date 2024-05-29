const contentContainer = document.getElementById("contentContainer");

async function getData(pokeOrder) {
   const url = `https://pokeapi.co/api/v2/pokemon/${pokeOrder}/`;
   try {
      const response = await fetch(url);
      if (!response.ok) {
         throw new Error(`Error: Unable to fetch data. Status code: ${response.status}`);
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
         let pokeName = capitalizeFirstLetter(data.forms[0].name);
         let pokeId = data.id; // Keep pokeId as a number initially
         let pokePic = data.sprites.other.dream_world.front_default;
         let pokeType = data.types[0].type.name;
         let pokeType2 = data.types[1] ? data.types[1].type.name : null;

         // Determine the format of the ID without converting to a string
         let formattedId;
         if (pokeId < 10) {
            formattedId = `#00${pokeId}`;
         } else if (pokeId < 100) {
            formattedId = `#0${pokeId}`;
         } else {
            formattedId = `#${pokeId}`;
         }

         // Display the Pokémon card with one or two types
         contentContainer.innerHTML += `
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
      } else {
         console.log(`Data for Pokémon with order ${i} could not be retrieved.`);
      }
   }
}
function capitalizeFirstLetter(string) {
   return string.charAt(0).toUpperCase() + string.slice(1);
}

getAllData();
