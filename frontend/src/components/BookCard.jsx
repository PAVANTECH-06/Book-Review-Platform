import React from "react";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function BookCard({ book }) {
  return (
    <Card className="shadow-sm h-100">
      <Card.Body>
        <Card.Title>{book.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          {book.author} ({book.year})
        </Card.Subtitle>
        <Card.Text>{book.description?.slice(0, 100)}...</Card.Text>
        <Button variant="primary" as={Link} to={`/books/${book._id}`}>
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
}
