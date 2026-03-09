const galleryTitle = "和 BBZ 的甜甜日常";
const galleryText = "普通的一天，因为是和你一起，就会自动变成值得纪念的一天。";
const galleryShapes = ["wide", "tall", "", "", "wide", "", "tall", "", ""];
const totalPhotos = 34;
const photoMemories = Array.from({ length: totalPhotos }, (_, index) => {
  const imageNumber = String(index + 1).padStart(2, "0");

  return {
    title: galleryTitle,
    text: galleryText,
    image: `assets/photos/photo-${imageNumber}.jpg`,
    shape: galleryShapes[index % galleryShapes.length]
  };
});

const galleryGrid = document.getElementById("galleryGrid");
const downloadButton = document.getElementById("downloadPostcard");
const letterBody = document.getElementById("letterBody");

function createFallbackMarkup(title, text) {
  return `
    <div class="gallery-fallback" aria-hidden="true">
      <div class="fallback-inner">
        <strong>${title}</strong>
        <p>${text}</p>
      </div>
    </div>
  `;
}

function createImageMarkup(memory) {
  return `
    <img
      src="${memory.image}"
      alt="${memory.title}"
      loading="lazy"
      data-title="${memory.title}"
      data-text="${memory.text}"
    />
  `;
}

function renderGallery() {
  galleryGrid.innerHTML = photoMemories
    .map((memory) => {
      const shapeClass = memory.shape ? ` ${memory.shape}` : "";

      return `
        <article class="gallery-card${shapeClass}">
          ${createImageMarkup(memory)}
          <div class="gallery-overlay">
            <h3>${memory.title}</h3>
            <p>${memory.text}</p>
          </div>
        </article>
      `;
    })
    .join("");

  galleryGrid.querySelectorAll("img").forEach((image) => {
    image.addEventListener("error", () => {
      image.outerHTML = createFallbackMarkup(image.dataset.title, image.dataset.text);
    });
  });
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
  const paragraphs = text.split("\n").filter(Boolean);
  let currentY = y;

  paragraphs.forEach((paragraph) => {
    const chars = [...paragraph];
    let line = "";

    chars.forEach((char) => {
      const testLine = line + char;

      if (context.measureText(testLine).width > maxWidth && line) {
        context.fillText(line, x, currentY);
        line = char;
        currentY += lineHeight;
      } else {
        line = testLine;
      }
    });

    if (line) {
      context.fillText(line, x, currentY);
      currentY += lineHeight;
    }

    currentY += lineHeight * 0.5;
  });

  return currentY;
}

function drawRoundedRect(context, x, y, width, height, radius) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawBackground(context, width, height) {
  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#2a1235");
  gradient.addColorStop(0.45, "#4d1f53");
  gradient.addColorStop(1, "#170d25");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  const glowLeft = context.createRadialGradient(260, 220, 10, 260, 220, 260);
  glowLeft.addColorStop(0, "rgba(255, 153, 199, 0.48)");
  glowLeft.addColorStop(1, "rgba(255, 153, 199, 0)");
  context.fillStyle = glowLeft;
  context.fillRect(0, 0, width, height);

  const glowRight = context.createRadialGradient(width - 220, 160, 20, width - 220, 160, 240);
  glowRight.addColorStop(0, "rgba(255, 215, 166, 0.38)");
  glowRight.addColorStop(1, "rgba(255, 215, 166, 0)");
  context.fillStyle = glowRight;
  context.fillRect(0, 0, width, height);

  for (let index = 0; index < 46; index += 1) {
    const x = ((index * 139) % width) + 20;
    const y = ((index * 89) % height) + 18;
    const size = index % 4 === 0 ? 4 : 2;

    context.fillStyle = `rgba(255,255,255,${index % 4 === 0 ? 0.85 : 0.45})`;
    context.beginPath();
    context.arc(x, y, size, 0, Math.PI * 2);
    context.fill();
  }
}

function drawHearts(context) {
  const hearts = [
    { x: 1310, y: 180, size: 28, color: "rgba(255, 158, 198, 0.8)" },
    { x: 1370, y: 235, size: 16, color: "rgba(255, 219, 163, 0.76)" },
    { x: 250, y: 800, size: 22, color: "rgba(226, 199, 255, 0.76)" }
  ];

  hearts.forEach((heart) => {
    context.save();
    context.translate(heart.x, heart.y);
    context.rotate(Math.PI / 4);
    context.fillStyle = heart.color;
    context.fillRect(-heart.size / 2, -heart.size / 2, heart.size, heart.size);
    context.beginPath();
    context.arc(0, -heart.size / 2, heart.size / 2, 0, Math.PI * 2);
    context.arc(-heart.size / 2, 0, heart.size / 2, 0, Math.PI * 2);
    context.fill();
    context.restore();
  });
}

function downloadPostcard() {
  const canvas = document.createElement("canvas");
  const width = 1600;
  const height = 2200;
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  drawBackground(context, width, height);
  drawHearts(context);

  const paperX = 70;
  const paperY = 90;
  const paperWidth = width - 140;
  const paperHeight = height - 180;

  drawRoundedRect(context, paperX, paperY, paperWidth, paperHeight, 42);
  context.fillStyle = "rgba(255, 248, 243, 0.96)";
  context.fill();
  context.strokeStyle = "rgba(188, 155, 166, 0.35)";
  context.lineWidth = 3;
  context.stroke();

  context.save();
  context.globalAlpha = 0.16;
  for (let y = paperY + 190; y < paperY + paperHeight - 180; y += 118) {
    context.strokeStyle = "#cdb6bf";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(paperX + 58, y);
    context.lineTo(paperX + paperWidth - 58, y);
    context.stroke();
  }
  context.restore();

  context.save();
  context.translate(paperX + paperWidth - 150, paperY + 92);
  context.rotate(0.08);
  drawRoundedRect(context, -58, -38, 116, 76, 22);
  context.fillStyle = "rgba(255, 250, 248, 0.8)";
  context.fill();
  context.strokeStyle = "rgba(173, 109, 132, 0.25)";
  context.lineWidth = 2;
  context.stroke();
  context.fillStyle = "#ad5f82";
  context.font = '600 28px "Cormorant Garamond", serif';
  context.fillText("For ljz", -24, 10);
  context.restore();

  context.fillStyle = "#5c4551";
  context.font = '600 30px "Noto Serif SC", serif';
  context.fillText("纪念日快乐 · Our 1st Anniversary", paperX + 70, paperY + 110);

  context.fillStyle = "#503741";
  context.font = '700 68px "Cormorant Garamond", "Noto Serif SC", serif';
  context.fillText("To BBZ（宝贝洲）：", paperX + 70, paperY + 220);

  const fullLetter = Array.from(letterBody.querySelectorAll("p"))
    .map((item) => item.textContent.trim())
    .join("\n");

  context.fillStyle = "#6a525d";
  context.font = '500 33px "Noto Serif SC", serif';
  const finalY = wrapText(
    context,
    fullLetter,
    paperX + 70,
    paperY + 330,
    paperWidth - 140,
    70
  );

  context.fillStyle = "#3d2530";
  context.font = '400 72px "Ma Shan Zheng", cursive';
  context.fillText(
    "From 聪明阳，也就是 zjy",
    paperX + paperWidth - 630,
    Math.min(finalY + 80, paperY + paperHeight - 110)
  );

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "zjy-ljz-anniversary-postcard.png";
  link.click();
}

renderGallery();
downloadButton.addEventListener("click", downloadPostcard);
