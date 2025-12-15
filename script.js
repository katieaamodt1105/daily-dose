const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtrBvEC-r_LLYnR22VehBBPs-AuWca4Ar8AF_zN89Wrg7WY_VyFy5QW8kfRsV-rNVxSF9KT7bAV0VW/pub?output=csv";

fetch(SHEET_URL)
  .then(res => res.text())
  .then(csv => {
    const rows = csv.split("\n").map(r => r.split(","));
    const headers = rows[0].map(h => h.trim().toLowerCase());
    const data = rows.slice(1);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dateIndex = headers.indexOf("date");
    const titleIndex = headers.indexOf("title");
    const textIndex = headers.indexOf("text");
    const imageIndex = headers.indexOf("image");

    let todayRow = null;

    for (let row of data) {
      const rowDate = new Date(row[dateIndex]);
      rowDate.setHours(0, 0, 0, 0);

      if (rowDate.getTime() === today.getTime()) {
        todayRow = row;
        break;
      }
    }

    // Fallback: rotate by day if exact date not found
    if (!todayRow) {
      const dayIndex = today.getDate() % data.length;
      todayRow = data[dayIndex];
    }

    document.getElementById("title").innerText =
      todayRow[titleIndex] || "";

    document.getElementById("text").innerText =
      todayRow[textIndex] || "";

    const img = document.getElementById("image");
    const imgUrl = todayRow[imageIndex];

    if (imgUrl && imgUrl.trim() !== "") {
      img.src = imgUrl;
      img.style.display = "block";
    } else {
      img.style.display = "none";
    }
  })
  .catch(err => {
    document.getElementById("title").innerText = "Oops!";
    document.getElementById("text").innerText =
      "Couldn’t load today’s content.";
    console.error(err);
  });
