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
         let pokePic = data.sprites.other.dream_world.front_default;
         // let pokePic = data.sprites.versions.generation-i.red-blue.front_transparent;
         let pokeType = data.types[0].type.name;
         // if (data.types[1].type.name != undefined) {
         //    let pokeType2 = data.types[1].type.name;
         //    return pokeType2;
         // }

         // console.log(pokeType2);
         contentContainer.innerHTML += `
         <div class="pokemon-card ${pokeType}"">
         <div class="poke-name">${pokeName}</div>
         <div class="poke-pic-wrapper">
         <img class="poke-pic"src="${pokePic}" alt="">
         </div>
         <div>${pokeType} / ${pokeType}</div>
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
