import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
  const { user } = useContext(AuthContext);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (user) {
      API.get(`/books?addedBy=${user.id}`).then(res => setBooks(res.data.books || []));
    }
  }, [user]);

  if (!user) return <div>Please login to view profile.</div>;

  return (
    <div>
      <h4>{user.name}'s Profile</h4>
      <p>{user.email}</p>

      <h5 className="mt-4">Books you added</h5>
      {books.length === 0 && <div className="text-muted">No books yet.</div>}
      {books.map(b => (
        <div className="card mb-2" key={b._id}>
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <Link to={`/book/${b._id}`} className="text-decoration-none"><strong>{b.title}</strong></Link>
              <div className="text-muted">{b.author}</div>
            </div>
            <div>
              <Link to={`/edit/${b._id}`} className="btn btn-sm btn-outline-primary me-2">Edit</Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
