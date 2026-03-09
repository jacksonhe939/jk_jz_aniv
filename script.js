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
  const width = 1200;
  const height = 1600;
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  drawBackground(context, width, height);
  drawHearts(context);

  context.fillStyle = "rgba(255, 255, 255, 0.08)";
  context.fillRect(70, 70, width - 140, height - 140);

  context.strokeStyle = "rgba(255, 255, 255, 0.18)";
  context.lineWidth = 2;
  context.strokeRect(70, 70, width - 140, height - 140);

  context.fillStyle = "#f7d8a6";
  context.font = '600 26px "Noto Serif SC", serif';
  context.fillText("Postcard for ljz", 120, 150);

  context.fillStyle = "#fff7fb";
  context.font = '700 84px "Cormorant Garamond", serif';
  context.fillText("zjy  ❤  ljz", 120, 265);

  context.fillStyle = "rgba(255, 247, 251, 0.8)";
  context.font = '500 32px "Noto Serif SC", serif';
  context.fillText("一周年快乐", 120, 325);

  const quoteX = 120;
  const quoteY = 390;
  const quoteWidth = width - 240;
  const quoteHeight = 760;
  const quoteGradient = context.createLinearGradient(
    quoteX,
    quoteY,
    quoteX + quoteWidth,
    quoteY + quoteHeight
  );
  quoteGradient.addColorStop(0, "rgba(255, 226, 237, 0.18)");
  quoteGradient.addColorStop(1, "rgba(255, 255, 255, 0.05)");
  context.fillStyle = quoteGradient;
  context.fillRect(quoteX, quoteY, quoteWidth, quoteHeight);

  context.strokeStyle = "rgba(255,255,255,0.18)";
  context.strokeRect(quoteX, quoteY, quoteWidth, quoteHeight);

  context.fillStyle = "#fff8fb";
  context.font = '700 52px "Cormorant Garamond", serif';
  context.fillText("Words to Say", quoteX + 48, quoteY + 92);

  context.fillStyle = "rgba(255, 248, 251, 0.82)";
  context.font = '500 36px "Noto Serif SC", serif';
  let textY = wrapText(
    context,
    "以后不让老婆一个人看小水豚哭啦。\n老婆想我时候拍拍我，\n我就会飞奔过去拍拍你。",
    quoteX + 48,
    quoteY + 170,
    quoteWidth - 96,
    58
  );

  context.fillStyle = "#ffd3e3";
  context.font = '400 56px "Ma Shan Zheng", cursive';
  textY += 36;
  context.fillText("永远站在你这边的 zjy", quoteX + 48, Math.min(textY, 1080));

  context.fillStyle = "#fff4f8";
  context.font = '500 28px "Noto Serif SC", serif';
  context.fillText("Keep this love forever.", quoteX + 48, quoteY + quoteHeight - 56);

  context.fillStyle = "rgba(255, 214, 233, 0.95)";
  context.font = '400 78px "Ma Shan Zheng", cursive';
  context.fillText("给 BBZ 的纪念明信片", 120, 1330);

  context.fillStyle = "rgba(255, 247, 251, 0.82)";
  context.font = '500 30px "Noto Serif SC", serif';
  wrapText(
    context,
    "快点击存起来吧\n把这一年的偏爱和回忆都留下来。",
    120,
    1410,
    width - 240,
    48
  );

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "zjy-ljz-anniversary-postcard.png";
  link.click();
}

renderGallery();
downloadButton.addEventListener("click", downloadPostcard);
