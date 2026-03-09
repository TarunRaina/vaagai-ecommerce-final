// import { createContext, useContext, useMemo, useState } from 'react'

// const ACCESS_TOKEN_KEY = 'accessToken'

// const AuthContext = createContext(null)

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [token, setToken] = useState(() => localStorage.getItem(ACCESS_TOKEN_KEY))

//   const login = ({ user: nextUser, token: nextToken }) => {
//     setUser(nextUser ?? null)
//     setToken(nextToken ?? null)

//     if (nextToken) {
//       localStorage.setItem(ACCESS_TOKEN_KEY, nextToken)
//     }
//   }

//   const logout = () => {
//     setUser(null)
//     setToken(null)
//     localStorage.clear()
//   }

//   const isAuthenticated = Boolean(token)
//   const userType = user?.userType ?? user?.role ?? null

//   const value = useMemo(
//     () => ({
//       user,
//       token,
//       login,
//       logout,
//       isAuthenticated,
//       userType,
//     }),
//     [user, token, isAuthenticated, userType]
//   )

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }

// export const useAuth = () => {
//   const context = useContext(AuthContext)

//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider')
//   }

//   return context
// }


import { createContext, useContext, useMemo, useState } from 'react'

const ACCESS_TOKEN_KEY = 'accessToken'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {

  const [token, setToken] = useState(() => sessionStorage.getItem(ACCESS_TOKEN_KEY))

  const [user, setUser] = useState(() => {
    const storedToken = sessionStorage.getItem(ACCESS_TOKEN_KEY)

    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]))
        return {
          email: payload.email,
          user_type: payload.user_type
        }
      } catch {
        return null
      }
    }

    return null
  })

  const login = (nextToken, nextUser) => {
    setUser(nextUser ?? null)
    setToken(nextToken ?? null)

    if (nextToken) {
      sessionStorage.setItem(ACCESS_TOKEN_KEY, nextToken)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  }

  const isAuthenticated = Boolean(token)
  const userType = user?.user_type ?? null

  const value = useMemo(
    () => ({
      user,
      token,
      login,
      logout,
      isAuthenticated,
      userType
    }),
    [user, token, isAuthenticated, userType]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}