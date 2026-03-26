import { createContext, useContext, useEffect, useState } from 'react'

const CreditContext = createContext()

export function CreditProvider({ children }) {
  const [credits, setCredits] = useState(5)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [showPaywall, setShowPaywall] = useState(false)

  // Load from local storage on mount
  useEffect(() => {
    const savedCredits = localStorage.getItem('mm_remaining_credits')
    const savedSub = localStorage.getItem('mm_is_subscribed')

    if (savedCredits !== null) setCredits(parseInt(savedCredits, 10))
    if (savedSub === 'true') setIsSubscribed(true)
  }, [])

  // Save to local storage when credits change
  useEffect(() => {
    localStorage.setItem('mm_remaining_credits', credits.toString())
    localStorage.setItem('mm_is_subscribed', isSubscribed.toString())
  }, [credits, isSubscribed])

  const useCredit = () => {
    if (isSubscribed) return true // Unlimited
    if (credits > 0) {
      setCredits(prev => prev - 1)
      return true
    }
    setShowPaywall(true)
    return false
  }

  const simulateSubscription = () => {
    setIsSubscribed(true)
    setShowPaywall(false)
    alert("Payment successful! You are now a Premium Member. 🚀")
  }

  return (
    <CreditContext.Provider value={{ credits, isSubscribed, showPaywall, setShowPaywall, useCredit, simulateSubscription }}>
      {children}
    </CreditContext.Provider>
  )
}

export const useCredits = () => useContext(CreditContext)
