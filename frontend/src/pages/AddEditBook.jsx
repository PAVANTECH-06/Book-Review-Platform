import React, { useState, useEffect, useContext } from 'react';
import API from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function AddEditBook() {
  const { id } = useParams();
  const editing = !!id;
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ title: '', author: '', description: '', genre: '', year: '' });

  useEffect(() => {
    if (editing) {
      API.get(`/books/${id}`).then(res => {
        const b = res.data.book;
        setForm({ title: b.title, author: b.author, description: b.description || '', genre: b.genre || '', year: b.year || '' });
      });
    }
  }, [editing, id]);

  const submit = async e => {
    e.preventDefault();
    try {
      if (editing) await API.put(`/books/${id}`, form);
      else await API.post('/books', form);
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="card p-4">
      <h4>{editing ? 'Edit Book' : 'Add Book'}</h4>
      <form onSubmit={submit}>
        <div className="mb-2"><input className="form-control" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" /></div>
        <div className="mb-2"><input className="form-control" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Author" /></div>
        <div className="mb-2"><input className="form-control" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} placeholder="Genre" /></div>
        <div className="mb-2"><input className="form-control" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="Year" type="number" /></div>
        <div className="mb-2"><textarea className="form-control" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" /></div>
        <button className="btn btn-primary">{editing ? 'Save' : 'Add Book'}</button>
      </form>
    </div>
  );
}
