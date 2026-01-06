'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  Calculator,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Download
} from 'lucide-react';
import Link from 'next/link';

interface FinancialInputs {
  ideaName: string;
  tam: number; // in millions
  initialPrice: number;
  monthlyChurn: number; // percentage
  cac: number;
  year1Customers: number;
  growthRate: number; // percentage YoY
  grossMargin: number; // percentage
  monthlyBurn: number;
  teamSize: number;
}

interface YearlyProjection {
  year: number;
  customers: number;
  revenue: number;
  cogs: number;
  grossProfit: number;
  operatingExpenses: number;
  netIncome: number;
  cashFlow: number;
  ltv: number;
  cacPayback: number;
}

function FinancialContent() {
  const searchParams = useSearchParams();
  const ideaFromUrl = searchParams.get('idea') || '';
  const tamFromUrl = searchParams.get('tam') || '';

  const parseTam = (tam: string): number => {
    const match = tam.match(/[\d.]+/);
    if (!match) return 100;
    const num = parseFloat(match[0]);
    if (tam.toLowerCase().includes('b')) return num * 1000;
    return num;
  };

  const [inputs, setInputs] = useState<FinancialInputs>({
    ideaName: ideaFromUrl,
    tam: parseTam(tamFromUrl),
    initialPrice: 99,
    monthlyChurn: 3,
    cac: 150,
    year1Customers: 100,
    growthRate: 150,
    grossMargin: 80,
    monthlyBurn: 15000,
    teamSize: 3,
  });

  const [projections, setProjections] = useState<YearlyProjection[]>([]);

  // Calculate projections
  useEffect(() => {
    const years: YearlyProjection[] = [];
    let cumulativeCashFlow = 0;

    for (let year = 1; year <= 3; year++) {
      const growthMultiplier = year === 1 ? 1 : Math.pow(1 + inputs.growthRate / 100, year - 1);
      const customers = Math.round(inputs.year1Customers * growthMultiplier);
      
      // Account for churn (simplified annual)
      const retainedCustomers = customers * Math.pow(1 - inputs.monthlyChurn / 100, 12);
      const avgCustomers = (customers + retainedCustomers) / 2;
      
      const revenue = avgCustomers * inputs.initialPrice * 12;
      const cogs = revenue * (1 - inputs.grossMargin / 100);
      const grossProfit = revenue - cogs;
      
      // Operating expenses grow with team
      const teamGrowth = year === 1 ? 1 : 1 + (year - 1) * 0.5;
      const monthlyOpex = inputs.monthlyBurn * teamGrowth;
      const operatingExpenses = monthlyOpex * 12 + (customers - (year === 1 ? 0 : years[year - 2].customers)) * inputs.cac;
      
      const netIncome = grossProfit - operatingExpenses;
      cumulativeCashFlow += netIncome;
      
      // LTV calculation
      const monthlyRevenue = inputs.initialPrice;
      const churnRate = inputs.monthlyChurn / 100;
      const ltv = churnRate > 0 ? (monthlyRevenue * inputs.grossMargin / 100) / churnRate : monthlyRevenue * 36;
      
      // CAC Payback (months)
      const monthlyGrossProfit = (inputs.initialPrice * inputs.grossMargin / 100);
      const cacPayback = monthlyGrossProfit > 0 ? inputs.cac / monthlyGrossProfit : 999;

      years.push({
        year,
        customers: Math.round(avgCustomers),
        revenue: Math.round(revenue),
        cogs: Math.round(cogs),
        grossProfit: Math.round(grossProfit),
        operatingExpenses: Math.round(operatingExpenses),
        netIncome: Math.round(netIncome),
        cashFlow: Math.round(cumulativeCashFlow),
        ltv: Math.round(ltv),
        cacPayback: Math.round(cacPayback * 10) / 10,
      });
    }

    setProjections(years);
  }, [inputs]);

  const formatCurrency = (value: number): string => {
    if (Math.abs(value) >= 1000000) {
      return `€${(value / 1000000).toFixed(1)}M`;
    }
    if (Math.abs(value) >= 1000) {
      return `€${(value / 1000).toFixed(0)}K`;
    }
    return `€${value.toFixed(0)}`;
  };

  const updateInput = (key: keyof FinancialInputs, value: number | string) => {
    setInputs({ ...inputs, [key]: value });
  };

  // Key metrics
  const year3 = projections[2];
  const ltvCacRatio = year3 ? (year3.ltv / inputs.cac) : 0;
  const breakEvenYear = projections.findIndex(p => p.netIncome > 0) + 1 || 'Mai';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border-subtle bg-surface-elevated sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <Link 
            href="/"
            className="flex items-center gap-1 md:gap-2 text-text-muted hover:text-text-primary transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Torna all'Analyst</span>
          </Link>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
              <Calculator className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold text-text-primary">Financial Model</h1>
              <p className="text-xs text-text-muted hidden sm:block">Proiezioni P&L a 3 anni</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Inputs Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-4"
          >
            <div className="bg-surface-elevated rounded-2xl border border-border-subtle p-4 md:p-6">
              <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-accent-purple" />
                Parametri
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-text-muted mb-1">Nome Idea</label>
                  <input
                    type="text"
                    value={inputs.ideaName}
                    onChange={(e) => updateInput('ideaName', e.target.value)}
                    className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-purple"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-muted mb-1">TAM (€M)</label>
                    <input
                      type="number"
                      value={inputs.tam}
                      onChange={(e) => updateInput('tam', parseFloat(e.target.value) || 0)}
                      className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Prezzo/mese (€)</label>
                    <input
                      type="number"
                      value={inputs.initialPrice}
                      onChange={(e) => updateInput('initialPrice', parseFloat(e.target.value) || 0)}
                      className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-purple"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Clienti Anno 1</label>
                    <input
                      type="number"
                      value={inputs.year1Customers}
                      onChange={(e) => updateInput('year1Customers', parseInt(e.target.value) || 0)}
                      className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Crescita YoY (%)</label>
                    <input
                      type="number"
                      value={inputs.growthRate}
                      onChange={(e) => updateInput('growthRate', parseFloat(e.target.value) || 0)}
                      className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-purple"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-muted mb-1">CAC (€)</label>
                    <input
                      type="number"
                      value={inputs.cac}
                      onChange={(e) => updateInput('cac', parseFloat(e.target.value) || 0)}
                      className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Churn/mese (%)</label>
                    <input
                      type="number"
                      value={inputs.monthlyChurn}
                      onChange={(e) => updateInput('monthlyChurn', parseFloat(e.target.value) || 0)}
                      className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-purple"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Gross Margin (%)</label>
                    <input
                      type="number"
                      value={inputs.grossMargin}
                      onChange={(e) => updateInput('grossMargin', parseFloat(e.target.value) || 0)}
                      className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-purple"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted mb-1">Burn/mese (€)</label>
                    <input
                      type="number"
                      value={inputs.monthlyBurn}
                      onChange={(e) => updateInput('monthlyBurn', parseFloat(e.target.value) || 0)}
                      className="w-full bg-background border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-purple"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="bg-surface-elevated rounded-2xl border border-border-subtle p-4 md:p-6">
              <h2 className="text-lg font-bold text-text-primary mb-4">📊 Metriche Chiave</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-background rounded-lg">
                  <span className="text-sm text-text-muted">LTV/CAC Ratio</span>
                  <span className={`font-bold ${ltvCacRatio >= 3 ? 'text-green-400' : ltvCacRatio >= 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {ltvCacRatio.toFixed(1)}x
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-background rounded-lg">
                  <span className="text-sm text-text-muted">CAC Payback</span>
                  <span className={`font-bold ${year3 && year3.cacPayback <= 12 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {year3?.cacPayback || 0} mesi
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-background rounded-lg">
                  <span className="text-sm text-text-muted">Break-even</span>
                  <span className={`font-bold ${breakEvenYear !== 'Mai' ? 'text-green-400' : 'text-red-400'}`}>
                    Anno {breakEvenYear}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 bg-background rounded-lg">
                  <span className="text-sm text-text-muted">LTV</span>
                  <span className="font-bold text-accent-green">{formatCurrency(year3?.ltv || 0)}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* P&L Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-surface-elevated rounded-2xl border border-border-subtle overflow-hidden">
              <div className="p-4 md:p-6 border-b border-border-subtle flex items-center justify-between">
                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-accent-green" />
                  P&L Projection - {inputs.ideaName || 'La tua idea'}
                </h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-background">
                      <th className="text-left p-3 text-xs font-medium text-text-muted">Voce</th>
                      {projections.map((p) => (
                        <th key={p.year} className="text-right p-3 text-xs font-medium text-text-muted">
                          Anno {p.year}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    <tr>
                      <td className="p-3 text-sm text-text-primary flex items-center gap-2">
                        <Users className="w-4 h-4 text-accent-purple" />
                        Clienti
                      </td>
                      {projections.map((p) => (
                        <td key={p.year} className="p-3 text-sm text-right font-medium text-text-primary">
                          {p.customers.toLocaleString()}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-background/50">
                      <td className="p-3 text-sm font-medium text-text-primary">💰 Revenue</td>
                      {projections.map((p) => (
                        <td key={p.year} className="p-3 text-sm text-right font-bold text-accent-green">
                          {formatCurrency(p.revenue)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 text-sm text-text-muted pl-6">- COGS</td>
                      {projections.map((p) => (
                        <td key={p.year} className="p-3 text-sm text-right text-text-muted">
                          ({formatCurrency(p.cogs)})
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-background/50">
                      <td className="p-3 text-sm font-medium text-text-primary">📈 Gross Profit</td>
                      {projections.map((p) => (
                        <td key={p.year} className="p-3 text-sm text-right font-medium text-text-primary">
                          {formatCurrency(p.grossProfit)}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 text-sm text-text-muted pl-6">- OpEx + CAC</td>
                      {projections.map((p) => (
                        <td key={p.year} className="p-3 text-sm text-right text-text-muted">
                          ({formatCurrency(p.operatingExpenses)})
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-gradient-to-r from-accent-purple/10 to-accent-cyan/10">
                      <td className="p-3 text-sm font-bold text-text-primary">🎯 Net Income</td>
                      {projections.map((p) => (
                        <td key={p.year} className={`p-3 text-sm text-right font-bold ${p.netIncome >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(p.netIncome)}
                          {p.netIncome >= 0 ? (
                            <TrendingUp className="w-3 h-3 inline ml-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 inline ml-1" />
                          )}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="p-3 text-sm text-text-muted">Cash Flow Cumulativo</td>
                      {projections.map((p) => (
                        <td key={p.year} className={`p-3 text-sm text-right ${p.cashFlow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {formatCurrency(p.cashFlow)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="p-4 md:p-6 bg-background border-t border-border-subtle">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-text-muted mb-1">Revenue Anno 3</p>
                    <p className="text-lg font-bold text-accent-green">{formatCurrency(year3?.revenue || 0)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-text-muted mb-1">Net Income Anno 3</p>
                    <p className={`text-lg font-bold ${(year3?.netIncome || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatCurrency(year3?.netIncome || 0)}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-text-muted mb-1">Clienti Anno 3</p>
                    <p className="text-lg font-bold text-text-primary">{(year3?.customers || 0).toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-text-muted mb-1">% del TAM</p>
                    <p className="text-lg font-bold text-accent-purple">
                      {inputs.tam > 0 ? ((year3?.revenue || 0) / (inputs.tam * 1000000) * 100).toFixed(2) : 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Insights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 grid md:grid-cols-2 gap-4"
            >
              <div className={`p-4 rounded-xl border ${ltvCacRatio >= 3 ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                <h3 className="font-bold text-text-primary mb-2">💡 Unit Economics</h3>
                <p className="text-sm text-text-secondary">
                  {ltvCacRatio >= 3 
                    ? `Eccellente! LTV/CAC di ${ltvCacRatio.toFixed(1)}x indica un business scalabile.`
                    : ltvCacRatio >= 1
                    ? `LTV/CAC di ${ltvCacRatio.toFixed(1)}x è sostenibile ma margine di miglioramento.`
                    : `⚠️ LTV/CAC < 1x non è sostenibile. Aumenta prezzi o riduci CAC.`
                  }
                </p>
              </div>
              <div className={`p-4 rounded-xl border ${breakEvenYear !== 'Mai' && breakEvenYear <= 2 ? 'bg-green-500/10 border-green-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
                <h3 className="font-bold text-text-primary mb-2">📅 Path to Profitability</h3>
                <p className="text-sm text-text-secondary">
                  {breakEvenYear !== 'Mai' && breakEvenYear <= 2
                    ? `Break-even nell'Anno ${breakEvenYear}. Ottimo per bootstrap o seed round.`
                    : breakEvenYear !== 'Mai'
                    ? `Break-even nell'Anno ${breakEvenYear}. Considera un round di finanziamento.`
                    : `Non raggiungi profittabilità nei 3 anni. Rivedi pricing o costi.`
                  }
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default function FinancialPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><span className="text-text-muted">Caricamento...</span></div>}>
      <FinancialContent />
    </Suspense>
  );
}
