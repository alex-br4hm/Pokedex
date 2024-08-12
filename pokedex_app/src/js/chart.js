function renderChart(i, ctx) {
   new Chart(ctx, {
      type: "bar",
      data: {
         labels: ["Attack", "Defense", "Special Attack", "Special Defense", "Speed"],
         datasets: [
            {
               data: [
                  pokeData[i].attack,
                  pokeData[i].defense,
                  pokeData[i].special_attack,
                  pokeData[i].special_defense,
                  pokeData[i].speed,
               ],
               backgroundColor: [
                  "rgba(255, 59, 59, 0.9)", // Rot für Attack
                  "rgba(59, 99, 255, 0.9)", // Blau für Defense
                  "rgba(255, 159, 64, 0.9)", // Orange für Special Attack
                  "rgba(153, 102, 255, 0.9)", // Lila für Special Defense
                  "rgba(75, 192, 192, 0.9)", // Türkis für Speed
               ],
               borderColor: ["white"],
               borderWidth: 1,
            },
         ],
      },
      options: {
         indexAxis: "y", // Horizontale Balken
         scales: {
            x: {
               // x-Achse, weil der Chart um 90 Grad gedreht ist
               beginAtZero: true,
               min: 0,
               minmax: 120,

               grid: {
                  display: true, // Raster ausblenden
               },
               border: {
                  display: false, // Achsenlinien ausblenden
               },
            },
            y: {
               grid: {
                  display: true, // Raster ausblenden
               },
               border: {
                  display: false, // Achsenlinien ausblenden
               },
            },
         },
         plugins: {
            legend: {
               display: false, // Legende ausblenden
            },
            datalabels: {
               color: "white", // Farbe der Datenlabels
               align: "center", // Textausrichtung
               anchor: "center", // Verankerung in der Mitte
               formatter: function (value) {
                  return value;
               },
            },
         },
         responsive: true,
         maintainAspectRatio: false, // Behalte das Verhältnis nicht bei, damit es die ganze Breite einnimmt
      },
   });
   return;
}
