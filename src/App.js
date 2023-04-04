// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import NewGamePage from './NewGamePage';
import FinalizeGamePage from './FinalizeGamePage';

const App = () => {
  const [playersForFinalization, setPlayersForFinalization] = useState([]);
  const [results, setResults] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage results={results} />} />
        <Route
          path="/new-game"
          element={
            <NewGamePage
              setPlayersForFinalization={(players) =>
                setPlayersForFinalization(players)
              }
            />
          }
        />
        <Route
          path="/finalize-game"
          element={
            <FinalizeGamePage
              players={playersForFinalization}
              setWinner={(playersWithResults) => {
                const sortedResults = playersWithResults.sort(
                  (a, b) => b.result - a.result
                );
                setResults(sortedResults);
              }}
            />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
