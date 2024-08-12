function checkScrollPosition() {
   let scrollPositionY = window.scrollY;
   let viewportHeight = window.innerHeight;
   let arrowUp = document.getElementById("arrowUp");
   if (scrollPositionY > viewportHeight / 2) {
      arrowUp.classList.remove("d-none");
   }
   if (scrollPositionY < viewportHeight / 2 && arrowUp) {
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
   if (event.target != suggestionsWrapper && event.target != userInputBar) {
      suggestionsWrapper.classList.add("d-none");
      clearUserInput();
   }
});

function clearUserInput() {
   let userInput = document.getElementById("userSearchInput");
   userInput.value = "";
}

document.addEventListener("DOMContentLoaded", function () {
   const children = suggestionsWrapper.getElementsByClassName("suggestion");
   let currentIndex = -1;

   document.addEventListener("keydown", function (event) {
      if (event.key === "ArrowDown") {
         if (currentIndex < children.length - 1) {
            currentIndex++;
            updateSelection();
         }
      } else if (event.key === "ArrowUp") {
         if (currentIndex > 0) {
            currentIndex--;
            updateSelection();
         }
      } else if (event.key === "Enter") {
         if (currentIndex >= 0 && currentIndex < children.length) {
            performAction(children[currentIndex]);
         }
      }
   });

   function updateSelection() {
      for (let i = 0; i < children.length; i++) {
         children[i].classList.remove("selected");
      }
      if (currentIndex >= 0) {
         children[currentIndex].classList.add("selected");
      }
   }

   function performAction(selectedElement) {
      alert("noch nicht implementiert :(");
   }
});
