import { useState } from 'react';
import api from '../api';

export default function ItemForm({ type }) {
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '', date: '', claimQuestion: '', tags: '' });
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState(null);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries({ ...form, type }).forEach(([k, v]) => fd.append(k, v));
      if (photo) fd.append('photo', photo);
      const { data } = await api.post('/items', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setCreated(data);
      setForm({ title: '', description: '', category: '', location: '', date: '', claimQuestion: '', tags: '' });
      setPhoto(null);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
      <input name="title" placeholder="Title" value={form.title} onChange={onChange} required />
      <input name="category" placeholder="Category (Bottle, ID Card, Book...)" value={form.category} onChange={onChange} />
      <input name="location" placeholder="Location" value={form.location} onChange={onChange} />
      <input name="date" type="date" value={form.date} onChange={onChange} />
      <textarea name="description" placeholder="Description" value={form.description} onChange={onChange} />
      <input name="tags" placeholder="tags (comma separated)" value={form.tags} onChange={onChange} />
      <input name="claimQuestion" placeholder="Match question (e.g., sticker on laptop?)" value={form.claimQuestion} onChange={onChange} />
      <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files[0])} />
      <button disabled={submitting}>{submitting ? 'Submitting...' : `Post ${type}`}</button>
      {created && <div>Created ✓ <a href={`/item/${created._id}`}>Open</a></div>}
    </form>
  );
}
