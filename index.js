
let deckId;
let computerScore = 0;
let myScore = 0;
let roundHistory = [];


const cardsContainer = document.getElementById("cards");
const newDeckBtn = document.getElementById("new-deck");
const drawCardBtn = document.getElementById("draw-cards");
const header = document.getElementById("header");
const remainingText = document.getElementById("remaining");
const computerScoreEl = document.getElementById("computer-score");
const myScoreEl = document.getElementById("my-score");
const historyLog = document.getElementById("history-log"); 


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

      computerScore = 0;
      myScore = 0;
      roundHistory = []; 
      historyLog.innerHTML = ""; 
      computerScoreEl.textContent = "Economy: 0";
      myScoreEl.textContent = "Wealth Preserved: 0";
      header.textContent = "Inflation War";
      drawCardBtn.disabled = false;
      cardsContainer.children[0].innerHTML = "";
      cardsContainer.children[1].innerHTML = "";
    });
}

newDeckBtn.addEventListener("click", handleClick);


drawCardBtn.addEventListener("click", () => {
  
  if (!deckId) {
    header.textContent = "⚠️ Start a New Simulation first!";
    return;
  }

  fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
    .then((res) => res.json())
    .then((data) => {
      remainingText.textContent = `Remaining rounds: ${data.remaining}`;

      const instrument0 = instrumentMap[data.cards[0].value];
      const instrument1 = instrumentMap[data.cards[1].value];

      cardsContainer.children[0].innerHTML = `
                <img src=${data.cards[0].image} class="card" />
                <span class="instrument-label">${instrument0.emoji} ${instrument0.label}</span>
            `;
      cardsContainer.children[1].innerHTML = `
                <img src=${data.cards[1].image} class="card" />
                <span class="instrument-label">${instrument1.emoji} ${instrument1.label}</span>
            `;

      const winnerText = determineCardWinner(data.cards[0], data.cards[1]);
      header.textContent = winnerText;

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

  let resultText;

  if (card1ValueIndex > card2ValueIndex) {
    computerScore++;
    computerScoreEl.textContent = `Economy: ${computerScore}`;
    resultText = "📉 Economy wins this round!";
  } else if (card1ValueIndex < card2ValueIndex) {
    myScore++;
    myScoreEl.textContent = `Wealth Preserved: ${myScore}`;
    resultText = "💰 Wealth preserved this round!";
  } else {
    resultText = "⚖️ Inflation stalemate!";
  }


  roundHistory.push(resultText);
  addHistoryItem(resultText);

  return resultText;
}

// NEW: adds one line to the history list on screen
function addHistoryItem(text) {
  const listItem = document.createElement("li");
  listItem.textContent = `Round ${roundHistory.length}: ${text}`;
  historyLog.appendChild(listItem);
}
