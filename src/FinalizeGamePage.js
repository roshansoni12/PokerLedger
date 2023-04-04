// FinalizeGamePage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FinalizeGamePage = ({ players, setWinner }) => {
  const navigate = useNavigate();
  const [results, setResults] = useState(Array(players.length).fill(''));

  const handleInputChange = (index, value) => {
    const newResults = [...results];
    newResults[index] = value;
    setResults(newResults);
  };

  const finalize = () => {
    const playersWithResults = players.map((player, index) => ({
      ...player,
      result: parseInt(results[index], 10),
    }));
    setWinner(playersWithResults);
    navigate('/');
  };

  const isEveryResultFilled = results.every((result) => result !== '');

  return (
    <div>
      <h1>Finalize Game</h1>
      {players.map((player, index) => (
        <div key={player.id}>
          {player.name} - Result: $
          <input
            type="number"
            value={results[index]}
            onChange={(e) => handleInputChange(index, e.target.value)}
          />
        </div>
      ))}
      <button disabled={!isEveryResultFilled} onClick={finalize}>
        Finalize
      </button>
    </div>
  );
};

export default FinalizeGamePage;
