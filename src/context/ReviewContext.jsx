import { createContext, useContext, useEffect, useState } from 'react'

const ReviewContext = createContext()

export function ReviewProvider({ children }) {
  const [reviews, setReviews] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [lastAnalysisType, setLastAnalysisType] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem('moneymentor_reviews')
    if (saved) {
      setReviews(JSON.parse(saved))
    }
  }, [])

  const saveReview = (review) => {
    const newReviews = [...reviews, { ...review, id: Date.now(), date: new Date().toISOString() }]
    setReviews(newReviews)
    localStorage.setItem('moneymentor_reviews', JSON.stringify(newReviews))
    setIsModalOpen(false)
  }

  const triggerReview = (type) => {
    setLastAnalysisType(type)
    // Small delay to let the results animation finish
    setTimeout(() => {
      setIsModalOpen(true)
    }, 2000)
  }

  const getTopReview = () => {
    if (reviews.length === 0) return null
    // Sort by rating (desc) and then by date (desc)
    return [...reviews].sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating
      return new Date(b.date) - new Date(a.date)
    })[0]
  }

  return (
    <ReviewContext.Provider value={{
      reviews,
      isModalOpen,
      setIsModalOpen,
      saveReview,
      triggerReview,
      getTopReview,
      lastAnalysisType
    }}>
      {children}
    </ReviewContext.Provider>
  )
}

export const useReview = () => useContext(ReviewContext)
