import React, { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'

// Import components
import Header from './components/Header'
import SimpleHeader from './components/SimpleHeader'
import DashboardLayout from './components/DashboardLayout'
import AIChatbot from './components/AIChatbot'

// Import pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import DualRegister from './pages/DualRegister'
import Dashboard from './pages/Dashboard'
import EmployerDashboard from './pages/EmployerDashboard'
import Profile from './pages/Profile'
import ResumeUpload from './pages/ResumeUpload'
import ResumeAnalysisResults from './pages/ResumeAnalysisResults'
import CareerQuestionnaire from './pages/CareerQuestionnaire'
import AIRecommendations from './pages/AIRecommendations'
import JobSearchOptimized from './pages/JobSearchOptimized'
import JobSearchRedesigned from './pages/JobSearchRedesigned'
import JobSearchFixed from './pages/JobSearchFixed'
import JobSearchRedesignedNew from './pages/JobSearchRedesignedNew'
import JobSearchProduction from './pages/JobSearchProduction'
import JobSearchDebug from './pages/JobSearchDebug'
import AIJobMatchingDashboard from './pages/AIJobMatchingDashboard'
import ApiTest from './pages/ApiTest'
import FeaturesSelection from './pages/FeaturesSelection'

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <>{children}</>
}

// Role-based Dashboard Component
const RoleBasedDashboard: React.FC = () => {
  const { user } = useAuth()
  
  if (user?.role === 'job_provider') {
    return <EmployerDashboard />
  }
  
  return <Dashboard />
}

// Public Route Component
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth()
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }
  
  return <>{children}</>
}

// Login Page Component with redirect after login
const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect to features selection if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/features', { replace: true })
    }
  }, [isAuthenticated, navigate])

  return <Login />
}

// Register Page Component with redirect after registration
const RegisterPage: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  // Redirect to features selection if already logged in
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/features', { replace: true })
    }
  }, [isAuthenticated, navigate])

  return <Register />
}

// Main App Component
const App: React.FC = () => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  
  // Listen for chatbot trigger events
  React.useEffect(() => {
    const handleOpenChatbot = () => setIsChatbotOpen(true)
    window.addEventListener('openChatbot', handleOpenChatbot)
    
    return () => {
      window.removeEventListener('openChatbot', handleOpenChatbot)
    }
  }, [])
  
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-900">
        <Routes>
          {/* Public Routes - Landing page with simple header */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <SimpleHeader />
                <Landing />
              </PublicRoute>
            }
          />

          {/* Auth Routes with simple header (logo + login/get started only) */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <SimpleHeader />
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <SimpleHeader />
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register/dual"
            element={
              <PublicRoute>
                <SimpleHeader />
                <DualRegister />
              </PublicRoute>
            }
          />

          {/* Protected Routes with Dashboard Layout - After login/registration */}
          <Route
            path="/features"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<FeaturesSelection />} />
          </Route>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<RoleBasedDashboard />} />
          </Route>
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Profile />} />
          </Route>
          
          <Route
            path="/resume-upload"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ResumeUpload />} />
          </Route>
          
          <Route
            path="/resume-analysis-results"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ResumeAnalysisResults />} />
          </Route>
          
          <Route
            path="/questionnaire"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CareerQuestionnaire />} />
          </Route>
          
          <Route
            path="/recommendations"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AIRecommendations />} />
          </Route>
          
          <Route
            path="/ai-matching"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AIJobMatchingDashboard />} />
          </Route>
          
          <Route
            path="/job-search"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<JobSearchProduction />} />
          </Route>
          
          <Route
            path="/job-search-prod"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<JobSearchProduction />} />
          </Route>
          
          <Route
            path="/job-search-debug"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<JobSearchDebug />} />
          </Route>
          
          <Route
            path="/api-test"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<ApiTest />} />
          </Route>

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        
        {/* AI Chatbot - Global across all pages */}
        <AIChatbot 
          isOpen={isChatbotOpen} 
          onClose={() => setIsChatbotOpen(false)} 
        />
      </div>
    </AuthProvider>
  )
}

export default App
