document.addEventListener("DOMContentLoaded", function () {
  // Form elemanlarını seç
  const form = document.getElementById("investment-form");
  const annualGrowthRateSlider = document.getElementById("annual-growth-rate");
  const growthRateValueSpan = document.getElementById("growth-rate-value");
  const periodicInvestmentLabel = document.getElementById(
    "periodic-investment-label"
  );
  const frequencyRadios = document.querySelectorAll(
    'input[name="investment-frequency"]'
  );
  const resultsContainer = document.getElementById("results-container");
  const finalAmountP = document.getElementById("final-amount");

  // Yıllık artış oranı kaydırıcısını dinle ve değeri anlık güncelle
  annualGrowthRateSlider.addEventListener("input", function () {
    growthRateValueSpan.textContent = `${this.value}%`;
  });

  // Yatırım sıklığı radio butonlarını dinle ve etiketi değiştir
  frequencyRadios.forEach((radio) => {
    radio.addEventListener("change", function () {
      let labelText = "";
      switch (this.value) {
        case "weekly":
          labelText = "Haftalık Yatırım Miktarınız (₺)";
          break;
        case "monthly":
          labelText = "Aylık Yatırım Miktarınız (₺)";
          break;
        case "yearly":
          labelText = "Yıllık Yatırım Miktarınız (₺)";
          break;
      }
      periodicInvestmentLabel.innerHTML = `<i class="bi bi-cash-stack"></i> ${labelText}`;
    });
  });

  // Form gönderildiğinde hesaplama yap
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Sayfanın yeniden yüklenmesini engelle

    // Girdileri al ve sayıya çevir
    const initialSavings =
      parseFloat(document.getElementById("initial-savings").value) || 0;
    const periodicInvestment =
      parseFloat(document.getElementById("periodic-investment").value) || 0;
    const durationMonths = parseInt(
      document.getElementById("duration-months").value
    );
    const annualGrowthRate = parseFloat(annualGrowthRateSlider.value);
    const frequency = document.querySelector(
      'input[name="investment-frequency"]:checked'
    ).value;

    // Girdiler geçerli mi kontrol et
    if (isNaN(durationMonths) || durationMonths <= 0) {
      alert("Lütfen geçerli bir süre (ay) giriniz.");
      return;
    }

    // Hesaplama yap
    const finalBalance = calculateInvestment(
      initialSavings,
      periodicInvestment,
      durationMonths,
      annualGrowthRate,
      frequency
    );

    // Sonucu animasyonlu göster
    displayResults(finalBalance, initialSavings);

    // Para efektini başlat
    startMoneyAnimation();
  });

  function calculateInvestment(initial, periodic, months, annualRate, freq) {
    let total = initial;
    const monthlyRate = annualRate / 100 / 12;

    let monthlyInvestment = 0;
    switch (freq) {
      case "weekly":
        monthlyInvestment = periodic * 4.345; // Ortalama hafta sayısı
        break;
      case "monthly":
        monthlyInvestment = periodic;
        break;
      case "yearly":
        monthlyInvestment = periodic / 12;
        break;
    }

    for (let i = 0; i < months; i++) {
      // Ay başında periyodik yatırımı ekle
      total += monthlyInvestment;
      // Ay sonunda getiriyi ekle
      const monthlyGain = total * monthlyRate;
      total += monthlyGain;
    }

    return total;
  }

  function displayResults(finalValue, startValue) {
    resultsContainer.classList.remove("d-none");

    const duration = 1500; // Animasyon süresi (milisaniye)
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    const increment = (finalValue - startValue) / totalFrames;

    let currentAmount = startValue;
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      currentAmount += increment;

      if (frame >= totalFrames) {
        clearInterval(counter);
        currentAmount = finalValue; // Son değeri garantile
      }

      finalAmountP.textContent = formatCurrency(currentAmount);
    }, frameRate);

    // Sonuç kartına pürüzsüz kaydırma
    resultsContainer.scrollIntoView({ behavior: "smooth" });
  }

  function startMoneyAnimation() {
    const container = document.getElementById("money-animation-container");
    container.innerHTML = ""; // Eski ikonları temizle
    const iconCount = 30; // Ekranda görünecek ikon sayısı

    for (let i = 0; i < iconCount; i++) {
      const icon = document.createElement("i");
      icon.classList.add("bi", "bi-cash-coin", "money-icon");
      icon.style.left = `${Math.random() * 100}vw`;
      icon.style.animationDelay = `${Math.random() * 4}s`;
      icon.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
      container.appendChild(icon);
    }
  }

  // Sayıyı para formatına çevir
  function formatCurrency(amount) {
    return amount.toLocaleString("tr-TR", {
      style: "currency",
      currency: "TRY",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
});
