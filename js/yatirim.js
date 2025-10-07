document.addEventListener("DOMContentLoaded", () => {
  const initialAmount = document.getElementById("initialAmount");
  const regularAmount = document.getElementById("regularAmount");
  const period = document.getElementById("period");
  const interest = document.getElementById("interest");
  const interestValue = document.getElementById("interestValue");
  const calculateBtn = document.getElementById("calculateBtn");
  const resultText = document.getElementById("resultText");
  const progressBar = document.getElementById("progressBar");
  const periodLabel = document.getElementById("periodLabel");

  const summaryDiv = document.getElementById("summary");
  const totalInvestedP = document.getElementById("totalInvested");
  const totalProfitP = document.getElementById("totalProfit");
  const finalAmountP = document.getElementById("finalAmount");

  const chartCanvas = document.getElementById("investmentChart");

  const radios = document.querySelectorAll('input[name="frequency"]');

  radios.forEach((radio) => {
    radio.addEventListener("change", () => {
      if (radio.checked) {
        switch (radio.value) {
          case "weekly":
            periodLabel.textContent = "Hafta";
            break;
          case "monthly":
            periodLabel.textContent = "Ay";
            break;
          case "yearly":
            periodLabel.textContent = "Yıl";
            break;
        }
      }
    });
  });

  interest.addEventListener("input", () => {
    interestValue.textContent = `${interest.value}%`;
  });

  let investmentChart = new Chart(chartCanvas, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Birikim",
          data: [],
          borderColor: "rgb(34,197,94)",
          backgroundColor: "rgba(34,197,94,0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 3,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (v) => "₺" + v.toLocaleString() },
        },
      },
    },
  });

  calculateBtn.addEventListener("click", () => {
    const P = parseFloat(initialAmount.value) || 0;
    const R = parseFloat(regularAmount.value) || 0;
    const N = parseInt(period.value) || 0;
    const yearlyInterest = parseFloat(interest.value) / 100;

    const frequency = document.querySelector(
      'input[name="frequency"]:checked'
    ).value;
    let periodsPerYear;

    switch (frequency) {
      case "weekly":
        periodsPerYear = 52;
        break;
      case "monthly":
        periodsPerYear = 12;
        break;
      case "yearly":
        periodsPerYear = 1;
        break;
    }

    const interestPerPeriod = yearlyInterest / periodsPerYear;

    // Progress bar animasyonu
    resultText.textContent = "Hesaplanıyor...";
    resultText.classList.remove("show");
    progressBar.style.width = "0%";
    summaryDiv.classList.remove("show");
    chartCanvas.classList.remove("show");

    let progress = 0;
    const interval = setInterval(() => {
      if (progress >= 100) {
        clearInterval(interval);

        // Hesaplama ve veri toplama
        let total = P;
        let labels = [];
        let dataPoints = [];

        for (let i = 1; i <= N; i++) {
          total += R;
          total += total * interestPerPeriod;
          labels.push(i);
          dataPoints.push(Math.round(total));
        }

        const totalInvested = P + R * N;
        const totalProfit = total - totalInvested;

        // Sonuç yazdır
        resultText.textContent = `${N} ${periodLabel.textContent.toLowerCase()} sonra tahmini birikiminiz: ₺${total.toLocaleString()}`;
        resultText.classList.add("show");

        totalInvestedP.textContent = `Toplam Yatırılan Miktar: ₺${totalInvested.toLocaleString()}`;
        totalProfitP.textContent = `Toplam Kazanç: ₺${totalProfit.toLocaleString()}`;
        finalAmountP.textContent = `Net Birikim: ₺${total.toLocaleString()}`;
        summaryDiv.classList.add("show");

        // Grafik güncelle
        investmentChart.data.labels = labels;
        investmentChart.data.datasets[0].data = dataPoints;
        investmentChart.update();
        chartCanvas.classList.add("show");
      } else {
        progress += 4;
        progressBar.style.width = `${progress}%`;
      }
    }, 40);
  });
});
