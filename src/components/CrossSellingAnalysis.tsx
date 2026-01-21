import { ShoppingBag, TrendingUp, Package, Calendar } from 'lucide-react'
import { useState } from 'react'

interface CrossSellingAnalysisProps {
  data: any
}

export default function CrossSellingAnalysis({ data }: CrossSellingAnalysisProps) {
  const [selectedMonth, setSelectedMonth] = useState<string>('all')
  const [channel, setChannel] = useState<'all' | 'mag' | 'web'>('all')
  
  if (!data || !data.crossSell) {
    return <div className="flex items-center justify-center min-h-[400px]"><div className="text-zinc-400">Chargement...</div></div>
  }
  
  const formatEuro = (value: number) => `${value.toLocaleString('fr-FR', { maximumFractionDigits: 0 })}€`
  
  // Analyse cross-selling par canal
  const analyzeCrossSelling = (crossSellData: any) => {
    const associations: any = {}
    
    Object.values(crossSellData).forEach((familySet: any) => {
      const families = Array.from(familySet)
      if (families.length < 2) return
      
      for (let i = 0; i < families.length; i++) {
        for (let j = i + 1; j < families.length; j++) {
          const key = [families[i], families[j]].sort().join(' → ')
          if (!associations[key]) {
            associations[key] = { count: 0, families: [families[i], families[j]].sort() }
          }
          associations[key].count++
        }
      }
    })
    
    return Object.values(associations).sort((a: any, b: any) => b.count - a.count)
  }
  
  const crossSellGlobal = channel === 'all' ? data.crossSell : 
                         channel === 'mag' ? data.crossSellMag : data.crossSellWeb
  const associations = analyzeCrossSelling(crossSellGlobal)
  
  // Top produits par mois pour réseaux sociaux
  const getTopProductsByMonth = () => {
    const produitsData = channel === 'all' ? data.produitsByMonth :
                         channel === 'mag' ? data.produitsByMonthMag : data.produitsByMonthWeb
    
    const months = Object.keys(produitsData).sort()
    
    return months.map(month => {
      const produits = produitsData[month]
      const topProduits = Object.entries(produits)
        .map(([numero, stats]: [string, any]) => ({
          numero,
          ca: stats.ca,
          volume: stats.volume,
          famille: stats.famille,
          sousFamille: stats.sousFamille,
        }))
        .sort((a, b) => b.ca - a.ca)
        .slice(0, 10)
      
      return { month, produits: topProduits }
    })
  }
  
  const productsByMonth = getTopProductsByMonth()
  const availableMonths = productsByMonth.map(m => m.month)
  
  const selectedMonthData = selectedMonth === 'all' 
    ? productsByMonth 
    : productsByMonth.filter(m => m.month === selectedMonth)
  
  // Produits globaux top performers
  const produitsData = channel === 'all' ? data.produits :
                       channel === 'mag' ? data.produitsMag : data.produitsWeb
  
  const topProduitsGlobal = Object.entries(produitsData)
    .map(([numero, stats]: [string, any]) => ({
      numero,
      ca: stats.ca,
      volume: stats.volume,
      famille: stats.famille,
      sousFamille: stats.sousFamille,
    }))
    .sort((a, b) => b.ca - a.ca)
    .slice(0, 20)
  
  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="glass rounded-3xl p-8 border border-zinc-800">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-4 bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl">
            <ShoppingBag className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">Cross-Selling & Produits Stars</h2>
            <p className="text-zinc-400">Associations produits et recommandations mensuelles</p>
          </div>
        </div>
        
        {/* Filtres */}
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-xs text-zinc-400 font-semibold uppercase mb-2">Canal</label>
            <div className="flex gap-2">
              <button
                onClick={() => setChannel('all')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  channel === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                Tous
              </button>
              <button
                onClick={() => setChannel('mag')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  channel === 'mag'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                Magasins
              </button>
              <button
                onClick={() => setChannel('web')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  channel === 'web'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                Web
              </button>
            </div>
          </div>
          
          <div className="flex-1">
            <label className="block text-xs text-zinc-400 font-semibold uppercase mb-2">Mois (Produits)</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous les mois</option>
              {availableMonths.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Cross-Selling Matrix */}
      <div className="glass rounded-3xl p-8 border border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="w-6 h-6 text-pink-400" />
          <h3 className="text-xl font-bold text-white">Top 20 Associations de Familles</h3>
          <span className="text-sm text-zinc-500">
            ({channel === 'all' ? 'Tous canaux' : channel === 'mag' ? 'Magasins physiques' : 'Boutique en ligne'})
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {associations.slice(0, 20).map((assoc: any, idx: number) => (
            <div key={idx} className="bg-zinc-900/50 rounded-2xl p-4 border border-zinc-800 hover:border-pink-500/30 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-pink-500/20 text-pink-400 font-bold text-xs">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-white">{assoc.families[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 pl-8">
                    <span className="text-pink-400">→</span>
                    <span className="text-sm font-semibold text-zinc-300">{assoc.families[1]}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-pink-400">{assoc.count}</div>
                  <div className="text-xs text-zinc-500">achats ensemble</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Top 20 Produits Globaux */}
      <div className="glass rounded-3xl p-8 border border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <Package className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">Top 20 Produits Globaux</h3>
          <span className="text-sm text-zinc-500">
            ({channel === 'all' ? 'Tous canaux' : channel === 'mag' ? 'Magasins' : 'Web'})
          </span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-black uppercase">Rang</th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase">N° Produit</th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase">Famille</th>
                <th className="px-4 py-3 text-left text-xs font-black uppercase">Sous-Famille</th>
                <th className="px-4 py-3 text-right text-xs font-black uppercase">CA</th>
                <th className="px-4 py-3 text-right text-xs font-black uppercase">Volume</th>
              </tr>
            </thead>
            <tbody>
              {topProduitsGlobal.map((produit, idx) => (
                <tr key={produit.numero} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-sm">
                      {idx + 1}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-bold text-white">{produit.numero}</td>
                  <td className="px-4 py-3 text-sm font-medium text-zinc-300">{produit.famille}</td>
                  <td className="px-4 py-3 text-sm text-zinc-400">{produit.sousFamille}</td>
                  <td className="px-4 py-3 text-right text-sm font-bold text-emerald-400">{formatEuro(produit.ca)}</td>
                  <td className="px-4 py-3 text-right text-sm font-medium text-zinc-300">{produit.volume.toLocaleString('fr-FR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Top Produits par Mois - Recommandations Réseaux Sociaux */}
      <div className="glass rounded-3xl p-8 border border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-purple-400" />
          <h3 className="text-xl font-bold text-white">🎯 Recommandations Mensuelles pour Réseaux Sociaux</h3>
          <span className="text-sm text-zinc-500">
            Top 10 produits à mettre en avant chaque mois
          </span>
        </div>
        
        <div className="space-y-6">
          {selectedMonthData.map(({ month, produits }) => (
            <div key={month} className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                  <span className="text-white font-bold">{month}</span>
                </div>
                <span className="text-sm text-zinc-400">Top 10 produits du mois</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {produits.map((produit: any, idx: number) => (
                  <div key={produit.numero} className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700 hover:border-purple-500/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold text-sm">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-sm font-bold text-white">{produit.numero}</div>
                          <div className="text-xs text-zinc-500">{produit.famille}</div>
                          <div className="text-xs text-zinc-600">{produit.sousFamille}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-emerald-400">{formatEuro(produit.ca)}</div>
                        <div className="text-xs text-zinc-500">{produit.volume} ventes</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
