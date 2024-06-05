function checkScrollPosition() {
   let scrollPositionY = window.scrollY;
   let viewportHeight = window.innerHeight;
   let arrowUp = document.getElementById("arrowUp");
   if (scrollPositionY > viewportHeight / 2) {
      arrowUp.classList.remove("d-none");
   } else {
      arrowUp.classList.add("d-none");
   }
}

window.addEventListener("scroll", checkScrollPosition);
checkScrollPosition();

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

function openCredits() {
   creditsContainer = document.getElementById("creditsContainer");
   document.getElementById("footer").classList.add("d-none");
   contentContainer.classList.add("d-none");
   creditsContainer.classList.remove("d-none");
   creditsContainer.innerHTML = openCreditsHTML();
}

function goBackToMainPage() {
   creditsContainer = document.getElementById("creditsContainer");
   document.getElementById("footer").classList.remove("d-none");
   creditsContainer.innerHTML = "";
   creditsContainer.classList.add("d-none");
   contentContainer.classList.remove("d-none");
}

function formateFlavorText(flavorText) {
   flavorText = flavorText.replace(/[\n\f]/g, " ");
   return flavorText;
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

window.addEventListener("click", function (event) {
   if (event.target === popUpContainer) {
      document.body.classList.remove("unscrollable");
      contentContainer.classList.remove("blured");
      popUpContainer.classList.add("d-none");
   }
});

window.addEventListener("click", function (event) {
   if (event.target != suggestionsWrapper) {
      suggestionsWrapper.classList.add("d-none");
   }
});
