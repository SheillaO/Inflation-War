// ─── State (identical to original) ───────────────────────────────────────────
let deckId;
let computerScore = 0;
let myScore = 0;

// ─── DOM references (identical to original) ───────────────────────────────────
const cardsContainer = document.getElementById("cards");
const newDeckBtn = document.getElementById("new-deck");
const drawCardBtn = document.getElementById("draw-cards");
const header = document.getElementById("header");
const remainingText = document.getElementById("remaining");
const computerScoreEl = document.getElementById("computer-score");
const myScoreEl = document.getElementById("my-score");

// ─── New: instrument map ──────────────────────────────────────────────────────
// Maps each playing card value to a financial instrument — display layer only.
// The valueOptions array in determineCardWinner stays IDENTICAL so indexOf
// comparisons are never affected. This object purely drives the label overlay.

const instrumentMap = {
  2: { label: "Cash", emoji: "💵" },
  3: { label: "Savings Account", emoji: "🏦" },
  4: { label: "Bonds", emoji: "📜" },
  5: { label: "Pension Fund", emoji: "👴" },
  6: { label: "Index Fund", emoji: "📈" },
  7: { label: "Real Estate", emoji: "🏠" },
  8: { label: "Commodities", emoji: "⚡" },
  9: { label: "Foreign Currency", emoji: "💱" },
  10: { label: "Gold", emoji: "🥇" },
  JACK: { label: "Equity", emoji: "📊" },
  QUEEN: { label: "Crypto", emoji: "₿" },
  KING: { label: "Diversified Portfolio", emoji: "🎯" },
  ACE: { label: "Inflation Hedge", emoji: "🛡️" },
};

// ─── New simulation (extended from original handleClick) ─────────────────────
// Added: score reset, card clear, button re-enable on new simulation
// Fetch call identical to original

function handleClick() {
  fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
    .then((res) => res.json())
    .then((data) => {
      remainingText.textContent = `Remaining rounds: ${data.remaining}`;
      deckId = data.deck_id;

      // Reset scores and UI for fresh simulation
      computerScore = 0;
      myScore = 0;
      computerScoreEl.textContent = "Economy: 0";
      myScoreEl.textContent = "Wealth Preserved: 0";
      header.textContent = "Inflation War";
      drawCardBtn.disabled = false;
      cardsContainer.children[0].innerHTML = "";
      cardsContainer.children[1].innerHTML = "";
    });
}

newDeckBtn.addEventListener("click", handleClick);

// ─── Draw cards (identical fetch and logic, updated render + strings) ─────────
drawCardBtn.addEventListener("click", () => {
  fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
    .then((res) => res.json())
    .then((data) => {
      remainingText.textContent = `Remaining rounds: ${data.remaining}`;

      // Look up instrument for each card — does not affect card.value
      const instrument0 = instrumentMap[data.cards[0].value];
      const instrument1 = instrumentMap[data.cards[1].value];

      // Identical innerHTML pattern — image stays, label is the only addition
      cardsContainer.children[0].innerHTML = `
                <img src=${data.cards[0].image} class="card" />
                <span class="instrument-label">${instrument0.emoji} ${instrument0.label}</span>
            `;
      cardsContainer.children[1].innerHTML = `
                <img src=${data.cards[1].image} class="card" />
                <span class="instrument-label">${instrument1.emoji} ${instrument1.label}</span>
            `;

      // Identical call to determineCardWinner
      const winnerText = determineCardWinner(data.cards[0], data.cards[1]);
      header.textContent = winnerText;

      // Identical end-state check — only strings updated
      if (data.remaining === 0) {
        drawCardBtn.disabled = true;
        if (computerScore > myScore) {
          header.textContent = "💸 The economy outpaced you. Inflation won.";
        } else if (myScore > computerScore) {
          header.textContent = "🛡️ You beat inflation! Wealth preserved.";
        } else {
          header.textContent = "⚖️ You broke even — inflation drew.";
        }
      }
    });
});

// ─── Determine winner (identical logic — valueOptions unchanged) ──────────────
// valueOptions MUST stay as original card values — indexOf depends on them.
// Only the return strings and score label text are updated.

function determineCardWinner(card1, card2) {
  const valueOptions = [
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "JACK",
    "QUEEN",
    "KING",
    "ACE",
  ];

  const card1ValueIndex = valueOptions.indexOf(card1.value);
  const card2ValueIndex = valueOptions.indexOf(card2.value);

  if (card1ValueIndex > card2ValueIndex) {
    computerScore++;
    computerScoreEl.textContent = `Economy: ${computerScore}`;
    return "📉 Economy wins this round!";
  } else if (card1ValueIndex < card2ValueIndex) {
    myScore++;
    myScoreEl.textContent = `Wealth Preserved: ${myScore}`;
    return "💰 Wealth preserved this round!";
  } else {
    return "⚖️ Inflation stalemate!";
  }
}
