const generateMarketData = () => {
  const assets = [
    { symbol: 'BTC/USD', basePrice: 64000 },
    { symbol: 'ETH/USD', basePrice: 3400 },
    { symbol: 'AAPL', basePrice: 185 },
    { symbol: 'TSLA', basePrice: 170 },
  ];

  return assets.map(asset => {
    const volatility = (Math.random() - 0.5) * 0.02; // +/- 1%
    const currentPrice = asset.basePrice * (1 + volatility);
    return {
      symbol: asset.symbol,
      price: currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      change: (volatility * 100).toFixed(2) + '%',
      volume: (Math.random() * 2).toFixed(1) + 'B',
      status: volatility > 0 ? 'Bullish' : 'Bearish'
    };
  });
};

module.exports = { generateMarketData };
