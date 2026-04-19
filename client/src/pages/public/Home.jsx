import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { ArrowUpRight, Activity, TrendingUp, DollarSign, Shield, Zap, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { checkAPIStatus } from '../../services/api';

export const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [apiOnline, setApiOnline] = useState(null);

  const [liveTrades, setLiveTrades] = useState([
    { id: 1, pair: 'BTC/USD', amount: '0.45', type: 'Buy', time: 'Just now' },
    { id: 2, pair: 'ETH/USD', amount: '12.4', type: 'Sell', time: '1m ago' },
    { id: 3, pair: 'SOL/USD', amount: '145.0', type: 'Buy', time: '3m ago' }
  ]);
  
  const [livePrice, setLivePrice] = useState(65430.50);

  // Check backend health on mount
  useEffect(() => {
    checkAPIStatus()
      .then(() => setApiOnline(true))
      .catch(() => setApiOnline(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() * 10) - 5;
      setLivePrice(prev => prev + change);

      if (Math.random() > 0.6) {
        const pairs = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'BNB/USD', 'AAPL', 'TSLA'];
        const types = ['Buy', 'Sell'];
        const amount = (Math.random() * 5).toFixed(2);
        const newTrade = {
          id: Date.now(),
          pair: pairs[Math.floor(Math.random() * pairs.length)],
          amount: amount,
          type: types[Math.floor(Math.random() * types.length)],
          time: 'Just now'
        };
        
        setLiveTrades(prev => {
          const updated = [newTrade, ...prev];
          return updated.slice(0, 5);
        });
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="text-center py-16 px-4">
        <div className="flex justify-center mb-4">
          {apiOnline !== null && (
            <Badge variant={apiOnline ? 'success' : 'danger'} className="px-3 py-1 text-xs">
              {apiOnline ? '● Backend Connected' : '○ Backend Offline'}
            </Badge>
          )}
        </div>
        <Badge variant="brand" className="mb-6 px-4 py-1 text-sm bg-indigo-100 text-indigo-700">AI-Powered Trading Platform</Badge>
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">
          Trade Smarter, Not Harder
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
          The first trading platform with an embedded AI that automatically pairs you with elite industry traders based exactly on your risk tolerance.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          {user ? (
            <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-lg shadow-indigo-500/30" onClick={() => navigate('/customer')}>
              Go to Dashboard <ArrowUpRight className="ml-2 w-5 h-5"/>
            </Button>
          ) : (
            <>
              <Button size="lg" className="h-14 px-8 text-lg font-bold shadow-lg shadow-indigo-500/30" onClick={() => navigate('/register')}>Start Trading Now <ArrowUpRight className="ml-2 w-5 h-5"/></Button>
              <Button variant="ghost" size="lg" className="h-14 px-8 text-lg font-semibold bg-white border border-gray-200 dark:bg-gray-900 dark:border-gray-800 shadow-sm" onClick={() => navigate('/login')}>Sign In to Dashboard</Button>
            </>
          )}
        </div>
      </section>

      {/* Stats Row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Card className="text-center p-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 dark:bg-green-900/20 mb-3">
            <DollarSign className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">$100K</p>
          <p className="text-sm text-gray-500 mt-1">Paper Trading Balance</p>
        </Card>
        <Card className="text-center p-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20 mb-3">
            <BarChart3 className="w-6 h-6 text-indigo-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">7+</p>
          <p className="text-sm text-gray-500 mt-1">API Endpoints</p>
        </Card>
        <Card className="text-center p-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-900/20 mb-3">
            <Zap className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">AI</p>
          <p className="text-sm text-gray-500 mt-1">Powered Advice (Free)</p>
        </Card>
      </section>

      {/* Real-time Widget Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <Card className="border-indigo-100 dark:border-indigo-900/40 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              Live Market Simulation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <DollarSign className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bitcoin (BTC) Mock</p>
                <div className="text-3xl font-mono font-bold text-gray-900 dark:text-white transition-colors duration-500">
                  ${livePrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            
            <div className="space-y-3 relative z-10">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Network Trades</p>
              {liveTrades.map(trade => (
                <div key={trade.id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800/80 border border-gray-100 dark:border-gray-700/50 shadow-sm transition-all duration-300">
                  <div className="flex items-center gap-3">
                    <Badge variant={trade.type === 'Buy' ? 'success' : 'danger'} className="w-12 justify-center">{trade.type}</Badge>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{trade.pair}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">{trade.amount}</div>
                    <div className="text-xs text-gray-400">{trade.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col justify-center space-y-8 pl-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Full-Stack AI Trading</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Register to get a paper trading account with $100K. Execute BUY/SELL trades, track your portfolio in real-time, and get AI-powered trading advice — all backed by a secure Express + MongoDB API.
          </p>
          <ul className="space-y-6 pt-2">
            <li className="flex gap-4">
               <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl h-fit">
                 <TrendingUp className="w-6 h-6 text-indigo-500" />
               </div>
               <div>
                 <strong className="block text-gray-900 dark:text-white text-lg">Live Portfolio Tracking</strong> 
                 <span className="text-gray-600 dark:text-gray-400 mt-1 block">Your wallet, assets, and trade history are stored securely in MongoDB.</span>
               </div>
            </li>
            <li className="flex gap-4">
               <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl h-fit">
                 <Shield className="w-6 h-6 text-indigo-500" />
               </div>
               <div>
                 <strong className="block text-gray-900 dark:text-white text-lg">Secure JWT Authentication</strong> 
                 <span className="text-gray-600 dark:text-gray-400 mt-1 block">Encrypted passwords, token-based sessions, and input validation on every request.</span>
               </div>
            </li>
            <li className="flex gap-4">
               <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl h-fit">
                 <Activity className="w-6 h-6 text-indigo-500" />
               </div>
               <div>
                 <strong className="block text-gray-900 dark:text-white text-lg">AI Trading Advice</strong> 
                 <span className="text-gray-600 dark:text-gray-400 mt-1 block">Get free AI-powered trade insights via OpenRouter's Gemini Flash model.</span>
               </div>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};
