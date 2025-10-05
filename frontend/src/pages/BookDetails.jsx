import React, { useEffect, useState, useContext } from 'react';
import API from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [avg, setAvg] = useState(null);
  const [form, setForm] = useState({ rating: 5, reviewText: '' });

  const load = async () => {
    const res = await API.get(`/books/${id}`);
    setBook(res.data.book);
    setReviews(res.data.reviews || []);
    setAvg(res.data.averageRating ?? null);
  };

  useEffect(() => { load(); }, [id]);

  const submitReview = async e => {
    e.preventDefault();
    try {
      await API.post('/reviews', { bookId: id, rating: form.rating, reviewText: form.reviewText });
      setForm({ rating: 5, reviewText: '' });
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || 'Failed to add review');
    }
  };

  const deleteBook = async () => {
    if (!confirm('Delete this book?')) return;
    try {
      await API.delete(`/books/${id}`);
      alert('Deleted');
      navigate('/');
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  const deleteReview = async (reviewId) => {
    if (!confirm('Delete this review?')) return;
    try {
      await API.delete(`/reviews/${reviewId}`);
      await load();
    } catch (err) {
      alert(err?.response?.data?.message || 'Delete failed');
    }
  };

  if (!book) return <div>Loading...</div>;

  return (
    <div>
      <div className="card mb-4">
        <div className="card-body">
          <h2>{book.title}</h2>
          <h6 className="text-muted">By {book.author} — {book.genre} • {book.year}</h6>
          <p className="mt-3">{book.description}</p>
          <div className="mt-2">
            <span className="badge bg-warning text-dark">{avg ? `${avg} ★` : 'No ratings'}</span>
            <span className="ms-2 text-muted">{reviews.length} reviews</span>
          </div>

          {user && book.addedBy && user.id === String(book.addedBy._id) && (
            <div className="mt-3">
              <button className="btn btn-sm btn-outline-primary me-2" onClick={() => navigate(`/edit/${book._id}`)}>Edit</button>
              <button className="btn btn-sm btn-danger" onClick={deleteBook}>Delete</button>
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h5>Reviews</h5>
        {reviews.length === 0 && <div className="text-muted">No reviews yet.</div>}
        {reviews.map(r => (
          <div key={r._id} className="card mb-2">
            <div className="card-body">
              <div className="d-flex justify-content-between">
                <div><strong>{r.userId?.name || 'User'}</strong></div>
                <div className="text-warning">★ {r.rating}</div>
              </div>
              <p>{r.reviewText}</p>
              {user && r.userId && user.id === r.userId._id && (
                <div>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => navigate(`/edit/${book._id}`)}>Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteReview(r._id)}>Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {user ? (
        <div className="card p-3">
          <h6>Add a review</h6>
          <form onSubmit={submitReview} className="d-flex gap-2">
            <select className="form-select w-auto" value={form.rating} onChange={e => setForm({ ...form, rating: Number(e.target.value) })}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <input className="form-control" value={form.reviewText} onChange={e => setForm({ ...form, reviewText: e.target.value })} placeholder="Write your review" />
            <button className="btn btn-primary">Submit</button>
          </form>
        </div>
      ) : (
        <div className="alert alert-secondary">Please log in to add a review.</div>
      )}
    </div>
  );
}
