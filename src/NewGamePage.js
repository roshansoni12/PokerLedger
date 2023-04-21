import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import database from './firebaseConfig';

const NewGamePage = ({ setPlayersForFinalization }) => {
  const [players, setPlayers] = useState([]);
  const [eliminatedPlayers, setEliminatedPlayers] = useState([]);
  const [name, setName] = useState('');
  const [buyIn, setBuyIn] = useState('');
  const [namesFromDB, setNamesFromDB] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const namesRef = database.ref('names');
    namesRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const namesList = data ? Object.values(data) : [];
      setNamesFromDB(namesList);
    });
  }, []);

  const addPlayer = () => {
    if (name && buyIn && parseInt(buyIn) > 0) {
      setPlayers([...players, { id: Date.now(), name, buyIn: parseInt(buyIn) }]);
      setName('');
      setBuyIn('');
    }
  };

  const eliminatePlayer = (id) => {
    const eliminatedIndex = players.findIndex((player) => player.id === id);
    const eliminated = players[eliminatedIndex];
    setEliminatedPlayers([...eliminatedPlayers, eliminated]);
    setPlayers(players.filter((player) => player.id !== id));
  };

  const rebuy = (id) => {
    const rebuyAmount = parseInt(prompt('Enter rebuy amount:'));
    if (rebuyAmount && rebuyAmount > 0) {
      const updatedPlayers = players.map((player) =>
        player.id === id ? { ...player, buyIn: player.buyIn + rebuyAmount } : player
      );
      setPlayers(updatedPlayers);
    }
  };

  const finalizeGame = () => {
    setPlayersForFinalization(players);

    const namesRef = database.ref('names');
    const balancesRef = database.ref('balances');
    players.concat(eliminatedPlayers).forEach((player) => {
      if (!namesFromDB.includes(player.name)) {
        namesRef.push(player.name);
      }

      const change = eliminatedPlayers.some((eliminated) => eliminated.id === player.id)
        ? -player.buyIn
        : player.buyIn;

      balancesRef.child(player.name).transaction((currentBalance) => {
        return (currentBalance || 0) + change;
      });
    });

    navigate('/finalize-game', {
      state: { activePlayers: players, eliminatedPlayers: eliminatedPlayers },
    });
  };

  const totalPot = players
    .concat(eliminatedPlayers)
    .reduce((sum, player) => sum + player.buyIn, 0);

  return (
    <div>
      <h2>New Game</h2>
      <input
        type="text"
        list="playerNames"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <datalist id="playerNames">
        {namesFromDB.map((playerName, index) => (
          <option key={index} value={playerName} />
        ))}
      </datalist>
      <input
        type="number"
        min="1"
        placeholder="Buy In"
        value={buyIn}
        onChange={(e) => setBuyIn(e.target.value)}
      />
      <button onClick={addPlayer}>Add Player</button>
      <datalist id="playerNames">
        {namesFromDB.map((player, index) => (
          <option key={index} value={player} />
        ))}
      </datalist>
      <h3>Active Players</h3>
      <ul>
        {players.map((player, index) => (
          <li key={index}>
            {player.name} - Buy In: ${player.buyIn}
            <button onClick={() => eliminatePlayer(player.id)}>Eliminate</button>
            <button onClick={() => rebuy(player.id)}>Rebuy</button>
          </li>
        ))}
      </ul>
      <h3>Eliminated Players</h3>
      <ul>
        {eliminatedPlayers.map((player, index) => (
          <li key={index}>
            {player.name} - Buy In: ${player.buyIn}
          </li>
        ))}
      </ul>
      <div>Total Pot: ${totalPot}</div>
      <button onClick={finalizeGame}>Finalize Game</button>
    </div>
  );
};

export default NewGamePage;