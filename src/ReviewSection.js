import { useState } from 'react';

const ReviewsSection = ({ movie }) => {
  const [expandedReviews, setExpandedReviews] = useState([]);

  const toggleExpand = (id) => {
    setExpandedReviews(prev =>
      prev.includes(id) ? prev.filter(rid => rid !== id) : [...prev, id]
    );
  };

  return (
    <>
      {movie.reviews?.results?.length > 0 && (
        <div className="section">
          <h2>Reviews</h2>
          <div className="reviews-container">
            {movie.reviews.results.map((review) => {
              const isExpanded = expandedReviews.includes(review.id);
              const content = isExpanded
                ? review.content
                : review.content.length > 300
                  ? `${review.content.slice(0, 300)}...`
                  : review.content;

              return (
                <div key={review.id} className="review">
                  <div className="review-header">
                    <strong>{review.author}</strong>
                  </div>
                  <div
                    className="review-content"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                  {review.content.length > 300 && (
                    <button
                      className="toggle-btn"
                      onClick={() => toggleExpand(review.id)}
                    >
                      {isExpanded ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default ReviewsSection;
