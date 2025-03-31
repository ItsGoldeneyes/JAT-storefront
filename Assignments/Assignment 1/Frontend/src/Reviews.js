import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

function Reviews() {
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(1);
  const [userId, setUserId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("purchasedItems")) || [];
    setPurchasedItems(storedItems);
  }, []);

  useEffect(() => {
    if (selectedItem) {
      fetchReviews(selectedItem.Item_Id);
    }
  }, [selectedItem]);

  const verifyAccessToken = async () => {
    const token = Cookies.get('access_token');
    if (token) {
      try {
        const response = await axios.post("http://localhost/Assignment1/access_token_check.php", {}, {
          headers: {
            'Authorization': `${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (response.data.success) {
          setUserId(response.data.user_id);
        } else {
          setError('Failed to verify access token.');
        }
      } catch (error) {
        console.error('Error verifying access token:', error);
        setError('Error verifying access token.');
      }
    } else {
      setError('No access token found.');
    }
  };

  useEffect(() => {
    verifyAccessToken();
  }, []);

  const fetchReviews = async (itemId) => {
    try {
      const response = await axios.post("http://localhost/Assignment1/get_reviews.php", {
        item_id: itemId
      });
      setReviews(response.data.reviews || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedItem || !newReview.trim() || rating < 1 || rating > 5 || userId === null) {
      console.error("Validation failed: Missing data", { selectedItem, newReview, rating, userId });
      return;
    }

    const payload = {
      item_id: selectedItem.Item_Id,
      review: newReview,
      ranking_num: rating,
      user_id: userId,
    };

    console.log("Submitting review:", payload);

    try {
      const response = await axios.post("http://localhost/Assignment1/submit_review.php", payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response:", response.data);

      if (response.data.success) {
        fetchReviews(selectedItem.Item_Id);
        setNewReview('');
        setRating(1);
      } else {
        console.error("Error from API:", response.data.message);
      }
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  return (
    <div>
      <h1>Reviews</h1>
      <h2>Select an item to review:</h2>
      <ul>
        {purchasedItems.length > 0 ? (
          purchasedItems.map((item) => (
            <li key={item.Item_Id}>
              <button onClick={() => setSelectedItem(item)}>
                {item.Item_name}
              </button>
            </li>
          ))
        ) : (
          <p>No purchased items available for review.</p>
        )}
      </ul>

      {selectedItem && (
        <div>
          <h2>Reviews for {selectedItem.Item_name}</h2>
          <ul>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <li key={index}>
                  <p>{review.review}</p>
                  <p>Rating: {review.ranking_num}</p>
                </li>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </ul>
          
          <div>
            <h3>Rate this item:</h3>
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setRating(num)}
                style={{ fontWeight: rating === num ? 'bold' : 'normal' }}
              >
                {num}
              </button>
            ))}
          </div>

          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review here..."
          />
          <button onClick={handleReviewSubmit}>Submit Review</button>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Reviews;