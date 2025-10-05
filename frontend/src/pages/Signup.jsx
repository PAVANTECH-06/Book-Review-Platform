import React, { useState, useContext } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/signup', form);
      // backend responds with token + user
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="card p-4">
      <h3>Create account</h3>
      <form onSubmit={submit}>
        <div className="mb-2">
          <input name="name" value={form.name} onChange={handle} className="form-control" placeholder="Full name" />
        </div>
        <div className="mb-2">
          <input name="email" value={form.email} onChange={handle} className="form-control" placeholder="Email" />
        </div>
        <div className="mb-2">
          <input name="password" type="password" value={form.password} onChange={handle} className="form-control" placeholder="Password" />
        </div>
        <button className="btn btn-primary">Sign up</button>
      </form>
    </div>
  );
}
