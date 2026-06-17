let deckId;
let computerScore = 0;
let myScore = 0;

const cardsContainer = document.getElementById("cards");
const newDeckBtn = document.getElementById("new-deck");
const drawCardBtn = document.getElementById("draw-cards");
const header = document.getElementById("header");
const remainingText = document.getElementById("remaining");
const computerScoreEl = document.getElementById("computer-score");
const myScoreEl = document.getElementById("my-score");

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

