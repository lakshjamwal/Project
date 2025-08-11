import { Link } from 'react-router-dom';

export default function ItemCard({ item }) {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12, display: 'flex', gap: 12 }}>
      {item.photoUrl && <img src={item.photoUrl} alt="" width={96} height={96} style={{ objectFit: 'cover', borderRadius: 6 }} />}
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0 }}>{item.title}</h3>
        <div style={{ fontSize: 14, color: '#555' }}>{item.category} • {item.location || 'Unknown'}</div>
        <p style={{ marginTop: 8 }}>{item.description?.slice(0, 120)}</p>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#777' }}>{new Date(item.createdAt).toLocaleString()}</span>
          <span style={{ fontSize: 12, color: '#333' }}>Status: {item.status}</span>
          <Link to={`/item/${item._id}`} style={{ marginLeft: 'auto' }}>View</Link>
        </div>
      </div>
    </div>
  );
}
