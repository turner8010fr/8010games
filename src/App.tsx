import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";

function App() {
  const [username, setUsername] = useState("");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="p-5 border-b border-white/10">
        <h1 className="text-3xl font-bold">8010 Games</h1>

        <nav className="flex gap-4 mt-4">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/games">Games</NavLink>
          <NavLink to="/chat">Chat</NavLink>
          <NavLink to="/leaderboards">Leaderboard</NavLink>
        </nav>
      </header>

      <main className="p-6">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                username={username}
                setUsername={setUsername}
              />
            }
          />

          <Route path="/games" element={<Games />} />

          <Route path="/chat" element={<Chat />} />

          <Route
            path="/leaderboards"
            element={<Leaderboard />}
          />
        </Routes>
      </main>
    </div>
  );
}


function Home({
  username,
  setUsername,
}: {
  username:string;
  setUsername:(x:string)=>void;
}) {
  return (
    <section>
      <h2 className="text-4xl font-bold">
        Welcome to 8010 Games
      </h2>

      <p className="mt-3 text-gray-400">
        Play games, earn XP, and compete.
      </p>

      <div className="mt-6">
        <input
          className="p-3 rounded bg-white text-black"
          placeholder="Username"
          value={username}
          onChange={(e)=>setUsername(e.target.value)}
        />

        {username && (
          <p className="mt-3">
            Logged in as {username}
          </p>
        )}
      </div>
    </section>
  );
}


function Games(){
  const games=[
    "Blackjack",
    "Roulette",
    "Crash",
    "Slots",
    "Poker",
    "Plinko"
  ];

  return(
    <div>
      <h2 className="text-3xl font-bold">
        Games
      </h2>

      <div className="grid gap-4 mt-5">
        {games.map(game=>(
          <div
            key={game}
            className="p-5 rounded-xl bg-slate-900 border border-white/10"
          >
            {game}
          </div>
        ))}
      </div>
    </div>
  );
}


function Chat(){
  return(
    <div>
      <h2 className="text-3xl font-bold">
        Chat
      </h2>

      <p className="mt-4 text-gray-400">
        Global chat coming soon.
      </p>
    </div>
  );
}


function Leaderboard(){
  return(
    <div>
      <h2 className="text-3xl font-bold">
        Leaderboards
      </h2>

      <ol className="mt-5 space-y-3">
        <li>1. Nova - 12000 XP</li>
        <li>2. Mika - 9000 XP</li>
        <li>3. Rex - 7000 XP</li>
      </ol>
    </div>
  );
}


export default App;
