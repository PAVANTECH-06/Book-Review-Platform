import React, { useState, useContext } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="card p-4">
      <h3>Login</h3>
      <form onSubmit={submit}>
        <div className="mb-2">
          <input name="email" value={form.email} onChange={handle} className="form-control" placeholder="Email" />
        </div>
        <div className="mb-2">
          <input name="password" value={form.password} onChange={handle} type="password" className="form-control" placeholder="Password" />
        </div>
        <button className="btn btn-success">Login</button>
      </form>
    </div>
  );
}
