/* ─────────────────────────────────────────────────────────────────
   TRADING PIT — Easter Egg Game
───────────────────────────────────────────────────────────────── */

class TradingPit {
  constructor() {
    this.modal = document.getElementById('trading-pit-modal');
    this.closeBtn = document.querySelector('.trading-pit-close');
    this.overlay = document.querySelector('.trading-pit-overlay');
    this.playAgainBtn = document.getElementById('pit-play-again');

    this.gameActive = false;
    this.timeRemaining = 90;
    this.cash = 10000;
    this.portfolio = {};
    this.holdings = {};
    this.initialCash = 10000;

    this.stocks = [
      { symbol: 'CHIP', name: 'ChipsCo', price: 42, volatility: 0.08 },
      { symbol: 'MINT', name: 'MintHealth', price: 58, volatility: 0.06 },
      { symbol: 'BOLT', name: 'BoltAI', price: 120, volatility: 0.12 },
      { symbol: 'SYNC', name: 'SyncData', price: 75, volatility: 0.07 },
      { symbol: 'WAVE', name: 'WaveCloud', price: 31, volatility: 0.10 }
    ];

    this.newsEvents = [
      '📈 Bull rally incoming!',
      '📉 Market correction brewing...',
      '⚡ Flash crash detected!',
      '🔥 Momentum surge!',
      '❄️ Cold market freeze',
      '🎯 Volatility spike!'
    ];

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.closeBtn.addEventListener('click', () => this.close());
    this.overlay.addEventListener('click', () => this.close());
    this.playAgainBtn.addEventListener('click', () => this.startGame());
  }

  open() {
    this.modal.classList.remove('trading-pit-hidden');
    document.body.style.overflow = 'hidden';
    this.startGame();
  }

  close() {
    this.modal.classList.add('trading-pit-hidden');
    document.body.style.overflow = '';
    this.gameActive = false;
  }

  startGame() {
    this.gameActive = true;
    this.timeRemaining = 90;
    this.cash = this.initialCash;
    this.portfolio = {};
    this.holdings = {};

    // Reset stocks
    this.stocks.forEach(stock => {
      stock.price = stock.basePrice || stock.price;
    });

    document.getElementById('pit-game-over').classList.add('trading-pit-hidden');

    this.render();
    this.startTimer();
    this.startPriceUpdates();
    this.startNewsEvents();
  }

  startTimer() {
    const timerInterval = setInterval(() => {
      this.timeRemaining--;
      document.getElementById('pit-timer').textContent = this.timeRemaining;

      if (this.timeRemaining <= 0) {
        clearInterval(timerInterval);
        this.endGame();
      }
    }, 1000);
  }

  startPriceUpdates() {
    this.priceInterval = setInterval(() => {
      if (!this.gameActive) return;

      this.stocks.forEach(stock => {
        const change = (Math.random() - 0.48) * stock.volatility * stock.price;
        stock.price = Math.max(1, stock.price + change);
      });

      this.render();
    }, 500);
  }

  startNewsEvents() {
    this.newsInterval = setInterval(() => {
      if (!this.gameActive) return;

      const event = this.newsEvents[Math.floor(Math.random() * this.newsEvents.length)];
      const strength = Math.random();

      this.stocks.forEach(stock => {
        const eventMagnitude = (strength - 0.5) * stock.volatility * stock.price * 2;
        stock.price = Math.max(1, stock.price + eventMagnitude);
      });

      this.showNews(event);
      this.render();
    }, 15000 + Math.random() * 10000);
  }

  showNews(message) {
    const newsEl = document.getElementById('pit-news');
    newsEl.textContent = message;
    newsEl.style.opacity = '1';

    setTimeout(() => {
      newsEl.style.opacity = '0';
    }, 3000);
  }

  buy(symbol, amount) {
    const stock = this.stocks.find(s => s.symbol === symbol);
    if (!stock) return;

    const cost = stock.price * amount;
    if (cost > this.cash) return;

    this.cash -= cost;
    this.holdings[symbol] = (this.holdings[symbol] || 0) + amount;
    this.render();
  }

  sell(symbol, amount) {
    if (!this.holdings[symbol] || this.holdings[symbol] < amount) return;

    const stock = this.stocks.find(s => s.symbol === symbol);
    const proceeds = stock.price * amount;

    this.cash += proceeds;
    this.holdings[symbol] -= amount;
    if (this.holdings[symbol] === 0) delete this.holdings[symbol];

    this.render();
  }

  getPortfolioValue() {
    let value = 0;
    Object.keys(this.holdings).forEach(symbol => {
      const stock = this.stocks.find(s => s.symbol === symbol);
      value += stock.price * this.holdings[symbol];
    });
    return value;
  }

  getTotalValue() {
    return this.cash + this.getPortfolioValue();
  }

  render() {
    document.getElementById('pit-cash').textContent = `$${Math.round(this.cash).toLocaleString()}`;
    document.getElementById('pit-portfolio').textContent = `$${Math.round(this.getPortfolioValue()).toLocaleString()}`;
    document.getElementById('pit-total').textContent = `$${Math.round(this.getTotalValue()).toLocaleString()}`;

    const stocksContainer = document.getElementById('pit-stocks');
    stocksContainer.innerHTML = '';

    this.stocks.forEach(stock => {
      const holding = this.holdings[stock.symbol] || 0;
      const holdingValue = holding * stock.price;

      const el = document.createElement('div');
      el.className = 'trading-pit-stock';
      el.innerHTML = `
        <div class="stock-header">
          <div class="stock-info">
            <span class="symbol">${stock.symbol}</span>
            <span class="name">${stock.name}</span>
          </div>
          <span class="price">$${stock.price.toFixed(2)}</span>
        </div>
        <div class="stock-holding">
          ${holding > 0 ? `<span class="holding-label">${holding} @ $${(holdingValue).toFixed(0)}</span>` : ''}
        </div>
        <div class="stock-controls">
          <button class="stock-btn buy" data-symbol="${stock.symbol}">Buy</button>
          <button class="stock-btn sell" data-symbol="${stock.symbol}" ${holding === 0 ? 'disabled' : ''}>Sell</button>
        </div>
      `;

      el.querySelector('.buy').addEventListener('click', () => this.buy(stock.symbol, 1));
      el.querySelector('.sell').addEventListener('click', () => this.sell(stock.symbol, 1));

      stocksContainer.appendChild(el);
    });
  }

  endGame() {
    this.gameActive = false;
    clearInterval(this.priceInterval);
    clearInterval(this.newsInterval);

    const finalValue = this.getTotalValue();
    const gain = finalValue - this.initialCash;

    document.getElementById('pit-final-score').textContent = `$${Math.round(finalValue).toLocaleString()}`;

    const gameOverEl = document.getElementById('pit-game-over');
    gameOverEl.classList.remove('trading-pit-hidden');

    if (gain > 0) {
      gameOverEl.querySelector('h3').textContent = `PROFIT! +$${Math.round(gain).toLocaleString()}`;
    } else if (gain < 0) {
      gameOverEl.querySelector('h3').textContent = `LOSS: -$${Math.round(Math.abs(gain)).toLocaleString()}`;
    } else {
      gameOverEl.querySelector('h3').textContent = 'BREAK EVEN';
    }
  }
}

// Initialize game
const tradingPit = new TradingPit();

// Hook up logo click to open game
document.addEventListener('DOMContentLoaded', () => {
  const navLogo = document.querySelector('.nav-logo');
  if (navLogo) {
    navLogo.addEventListener('click', (e) => {
      if (e.ctrlKey || e.metaKey) return; // Allow normal nav
      e.preventDefault();
      tradingPit.open();
    });
  }
});
