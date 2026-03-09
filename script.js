const memoryThemes = [
  {
    title: "和 BBZ 的甜甜日常",
    text: "普通的一天，因为是和你一起，就会自动变成值得纪念的一天。"
  },
  {
    title: "小朋友今天也很可爱",
    text: "每次看到你的笑，我都会觉得这一年真的好值。"
  },
  {
    title: "我们一起去过的地方",
    text: "风景很好看，但因为你在旁边，回忆才会真正发光。"
  },
  {
    title: "想偷偷珍藏的瞬间",
    text: "有些画面舍不得删，因为每一张里都有我最偏爱的你。"
  },
  {
    title: "高热量约会记录",
    text: "一起吃了好多好吃的，也把喜欢一点点养得越来越胖乎乎。"
  },
  {
    title: "略略略，一周年啦",
    text: "这一页不只是相册，也是 zjy 想认真送给 ljz 的一份纪念。"
  }
];
const galleryShapes = ["wide", "tall", "", "", "wide", "", "tall", "", ""];
const totalPhotos = 34;
const photoMemories = Array.from({ length: totalPhotos }, (_, index) => {
  const imageNumber = String(index + 1).padStart(2, "0");
  const theme = memoryThemes[index % memoryThemes.length];

  return {
    ...theme,
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
  const width = 1600;
  const height = 1000;
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d");

  drawBackground(context, width, height);
  drawHearts(context);

  context.fillStyle = "rgba(255, 255, 255, 0.1)";
  context.fillRect(80, 90, width - 160, height - 180);

  context.strokeStyle = "rgba(255, 255, 255, 0.18)";
  context.lineWidth = 2;
  context.strokeRect(80, 90, width - 160, height - 180);

  context.fillStyle = "#f7d8a6";
  context.font = '600 28px "Noto Serif SC", serif';
  context.fillText("Words to Say", 140, 165);

  context.fillStyle = "#fff7fb";
  context.font = '700 88px "Cormorant Garamond", serif';
  context.fillText("zjy  ❤  ljz", 140, 270);

  context.fillStyle = "rgba(255, 247, 251, 0.8)";
  context.font = '500 34px "Noto Serif SC", serif';
  context.fillText("一周年快乐", 140, 330);

  context.fillStyle = "#fff0f7";
  context.font = '500 34px "Noto Serif SC", serif';
  const letterText = Array.from(letterBody.querySelectorAll("p"))
    .slice(0, 2)
    .map((item) => item.textContent.trim())
    .join("\n");

  const endY = wrapText(context, letterText, 140, 420, 830, 52);

  context.fillStyle = "#ffd5e6";
  context.font = '400 44px "Ma Shan Zheng", cursive';
  context.fillText("永远站在你这边的 zjy", 140, Math.min(endY + 70, 840));

  const quoteX = 1050;
  const quoteY = 270;
  const quoteWidth = 360;
  const quoteHeight = 480;
  const quoteGradient = context.createLinearGradient(quoteX, quoteY, quoteX + quoteWidth, quoteY + quoteHeight);
  quoteGradient.addColorStop(0, "rgba(255, 226, 237, 0.18)");
  quoteGradient.addColorStop(1, "rgba(255, 255, 255, 0.05)");
  context.fillStyle = quoteGradient;
  context.fillRect(quoteX, quoteY, quoteWidth, quoteHeight);

  context.strokeStyle = "rgba(255,255,255,0.18)";
  context.strokeRect(quoteX, quoteY, quoteWidth, quoteHeight);

  context.fillStyle = "#fff8fb";
  context.font = '700 44px "Cormorant Garamond", serif';
  context.fillText("Postcard", quoteX + 34, quoteY + 74);

  context.fillStyle = "rgba(255, 248, 251, 0.82)";
  context.font = '500 30px "Noto Serif SC", serif';
  wrapText(
    context,
    "以后不让老婆一个人看小水豚哭啦。\n老婆想我时候拍拍我，我就会飞奔过去拍拍你。",
    quoteX + 34,
    quoteY + 148,
    quoteWidth - 68,
    46
  );

  context.fillStyle = "#ffd3e3";
  context.font = '500 24px "Noto Serif SC", serif';
  context.fillText("Keep this love forever.", quoteX + 34, quoteY + quoteHeight - 54);

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "zjy-ljz-anniversary-postcard.png";
  link.click();
}

renderGallery();
downloadButton.addEventListener("click", downloadPostcard);
