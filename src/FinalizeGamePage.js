import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const FinalizeGamePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const activePlayers = location.state?.activePlayers || [];
  const eliminatedPlayers = location.state?.eliminatedPlayers || [];
  const [finalAmounts, setFinalAmounts] = useState({});

  const totalPot = activePlayers
    .concat(eliminatedPlayers)
    .reduce((sum, player) => sum + player.buyIn, 0);

  const handleFinalize = () => {
    // Logic for handling finalization goes here
    console.log(finalAmounts);
    navigate('/');
  };

  const handleAmountChange = (id, value) => {
    setFinalAmounts({ ...finalAmounts, [id]: value });
  };

  const allFieldsFilled = activePlayers.every(
    (player) => finalAmounts[player.id] !== undefined
  );

  const sumOfEnteredValues = Object.values(finalAmounts).reduce(
    (sum, value) => sum + value,
    0
  );

  const isPotEqual = sumOfEnteredValues === totalPot;

  return (
    <div>
      <h1>Finalize Game</h1>
      <h2>Total Pot: ${totalPot}</h2>
      <ul>
        {activePlayers.map((player) => (
          <li key={player.id}>
            {player.name} - Buy In: ${player.buyIn}
            <input
              type="number"
              placeholder="Final Amount"
              value={finalAmounts[player.id] || ''}
              onChange={(e) =>
                handleAmountChange(player.id, parseInt(e.target.value))
              }
            />
          </li>
        ))}
      </ul>
      {!isPotEqual && <p>Please make sure the entered values equal the total pot.</p>}
      <button onClick={handleFinalize} disabled={!allFieldsFilled || !isPotEqual}>
        Finalize
      </button>
    </div>
  );
};

export default FinalizeGamePage;
