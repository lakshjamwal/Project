import { useEffect, useState } from 'react';
import api from '../api';
import ItemCard from '../components/ItemCard.jsx';

export default function DashboardLost() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');

  useEffect(() => { fetchItems(); }, []);
  const fetchItems = async () => {
    const { data } = await api.get('/items', { params: { type: 'lost', q, category } });
    setItems(data.items || []);
  };

  return (
    <div>
      <h2>Lost Items</h2>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <input placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />
        <input placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} />
        <button onClick={fetchItems}>Filter</button>
      </div>
      <div style={{ display: 'grid', gap: 12 }}>
        {items.map(i => <ItemCard key={i._id} item={i} />)}
      </div>
    </div>
  );
}
