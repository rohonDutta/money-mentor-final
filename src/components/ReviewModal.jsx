import { MessageSquare, Star, X } from 'lucide-react'
import { useState } from 'react'
import { useReview } from '../context/ReviewContext'
import './ReviewModal.css'

export default function ReviewModal() {
  const { isModalOpen, setIsModalOpen, saveReview, lastAnalysisType } = useReview()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')

  if (!isModalOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (rating === 0) return

    saveReview({
      rating,
      comment,
      type: lastAnalysisType,
      userName: 'Anonymous Mentor User' // Fixed for simplicity in this hackathon version
    })

    // Reset state
    setRating(0)
    setComment('')
  }

  return (
    <div className="review-modal-overlay animate-fade-in">
      <div className="review-modal glass-card animate-scale-in">
        <button className="review-close" onClick={() => setIsModalOpen(false)}>
          <X size={20} />
        </button>

        <div className="review-icon-wrap">
          <MessageSquare size={32} />
        </div>

        <h2>Great insights?</h2>
        <p>How would you rate your {lastAnalysisType} experience?</p>

        <form onSubmit={handleSubmit}>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${(hover || rating) >= star ? 'active' : ''}`}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  size={32}
                  fill={(hover || rating) >= star ? 'currentColor' : 'none'}
                />
              </button>
            ))}
          </div>

          <textarea
            className="review-textarea"
            placeholder="Tell us what you liked (or what we could improve)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          ></textarea>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={rating === 0}
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  )
}
