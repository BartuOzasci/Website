// Gerekli HTML elementlerini seç
const dealButton = document.getElementById("dealButton");
const cardContainer = document.getElementById("card-container");

// Butona tıklama olayını dinle
dealButton.addEventListener("click", dealCards);

// Kartları dağıtma fonksiyonu
async function dealCards() {
  try {
    // kartfutbolcu.txt dosyasını fetch API ile oku
    const response = await fetch("kartfutbolcu.txt");
    if (!response.ok) {
      throw new Error("kartfutbolcu.txt dosyası bulunamadı!");
    }
    const text = await response.text();

    // Metni satırlara böl, boş satırları temizle
    const allPlayers = text
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);

    if (allPlayers.length < 8) {
      alert("Lütfen kartfutbolcu.txt dosyasına en az 8 futbolcu ekleyin.");
      return;
    }

    // Futbolcuları karıştır ve ilk 8 tanesini seç
    const shuffledPlayers = shuffleArray(allPlayers);
    const selectedPlayers = shuffledPlayers.slice(0, 8);

    // Altın çerçeve alacak 3 kartın rastgele indeksini belirle
    const goldIndexes = new Set();
    while (goldIndexes.size < 3) {
      const randomIndex = Math.floor(Math.random() * 8);
      goldIndexes.add(randomIndex);
    }

    // Kartları ekrana basmadan önce eski kartları temizle
    cardContainer.innerHTML = "";

    // Seçilen 8 futbolcu için kart oluştur
    selectedPlayers.forEach((player, index) => {
      const frameClass = goldIndexes.has(index) ? "gold-frame" : "";

      // Wikipedia'dan resim çekmek karmaşık bir API süreci gerektirir.
      // Bunun yerine, her futbolcu için bir arama terimi oluşturup placeholder kullanalım.
      // Gerçek bir projede Wikipedia API veya başka bir resim servisi kullanılabilir.
      const imageUrl = `https://source.unsplash.com/400x400/?${encodeURIComponent(
        player
      )}`;

      const cardHTML = `
                <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 mb-4">
                    <div class="player-card ${frameClass}">
                        <div class="card-frame">
                            <img src="${imageUrl}" alt="${player}" class="player-image">
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

// Bir diziyi karıştırmak için kullanılan yardımcı fonksiyon (Fisher-Yates algoritması)
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
