import { FormEvent, useEffect, useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';

type AuthMode = 'login' | 'signup';

type UserProfile = {
  username: string;
  password: string;
  coins: number;
  xp: number;
  role: string;
  joined: string;
};

const games = [
  { name: 'Blackjack', genre: 'Classic Casino', badge: 'Hot' },
  { name: 'Roulette', genre: 'Lucky Spin', badge: 'Trending' },
  { name: 'Crash', genre: 'High Risk', badge: 'New' },
  { name: 'Poker', genre: 'Skill Match', badge: 'VIP' }
];

const stats = [
  { label: 'Live Players', value: '12.4K' },
  { label: 'Daily Rewards', value: '98%' },
  { label: 'Avg. Session', value: '24m' }
];

const USERS_KEY = '8010games-users';
const SESSION_KEY = '8010games-session';

function App() {
  const [authMode, setAuthMode] = useState<AuthMode>('login');
  const [users, setUsers] = useState<UserProfile[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = window.localStorage.getItem(USERS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = window.localStorage.getItem(SESSION_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
    } else {
      window.localStorage.removeItem(SESSION_KEY);
    }
  }, [currentUser]);

  const handleAuth = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const username = form.username.trim();
    const password = form.password.trim();

    if (!username || !password) {
      setIsError(true);
      setMessage('Please enter both a username and password.');
      return;
    }

    if (authMode === 'signup') {
      if (password.length < 6) {
        setIsError(true);
        setMessage('Password must be at least 6 characters.');
        return;
      }
      const existing = users.find((user) => user.username.toLowerCase() === username.toLowerCase());
      if (existing) {
        setIsError(true);
        setMessage('That username is already taken.');
        return;
      }

      const newUser: UserProfile = {
        username,
        password,
        coins: 1200,
        xp: 400,
        role: 'New Member',
        joined: new Date().toLocaleDateString()
      };

      setUsers((prev) => [...prev, newUser]);
      setCurrentUser(newUser);
      setIsError(false);
      setMessage('Account created! You are now signed in.');
      setForm({ username: '', password: '' });
      return;
    }

    const match = users.find(
      (user) => user.username.toLowerCase() === username.toLowerCase() && user.password === password
    );

    if (!match) {
      setIsError(true);
      setMessage('No account matched that username and password.');
      return;
    }

    setCurrentUser(match);
    setIsError(false);
    setMessage(`Welcome back, ${match.username}!`);
    setForm({ username: '', password: '' });
  };

  const clearMessage = () => {
    setMessage(null);
    setIsError(false);
  };

  return (
    <div className="min-h-screen bg-bg text-slate-100">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-wide">8010 Games</h1>
            <p className="text-sm text-slate-400">Modern gaming platform</p>
          </div>
          <nav className="flex flex-wrap items-center gap-2 text-sm sm:gap-4">
            <NavLink to="/" className="rounded-full px-3 py-2 text-slate-300 transition hover:bg-white/10 hover:text-white">Home</NavLink>
            <NavLink to="/games" className="rounded-full px-3 py-2 text-slate-300 transition hover:bg-white/10 hover:text-white">Games</NavLink>
            <NavLink to="/chat" className="rounded-full px-3 py-2 text-slate-300 transition hover:bg-white/10 hover:text-white">Chat</NavLink>
            <NavLink to="/leaderboards" className="rounded-full px-3 py-2 text-slate-300 transition hover:bg-white/10 hover:text-white">Leaderboards</NavLink>
            <NavLink to="/admin" className="rounded-full px-3 py-2 text-slate-300 transition hover:bg-white/10 hover:text-white">Admin</NavLink>
            {currentUser ? (
              <button onClick={() => setCurrentUser(null)} className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-white">Logout</button>
            ) : (
              <button onClick={() => setAuthMode('login')} className="rounded-full bg-cyan-400 px-3 py-2 font-medium text-slate-950">Login</button>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <Routes>
          <Route path="/" element={<Home currentUser={currentUser} authMode={authMode} setAuthMode={setAuthMode} form={form} setForm={setForm} handleAuth={handleAuth} message={message} setMessage={clearMessage} isError={isError} />} />
          <Route path="/games" element={<Games />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}

function Home({ currentUser, authMode, setAuthMode, form, setForm, handleAuth, message, setMessage, isError }: any) {
  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="overflow-hidden rounded-[28px] border border-cyan-400/20 bg-gradient-to-br from-violet-600/30 via-slate-900 to-cyan-500/20 p-4 shadow-2xl shadow-cyan-950/40 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-8">
          <div className="space-y-4 sm:space-y-5">
            <div className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">Live • Social • Rewarding</div>
            <h2 className="text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">Play, compete, and collect rewards in a modern gaming universe.</h2>
            <p className="max-w-2xl text-base text-slate-300 sm:text-lg">Discover featured games, chat with players, climb leaderboards, and unlock achievements in a polished experience built for iPhone, Android, tablets, laptops, and desktops.</p>
            <div className="flex flex-wrap gap-3">
              <a href="/games" className="rounded-xl bg-cyan-400 px-4 py-3 font-medium text-slate-950 transition hover:bg-cyan-300">Explore Games</a>
              <a href="/leaderboards" className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 font-medium text-white transition hover:bg-white/20">View Rankings</a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/45 p-4 backdrop-blur sm:p-6">
            <div className="flex items-center justify-between text-sm text-slate-400">
              <span>Online now</span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-emerald-300">+12%</span>
            </div>
            <div className="mt-4 space-y-3 sm:mt-6 sm:space-y-4">
              {stats.map((item: { label: string; value: string }) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-semibold">{item.value}</p>
                  <p className="text-sm text-slate-400">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold">Featured Games</h3>
              <p className="mt-1 text-sm text-slate-400">Tuned for smooth play on every screen size.</p>
            </div>
            {currentUser ? <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300">Signed in as {currentUser.username}</span> : null}
          </div>
          <div className="mt-4 space-y-3">
            {games.map((game) => (
              <div key={game.name} className="flex items-center justify-between rounded-xl border border-white/10 bg-slate-950/40 p-3">
                <div>
                  <p className="font-medium">{game.name}</p>
                  <p className="text-sm text-slate-400">{game.genre}</p>
                </div>
                <span className="rounded-full bg-violet-500/20 px-2 py-1 text-xs text-violet-300">{game.badge}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setAuthMode('login')} className={`rounded-full px-3 py-2 text-sm ${authMode === 'login' ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-slate-300'}`}>Login</button>
            <button onClick={() => setAuthMode('signup')} className={`rounded-full px-3 py-2 text-sm ${authMode === 'signup' ? 'bg-cyan-400 text-slate-950' : 'bg-white/10 text-slate-300'}`}>Sign Up</button>
          </div>
          <p className="mt-3 text-sm text-slate-400">No Gmail required. Just choose a username and password.</p>

          <form className="mt-4 space-y-3" onSubmit={handleAuth}>
            <input
              value={form.username}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, username: event.target.value }));
                setMessage(null);
              }}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-3 outline-none ring-0"
              placeholder="Username"
              autoComplete="username"
            />
            <input
              value={form.password}
              onChange={(event) => {
                setForm((prev) => ({ ...prev, password: event.target.value }));
                setMessage(null);
              }}
              className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3 py-3 outline-none ring-0"
              placeholder="Password"
              type="password"
              autoComplete={authMode === 'signup' ? 'new-password' : 'current-password'}
            />
            <button className="w-full rounded-xl bg-violet-600 px-4 py-3 font-medium transition hover:bg-violet-500">
              {authMode === 'signup' ? 'Create Account' : 'Log In'}
            </button>
          </form>

          {message ? (
            <div onClick={setMessage} className={`mt-4 rounded-xl border px-3 py-3 text-sm ${isError ? 'border-rose-400/30 bg-rose-500/10 text-rose-200' : 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200'}`}>
              {message}
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function Games() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Game Library</h2>
        <p className="mt-2 text-sm text-slate-400 sm:text-base">A modern catalog of casino-style and skill-based games with rewards and social features.</p>
      </div>
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
        {['Blackjack', 'Roulette', 'Baccarat', 'Slots', 'Crash', 'Plinko', 'Dice', 'Mines', 'Poker'].map((game) => (
          <div key={game} className="rounded-2xl border border-white/10 bg-slate-900/80 p-5 shadow-lg shadow-black/20">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-xl font-semibold">{game}</h3>
              <span className="rounded-full bg-emerald-500/20 px-2 py-1 text-xs text-emerald-300">Live</span>
            </div>
            <p className="mt-3 text-sm text-slate-400">Sound effects, animations, XP rewards, achievements, and daily challenges included.</p>
            <button className="mt-4 rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium hover:bg-violet-500">Play Now</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Chat() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-6">
        <h2 className="text-2xl font-semibold">Global Chat</h2>
        <div className="mt-4 space-y-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4">
          <div className="rounded-xl bg-white/5 p-3 text-sm"><span className="text-cyan-300">Nova</span>: Welcome back! Drop a message or mention a friend.</div>
          <div className="rounded-xl bg-white/5 p-3 text-sm"><span className="text-fuchsia-300">Mika</span>: I just unlocked a new badge.</div>
          <div className="rounded-xl bg-white/5 p-3 text-sm"><span className="text-emerald-300">Rex</span>: Join the daily challenge!</div>
        </div>
        <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/40 p-3">
          <input className="w-full bg-transparent outline-none" placeholder="Type a message..." />
        </div>
      </div>
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-6">
        <h3 className="text-xl font-semibold">Live Presence</h3>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          <li className="flex items-center justify-between"><span>Nova</span><span className="text-emerald-400">Online</span></li>
          <li className="flex items-center justify-between"><span>Mika</span><span className="text-emerald-400">Online</span></li>
          <li className="flex items-center justify-between"><span>Rex</span><span className="text-slate-400">Away</span></li>
        </ul>
      </div>
    </div>
  );
}

function Leaderboards() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Leaderboards</h2>
        <p className="mt-2 text-sm text-slate-400 sm:text-base">Track XP, coins, gems, wins, and ranking streaks in real time.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {['XP', 'Coins', 'Gems', 'Wins', 'Win Rate', 'Daily'].map((category) => (
          <div key={category} className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
            <h3 className="text-lg font-semibold">{category}</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li className="flex justify-between"><span>1. Nova</span><span>12,340</span></li>
              <li className="flex justify-between"><span>2. Mika</span><span>10,980</span></li>
              <li className="flex justify-between"><span>3. Rex</span><span>9,710</span></li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function Admin() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 sm:p-6">
        <h2 className="text-2xl font-semibold sm:text-3xl">Admin Dashboard</h2>
        <p className="mt-2 text-sm text-slate-400 sm:text-base">Secure controls for users, moderation, analytics, announcements, and reports.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {['Active Users', 'Online Users', 'Daily Signups', 'Revenue'].map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
            <p className="text-sm text-slate-400">{item}</p>
            <p className="mt-2 text-2xl font-semibold">{item === 'Revenue' ? '$48.2K' : '1,284'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
