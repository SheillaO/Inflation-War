# Inflation War 💸
 
**A gamified financial literacy simulator that teaches inflation resilience through head-to-head card battles; no financial knowledge required to play, but you'll have some by the end.**

<img width="1918" height="862" alt="Inflation War" src="https://github.com/user-attachments/assets/2a95a4ce-37f4-42f3-aa4c-9c4a5dcd8125" />


---

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://inflationwar.netlify.app/)
---
---
## The Problem
 
3.5 billion people globally have no access to meaningful financial education. In markets where inflation consistently runs above 10% — Nigeria, Argentina, Turkey, Kenya, Zimbabwe — households make savings and investment decisions in a vacuum. The consequences compound quietly: cash erodes, pensions underperform, and short-term survival instincts override long-term wealth building.
 
Existing financial literacy tools fail this audience in one of two ways: they assume prior knowledge (Investopedia), or they're so structurally dry that completion rates collapse (most NGO-funded e-learning). Neither is the tool someone opens twice.
 
A card game has no such barrier. You don't need to know what an index fund is to play. You learn what it is by losing to it.
 
---
## What It Does
 
Each simulation deals a shuffled 52-card deck. Every round draws two cards — one for the Economy, one for the Player. The card that ranks higher wins the round.
 
The core mechanic is unchanged from a standard game of War. What changes is the meaning of each card:
 
| Card | Financial Instrument | Inflation Resilience |
|------|---------------------|---------------------|
| 2 | 💵 Cash | Lowest — erodes fastest under inflation |
| 3 | 🏦 Savings Account | Marginally better than cash |
| 4 | 📜 Bonds | Fixed-rate instruments underperform during inflation |
| 5 | 👴 Pension Fund | Stable but slow |
| 6 | 📈 Index Fund | Market-linked growth |
| 7 | 🏠 Real Estate | Tangible asset, inflation-resistant |
| 8 | ⚡ Commodities | Strong inflation hedge |
| 9 | 💱 Foreign Currency | Protects against local currency devaluation |
| 10 | 🥇 Gold | Historical store of value |
| JACK | 📊 Equity | High-growth, high-volatility |
| QUEEN | ₿ Crypto | Maximum volatility |
| KING | 🎯 Diversified Portfolio | Broad resilience through distribution |
| ACE | 🛡️ Inflation Hedge | Highest — instruments designed for inflationary environments |
 
When your card ranks higher than the Economy's card, you preserved wealth that round. When the Economy's card wins, inflation ate it. When the deck runs out, the simulation delivers a verdict.
 
---

## Architecture
 
Three files. One external API. Zero dependencies.
 
```
inflation-war/
├── index.html    — structure and game UI
├── index.css     — layout and component styles
└── index.js      — state, data fetching, game logic, instrument mapping
```
 
This project is a deliberate demonstration of a core software principle: **separation of display from logic**. The game engine and the financial instrument layer are completely decoupled. The instrument mapping object is purely a UI concern — it never touches the comparison logic.
 
---
 
## Data Layer
 
Inflation War uses the [Deck of Cards API](https://apis.scrimba.com/deckofcards) via the Scrimba proxy — a REST endpoint that manages shuffled card decks as stateful server-side resources. Each deck is identified by a `deck_id` returned on initialisation, which is then passed as a path parameter on every subsequent draw request.
 
**Initialising a simulation:**
```js
fetch("https://apis.scrimba.com/deckofcards/api/deck/new/shuffle/")
    .then(res => res.json())
    .then(data => {
        deckId = data.deck_id           // store deck reference in state
        remainingText.textContent = `Remaining rounds: ${data.remaining}`
    })
```
 
**Drawing two cards per round:**
```js
fetch(`https://apis.scrimba.com/deckofcards/api/deck/${deckId}/draw/?count=2`)
```
 
The API manages deck state server-side. `data.remaining` decrements on every draw and hits `0` when the deck is exhausted — which triggers the final verdict. This removes the need for any client-side card tracking.
 
---
 
## Scoring Engine
 
The comparison logic uses a ranked string array and `indexOf` — O(n) lookup against a 13-element array:
 
```js
const valueOptions = ["2", "3", "4", "5", "6", "7", "8", "9",
    "10", "JACK", "QUEEN", "KING", "ACE"]
 
const card1ValueIndex = valueOptions.indexOf(card1.value)
const card2ValueIndex = valueOptions.indexOf(card2.value)
```
 
**This array is intentionally unchanged from the original card game.** The instrument ranking maps directly onto card rank — Cash (2) is the weakest inflation hedge, Inflation Hedge (ACE) is the strongest. No translation layer is needed between the API response and the scoring logic. The card value *is* the instrument rank.
 
---
 
## Display Layer — The Instrument Map
 
The `instrumentMap` object is a pure display concern. It is never referenced by the scoring engine. Its only job is to translate the card value that comes back from the API into a human-readable financial label:
 
```js
const instrumentMap = {
    "2":   { label: "Cash",           emoji: "💵" },
    "ACE": { label: "Inflation Hedge", emoji: "🛡️" },
    // ...
}
```

This is the architectural decision that makes 99% code reuse possible. The game mechanic and the financial education layer are two independent systems that happen to share the same data — `card.value` — as their bridge. Adding, removing, or relabelling instruments requires no changes to the scoring logic whatsoever.
 
---
 
## State Management
 
All application state is held in three variables at the module level:
 
```js
let deckId           // server-side deck reference
let computerScore    // economy wins
let myScore          // rounds where wealth was preserved
```
 
State is updated in two places only: `handleClick()` (reset on new simulation) and `determineCardWinner()` (increment on round result). The DOM is updated immediately after each state change — no batching, no diffing. For a two-player turn-based game, this is the correct level of complexity.
 
---
 
## Built With
 
- **HTML5** — semantic structure, accessible button states
- **CSS3** — flexbox layout, fixed viewport height distribution
- **Vanilla JavaScript** — Fetch API, Promise chaining, DOM manipulation, stateful API session management
- **[Deck of Cards API](https://apis.scrimba.com/deckofcards)** — shuffled deck lifecycle management
- **Zero dependencies** — no npm, no bundler, no framework
---
 
## What This Project Demonstrates
 
**Separation of concerns in practice**
The instrument map and the scoring engine share one data point (`card.value`) but are otherwise completely independent. This is the same principle that drives MVC architecture — model, view, and controller don't need to know how the others work.
 
**API session management**
The `deck_id` pattern — initialise a resource, receive an identifier, reference it on every subsequent request — is the same pattern used in authentication tokens, WebSocket connections, and stateful server-side sessions. Understanding it at this level transfers directly to more complex systems.
 
**State reset discipline**
New simulation resets scores, clears the DOM, re-enables the button, and resets the header — all before the API response arrives. This prevents stale UI from a previous session bleeding into a new one.
 
**Ranking by array index**
Using `indexOf` on a sorted string array for comparison is a pattern that appears in real systems — feature flag ordering, priority queues, and configuration-driven sort logic all use variations of this approach.
 
---
 
## Roadmap

Prioritized by effort-to-impact ratio — what's worth building next, and why.

### 🟢 Next Up (Low effort, high impact)

**Round History Log**
Currently, each round's result flashes in the header and disappears. A scrollable log turns single-round feedback into a visible pattern — exactly the kind of "see your behavior over time" insight that makes financial education stick.

```js
// Append after each round in determineCardWinner()
const roundLog = [];
roundLog.push({ 
  round: roundLog.length + 1, 
  winner: card1ValueIndex > card2ValueIndex ? "Economy" : "You",
  instrument1: instrumentMap[card1.value].label,
  instrument2: instrumentMap[card2.value].label
});
```
Render as a simple `<ul>` below the cards. No new API calls, no new state shape — just an array that grows.

---

**Win Probability Display**
The Deck of Cards API returns `remaining` on every draw. Since you know the full deck composition (4 of each value), you can calculate "how many high-value cards are left" and show a live odds indicator — e.g. *"68% of remaining cards rank below Index Fund."*

This is a pure-math feature: no new endpoints, just arithmetic on data you already have.

---

### 🟡 Worth Doing (Medium effort, strong differentiation)

**Difficulty Modes**
The API supports a `?cards=` parameter for partial decks. Pre-building a "recession deck" (weighted toward low-value cards) versus a "boom deck" (weighted high) lets you simulate different economic conditions — which ties directly back to the project's actual thesis instead of just being a difficulty slider.

**Localised Inflation Scenarios**
Swap `instrumentMap` labels based on a country selector (Nigeria, Argentina, Turkey, Kenya — the markets your README already calls out). Same `valueOptions` array, same scoring engine, different label set per country. This is the strongest "architecture flex" item on the list — it proves the separation-of-concerns design actually pays off when you extend it.

---

### 🔵 Later (Higher effort, nice-to-have)

**Instrument Detail Modal**
On card click, show a short explainer of why that instrument ranks where it does. Needs either static copy (easy) or a fetched description (more API work, less payoff at this stage).

---

### Why this order

The first two items use data you're *already fetching* — they're UI work, not new architecture. The localisation feature is the one I'd actually point to in an interview, because it's the cleanest proof that decoupling `instrumentMap` from the scoring engine wasn't just a tidy README claim — it's a real extension point.
 
## Run Locally
 
No install required.
 
```bash
git clone https://github.com/SheillaO/Inflation-War
cd inflation-war
open index.html
```
---

**Sheilla O.**  
Product-Minded Developer | Nairobi, Kenya 🇰🇪
 
Building at the intersection of social infrastructure, privacy, and developer tools.
 
💼 [LinkedIn](https://www.linkedin.com/in/sheillaolga/) • 🐙 [GitHub](https://github.com/SheillaO/Inflation-War)
 
---
 
*The card ranking — Cash at 2, Inflation Hedge at Ace — is not arbitrary. It reflects the actual hierarchy of inflation resilience as documented by the IMF and World Bank. The game teaches this hierarchy through repetition, not instruction.*
