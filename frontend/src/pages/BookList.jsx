import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Form } from "react-bootstrap";
import BookCard from "../components/BookCard";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [filters, setFilters] = useState({
    genre: "",
    author: "",
    year: "",
  });

  useEffect(() => {
    axios.get(`${API_URL}/books`)
      .then(res => {
        setBooks(res.data);
        setFilteredBooks(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    let filtered = books;

    if (filters.genre) {
      filtered = filtered.filter(b =>
        b.genre.toLowerCase().includes(filters.genre.toLowerCase())
      );
    }

    if (filters.author) {
      filtered = filtered.filter(b =>
        b.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    }

    if (filters.year) {
      filtered = filtered.filter(b =>
        String(b.year).includes(filters.year)
      );
    }

    setFilteredBooks(filtered);
  }, [filters, books]);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">📚 Book List</h2>
      <Form className="mb-4">
        <Row>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Filter by genre..."
              value={filters.genre}
              onChange={e => setFilters({ ...filters, genre: e.target.value })}
            />
          </Col>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Filter by author..."
              value={filters.author}
              onChange={e => setFilters({ ...filters, author: e.target.value })}
            />
          </Col>
          <Col md={4}>
            <Form.Control
              type="text"
              placeholder="Filter by year..."
              value={filters.year}
              onChange={e => setFilters({ ...filters, year: e.target.value })}
            />
          </Col>
        </Row>
      </Form>
      <Row>
        {filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <Col md={4} key={book._id} className="mb-4">
              <BookCard book={book} />
            </Col>
          ))
        ) : (
          <p className="text-center mt-3">No books found.</p>
        )}
      </Row>
    </Container>
  );
}
