// script.js (Sabit resimli versiyon)

const dealButton = document.getElementById("dealButton");
const cardContainer = document.getElementById("card-container");

dealButton.addEventListener("click", dealCards);

async function dealCards() {
  try {
    const response = await fetch("kartfutbolcu.txt");
    if (!response.ok) {
      throw new Error(
        "kartfutbolcu.txt dosyası bulunamadı! Klasörde olduğundan emin misiniz?"
      );
    }
    const text = await response.text();

    const allPlayers = text
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (allPlayers.length < 8) {
      alert("Lütfen kartfutbolcu.txt dosyasına en az 8 futbolcu ekleyin.");
      return;
    }

    const shuffledPlayers = shuffleArray(allPlayers);
    const selectedPlayers = shuffledPlayers.slice(0, 8);

    const goldIndexes = new Set();
    while (goldIndexes.size < 3) {
      const randomIndex = Math.floor(Math.random() * 8);
      goldIndexes.add(randomIndex);
    }

    cardContainer.innerHTML = "";

    // Sabit resmin yolu
    // Kendi resim dosyanızın adını ve yolunu buraya yazın.
    // Örneğin: './default-player.png' veya 'img/my-player.png'
    const fixedImageUrl = "../img/futbolcukart.png";

    selectedPlayers.forEach((player, index) => {
      const frameClass = goldIndexes.has(index) ? "gold-frame" : "";

      const cardHTML = `
                <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4">
                    <div class="player-card ${frameClass}">
                        <div class="card-frame">
                            <img src="${fixedImageUrl}" alt="${player}" class="player-image">
                            <h5 class="player-name">${player}</h5>
                        </div>
                    </div>
                </div>
            `;
      cardContainer.innerHTML += cardHTML;
    });
  } catch (error) {
    console.error("Hata:", error);
    cardContainer.innerHTML = `<div class="col-12"><p class="text-danger text-center">${error.message}</p></div>`;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
