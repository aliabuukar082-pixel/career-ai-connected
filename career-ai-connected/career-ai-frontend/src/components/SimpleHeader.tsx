import { Link } from 'react-router-dom'
import { BrainCircuit, LogIn, UserPlus } from 'lucide-react'
import { motion } from 'framer-motion'

const SimpleHeader = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800/50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center group transform transition-all duration-300 hover:scale-105"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-indigo-500/25">
              <BrainCircuit className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-100">Career AI</span>
          </Link>

          {/* Navigation Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              to="/login"
              className="flex items-center px-4 py-2 text-slate-300 hover:text-slate-100 transition-colors duration-300 group"
            >
              <LogIn className="w-4 h-4 mr-2 group-hover:text-indigo-400 transition-colors" />
              <span className="font-medium group-hover:text-indigo-400 transition-colors">Login</span>
            </Link>
            
            <Link
              to="/register"
              className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              <span>Get Started</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  )
}

export default SimpleHeader
