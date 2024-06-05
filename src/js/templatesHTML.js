function renderPokeCardsHTML(i) {
   return `
   <div class="pokemon-card ${pokeData[i].maintype}" onclick="openPopUp(${i})">
   <div class="card-name-id-wrapper">
       <div class="poke-names-wrapper">
      <div class="poke-name">${pokeData[i].ger_name}</div>
      <div class="poke-name-eng">${pokeData[i].name}</div>
      </div> 
      <div class="poke-id">${pokeData[i].id}</div>
   </div>
   <div class="poke-pic-wrapper">
      <img class="poke-pic" src="${pokeData[i].picture}" alt="${pokeData[i].name}" />
   </div>
   <div class="poke-type-wrapper">
      <div class="${pokeData[i].maintype} poke-type">${pokeData[i].maintype}</div>
      ${
         pokeData[i].subtype
            ? `
      <div class="${pokeData[i].subtype} poke-type">${pokeData[i].subtype}</div>
      `
            : ""
      }
   </div>
</div>
    `;
}

function renderArrowLeftHTML(i) {
   return `<img class="arrow-icon arrow-left" id="arrowLeft" src="./src/assets/img/arrow_icon.png" onclick="stepLeftOrRight('left', ${i})" alt="" />`;
}

function renderArrowRightHTML(i) {
   return `<img class="arrow-icon arrow-right" id="arrowRight" src="./src/assets/img/arrow_icon.png" onclick="stepLeftOrRight('right', ${i})" alt="" />`;
}

function renderPopUpContainerHTML(i, arrowLeftHTML, arrowRightHTML) {
   return `
   <div class="poke-pu-wrapper ${pokeData[i].maintype}PU">
   <div class="hp-display">${pokeData[i].hp} HP</div>
   <h2>${pokeData[i].ger_name}</h2>
   <h3>(${pokeData[i].name})</h3>
   <img class="close-icon" src="./src/assets/img/close_icon.png" onclick="closePopUp()" alt="" />
   ${arrowLeftHTML} ${arrowRightHTML}
   <img src="${pokeData[i].picture}" class="poke-pu-pic" alt="Picture of ${pokeData[i].name}" />
   <div class="poke-pu-information-wrapper">
      <div class="poke-type-wrapper">
         <div class="${pokeData[i].maintype}PU poke-type">${pokeData[i].maintype}</div>
         ${
            pokeData[i].subtype
               ? `
         <div class="${pokeData[i].subtype}PU poke-type">${pokeData[i].subtype}</div>
         `
               : ""
         }
      </div>
      <div class="flavor-text">${pokeData[i].flavor_text}</div>
      <div class="chart-wrapper"><canvas id="myChart" class="custom-chart-size"></canvas></div>
   </div>
</div>
`;
}

function openCreditsHTML() {
   return `
    <h2>Thanks to <a class="api-link" target="_blank" href="https://pokeapi.co/">PokeAPI</a> for the data.</h2>
          <h2>
             Thanks to <a class="api-link" target="_blank" href="https://devonkong.tumblr.com/">devonkong</a> for the gif
             of the loading-screen.
          </h2>
          <div class="go-back" onclick="goBackToMainPage()">Back to Mainpage</div>
    `;
}
