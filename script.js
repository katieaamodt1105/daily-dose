const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtrBvEC-r_LLYnR22VehBBPs-AuWca4Ar8AF_zN89Wrg7WY_VyFy5QW8kfRsV-rNVxSF9KT7bAV0VW/pub?output=csv";

Papa.parse(SHEET_URL, {
  download: true,
  header: true,
  complete: function(results) {
    const data = results.data;

    const today = new Date();
    const todayMonth = today.getMonth();
    const todayDay = today.getDate();

    let todayRow = null;

    for (let row of data) {
      if (!row.date) continue;

      const rowDate = new Date(row.date);

      if (
        rowDate.getMonth() === todayMonth &&
        rowDate.getDate() === todayDay
      ) {
        todayRow = row;
        break;
      }
    }

    // Fallback if no date match
    if (!todayRow) {
      todayRow = data[todayDay % data.length];
    }

    document.getElementById("title").innerText = todayRow.title || "";
    document.getElementById("text").innerText = todayRow.text || "";

    const img = document.getElementById("image");
    if (todayRow.image && todayRow.image.trim() !== "") {
      img.src = todayRow.image;
      img.style.display = "block";
    } else {
      img.style.display = "none";
    }
  },
  error: function(err) {
    console.error(err);
    document.getElementById("title").innerText = "Error loading content";
    document.getElementById("text").innerText = "Please try again later.";
  }
});
