import Head from 'next/head';
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex/_generated/api';

const LEGENDS = [
  { id: 'lux', name: 'Lux', role: 'Mage', img: 'lux' },
  { id: 'garen', name: 'Garen', role: 'Combattant', img: 'garen' },
  { id: 'yasuo', name: 'Yasuo', role: 'Duelliste', img: 'yasuo' },
  { id: 'darius', name: 'Darius', role: 'Combattant', img: 'darius' },
  { id: 'teemo', name: 'Teemo', role: 'Éclaireur', img: 'teemo' },
  { id: 'viktor', name: 'Viktor', role: 'Mage', img: 'viktor' },
  { id: 'leona', name: 'Leona', role: 'Gardienne', img: 'leona' },
  { id: 'miss-fortune', name: 'Miss Fortune', role: 'Tireur', img: 'missfortune' },
  { id: 'volibear', name: 'Volibear', role: 'Combattant', img: 'volibear' },
  { id: 'maitre-yi', name: 'Maître Yi', role: 'Duelliste', img: 'maitreyi' },
  { id: 'jinx', name: 'Jinx', role: 'Tireur', img: 'jinx' },
  { id: 'ahri', name: 'Ahri', role: 'Mage', img: 'ahri' },
  { id: 'lee-sin', name: 'Lee Sin', role: 'Duelliste', img: 'leesin' },
  { id: 'annie', name: 'Annie', role: 'Mage', img: 'annie' },
  { id: 'kaisa', name: "Kai'Sa", role: 'Tireur', img: 'kaisa' },
  { id: 'sett', name: 'Sett', role: 'Combattant', img: 'sett' },
  { id: 'azir', name: 'Azir', role: 'Mage', img: 'azir' },
  { id: 'sivir', name: 'Sivir', role: 'Tireur', img: 'sivir' },
  { id: 'irelia', name: 'Irelia', role: 'Duelliste', img: 'irelia' },
  { id: 'renata', name: 'Renata', role: 'Soutien', img: 'renata' },
  { id: 'ezreal', name: 'Ezreal', role: 'Tireur', img: 'ezreal' },
  { id: 'rumble', name: 'Rumble', role: 'Combattant', img: 'rumble' },
  { id: 'fiora', name: 'Fiora', role: 'Duelliste', img: 'fiora' },
  { id: 'ornn', name: 'Ornn', role: 'Tank', img: 'ornn' },
  { id: 'lucian', name: 'Lucian', role: 'Tireur', img: 'lucian' },
  { id: 'draven', name: 'Draven', role: 'Tireur', img: 'draven' },
  { id: 'reksai', name: "Rek'Sai", role: 'Assassin', img: 'reksai' },
  { id: 'jax', name: 'Jax', role: 'Duelliste', img: 'jax' },
  { id: 'lillia', name: 'Lillia', role: 'Mage', img: 'lillia' },
  { id: 'khazix', name: "Kha'Zix", role: 'Assassin', img: 'khazix' },
  { id: 'diana', name: 'Diana', role: 'Duelliste', img: 'diana' },
  { id: 'ivern', name: 'Ivern', role: 'Soutien', img: 'ivern' },
  { id: 'leblanc', name: 'LeBlanc', role: 'Assassin', img: 'leblanc' },
  { id: 'vex', name: 'Vex', role: 'Mage', img: 'vex' },
  { id: 'jhin', name: 'Jhin', role: 'Tireur', img: 'jhin' },
  { id: 'vi', name: 'Vi', role: 'Combattant', img: 'vi' },
  { id: 'rengar', name: 'Rengar', role: 'Assassin', img: 'rengar' },
  { id: 'pyke', name: 'Pyke', role: 'Assassin', img: 'pyke' },
  { id: 'maitre-yi-unleashed', name: 'Maître Yi Unleashed', role: 'Duelliste', img: 'maitreyiunleashed' },
  { id: 'poppy', name: 'Poppy', role: 'Tank', img: 'poppy' },
];

// Couleurs basées sur les cartes Riftbound
// jaune=#D4A017 orange=#D35400 rouge=#C0392B violet=#7D3C98 bleu=#2874A6 vert=#1E8449
const LEGEND_COLORS = {
  'lux': ['#D4A017', '#2874A6'],
  'garen': ['#D4A017', '#D35400'],
  'yasuo': ['#1E8449', '#7D3C98'],
  'darius': ['#D4A017', '#C0392B'],
  'teemo': ['#7D3C98', '#2874A6'],
  'viktor': ['#D4A017', '#2874A6'],
  'leona': ['#D4A017', '#1E8449'],
  'miss-fortune': ['#7D3C98', '#D35400'],
  'volibear': ['#D35400', '#C0392B'],
  'maitre-yi': ['#1E8449', '#D35400'],
  'jinx': ['#C0392B', '#7D3C98'],
  'ahri': ['#1E8449', '#2874A6'],
  'lee-sin': ['#D35400', '#1E8449'],
  'annie': ['#7D3C98', '#C0392B'],
  'kaisa': ['#2874A6', '#C0392B'],
  'sett': ['#D4A017', '#D35400'],
  'azir': ['#D4A017', '#1E8449'],
  'sivir': ['#D35400', '#7D3C98'],
  'irelia': ['#1E8449', '#7D3C98'],
  'renata': ['#2874A6', '#D4A017'],
  'ezreal': ['#2874A6', '#7D3C98'],
  'rumble': ['#2874A6', '#C0392B'],
  'fiora': ['#D35400', '#D4A017'],
  'ornn': ['#2874A6', '#1E8449'],
  'lucian': ['#D35400', '#C0392B'],
  'draven': ['#C0392B', '#7D3C98'],
  'reksai': ['#D4A017', '#C0392B'],
  'jax': ['#D35400', '#1E8449'],
  'lillia': ['#2874A6', '#1E8449'],
  'khazix': ['#D35400', '#7D3C98'],
  'diana': ['#2874A6', '#7D3C98'],
  'ivern': ['#D4A017', '#1E8449'],
  'leblanc': ['#2874A6', '#D4A017'],
  'vex': ['#1E8449', '#7D3C98'],
  'jhin': ['#2874A6', '#C0392B'],
  'vi': ['#D4A017', '#C0392B'],
  'rengar': ['#D35400', '#C0392B'],
  'pyke': ['#7D3C98', '#C0392B'],
  'maitre-yi-unleashed': ['#1E8449', '#D35400'],
  'poppy': ['#D4A017', '#D35400'],
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
  const colors = LEGEND_COLORS[legend.id] || ['#333', '#555'];

  return (
    <div className={`card ${total > 0 ? 'has-data' : ''}`}>
      <div style={{
        position:'absolute',inset:0,
        background:`linear-gradient(135deg, ${colors[0]}28 0%, ${colors[0]}28 48%, transparent 48%, transparent 52%, ${colors[1]}28 52%, ${colors[1]}28 100%)`,
        borderRadius:12,pointerEvents:'none',
      }}/>
      <div style={{
        position:'absolute',top:0,left:0,width:'50%',height:3,
        background:colors[0],
        borderRadius:'12px 0 0 0',pointerEvents:'none',
      }}/>
      <div style={{
        position:'absolute',top:0,right:0,width:'50%',height:3,
        background:colors[1],
        borderRadius:'0 12px 0 0',pointerEvents:'none',
      }}/>
      <div className="card-rank">#{rank}</div>
      <div className="card-header">
        <div className="card-name-block">
          <span className="card-name">{legend.name}</span>
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
          <svg style={{width:12,height:12,flexShrink:0}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          Victoire
        </button>
        <button className="btn-reset" onClick={() => onReset(legend.id)} title="Réinitialiser" disabled={total === 0}>
          <svg style={{width:14,height:14,flexShrink:0}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
        </button>
        <button className="btn-loss" onClick={() => onLoss(legend.id)} title="Ajouter une défaite">
          <svg style={{width:12,height:12,flexShrink:0}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
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

const PROFILE_KEY = 'riftbound-profile-code';

function getInitialRecords() {
  const init = {};
  LEGENDS.forEach(l => { init[l.id] = { wins: 0, losses: 0 }; });
  return init;
}

export default function Home() {
  const [profileCode, setProfileCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [connected, setConnected] = useState(false);
  const [records, setRecords] = useState(getInitialRecords);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('default');
  const [toast, setToast] = useState(null);
  const saveTimer = useRef(null);

  const cloudData = useQuery(
    api.profiles.get,
    connected && profileCode ? { code: profileCode } : "skip"
  );
  const saveToCloud = useMutation(api.profiles.save);

  // Load profile code from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(PROFILE_KEY);
    if (saved) {
      setProfileCode(saved);
      setInputCode(saved);
      setConnected(true);
    }
  }, []);

  // When cloud data arrives, merge it into records
  useEffect(() => {
    if (cloudData && cloudData.records) {
      try {
        const parsed = JSON.parse(cloudData.records);
        setRecords(prev => {
          const merged = { ...prev };
          Object.keys(parsed).forEach(k => {
            if (merged[k] !== undefined) merged[k] = parsed[k];
          });
          return merged;
        });
      } catch {}
    }
  }, [cloudData]);

  // Debounced save to cloud when records change
  const syncToCloud = useCallback((newRecords) => {
    if (!connected || !profileCode) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      saveToCloud({ code: profileCode, records: JSON.stringify(newRecords) });
    }, 800);
  }, [connected, profileCode, saveToCloud]);

  // Also keep localStorage as fallback
  useEffect(() => {
    if (!connected) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(records)); } catch {}
    syncToCloud(records);
  }, [records, connected, syncToCloud]);

  const handleConnect = () => {
    const code = inputCode.trim();
    if (!code) return;
    setProfileCode(code);
    setConnected(true);
    localStorage.setItem(PROFILE_KEY, code);
    showToast(`Connecté : ${code}`, 'win');
  };

  const handleDisconnect = () => {
    setConnected(false);
    setProfileCode('');
    setInputCode('');
    setRecords(getInitialRecords());
    localStorage.removeItem(PROFILE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    showToast('Déconnecté', 'reset');
  };

  const showToast = (msg, type = 'win') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 1800);
  };

  const onWin = (id) => {
    const name = LEGENDS.find(l => l.id === id)?.name;
    setRecords(prev => {
      const next = { ...prev, [id]: { ...prev[id], wins: prev[id].wins + 1 } };
      return next;
    });
    showToast(`+1 Victoire — ${name}`, 'win');
  };

  const onLoss = (id) => {
    const name = LEGENDS.find(l => l.id === id)?.name;
    setRecords(prev => {
      const next = { ...prev, [id]: { ...prev[id], losses: prev[id].losses + 1 } };
      return next;
    });
    showToast(`+1 Défaite — ${name}`, 'loss');
  };

  const onReset = (id) => {
    const name = LEGENDS.find(l => l.id === id)?.name;
    setRecords(prev => {
      const next = { ...prev, [id]: { wins: 0, losses: 0 } };
      return next;
    });
    showToast(`Reset — ${name}`, 'reset');
  };

  const onResetAll = () => {
    if (!confirm('Remettre tous les scores à zéro ?')) return;
    const reset = getInitialRecords();
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
              <div>
                <h1 className="logo-title">RIFTBOUND</h1>
                <p className="logo-sub">Tracker de Winrate</p>
              </div>
            </div>
            <div style={{display:'flex',alignItems:'center',gap:8}}>
              {connected ? (
                <>
                  <span style={{
                    display:'flex',alignItems:'center',gap:6,
                    padding:'7px 14px',borderRadius:10,fontSize:12,
                    fontFamily:"'Cinzel', serif",fontWeight:700,
                    background:'linear-gradient(135deg, #0a1a0a, #0e200e)',
                    border:'1px solid rgba(46,204,113,0.3)',color:'#2ECC71',
                    letterSpacing:'0.04em',
                  }}>
                    <span style={{width:8,height:8,borderRadius:'50%',background:'#2ECC71',boxShadow:'0 0 8px rgba(46,204,113,0.5)'}}/>
                    {profileCode}
                  </span>
                  <button
                    onClick={handleDisconnect}
                    style={{
                      padding:'7px 12px',borderRadius:10,fontSize:11,
                      fontFamily:"'Cinzel', serif",fontWeight:700,
                      background:'linear-gradient(135deg, #1a0a0a, #200e0e)',
                      border:'1px solid rgba(231,76,60,0.3)',color:'rgba(231,76,60,0.7)',
                      cursor:'pointer',textTransform:'uppercase',letterSpacing:'0.05em',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.color='#E74C3C'; e.currentTarget.style.borderColor='rgba(231,76,60,0.6)'; }}
                    onMouseLeave={e => { e.currentTarget.style.color='rgba(231,76,60,0.7)'; e.currentTarget.style.borderColor='rgba(231,76,60,0.3)'; }}
                  >
                    Déco
                  </button>
                </>
              ) : (
                <>
                  <input
                    placeholder="Code profil..."
                    value={inputCode}
                    onChange={e => setInputCode(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleConnect(); }}
                    style={{
                      padding:'8px 14px',borderRadius:10,fontSize:13,
                      fontFamily:"'Crimson Pro', serif",
                      background:'linear-gradient(135deg, #0d1117, #111825)',
                      border:'1px solid #1e2a3a',color:'#c8d8e8',
                      outline:'none',width:150,
                    }}
                  />
                  <button
                    onClick={handleConnect}
                    style={{
                      padding:'8px 16px',borderRadius:10,fontSize:11,
                      fontFamily:"'Cinzel', serif",fontWeight:700,
                      background:'linear-gradient(135deg, #1a1500, #252000)',
                      border:'1px solid rgba(200,168,75,0.4)',color:'#c8a84b',
                      cursor:'pointer',textTransform:'uppercase',letterSpacing:'0.05em',
                      whiteSpace:'nowrap',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(200,168,75,0.7)'; e.currentTarget.style.boxShadow='0 0 14px rgba(200,168,75,0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(200,168,75,0.4)'; e.currentTarget.style.boxShadow='none'; }}
                  >
                    Sync
                  </button>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="main">
          {/* Global stats */}
          <GlobalStats stats={globalStats} />

          {/* Controls */}
          <div className="controls">
            <div style={{display:'flex',gap:12,alignItems:'center',marginBottom:8}}>
              <div style={{position:'relative',flex:1,minWidth:200}}>
              <svg style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:16,height:16,color:'#445',pointerEvents:'none'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input
                placeholder="Rechercher une légende..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width:'100%',padding:'10px 14px 10px 40px',
                  background:'linear-gradient(135deg, #0d1117, #111825)',
                  border:'1px solid #1e2a3a',
                  color:'#c8d8e8',borderRadius:10,
                  fontFamily:"'Crimson Pro', serif",fontSize:15,
                  outline:'none',
                  boxShadow:'0 2px 8px rgba(0,0,0,0.25)',
                }}
                onFocus={e => {
                  e.currentTarget.style.borderColor='rgba(200,168,75,0.4)';
                  e.currentTarget.style.boxShadow='0 0 14px rgba(200,168,75,0.1)';
                }}
                onBlur={e => {
                  e.currentTarget.style.borderColor='#1e2a3a';
                  e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.25)';
                }}
              />
              </div>
              <button
                onClick={onResetAll}
                style={{
                  display:'flex',alignItems:'center',gap:6,
                  background:'linear-gradient(135deg, #1a0a0a, #200e0e)',
                  border:'1px solid rgba(231,76,60,0.3)',
                  color:'rgba(231,76,60,0.7)',padding:'9px 18px',borderRadius:10,
                  cursor:'pointer',fontFamily:"'Cinzel', serif",fontSize:11,
                  fontWeight:700,letterSpacing:'0.06em',textTransform:'uppercase',
                  boxShadow:'0 2px 10px rgba(0,0,0,0.3)',whiteSpace:'nowrap',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background='linear-gradient(135deg, #2a0808, #351010)';
                  e.currentTarget.style.borderColor='rgba(231,76,60,0.6)';
                  e.currentTarget.style.color='#E74C3C';
                  e.currentTarget.style.boxShadow='0 4px 20px rgba(231,76,60,0.2)';
                  e.currentTarget.style.transform='translateY(-1px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background='linear-gradient(135deg, #1a0a0a, #200e0e)';
                  e.currentTarget.style.borderColor='rgba(231,76,60,0.3)';
                  e.currentTarget.style.color='rgba(231,76,60,0.7)';
                  e.currentTarget.style.boxShadow='0 2px 10px rgba(0,0,0,0.3)';
                  e.currentTarget.style.transform='translateY(0)';
                }}
              >
                <svg style={{width:14,height:14,flexShrink:0}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                Reset tout
              </button>
            </div>
            <div style={{display:'flex',gap:12,flexWrap:'wrap',marginBottom:8}}>
              {[
                { v: 'all', l: 'Tous' },
                { v: 'played', l: 'Joués' },
                { v: 'unplayed', l: 'Non joués' },
                { v: 'positive', l: '≥50%' },
                { v: 'negative', l: '<50%' },
              ].map(f => {
                const isActive = filter === f.v;
                return (
                  <button
                    key={f.v}
                    onClick={() => setFilter(f.v)}
                    style={{
                      padding:'11px 18px',
                      border: isActive ? '1px solid rgba(200,168,75,0.5)' : '1px solid #1e2a3a',
                      background: isActive ? 'linear-gradient(135deg, #1a1500, #252000)' : 'linear-gradient(135deg, #0d1117, #111825)',
                      color: isActive ? '#c8a84b' : '#556',
                      borderRadius:10, cursor:'pointer', fontSize:12,
                      fontFamily:"'Cinzel', serif", fontWeight:700,
                      letterSpacing:'0.06em', whiteSpace:'nowrap',
                      boxShadow: isActive ? '0 0 14px rgba(200,168,75,0.12), inset 0 1px 0 rgba(200,168,75,0.1)' : '0 2px 8px rgba(0,0,0,0.25)',
                      transition:'all 0.2s ease',
                    }}
                    onMouseEnter={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor='#334';
                        e.currentTarget.style.color='#99a';
                        e.currentTarget.style.transform='translateY(-1px)';
                        e.currentTarget.style.boxShadow='0 4px 14px rgba(0,0,0,0.35)';
                      }
                    }}
                    onMouseLeave={e => {
                      if (!isActive) {
                        e.currentTarget.style.borderColor='#1e2a3a';
                        e.currentTarget.style.color='#556';
                        e.currentTarget.style.transform='translateY(0)';
                        e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.25)';
                      }
                    }}
                  >
                    {f.l}
                  </button>
                );
              })}
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              style={{
                padding:'9px 32px 9px 14px',
                background:'#0d1117',border:'1px solid #1e2a3a',
                color:'#778',borderRadius:10,fontFamily:"'Cinzel', serif",
                fontSize:12,fontWeight:700,cursor:'pointer',outline:'none',
                boxShadow:'0 2px 8px rgba(0,0,0,0.25)',
                WebkitAppearance:'none',MozAppearance:'none',appearance:'none',
                backgroundImage:"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23556' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E\")",
                backgroundRepeat:'no-repeat',backgroundPosition:'right 10px center',
              }}
            >
              <option value="default">Ordre original</option>
              <option value="name">Nom A-Z</option>
              <option value="winrate-desc">Winrate ↓</option>
              <option value="winrate-asc">Winrate ↑</option>
              <option value="games">Plus joués</option>
            </select>
          </div>

          <p style={{fontSize:12,color:'#2a3a4a',marginTop:12,marginBottom:20,letterSpacing:'0.05em'}}>{filtered.length} légende{filtered.length > 1 ? 's' : ''} affichée{filtered.length > 1 ? 's' : ''}</p>

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
        .logo-title {
          font-family: 'Cinzel', serif; font-size: 22px; font-weight: 900;
          color: #c8a84b; letter-spacing: 0.15em; line-height: 1;
          text-shadow: 0 0 30px rgba(200,168,75,0.3);
        }
        .logo-sub { font-size: 11px; color: #445; letter-spacing: 0.2em; text-transform: uppercase; margin-top: 2px; }
        .reset-all-btn {
          display: flex; align-items: center; gap: 6px;
          background: #1a0a0a; border: 1px solid #E74C3C33;
          color: #E74C3C77; padding: 9px 16px; border-radius: 10px;
          cursor: pointer; font-family: 'Cinzel', serif; font-size: 11px;
          font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;
          transition: all 0.25s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .reset-all-btn:hover {
          background: #2a0a0a; color: #E74C3C; border-color: #E74C3C88;
          transform: translateY(-1px); box-shadow: 0 4px 16px rgba(231,76,60,0.15);
        }

        .main { max-width: 1400px; margin: 0 auto; padding: 40px 24px; position: relative; z-index: 1; }

        .controls {
          display: flex; flex-direction: column; align-items: stretch; gap: 28px;
          margin-top: 24px; margin-bottom: 24px;
        }
        .search-wrap { position: relative; flex: 1; min-width: 200px; }
        .search-input {
          width: 100%; padding: 10px 12px 10px 38px;
          background: #0d1117; border: 1px solid #1e2a3a;
          color: #c8d8e8; border-radius: 10px; font-family: 'Crimson Pro', serif; font-size: 15px;
          outline: none; transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .search-input::placeholder { color: #334; }
        .search-input:focus { border-color: #c8a84b66; box-shadow: 0 0 12px rgba(200,168,75,0.1); }

        .filter-group { display: flex; gap: 6px; flex-wrap: wrap; }
        .filter-btn {
          padding: 9px 16px; border: 1px solid #1e2a3a; background: #0d1117;
          color: #556; border-radius: 10px; cursor: pointer; font-size: 12px;
          font-family: 'Cinzel', serif; font-weight: 600; letter-spacing: 0.05em;
          transition: all 0.25s ease; white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        .filter-btn.active {
          background: linear-gradient(135deg, #1a1500 0%, #2a2000 100%);
          border-color: #c8a84b88; color: #c8a84b;
          box-shadow: 0 0 12px rgba(200,168,75,0.15), inset 0 1px 0 rgba(200,168,75,0.1);
        }
        .filter-btn:hover:not(.active) {
          border-color: #334; color: #889; background: #111825;
          transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .sort-select {
          padding: 9px 14px; background: #0d1117; border: 1px solid #1e2a3a;
          color: #778; border-radius: 10px; font-family: 'Cinzel', serif; font-size: 12px;
          font-weight: 600; cursor: pointer; outline: none; transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          -webkit-appearance: none; -moz-appearance: none; appearance: none;
          padding-right: 32px;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23556' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 10px center;
        }
        .sort-select:hover { border-color: #334; color: #889; background-color: #111825; }
        .sort-select:focus { border-color: #c8a84b66; box-shadow: 0 0 12px rgba(200,168,75,0.1); }

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
