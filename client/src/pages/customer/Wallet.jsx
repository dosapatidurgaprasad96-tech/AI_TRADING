import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { DollarSign, TrendingUp, TrendingDown, Wallet as WalletIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getPortfolio, executeTrade as apiExecuteTrade, getMarketQuote } from '../../services/api';

export const Wallet = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Trade form state
  const [symbol, setSymbol] = useState('');
  const [quantity, setQuantity] = useState('');
  const [tradeType, setTradeType] = useState('BUY');
  const [tradeLoading, setTradeLoading] = useState(false);
  const [tradeMsg, setTradeMsg] = useState({ type: '', text: '' });

  // Quote state
  const [quote, setQuote] = useState(null);

  const fetchPortfolio = async () => {
    try {
      const data = await getPortfolio(user.token);
      setPortfolio(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) fetchPortfolio();
  }, [user]);

  const handleGetQuote = async () => {
    if (!symbol.trim()) return;
    try {
      const data = await getMarketQuote(user.token, symbol.trim().toUpperCase());
      setQuote(data);
    } catch (err) {
      setTradeMsg({ type: 'error', text: err.message });
    }
  };

  const handleTrade = async (e) => {
    e.preventDefault();
    setTradeMsg({ type: '', text: '' });

    if (!symbol.trim() || !quantity || Number(quantity) <= 0) {
      setTradeMsg({ type: 'error', text: 'Please enter a valid symbol and quantity.' });
      return;
    }

    const price = quote?.price || 100;

    setTradeLoading(true);
    try {
      await apiExecuteTrade(user.token, {
        symbol: symbol.trim().toUpperCase(),
        type: tradeType,
        quantity: Number(quantity),
        price,
      });
      setTradeMsg({ type: 'success', text: `${tradeType} order executed for ${quantity} ${symbol.toUpperCase()} @ $${price}` });
      setSymbol('');
      setQuantity('');
      setQuote(null);
      fetchPortfolio(); // Refresh
    } catch (err) {
      setTradeMsg({ type: 'error', text: err.message });
    } finally {
      setTradeLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 bg-red-50 text-red-600 rounded-lg dark:bg-red-900/20">{error}</div>;
  }

  const portfolioValue = portfolio?.assets?.reduce((sum, a) => sum + (a.quantity * a.averagePrice), 0) || 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wallet & Trading</h1>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-green-100 dark:border-green-900/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-sm text-gray-500">Cash Balance</p>
          </div>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            ${portfolio?.totalBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
          </p>
        </Card>
        <Card className="p-5 border-indigo-100 dark:border-indigo-900/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
              <TrendingUp className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="text-sm text-gray-500">Portfolio Value</p>
          </div>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            ${portfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </Card>
        <Card className="p-5 border-purple-100 dark:border-purple-900/30">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <WalletIcon className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-sm text-gray-500">Net Worth</p>
          </div>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            ${(portfolio?.totalBalance + portfolioValue).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </Card>
      </div>

      {/* Trade Panel */}
      <Card>
        <CardHeader>
          <CardTitle>Execute a Trade</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrade} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
              <div>
                <Input
                  label="Symbol"
                  placeholder="e.g. AAPL"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  label="Quantity"
                  type="number"
                  min="1"
                  placeholder="e.g. 10"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Type</label>
                <select
                  value={tradeType}
                  onChange={(e) => setTradeType(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:text-white"
                >
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>
              <div className="flex gap-2">
                <Button type="button" variant="ghost" className="h-11 px-4 border border-gray-200 dark:border-gray-700" onClick={handleGetQuote}>
                  Get Price
                </Button>
                <Button type="submit" className="h-11 px-6" disabled={tradeLoading}>
                  {tradeLoading ? '...' : tradeType}
                </Button>
              </div>
            </div>

            {quote && (
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm flex items-center gap-2">
                <Badge>{quote.symbol}</Badge>
                <span className="font-mono font-bold text-gray-900 dark:text-white">${quote.price?.toFixed(2)}</span>
                <span className={`text-xs ${quote.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {quote.change >= 0 ? '+' : ''}{quote.change?.toFixed(2)}
                </span>
              </div>
            )}

            {tradeMsg.text && (
              <div className={`p-3 rounded-lg text-sm ${tradeMsg.type === 'success' ? 'bg-green-50 text-green-600 dark:bg-green-900/20' : 'bg-red-50 text-red-600 dark:bg-red-900/20'}`}>
                {tradeMsg.text}
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle>My Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          {portfolio?.assets?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-500">Symbol</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-500">Qty</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-500">Avg Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-500">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {portfolio.assets.map((asset, i) => (
                    <tr key={i} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="py-3 px-4 font-semibold text-gray-900 dark:text-white">{asset.symbol}</td>
                      <td className="py-3 px-4 text-right text-gray-700 dark:text-gray-300">{asset.quantity}</td>
                      <td className="py-3 px-4 text-right font-mono text-gray-700 dark:text-gray-300">${asset.averagePrice?.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right font-mono font-semibold text-gray-900 dark:text-white">
                        ${(asset.quantity * asset.averagePrice).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No assets yet. Execute a BUY trade above to get started!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
