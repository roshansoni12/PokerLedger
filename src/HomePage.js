import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import database from './firebaseConfig';

const HomePage = () => {
  const [balances, setBalances] = useState({});
  const [namesFromDB, setNamesFromDB] = useState([]);
  const [editName, setEditName] = useState('');
  const [editAmount, setEditAmount] = useState('');

  useEffect(() => {
    const namesRef = database.ref('names');
    const balancesRef = database.ref('balances');
    namesRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const namesList = data ? Object.values(data) : [];
      setNamesFromDB(namesList);
    });
    balancesRef.on('value', (snapshot) => {
      const data = snapshot.val();
      const balancesData = data || {};
      setBalances(balancesData);
    });
  }, []);

  const updateBalance = () => {
    const newAmount = parseInt(editAmount);
    if (editName && !isNaN(newAmount)) {
      const balancesRef = database.ref('balances');
      balancesRef.child(editName).set(newAmount);
      setEditName('');
      setEditAmount('');
    }
  };

  const removePlayer = (name) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the leaderboard?`)) {
      const balancesRef = database.ref(`balances/${name}`);
      const namesRef = database.ref('names').orderByValue().equalTo(name);

      balancesRef.remove();
      namesRef.once('child_added', (snapshot) => {
        snapshot.ref.remove();
      });
    }
  };

  const sortedBalances = Object.entries(balances).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <h1>HomePage</h1>
      <ul>
        {sortedBalances.map(([name, balance], index) => (
          <li key={index}>
            {name}: {balance}
            <button onClick={() => removePlayer(name)}>Remove</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        list="playerNames"
        placeholder="Name"
        value={editName}
        onChange={(e) => setEditName(e.target.value)}
      />
      <datalist id="playerNames">
        {namesFromDB.map((name, index) => (
          <option key={index} value={name} />
        ))}
      </datalist>
      <input
        type="number"
        placeholder="Amount"
        value={editAmount}
        onChange={(e) => setEditAmount(e.target.value)}
      />
      <button onClick={updateBalance}>Edit Leaderboard</button>
      <Link to="/new-game">New Game</Link>
    </div>
  );
};

export default HomePage;
