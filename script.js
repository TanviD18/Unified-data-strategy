const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

const stars = [];
const STAR_COUNT = 70;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function seedStars() {
  stars.length = 0;
  for (let i = 0; i < STAR_COUNT; i += 1) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.25,
      a: Math.random() * 0.45 + 0.12,
      drift: Math.random() * 0.08 + 0.015,
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const star of stars) {
    star.y += star.drift;
    if (star.y > canvas.height + 2) {
      star.y = -2;
      star.x = Math.random() * canvas.width;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(230, 240, 255, ${star.a})`;
    ctx.fill();
  }

  requestAnimationFrame(drawStars);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  seedStars();
});

resizeCanvas();
seedStars();
drawStars();

// ── Diagram Tooltips ──
function wireDiagramTooltips(diagramId, tooltipId) {
  const diagram = document.getElementById(diagramId);
  const tooltip = document.getElementById(tooltipId);
  if (!diagram || !tooltip) {
    return;
  }

  const nodes = diagram.querySelectorAll(".system-node");

  function moveTooltip(event) {
    const bounds = diagram.getBoundingClientRect();
    const left = event.clientX - bounds.left + 14;
    const top = event.clientY - bounds.top + 14;
    tooltip.style.left = `${left}px`;
    tooltip.style.top = `${top}px`;
  }

  nodes.forEach((node) => {
    node.addEventListener("mouseenter", (event) => {
      const title = node.dataset.system;
      const description = node.dataset.description;
      tooltip.textContent = `${title}: ${description}`;
      tooltip.classList.add("show");
      moveTooltip(event);
    });

    node.addEventListener("mousemove", moveTooltip);

    node.addEventListener("mouseleave", () => {
      tooltip.classList.remove("show");
    });
  });
}

wireDiagramTooltips("current-diagram", "diagram-tooltip");
wireDiagramTooltips("proposed-diagram", "proposed-tooltip");

// ── Priority Board ──
const board = document.getElementById("priority-board");
let draggedCard = null;

function updateRanks() {
  const cards = board.querySelectorAll(".priority-card");
  cards.forEach((card, idx) => {
    card.querySelector(".priority-rank").textContent = String(idx + 1);
    card.classList.toggle("top-priority", idx === 0);

    const upBtn = card.querySelector(".move-up");
    const downBtn = card.querySelector(".move-down");
    if (upBtn) {
      upBtn.disabled = idx === 0;
    }
    if (downBtn) {
      downBtn.disabled = idx === cards.length - 1;
    }
  });
}

board.querySelectorAll(".priority-card").forEach((card) => {
  card.addEventListener("dragstart", () => {
    draggedCard = card;
    card.classList.add("dragging");
  });

  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    draggedCard = null;
    updateRanks();
  });

  card.addEventListener("dragover", (event) => {
    event.preventDefault();
  });

  card.addEventListener("drop", (event) => {
    event.preventDefault();
    if (!draggedCard || draggedCard === card) {
      return;
    }

    const cards = Array.from(board.querySelectorAll(".priority-card"));
    const draggedIndex = cards.indexOf(draggedCard);
    const targetIndex = cards.indexOf(card);

    if (draggedIndex < targetIndex) {
      board.insertBefore(draggedCard, card.nextSibling);
    } else {
      board.insertBefore(draggedCard, card);
    }

    updateRanks();
  });

  const upBtn = card.querySelector(".move-up");
  const downBtn = card.querySelector(".move-down");

  if (upBtn) {
    upBtn.addEventListener("click", () => {
      const previous = card.previousElementSibling;
      if (previous) {
        board.insertBefore(card, previous);
        updateRanks();
      }
    });
  }

  if (downBtn) {
    downBtn.addEventListener("click", () => {
      const next = card.nextElementSibling;
      if (next) {
        board.insertBefore(next, card);
        updateRanks();
      }
    });
  }
});

updateRanks();

// ── Help Needed Yes/No interaction ──
const btnYes = document.getElementById("btn-yes");
const btnNo = document.getElementById("btn-no");
const helpResponse = document.getElementById("help-response");

function clearSelection() {
  btnYes.classList.remove("selected");
  btnNo.classList.remove("selected");
  helpResponse.textContent = "";
}

btnYes.addEventListener("click", () => {
  clearSelection();
  btnYes.classList.add("selected");
  helpResponse.textContent = "Great — unified data flow is the foundation of this proposal.";
});

btnNo.addEventListener("click", () => {
  clearSelection();
  btnNo.classList.add("selected");
  helpResponse.textContent = "Understood — happy to discuss further and align on the right path forward.";
});

