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
      if (data) {
         let pokeName = data.forms[0].name;
         let pokePic = data.sprites.front_default;
         contentContainer.innerHTML += `
         <div class="pokemon-card">
         <div>${pokeName}</div>
         <img src="${pokePic}" alt="">
         </div>
         `;
      } else {
         console.log(`Data for Pokémon with order ${i} could not be retrieved.`);
      }
   }
}

getAllData();
