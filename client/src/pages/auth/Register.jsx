import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UserPlus, ChevronRight, ChevronLeft, ShieldCheck, Brain, Wallet, Activity, Target, MessageSquare } from 'lucide-react';

export const Register = () => {
  const [role, setRole] = useState('Customer');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    country: '',
    // Customer Specifics
    monthlyIncome: '',
    investment: '',
    netWorth: '',
    sourceOfFunds: '',
    riskTolerance: 'Medium',
    maxLoss: '10',
    investmentGoal: 'Wealth Growth',
    preferredMarkets: [],
    tradingStyle: 'Long-term Investing',
    experienceLevel: 'Beginner',
    pastExperience: 'No',
    aiAssistanceLevel: 'AI-Assisted',
    aiInterest: 'Yes',
    traderSelection: 'Auto-Assign Trader (AI-Based)',
    commMode: 'Chat',
    commLanguage: 'English',
    availability: '',
    lossReaction: 'Hold Investment',
    profitReaction: 'Let Profits Run',
    timeHorizon: 'Medium-term (6–24 months)',
    liquidityNeeds: 'No',
    emergencyFunds: 'Yes',
    diversification: 'Moderate',
    preferredSectors: [],
    avoidSectors: '',
    recoveryExpectation: 'Medium-Term Recovery (Months)',
    automationComfort: 'AI-Assisted Decisions',
    interactionLevel: 'Medium',
    allocationGoal: 'Wealth Accumulation'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const current = prev[field] || [];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const validateStep = () => {
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.phone) {
        setError('Please fill in all basic fields');
        return false;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return false;
      }
    }
    setError('');
    return true;
  };

  const handleNext = () => {
    if (validateStep()) nextStep();
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');

    if (role === 'Customer' && step < 5) {
        if (validateStep()) nextStep();
        return;
    }

    setIsLoading(true);

    try {
      const payload = { ...formData, role };
      await register(payload);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="w-full">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">Select Role</label>
              <select 
                value={role} 
                onChange={(e) => { setRole(e.target.value); setStep(1); }}
                className="flex h-11 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:text-white transition-shadow"
              >
                <option value="Admin">Admin</option>
                <option value="Employee">Employee (Trader)</option>
                <option value="Customer">Customer</option>
              </select>
            </div>
            <Input
              label="Full Name"
              name="name"
              placeholder="e.g. Michael Jordan"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              placeholder="michael@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Mobile Number"
              name="phone"
              type="tel"
              placeholder="+91 9876543210"
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
            <Input
              label="Country / Region"
              name="country"
              placeholder="e.g. India"
              value={formData.country}
              onChange={handleInputChange}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              placeholder="Minimum 6 characters"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
        );
      
      case 2: // Customer Only: Financial & Risk
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Monthly Income Range"
                    name="monthlyIncome"
                    placeholder="e.g. $5000 - $10000"
                    value={formData.monthlyIncome}
                    onChange={handleInputChange}
                />
                <Input
                    label="Initial Investment ($)"
                    name="investment"
                    type="number"
                    placeholder="e.g. 1000"
                    value={formData.investment}
                    onChange={handleInputChange}
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                    label="Net Worth Range"
                    name="netWorth"
                    placeholder="e.g. $50k - $100k"
                    value={formData.netWorth}
                    onChange={handleInputChange}
                />
                <Input
                    label="Source of Funds"
                    name="sourceOfFunds"
                    placeholder="e.g. Savings, Salary"
                    value={formData.sourceOfFunds}
                    onChange={handleInputChange}
                />
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-indigo-600 mb-4 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> Risk Profile</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Risk Tolerance</label>
                        <select name="riskTolerance" value={formData.riskTolerance} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm dark:text-white">
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>
                    <Input
                        label="Max Acceptable Loss (%)"
                        name="maxLoss"
                        type="number"
                        value={formData.maxLoss}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
          </div>
        );

      case 3: // Customer Only: Preferences & Experience
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Preferred Markets</label>
                <div className="grid grid-cols-2 gap-2">
                    {['Stocks', 'Crypto', 'Forex', 'Commodities'].map(m => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => handleCheckboxChange('preferredMarkets', m)}
                            className={`p-3 rounded-xl border text-sm font-medium transition-all ${formData.preferredMarkets.includes(m) ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-transparent border-gray-200 dark:border-gray-800 text-gray-500'}`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Trading Style</label>
                    <select name="tradingStyle" value={formData.tradingStyle} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm dark:text-white">
                        <option value="Short-term (Day Trading)">Short-term (Day Trading)</option>
                        <option value="Swing Trading">Swing Trading</option>
                        <option value="Long-term Investing">Long-term Investing</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Experience Level</label>
                    <select name="experienceLevel" value={formData.experienceLevel} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm dark:text-white">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                    </select>
                </div>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-indigo-600 mb-4 flex items-center gap-2"><Brain className="w-4 h-4"/> AI Personalization</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">AI Assistance Level</label>
                        <select name="aiAssistanceLevel" value={formData.aiAssistanceLevel} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm dark:text-white">
                            <option value="Fully Automated">Fully Automated</option>
                            <option value="AI-Assisted">AI-Assisted</option>
                            <option value="Manual Control">Manual Control</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Trader Selection</label>
                        <select name="traderSelection" value={formData.traderSelection} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm dark:text-white">
                            <option value="Auto-Assign Trader (AI-Based)">Auto-Assign (AI)</option>
                            <option value="Choose Trader Manually">Manual Selection</option>
                            <option value="Hybrid (AI Suggests)">Hybrid Mode</option>
                        </select>
                    </div>
                </div>
            </div>
          </div>
        );

      case 4: // Customer Only: Behavioral & Strategy
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Reaction to Loss</label>
                    <select name="lossReaction" value={formData.lossReaction} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm dark:text-white">
                        <option value="Sell Immediately">Sell Immediately</option>
                        <option value="Hold Investment">Hold Investment</option>
                        <option value="Invest More">Invest More</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Reaction to Profit</label>
                    <select name="profitReaction" value={formData.profitReaction} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm dark:text-white">
                        <option value="Book Profit Early">Book Profit Early</option>
                        <option value="Let Profits Run">Let Profits Run</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Investment Horizon</label>
                    <select name="timeHorizon" value={formData.timeHorizon} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm dark:text-white">
                        <option value="Short-term (0–6 months)">Short-term (0–6m)</option>
                        <option value="Medium-term (6–24 months)">Medium-term (6-24m)</option>
                        <option value="Long-term (2+ years)">Long-term (2+ years)</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Diversification</label>
                    <select name="diversification" value={formData.diversification} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm dark:text-white">
                        <option value="Conservative">Conservative</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Highly Diversified">Highly Diversified</option>
                    </select>
                </div>
            </div>
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                <h3 className="text-sm font-bold text-indigo-600 mb-4 flex items-center gap-2"><Target className="w-4 h-4"/> Goals & Allocation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Allocation Goal</label>
                        <select name="allocationGoal" value={formData.allocationGoal} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm dark:text-white">
                            <option value="Retirement Planning">Retirement</option>
                            <option value="Short-Term Gains">Short-Term Gains</option>
                            <option value="Wealth Accumulation">Wealth Accumulation</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Interaction Level</label>
                        <select name="interactionLevel" value={formData.interactionLevel} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm dark:text-white">
                            <option value="High (Frequent)">High (Frequent)</option>
                            <option value="Medium">Medium</option>
                            <option value="Low (Hands-Off)">Low (Hands-Off)</option>
                        </select>
                    </div>
                </div>
            </div>
          </div>
        );

      case 5: // Customer Only: Communication & Sectors
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Preferred Sectors</label>
                <div className="grid grid-cols-3 gap-2">
                    {['Tech', 'Health', 'Energy', 'Finance', 'AI', 'Green'].map(s => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => handleCheckboxChange('preferredSectors', s)}
                            className={`p-2 rounded-lg border text-xs font-bold transition-all ${formData.preferredSectors.includes(s) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-transparent border-gray-200 dark:border-gray-800 text-gray-500'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Comm. Mode</label>
                    <select name="commMode" value={formData.commMode} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm dark:text-white">
                        <option value="Chat">Chat</option>
                        <option value="Email">Email</option>
                        <option value="Notifications">Notifications</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Language</label>
                    <select name="commLanguage" value={formData.commLanguage} onChange={handleInputChange} className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 text-sm dark:text-white">
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Spanish">Spanish</option>
                    </select>
                </div>
            </div>
            <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex gap-3">
                    <Activity className="w-5 h-5 text-indigo-600 shrink-0 mt-1" />
                    <div>
                        <h4 className="text-xs font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-widest mb-1">Final Consistency Check</h4>
                        <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-medium">Our AI is validating your risk-to-reward parameters. High-risk profiles with low loss tolerance will be flagged for trader review.</p>
                    </div>
                </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-gray-50 dark:bg-gray-950 transition-colors">
      <Card className="max-w-2xl w-full space-y-8 p-6 lg:p-10 border-indigo-100 dark:border-indigo-900/50 relative overflow-hidden shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-gray-900/80">
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
        
        <div className="text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20 transform rotate-3 hover:rotate-0 transition-transform">
            <UserPlus className="h-10 w-10 text-white" />
          </div>
          <h2 className="mt-6 text-4xl font-black text-gray-900 dark:text-white tracking-tighter uppercase">Create Account</h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">
            Step {step} {role === 'Customer' ? 'of 5' : ''} · Joining as {role}
          </p>
          
          {role === 'Customer' && (
            <div className="flex gap-1 justify-center mt-6">
                {[1,2,3,4,5].map(i => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${step >= i ? 'w-8 bg-indigo-600' : 'w-3 bg-gray-200 dark:bg-gray-800'}`} />
                ))}
            </div>
          )}
        </div>
        
        {error && <div className="p-4 bg-red-50 text-red-700 rounded-2xl text-xs font-bold border border-red-100 dark:bg-red-900/20 dark:border-red-900/50 flex items-center gap-2"><Activity className="w-4 h-4"/> {error}</div>}
        {success && <div className="p-4 bg-green-50 text-green-700 rounded-2xl text-xs font-bold border border-green-100 dark:bg-green-900/20 dark:border-green-900/50 flex items-center gap-2"><ShieldCheck className="w-4 h-4"/> {success}</div>}

        <form className="mt-8 space-y-8" onSubmit={handleRegister}>
          {renderStep()}

          <div className="flex gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            {step > 1 && (
                <Button 
                    type="button" 
                    variant="secondary"
                    className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-xs"
                    onClick={prevStep}
                >
                    <ChevronLeft className="w-5 h-5 mr-2" /> Back
                </Button>
            )}
            
            <Button 
                type="submit" 
                className={`flex-[2] h-14 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-500/20 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : (
                    role === 'Customer' && step < 5 ? (
                        <span className="flex items-center gap-2">Continue <ChevronRight className="w-5 h-5" /></span>
                    ) : 'Finalize Registration'
                )}
            </Button>
          </div>

          <p className="text-center text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mt-6">
            Already have an account? <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">Sign in here</Link>
          </p>
        </form>
      </Card>
    </div>
  );
};
