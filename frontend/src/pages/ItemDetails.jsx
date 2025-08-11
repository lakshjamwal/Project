import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function ItemDetails() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [message, setMessage] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => { (async () => { const { data } = await api.get(`/items/${id}`); setItem(data); })(); }, [id]);

  const claim = async () => {
    await api.post('/claims', { itemId: id, message, answer });
    alert('Claim submitted');
  };

  const markReturned = async () => {
    await api.patch(`/items/${id}/status`, { status: 'returned' });
    const { data } = await api.get(`/items/${id}`); setItem(data);
  };

  if (!item) return <div>Loading...</div>;
  return (
    <div>
      <h2>{item.title}</h2>
      {item.photoUrl && <img src={item.photoUrl} alt="" style={{ maxWidth: '100%', borderRadius: 8 }} />}
      <p><b>Type:</b> {item.type} • <b>Status:</b> {item.status}</p>
      <p><b>Category:</b> {item.category} • <b>Location:</b> {item.location} • <b>Date:</b> {item.date ? new Date(item.date).toLocaleDateString() : '—'}</p>
      <p>{item.description}</p>
      <p><b>Question:</b> {item.claimQuestion || '—'}</p>

      {item.status === 'active' && (
        <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
          <h3>Claim this item</h3>
          <input placeholder="Your message" value={message} onChange={(e) => setMessage(e.target.value)} />
          <input placeholder="Your answer to question" value={answer} onChange={(e) => setAnswer(e.target.value)} />
          <button onClick={claim}>Submit Claim</button>
        </div>
      )}

      <div style={{ marginTop: 12 }}>
        <button onClick={markReturned}>Mark as Returned (owner)</button>
      </div>
    </div>
  );
}
