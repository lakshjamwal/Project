import { useEffect, useState } from 'react';
import api from '../api';

export default function Admin() {
  const [items, setItems] = useState([]);
  const [claims, setClaims] = useState([]);

  const fetchAll = async () => {
    const { data } = await api.get('/admin/items');
    setItems(data);
    const { data: pending } = await api.get('/claims/mine/pending');
    setClaims(pending);
  };

  useEffect(() => { fetchAll(); }, []);

  const toggleApprove = async (id, approved) => {
    await api.patch(`/admin/items/${id}/approve`, { approved });
    fetchAll();
  };

  const actOnClaim = async (id, status) => {
    await api.patch(`/claims/${id}`, { status });
    fetchAll();
  };

  return (
    <div>
      <h2>Admin</h2>

      <section>
        <h3>Items</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {items.map(i => (
            <div key={i._id} style={{ border: '1px solid #ddd', padding: 8, borderRadius: 6 }}>
              <b>{i.title}</b> — {i.type} — approved: {String(i.approved)} — status: {i.status}
              <div>
                <button onClick={() => toggleApprove(i._id, true)}>Approve</button>
                <button onClick={() => toggleApprove(i._id, false)}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 16 }}>
        <h3>Pending Claims on My Items</h3>
        <div style={{ display: 'grid', gap: 8 }}>
          {claims.map(c => (
            <div key={c._id} style={{ border: '1px solid #ddd', padding: 8, borderRadius: 6 }}>
              <div><b>Item:</b> {c.itemId?.title} ({c.itemId?.type})</div>
              <div><b>From:</b> {c.claimantId?.name} — {c.claimantId?.email}</div>
              <div><b>Msg:</b> {c.message}</div>
              <div><b>Answer:</b> {c.answer}</div>
              <div>
                <button onClick={() => actOnClaim(c._id, 'approved')}>Approve</button>
                <button onClick={() => actOnClaim(c._id, 'rejected')}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
