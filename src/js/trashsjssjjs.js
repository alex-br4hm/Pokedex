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
let pokeData = [];

const url = "https://pokeapi.co/api/v2/pokemon?limit=25&offset=0";

// Funktion zum Abrufen der Pokémon-Daten
async function fetchPokemons() {
   try {
      const response = await fetch(url);
      if (!response.ok) {
         throw new Error("Netzwerkantwort war nicht ok " + response.statusText);
      }
      const pdata = await response.json();
      const pokemons = pdata.results;

      for (const pokemon of pokemons) {
         const data = await fetchPokemonDetails(pokemon.url);
         pokeId = data.id;
         pokeData.push({
            "name": capitalizeFirstLetter(data.forms[0].name),
            "id": formatePokeId(),
            "picture": data.sprites.other.dream_world.front_default,
            "maintype": data.types[0].type.name,
            "subtype": data.types[1] ? data.types[1].type.name : null,
            "hp": data.stats[0].base_stat,
            "attack": data.stats[1].base_stat,
            "defense": data.stats[2].base_stat,
            "speed": data.stats[5].base_stat,
         });
      }
   } catch (error) {
      console.error("Es gab ein Problem mit der Fetch-Operation:", error);
   }
   renderPokeCards();
}

// Funktion zum Abrufen der Details eines Pokémon
async function fetchPokemonDetails(url) {
   try {
      const response = await fetch(url);
      if (!response.ok) {
         throw new Error("Netzwerkantwort war nicht ok " + response.statusText);
      }
      return await response.json();
   } catch (error) {
      console.error("Es gab ein Problem mit der Fetch-Operation:", error);
   }
}

function getPokeInformations(data) {}

console.log(pokeData);

// Funktion aufrufen

function renderPokeCards() {
   for (let i = 0; i < pokeData.length; i++) {
      contentContainer.innerHTML += `${renderPokeCardsHTML(i)}`;
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
   pokeText = pokeText.replace(/[\n\f]/g, " ");
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
   document.body.classList.add("unscrollable");
   contentContainer.classList.add("blured");
   renderPopUpContainer(i);
}

function closePopUp() {
   document.body.classList.remove("unscrollable");
   contentContainer.classList.remove("blured");
   popUpContainer.classList.add("d-none");
}

async function renderPopUpContainer(i) {
   const data = await getData(i);
   popUpContainer.innerHTML = "";
   if (data) {
      getPokeInformations(data, i);
      await getMoreInformation(i);
      popUpContainer.innerHTML += `
       <div class="poke-pu-wrapper ${pokeType}PU">
            <h2>${pokeName}</h2>
            <img class="close-icon" src="./src/assets/img/close_icon.png" onclick="closePopUp()" alt="" />
            <img class="arrow-icon arrow-left" src="./src/assets/img/arrow_icon.png" onclick="" alt="" />
            <img class="arrow-icon arrow-right" src="./src/assets/img/arrow_icon.png" onclick="" alt="" />
            <img src="${pokePic}" class="poke-pu-pic" alt="Picture of ${pokeName}" />
            
            <div class="poke-pu-information-wrapper">
            <div class="poke-type-wrapper">
            <div class="${pokeType}PU poke-type">${pokeType}</div>
            ${pokeType2 ? `<div class="${pokeType2}PU poke-type">${pokeType2}</div>` : ""}
            </div>
                
            <div class="flavor-text">
            ${pokeText}
            </div>
            <div class="Stats">HP: ${statHP}</div>
            <div class="stats">HP: ${statHP}</div>
            <div class="stats">Attack: ${statAttack}</div>
            <div class="stats">Defense: ${statDefense}</div>
            <div class="stats">Speed: ${statSpeed}</div> 
           
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
         const firstFlavorText = flavorTextEntries[3].flavor_text;
         console.log(firstFlavorText);
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

function checkScrollPosition() {
   let scrollPositionY = window.scrollY;
   let viewportHeight = window.innerHeight;
   let targetElement = document.getElementById("arrowUp");

   if (scrollPositionY > viewportHeight / 2) {
      targetElement.classList.remove("d-none");
   } else {
      targetElement.classList.add("d-none");
   }
}

window.addEventListener("scroll", checkScrollPosition);
// initial check
checkScrollPosition();

// const contentContainer = document.getElementById("contentContainer");
// const popUpContainer = document.getElementById("popUpContainer");
// let pokeData = [];

// async function getData(pokeOrder) {
//    const url = `https://pokeapi.co/api/v2/pokemon/${pokeOrder}/`;
//    try {
//       const response = await fetch(url);
//       if (!response.ok) {
//          throw new Error(`Error: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//    } catch (error) {
//       console.error(error);
//       return null;
//    }
// }

// async function getAllData() {
//    for (let i = 1; i <= 150; i++) {
//       const data = await getData(i);
//       // const infoText = await getFirstFlavorText(i);
//       getPokeInformations(data);
//    }
//    renderPokeCards();
// }

// function renderPokeCards() {
//    for (let i = 0; i < pokeData.length; i++) {
//       contentContainer.innerHTML += `${renderPokeCardsHTML(i)}`;
//    }
// }

// function renderPokeCardsHTML(i) {
//    return `
//    <div class="pokemon-card ${pokeData[i].maintype}" onclick="openPopUp(${i})">
//       <div class="card-name-id-wrapper">
//       <div class="poke-name">${pokeData[i].name}</div>
//       <div class="poke-id">${pokeData[i].id}</div>
//       </div>
//       <div class="poke-pic-wrapper">
//          <img class="poke-pic" src="${pokeData[i].picture}" alt="${pokeData[i].name}">
//       </div>
//       <div class="poke-type-wrapper">
//          <div class="${pokeData[i].maintype} poke-type">${pokeData[i].maintype}</div>
//          ${pokeData[i].subtype ? `<div class="${pokeData[i].subtype} poke-type">${pokeData[i].subtype}</div>` : ""}
//       </div>
//    </div>
//    `;
// }

// function getPokeInformations(data) {
//    pokeId = data.id;
//    // infoText = infoText.replace(/[\n\f]/g, " ");
//    pokeData.push({
//       "name": capitalizeFirstLetter(data.forms[0].name),
//       "id": formatePokeId(),
//       "picture": data.sprites.other.dream_world.front_default,
//       "maintype": data.types[0].type.name,
//       "subtype": data.types[1] ? data.types[1].type.name : null,
//       "hp": data.stats[0].base_stat,
//       "attack": data.stats[1].base_stat,
//       "defense": data.stats[2].base_stat,
//       "speed": data.stats[5].base_stat,
//       // "flavor_text": infoText,
//    });
// }

// async function getFirstFlavorText(pokemonOrder) {
//    const url = `https://pokeapi.co/api/v2/pokemon-species/${pokemonOrder}/`;
//    try {
//       const response = await fetch(url);
//       if (!response.ok) {
//          throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//       const data = await response.json();
//       const flavorTextEntries = data.flavor_text_entries;
//       if (flavorTextEntries && flavorTextEntries.length > 0) {
//          const firstFlavorText = flavorTextEntries[3].flavor_text;
//          return firstFlavorText;
//       } else {
//          console.log("No flavor text entries found.");
//          return null;
//       }
//    } catch (error) {
//       console.error("Error fetching data:", error);
//    }
// }

// function formatePokeId() {
//    if (pokeId < 10) {
//       formattedId = `#00${pokeId}`;
//    } else if (pokeId < 100) {
//       formattedId = `#0${pokeId}`;
//    } else {
//       formattedId = `#${pokeId}`;
//    }
//    return formattedId;
// }

// function capitalizeFirstLetter(string) {
//    return string.charAt(0).toUpperCase() + string.slice(1);
// }

// function openPopUp(i) {
//    popUpContainer.classList.remove("d-none");
//    document.body.classList.add("unscrollable");
//    contentContainer.classList.add("blured");
//    renderPopUpContainer(i);
// }

// function closePopUp() {
//    document.body.classList.remove("unscrollable");
//    contentContainer.classList.remove("blured");
//    popUpContainer.classList.add("d-none");
// }

// function renderPopUpContainer(i) {
//    popUpContainer.innerHTML = "";
//    popUpContainer.innerHTML += `
//        <div class="poke-pu-wrapper ${pokeData[i].maintype}PU">
//             <h2>${pokeData[i].name}</h2>
//             <img class="close-icon" src="./src/assets/img/close_icon.png" onclick="closePopUp()" alt="" />
//             <img class="arrow-icon arrow-left" src="./src/assets/img/arrow_icon.png" onclick="" alt="" />
//             <img class="arrow-icon arrow-right" src="./src/assets/img/arrow_icon.png" onclick="" alt="" />
//             <img src="${pokeData[i].picture}" class="poke-pu-pic" alt="Picture of ${pokeData[i].name}" />
//             <div class="poke-pu-information-wrapper">
//             <div class="poke-type-wrapper">
//             <div class="${pokeData[i].maintype}PU poke-type">${pokeData[i].maintype}</div>
//             ${pokeData[i].subtype ? `<div class="${pokeData[i].subtype}PU poke-type">${pokeData[i].subtype}</div>` : ""}
//          </div>
//             <div class="flavor-text">
//             ${pokeData[i].flavor_text}
//             </div>
//             <div class="stats">HP: ${pokeData[i].hp}</div>
//             <div class="stats">Attack: ${pokeData[i].attack}</div>
//             <div class="stats">Defense: ${pokeData[i].defense}</div>
//             <div class="stats">Speed: ${pokeData[i].speed}</div>
//             </div>
//          </div>
//       `;
// }

// function checkScrollPosition() {
//    let scrollPositionY = window.scrollY;
//    let viewportHeight = window.innerHeight;
//    let targetElement = document.getElementById("arrowUp");

//    if (scrollPositionY > viewportHeight / 2) {
//       targetElement.classList.remove("d-none");
//    } else {
//       targetElement.classList.add("d-none");
//    }
// }

// window.addEventListener("scroll", checkScrollPosition);
// // initial check
// checkScrollPosition();
