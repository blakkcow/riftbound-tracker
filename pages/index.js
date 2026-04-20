import Head from 'next/head';
import { useState, useEffect, useMemo } from 'react';

const LEGENDS = [
  { id: 'lux', name: 'Lux', role: 'Mage' },
  { id: 'garen', name: 'Garen', role: 'Combattant' },
  { id: 'yasuo', name: 'Yasuo', role: 'Duelliste' },
  { id: 'darius', name: 'Darius', role: 'Combattant' },
  { id: 'teemo', name: 'Teemo', role: 'Éclaireur' },
  { id: 'viktor', name: 'Viktor', role: 'Mage' },
  { id: 'leona', name: 'Leona', role: 'Gardienne' },
  { id: 'miss-fortune', name: 'Miss Fortune', role: 'Tireur' },
  { id: 'volibear', name: 'Volibear', role: 'Combattant' },
  { id: 'maitre-yi', name: 'Maître Yi', role: 'Duelliste' },
  { id: 'jinx', name: 'Jinx', role: 'Tireur' },
  { id: 'ahri', name: 'Ahri', role: 'Mage' },
  { id: 'lee-sin', name: 'Lee Sin', role: 'Duelliste' },
  { id: 'annie', name: 'Annie', role: 'Mage' },
  { id: 'kaisa', name: "Kai'Sa", role: 'Tireur' },
  { id: 'sett', name: 'Sett', role: 'Combattant' },
  { id: 'azir', name: 'Azir', role: 'Mage' },
  { id: 'sivir', name: 'Sivir', role: 'Tireur' },
  { id: 'irelia', name: 'Irelia', role: 'Duelliste' },
  { id: 'renata', name: 'Renata', role: 'Soutien' },
  { id: 'ezreal', name: 'Ezreal', role: 'Tireur' },
  { id: 'rumble', name: 'Rumble', role: 'Combattant' },
  { id: 'fiora', name: 'Fiora', role: 'Duelliste' },
  { id: 'ornn', name: 'Ornn', role: 'Tank' },
  { id: 'lucian', name: 'Lucian', role: 'Tireur' },
  { id: 'draven', name: 'Draven', role: 'Tireur' },
  { id: 'reksai', name: "Rek'Sai", role: 'Assassin' },
  { id: 'jax', name: 'Jax', role: 'Duelliste' },
  { id: 'lillia', name: 'Lillia', role: 'Mage' },
  { id: 'khazix', name: "Kha'Zix", role: 'Assassin' },
  { id: 'diana', name: 'Diana', role: 'Duelliste' },
  { id: 'ivern', name: 'Ivern', role: 'Soutien' },
  { id: 'leblanc', name: 'LeBlanc', role: 'Assassin' },
  { id: 'vex', name: 'Vex', role: 'Mage' },
  { id: 'jhin', name: 'Jhin', role: 'Tireur' },
  { id: 'vi', name: 'Vi', role: 'Combattant' },
  { id: 'rengar', name: 'Rengar', role: 'Assassin' },
  { id: 'pyke', name: 'Pyke', role: 'Assassin' },
  { id: 'maitre-yi-unleashed', name: 'Maître Yi Unleashed', role: 'Duelliste' },
  { id: 'poppy', name: 'Poppy', role: 'Tank' },
];

const ROLE_COLORS = {
  'Mage': '#7B5EA7',
  'Combattant': '#C0392B',
  'Duelliste': '#E67E22',
  'Tank': '#2980B9',
  'Tireur': '#27AE60',
  'Assassin': '#8E44AD',
  'Soutien': '#16A085',
  'Éclaireur': '#F39C12',
  'Gardienne': '#D4AC0D',
};

const STORAGE_KEY = 'riftbound-tracker-v1';

function getWinRate(wins, losses) {
  const total = wins + losses;
  if (total === 0) return null;
  return wins / total;
}

function getTrend(wr) {
  if (wr === null) return { icon: '—', label: '', color: '#555' };
  if (wr >= 0.6) return { icon: '🔥', label: 'En feu', color: '#FF6B35' };
  if (wr >= 0.5) return { icon: '✅', label: 'Positif', color: '#2ECC71' };
  if (wr >= 0.35) return { icon: '⚠️', label: 'Instable', color: '#F39C12' };
  return { icon: '❌', label: 'Difficile', color: '#E74C3C' };
}

function WinBar({ wr }) {
  const pct = wr === null ? 0 : wr * 100;
  const color = wr === null ? '#333' : wr >= 0.6 ? '#2ECC71' : wr >= 0.5 ? '#27AE60' : wr >= 0.35 ? '#E67E22' : '#E74C3C';
  return (
    <div className="win-bar-track">
      <div className="win-bar-fill" style={{ width: `${pct}%`, background: color }} />
      <style jsx>{`
        .win-bar-track { width: 100%; height: 6px; background: #1a1a2e; border-radius: 3px; overflow: hidden; }
        .win-bar-fill { height: 100%; border-radius: 3px; transition: width 0.5s cubic-bezier(.4,0,.2,1); }
      `}</style>
    </div>
  );
}

function LegendCard({ legend, wins, losses, onWin, onLoss, onReset, rank }) {
  const wr = getWinRate(wins, losses);
  const trend = getTrend(wr);
  const total = wins + losses;
  const roleColor = ROLE_COLORS[legend.role] || '#888';

  return (
    <div className={`card ${total > 0 ? 'has-data' : ''}`}>
      <div className="card-rank">#{rank}</div>
      <div className="card-header">
        <div className="card-name-block">
          <span className="card-name">{legend.name}</span>
          <span className="card-role" style={{ color: roleColor, borderColor: roleColor + '44', background: roleColor + '15' }}>
            {legend.role}
          </span>
        </div>
        <span className="card-trend" title={trend.label}>{trend.icon}</span>
      </div>

      <WinBar wr={wr} />

      <div className="card-stats">
        <div className="stat win">
          <span className="stat-val">{wins}</span>
          <span className="stat-lbl">V</span>
        </div>
        <div className="stat-center">
          <span className="winrate-display" style={{ color: wr === null ? '#444' : trend.color }}>
            {wr === null ? '—' : `${(wr * 100).toFixed(1)}%`}
          </span>
          <span className="total-games">{total > 0 ? `${total} partie${total > 1 ? 's' : ''}` : 'Aucune partie'}</span>
        </div>
        <div className="stat loss">
          <span className="stat-val">{losses}</span>
          <span className="stat-lbl">D</span>
        </div>
      </div>

      <div className="card-actions">
        <button className="btn-win" onClick={() => onWin(legend.id)} title="Ajouter une victoire">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          Victoire
        </button>
        <button className="btn-reset" onClick={() => onReset(legend.id)} title="Réinitialiser" disabled={total === 0}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
        <button className="btn-loss" onClick={() => onLoss(legend.id)} title="Ajouter une défaite">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          Défaite
        </button>
      </div>

      <style jsx>{`
        .card {
          background: linear-gradient(135deg, #0d1b2a 0%, #1a1a2e 100%);
          border: 1px solid #1e2a3a;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
        }
        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #c8a84b33, transparent);
          transition: opacity 0.3s;
          opacity: 0;
        }
        .card:hover { border-color: #c8a84b44; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
        .card:hover::before { opacity: 1; }
        .card.has-data { border-color: #2a3a4a; }
        .card-rank { position: absolute; top: 10px; right: 12px; font-size: 10px; color: #2a3a4a; font-family: 'Cinzel', serif; }
        .card-header { display: flex; align-items: flex-start; justify-content: space-between; }
        .card-name-block { display: flex; flex-direction: column; gap: 4px; }
        .card-name { font-family: 'Cinzel', serif; font-size: 14px; color: #c8a84b; font-weight: 600; line-height: 1; }
        .card-role { font-size: 9px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 2px 6px; border-radius: 4px; border: 1px solid; width: fit-content; }
        .card-trend { font-size: 18px; }
        .card-stats { display: flex; align-items: center; justify-content: space-between; }
        .stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .stat.win .stat-val { color: #2ECC71; font-size: 22px; font-weight: 800; font-family: 'Cinzel', serif; }
        .stat.loss .stat-val { color: #E74C3C; font-size: 22px; font-weight: 800; font-family: 'Cinzel', serif; }
        .stat-lbl { font-size: 10px; color: #445; text-transform: uppercase; letter-spacing: 0.1em; }
        .stat-center { display: flex; flex-direction: column; align-items: center; gap: 2px; }
        .winrate-display { font-family: 'Cinzel', serif; font-size: 18px; font-weight: 700; }
        .total-games { font-size: 10px; color: #445; }
        .card-actions { display: flex; gap: 6px; }
        .btn-win, .btn-loss, .btn-reset {
          flex: 1; padding: 8px 4px; border: none; border-radius: 8px; cursor: pointer;
          font-size: 11px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase;
          display: flex; align-items: center; justify-content: center; gap: 4px;
          transition: all 0.15s ease;
        }
        .btn-win svg, .btn-loss svg, .btn-reset svg { width: 12px; height: 12px; flex-shrink: 0; }
        .btn-win { background: #1a3a1a; color: #2ECC71; border: 1px solid #2ECC7133; }
        .btn-win:hover { background: #2ECC71; color: #0a1a0a; transform: scale(1.02); }
        .btn-loss { background: #3a1a1a; color: #E74C3C; border: 1px solid #E74C3C33; }
        .btn-loss:hover { background: #E74C3C; color: #fff; transform: scale(1.02); }
        .btn-reset { flex: 0 0 32px; background: #1a1a1a; color: #445; border: 1px solid #222; }
        .btn-reset:hover:not(:disabled) { background: #333; color: #888; }
        .btn-reset:disabled { opacity: 0.3; cursor: not-allowed; }
      `}</style>
    </div>
  );
}

function GlobalStats({ stats }) {
  const wr = getWinRate(stats.totalWins, stats.totalLosses);
  const trend = getTrend(wr);
  const total = stats.totalWins + stats.totalLosses;
  const played = stats.legendsPlayed;

  return (
    <div className="global-stats">
      <div className="gs-item">
        <span className="gs-val gs-wins">{stats.totalWins}</span>
        <span className="gs-lbl">Victoires</span>
      </div>
      <div className="gs-divider" />
      <div className="gs-item">
        <span className="gs-val gs-losses">{stats.totalLosses}</span>
        <span className="gs-lbl">Défaites</span>
      </div>
      <div className="gs-divider" />
      <div className="gs-item">
        <span className="gs-val gs-total">{total}</span>
        <span className="gs-lbl">Parties</span>
      </div>
      <div className="gs-divider" />
      <div className="gs-item">
        <span className="gs-val" style={{ color: wr === null ? '#444' : trend.color }}>
          {wr === null ? '—' : `${(wr * 100).toFixed(1)}%`}
        </span>
        <span className="gs-lbl">Win Rate Global {wr !== null && trend.icon}</span>
      </div>
      <div className="gs-divider" />
      <div className="gs-item">
        <span className="gs-val gs-legends">{played}</span>
        <span className="gs-lbl">Légendes jouées</span>
      </div>

      <style jsx>{`
        .global-stats {
          display: flex; align-items: center; justify-content: center;
          flex-wrap: wrap; gap: 0;
          background: linear-gradient(135deg, #0d1117 0%, #0d1b2a 100%);
          border: 1px solid #c8a84b33;
          border-radius: 16px;
          padding: 20px 32px;
          margin-bottom: 32px;
          box-shadow: 0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200,168,75,0.1);
        }
        .gs-item { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 0 24px; }
        .gs-divider { width: 1px; height: 40px; background: #1e2a3a; }
        .gs-val { font-family: 'Cinzel', serif; font-size: 28px; font-weight: 700; line-height: 1; }
        .gs-wins { color: #2ECC71; }
        .gs-losses { color: #E74C3C; }
        .gs-total { color: #c8a84b; }
        .gs-legends { color: #7B8FA1; }
        .gs-lbl { font-size: 10px; color: #445; text-transform: uppercase; letter-spacing: 0.1em; }
        @media (max-width: 600px) {
          .global-stats { padding: 16px; }
          .gs-item { padding: 0 12px; }
          .gs-val { font-size: 20px; }
        }
      `}</style>
    </div>
  );
}

export default function Home() {
  const [records, setRecords] = useState(() => {
    const init = {};
    LEGENDS.forEach(l => { init[l.id] = { wins: 0, losses: 0 }; });
    return init;
  });
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');
  const [loaded, setLoaded] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setRecords(prev => {
          const merged = { ...prev };
          Object.keys(parsed).forEach(k => { if (merged[k] !== undefined) merged[k] = parsed[k]; });
          return merged;
        });
      }
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch {}
  }, [records, loaded]);

  const showToast = (msg, type = 'win') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 1800);
  };

  const onWin = (id) => {
    const name = LEGENDS.find(l => l.id === id)?.name;
    setRecords(prev => ({ ...prev, [id]: { ...prev[id], wins: prev[id].wins + 1 } }));
    showToast(`+1 Victoire — ${name}`, 'win');
  };

  const onLoss = (id) => {
    const name = LEGENDS.find(l => l.id === id)?.name;
    setRecords(prev => ({ ...prev, [id]: { ...prev[id], losses: prev[id].losses + 1 } }));
    showToast(`+1 Défaite — ${name}`, 'loss');
  };

  const onReset = (id) => {
    const name = LEGENDS.find(l => l.id === id)?.name;
    setRecords(prev => ({ ...prev, [id]: { wins: 0, losses: 0 } }));
    showToast(`Reset — ${name}`, 'reset');
  };

  const onResetAll = () => {
    if (!confirm('Remettre tous les scores à zéro ?')) return;
    const reset = {};
    LEGENDS.forEach(l => { reset[l.id] = { wins: 0, losses: 0 }; });
    setRecords(reset);
    showToast('Tous les scores remis à zéro', 'reset');
  };

  const globalStats = useMemo(() => {
    let totalWins = 0, totalLosses = 0, legendsPlayed = 0;
    LEGENDS.forEach(l => {
      const r = records[l.id];
      totalWins += r.wins;
      totalLosses += r.losses;
      if (r.wins + r.losses > 0) legendsPlayed++;
    });
    return { totalWins, totalLosses, legendsPlayed };
  }, [records]);

  const filtered = useMemo(() => {
    let list = LEGENDS.filter(l => {
      const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
      const r = records[l.id];
      const total = r.wins + r.losses;
      const wr = getWinRate(r.wins, r.losses);
      if (filter === 'played') return matchSearch && total > 0;
      if (filter === 'unplayed') return matchSearch && total === 0;
      if (filter === 'positive') return matchSearch && wr !== null && wr >= 0.5;
      if (filter === 'negative') return matchSearch && wr !== null && wr < 0.5;
      return matchSearch;
    });

    if (sort === 'winrate-desc') {
      list = [...list].sort((a, b) => {
        const wa = getWinRate(records[a.id].wins, records[a.id].losses) ?? -1;
        const wb = getWinRate(records[b.id].wins, records[b.id].losses) ?? -1;
        return wb - wa;
      });
    } else if (sort === 'winrate-asc') {
      list = [...list].sort((a, b) => {
        const wa = getWinRate(records[a.id].wins, records[a.id].losses) ?? 2;
        const wb = getWinRate(records[b.id].wins, records[b.id].losses) ?? 2;
        return wa - wb;
      });
    } else if (sort === 'games') {
      list = [...list].sort((a, b) => {
        const ta = records[a.id].wins + records[a.id].losses;
        const tb = records[b.id].wins + records[b.id].losses;
        return tb - ta;
      });
    } else if (sort === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [records, search, filter, sort]);

  return (
    <>
      <Head>
        <title>Riftbound Tracker</title>
        <meta name="description" content="Suivi de winrate pour Riftbound" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300&display=swap" rel="stylesheet" />
      </Head>

      <div className="app">
        {/* BG noise */}
        <div className="bg-noise" />
        <div className="bg-glow" />

        {/* Header */}
        <header className="header">
          <div className="header-inner">
            <div className="logo-block">
              <span className="logo-icon">🃏</span>
              <div>
                <h1 className="logo-title">RIFTBOUND</h1>
                <p className="logo-sub">Tracker de Winrate</p>
              </div>
            </div>
            <button className="reset-all-btn" onClick={onResetAll}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              Reset tout
            </button>
          </div>
        </header>

        <main className="main">
          {/* Global stats */}
          <GlobalStats stats={globalStats} />

          {/* Controls */}
          <div className="controls">
            <div className="search-wrap">
              <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                className="search-input"
                placeholder="Rechercher une légende..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="filter-group">
              {[
                { v: 'all', l: 'Tous' },
                { v: 'played', l: 'Joués' },
                { v: 'unplayed', l: 'Non joués' },
                { v: 'positive', l: '≥50%' },
                { v: 'negative', l: '<50%' },
              ].map(f => (
                <button key={f.v} className={`filter-btn ${filter === f.v ? 'active' : ''}`} onClick={() => setFilter(f.v)}>
                  {f.l}
                </button>
              ))}
            </div>
            <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="default">Ordre original</option>
              <option value="name">Nom A→Z</option>
              <option value="winrate-desc">Winrate ↓</option>
              <option value="winrate-asc">Winrate ↑</option>
              <option value="games">Plus joués</option>
            </select>
          </div>

          <p className="result-count">{filtered.length} légende{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}</p>

          {/* Grid */}
          <div className="grid">
            {filtered.map((legend, i) => (
              <LegendCard
                key={legend.id}
                legend={legend}
                wins={records[legend.id].wins}
                losses={records[legend.id].losses}
                onWin={onWin}
                onLoss={onLoss}
                onReset={onReset}
                rank={LEGENDS.indexOf(legend) + 1}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="empty">
              <span>🔍</span>
              <p>Aucune légende trouvée</p>
            </div>
          )}
        </main>

        <footer className="footer">
          <p>Données sauvegardées localement dans votre navigateur · Riftbound Tracker</p>
        </footer>

        {/* Toast */}
        {toast && (
          <div className={`toast toast-${toast.type}`}>
            {toast.type === 'win' && '✅ '}
            {toast.type === 'loss' && '❌ '}
            {toast.type === 'reset' && '🔄 '}
            {toast.msg}
          </div>
        )}
      </div>

      <style jsx global>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body {
          font-family: 'Crimson Pro', Georgia, serif;
          background: #060d14;
          color: #c8d8e8;
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }
        .app { min-height: 100vh; position: relative; }
        .bg-noise {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E");
          opacity: 0.4;
        }
        .bg-glow {
          position: fixed; top: -200px; left: 50%; transform: translateX(-50%);
          width: 800px; height: 400px; pointer-events: none; z-index: 0;
          background: radial-gradient(ellipse, rgba(200,168,75,0.06) 0%, transparent 70%);
        }

        .header {
          position: sticky; top: 0; z-index: 100;
          background: rgba(6,13,20,0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid #c8a84b22;
          padding: 0 24px;
        }
        .header-inner {
          max-width: 1400px; margin: 0 auto;
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 0;
        }
        .logo-block { display: flex; align-items: center; gap: 12px; }
        .logo-icon { font-size: 28px; }
        .logo-title {
          font-family: 'Cinzel', serif; font-size: 22px; font-weight: 900;
          color: #c8a84b; letter-spacing: 0.15em; line-height: 1;
          text-shadow: 0 0 30px rgba(200,168,75,0.3);
        }
        .logo-sub { font-size: 11px; color: #445; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 2px; }
        .reset-all-btn {
          display: flex; align-items: center; gap: 6px;
          background: transparent; border: 1px solid #E74C3C44;
          color: #E74C3C88; padding: 8px 14px; border-radius: 8px;
          cursor: pointer; font-family: 'Cinzel', serif; font-size: 11px;
          letter-spacing: 0.05em; text-transform: uppercase; transition: all 0.2s;
        }
        .reset-all-btn svg { width: 14px; height: 14px; }
        .reset-all-btn:hover { background: #E74C3C11; color: #E74C3C; border-color: #E74C3C88; }

        .main { max-width: 1400px; margin: 0 auto; padding: 40px 24px; position: relative; z-index: 1; }

        .controls {
          display: flex; align-items: center; gap: 12px; margin-bottom: 12px;
          flex-wrap: wrap;
        }
        .search-wrap { position: relative; flex: 1; min-width: 200px; }
        .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #445; pointer-events: none; }
        .search-input {
          width: 100%; padding: 10px 12px 10px 38px;
          background: #0d1b2a; border: 1px solid #1e2a3a;
          color: #c8d8e8; border-radius: 10px; font-family: 'Crimson Pro', serif; font-size: 15px;
          outline: none; transition: border-color 0.2s;
        }
        .search-input::placeholder { color: #2a3a4a; }
        .search-input:focus { border-color: #c8a84b44; }

        .filter-group { display: flex; gap: 4px; flex-wrap: wrap; }
        .filter-btn {
          padding: 8px 12px; border: 1px solid #1e2a3a; background: #0d1b2a;
          color: #445; border-radius: 8px; cursor: pointer; font-size: 12px;
          font-family: 'Cinzel', serif; letter-spacing: 0.04em; transition: all 0.2s;
          white-space: nowrap;
        }
        .filter-btn.active { background: #c8a84b15; border-color: #c8a84b55; color: #c8a84b; }
        .filter-btn:hover:not(.active) { border-color: #2a3a4a; color: #667; }

        .sort-select {
          padding: 8px 12px; background: #0d1b2a; border: 1px solid #1e2a3a;
          color: #667; border-radius: 8px; font-family: 'Cinzel', serif; font-size: 12px;
          cursor: pointer; outline: none; transition: border-color 0.2s;
        }
        .sort-select:focus { border-color: #c8a84b44; }

        .result-count { font-size: 12px; color: #2a3a4a; margin-bottom: 20px; letter-spacing: 0.05em; }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
        }

        .empty { text-align: center; padding: 80px 20px; color: #2a3a4a; }
        .empty span { font-size: 40px; display: block; margin-bottom: 12px; }
        .empty p { font-family: 'Cinzel', serif; font-size: 14px; }

        .footer { text-align: center; padding: 40px 24px 24px; color: #1e2a3a; font-size: 12px; position: relative; z-index: 1; }

        .toast {
          position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
          padding: 12px 24px; border-radius: 10px; font-family: 'Cinzel', serif;
          font-size: 13px; letter-spacing: 0.05em; z-index: 9999;
          animation: toast-in 0.3s ease;
          white-space: nowrap;
        }
        .toast-win { background: #1a3a1a; color: #2ECC71; border: 1px solid #2ECC7155; }
        .toast-loss { background: #3a1a1a; color: #E74C3C; border: 1px solid #E74C3C55; }
        .toast-reset { background: #1a1a2e; color: #c8a84b; border: 1px solid #c8a84b55; }
        @keyframes toast-in { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }

        @media (max-width: 768px) {
          .main { padding: 24px 16px; }
          .controls { gap: 8px; }
          .grid { grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
        }
      `}</style>
    </>
  );
}
