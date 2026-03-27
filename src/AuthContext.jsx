import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem('mm_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    // Simulate login - in production, this would call your backend
    const storedUsers = JSON.parse(localStorage.getItem('mm_users') || '[]')
    const foundUser = storedUsers.find(u => u.email === email && u.password === password)
    
    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem('mm_user', JSON.stringify(userWithoutPassword))
      return { success: true }
    }
    return { success: false, error: 'Invalid email or password' }
  }

  const signup = (userData) => {
    // Simulate signup - in production, this would call your backend
    const storedUsers = JSON.parse(localStorage.getItem('mm_users') || '[]')
    
    // Check if user already exists
    if (storedUsers.find(u => u.email === userData.email)) {
      return { success: false, error: 'Email already registered' }
    }

    const newUser = {
      id: Date.now().toString(),
      ...userData,
      emailVerified: false,
      createdAt: new Date().toISOString()
    }

    storedUsers.push(newUser)
    localStorage.setItem('mm_users', JSON.stringify(storedUsers))

    const { password, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem('mm_user', JSON.stringify(userWithoutPassword))
    
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('mm_user')
  }

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem('mm_user', JSON.stringify(updatedUser))

    // Update in users list
    const storedUsers = JSON.parse(localStorage.getItem('mm_users') || '[]')
    const updatedUsers = storedUsers.map(u => 
      u.id === user.id ? { ...u, ...updates } : u
    )
    localStorage.setItem('mm_users', JSON.stringify(updatedUsers))
  }

  const sendVerificationEmail = () => {
    // Simulate sending verification email
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true })
      }, 1000)
    })
  }

  const verifyEmail = (code) => {
    // Simulate email verification
    if (code === '123456') {
      updateProfile({ emailVerified: true })
      return { success: true }
    }
    return { success: false, error: 'Invalid verification code' }
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      signup,
      logout,
      updateProfile,
      sendVerificationEmail,
      verifyEmail,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
