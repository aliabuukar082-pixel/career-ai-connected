import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import axios from 'axios'
import ProgressTracker from '../components/ProgressTracker'
import { 
  BrainCircuit, 
  Target, 
  TrendingUp, 
  ArrowRight,
  CheckCircle,
  Zap,
  Upload,
  Star,
  BarChart3,
  Calendar,
  FileText,
  Briefcase,
  Lightbulb,
  Rocket,
  Activity,
  Users,
  Award,
  Sparkles,
  Globe,
  Cpu,
  Shield,
  Eye,
  Heart,
  Flame,
  Lock
} from 'lucide-react'

const Dashboard = () => {
  const { user } = useAuth()
  const [progress, setProgress] = useState({
    resume_uploaded: false,
    assessment_completed: false,
    career_matches_ready: false,
    current_step: 'upload_resume'
  })
  const [loading, setLoading] = useState(true)

  // Calculate completion percentages based on progress
  const profileCompletion = progress.resume_uploaded ? 100 : 25
  const assessmentProgress = progress.assessment_completed ? 100 : (progress.resume_uploaded ? 50 : 0)

  useEffect(() => {
    fetchUserProgress()
  }, [])

  const fetchUserProgress = async () => {
    try {
      const token = localStorage.getItem('access_token')
      const response = await axios.get('http://localhost:8000/api/progress/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      setProgress(response.data)
    } catch (error) {
      console.error('Failed to fetch user progress:', error)
    } finally {
      setLoading(false)
    }
  }

  // Define progress steps
  const progressSteps = [
    {
      id: 'upload_resume',
      name: 'Upload Resume',
      href: '/resume-upload',
      completed: progress.resume_uploaded,
      locked: false,
      current: progress.current_step === 'upload_resume' && !progress.resume_uploaded
    },
    {
      id: 'assessment',
      name: 'Assessment',
      href: '/questionnaire',
      completed: progress.assessment_completed,
      locked: !progress.resume_uploaded,
      current: progress.current_step === 'assessment' && !progress.assessment_completed
    },
    {
      id: 'career_matches',
      name: 'Career Matches',
      href: '/recommendations',
      completed: progress.career_matches_ready,
      locked: !progress.assessment_completed,
      current: progress.current_step === 'career_matches' && !progress.career_matches_ready
    },
    {
      id: 'job_search',
      name: 'Job Search',
      href: '/job-search',
      completed: false,
      locked: !progress.career_matches_ready,
      current: progress.current_step === 'job_search'
    }
  ]

  const quickActions = [
    {
      title: "Upload Resume",
      description: "Get AI analysis of your resume",
      icon: Upload,
      href: "/resume-upload",
      color: "from-blue-500 to-cyan-600",
      locked: false
    },
    {
      title: "Take Assessment",
      description: "Complete AI-powered career assessment",
      icon: BrainCircuit,
      href: "/questionnaire",
      color: "from-indigo-500 to-purple-600",
      locked: !progress.resume_uploaded
    },
    {
      title: "Explore Careers",
      description: "Browse career recommendations",
      icon: Briefcase,
      href: "/recommendations",
      color: "from-green-500 to-emerald-600",
      locked: !progress.assessment_completed
    },
    {
      title: "Find Jobs",
      description: "Search for job opportunities",
      icon: Target,
      href: "/job-search",
      color: "from-purple-500 to-pink-600",
      locked: !progress.career_matches_ready
    }
  ]

  const careerMatches = [
    { career: "Senior Software Engineer", match: 92, category: "Technology" },
    { career: "Product Manager", match: 85, category: "Management" },
    { career: "Data Scientist", match: 78, category: "Analytics" },
    { career: "UX Designer", match: 71, category: "Design" }
  ]

  const skills = [
    { name: "Technical Skills", level: 85 },
    { name: "Leadership", level: 70 },
    { name: "Communication", level: 90 },
    { name: "Problem Solving", level: 88 },
    { name: "Creativity", level: 75 },
    { name: "Teamwork", level: 92 }
  ]

  const weeklyGoals = [
    { id: 1, task: "Complete LinkedIn profile optimization", completed: true },
    { id: 2, task: "Research 3 target companies", completed: true },
    { id: 3, task: "Practice interview questions", completed: false },
    { id: 4, task: "Update resume with new skills", completed: false },
    { id: 5, task: "Network with 2 industry professionals", completed: false }
  ]

  const trendingCareers = [
    { title: "AI/ML Engineer", growth: "+35%", demand: "Very High" },
    { title: "Data Scientist", growth: "+28%", demand: "High" },
    { title: "Cloud Architect", growth: "+22%", demand: "High" },
    { title: "DevOps Engineer", growth: "+18%", demand: "High" }
  ]

  const careerRoadmap = [
    { step: "Foundation Skills", status: "completed", description: "Complete technical fundamentals" },
    { step: "Specialization", status: "current", description: "Focus on AI/ML specialization" },
    { step: "Portfolio Building", status: "pending", description: "Create impressive project portfolio" },
    { step: "Networking", status: "pending", description: "Build professional network" },
    { step: "Job Applications", status: "pending", description: "Apply to target positions" }
  ]

  const aiInsights = {
    topRecommendation: "Senior Software Engineer",
    reasoning: "Your technical skills, problem-solving abilities, and experience align perfectly with senior software engineering roles. The high demand for tech professionals and your strong foundation make this an optimal career path.",
    marketDemand: "Very High",
    salaryRange: "$120K - $180K",
    growthPotential: "Excellent"
  }

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        {/* Modern Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="border-b border-slate-800/50 backdrop-blur-xl bg-slate-900/30"
        >
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  Career Dashboard
                </h1>
                <p className="text-slate-400 mt-1">AI-powered career intelligence platform</p>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-white font-medium">{user?.first_name || 'User'}</div>
                  <div className="text-slate-400 text-sm">Premium Member</div>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user?.first_name?.[0]?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.header>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
          {/* Progress Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ProgressTracker steps={progressSteps} />
          </motion.div>

          {/* Stats Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <BrainCircuit className="w-6 h-6 text-blue-400" />
                </div>
                <span className="text-3xl font-bold text-white">{profileCompletion}%</span>
              </div>
              <div className="text-slate-400 text-sm">Profile Complete</div>
              <div className="mt-2 w-full bg-slate-800 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${profileCompletion}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-purple-500/20 rounded-xl">
                  <Target className="w-6 h-6 text-purple-400" />
                </div>
                <span className="text-3xl font-bold text-white">92%</span>
              </div>
              <div className="text-slate-400 text-sm">Career Match</div>
              <div className="mt-2 flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className={`h-2 flex-1 rounded-full ${i < 4 ? 'bg-purple-500' : 'bg-slate-700'}`}></div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <TrendingUp className="w-6 h-6 text-green-400" />
                </div>
                <span className="text-3xl font-bold text-white">{assessmentProgress}%</span>
              </div>
              <div className="text-slate-400 text-sm">Assessment</div>
              <div className="mt-2 w-full bg-slate-800 rounded-full h-2">
                <motion.div 
                  className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${assessmentProgress}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-amber-500/20 rounded-xl">
                  <Award className="w-6 h-6 text-amber-400" />
                </div>
                <span className="text-3xl font-bold text-white">8</span>
              </div>
              <div className="text-slate-400 text-sm">Skills Verified</div>
              <div className="mt-2 flex space-x-1">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-2 w-2 bg-amber-500 rounded-full"></div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: action.locked ? 1 : 1.02 }}
                  className="group"
                >
                  {action.locked ? (
                    <div className="block bg-slate-900/30 backdrop-blur-sm border border-slate-800/30 rounded-2xl p-6 opacity-60 cursor-not-allowed">
                      <div className="inline-flex p-3 bg-slate-800 rounded-xl mb-4 relative">
                        <action.icon className="w-6 h-6 text-slate-500" />
                        <Lock className="w-3 h-3 text-slate-600 absolute -top-1 -right-1" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-400 mb-2">{action.title}</h3>
                      <p className="text-slate-500 text-sm">{action.description}</p>
                      <div className="mt-4 flex items-center text-slate-500 text-sm font-medium">
                        <Lock className="w-4 h-4 mr-1" />
                        Complete previous steps first
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={action.href}
                      className={`block bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6 hover:border-${action.color.split('-')[1]}-500/50 transition-all duration-300`}
                    >
                      <div className={`inline-flex p-3 bg-gradient-to-br ${action.color} rounded-xl mb-4`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2">{action.title}</h3>
                      <p className="text-slate-400 text-sm">{action.description}</p>
                      <div className="mt-4 flex items-center text-blue-400 text-sm font-medium">
                        Get Started <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

        {/* AI Insights Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4">AI Career Insights</h2>
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-purple-400 mb-2">Top Recommendation</h3>
                  <p className="text-2xl font-bold text-white mb-2">{aiInsights.topRecommendation}</p>
                  <p className="text-slate-300 text-sm mb-4">{aiInsights.reasoning}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm">{aiInsights.marketDemand}</span>
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm">{aiInsights.salaryRange}</span>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-lg text-sm">{aiInsights.growthPotential}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                    <div className="text-4xl font-bold text-purple-400 mb-2">92%</div>
                    <div className="text-slate-300">Match Score</div>
                  </div>
                  <div className="text-center p-4 bg-slate-800/50 rounded-xl">
                    <div className="text-2xl font-bold text-green-400 mb-2">88%</div>
                    <div className="text-slate-300">Skills Match</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Career Matches */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold text-white mb-4">Career Matches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {careerMatches.map((career, index) => (
                <motion.div
                  key={career.career}
                  className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-white font-semibold">{career.career}</h3>
                      <span className="text-slate-400 text-xs">{career.category}</span>
                    </div>
                    <span className="text-purple-400 font-bold text-lg">{career.match}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <motion.div 
                      className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${career.match}%` }}
                      transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Skills and Roadmap */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Skills Analysis</h2>
              <div className="space-y-3">
                {skills.map((skill, index) => (
                  <motion.div
                    key={skill.name}
                    className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-cyan-300 font-medium">{skill.name}</span>
                      <span className="text-white font-bold">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2">
                      <motion.div 
                        className="bg-gradient-to-r from-cyan-400 to-blue-400 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Roadmap */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Career Roadmap</h2>
              <div className="space-y-3">
                {careerRoadmap.map((step, index) => (
                  <motion.div
                    key={step.step}
                    className="flex items-start space-x-3 bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                      step.status === 'completed' ? 'bg-green-500' : 
                      step.status === 'current' ? 'bg-blue-500' : 'bg-slate-600'
                    }`}>
                      {step.status === 'completed' && <CheckCircle className="w-4 h-4 text-white" />}
                      {step.status === 'current' && (
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                      )}
                    </div>
                    <div>
                      <h3 className={`font-semibold ${
                        step.status === 'completed' ? 'text-green-400' : 
                        step.status === 'current' ? 'text-blue-400' : 'text-slate-400'
                      }`}>{step.step}</h3>
                      <p className="text-slate-300 text-sm">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            {/* Goals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Weekly Goals</h2>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
                <div className="space-y-2">
                  {weeklyGoals.map((goal) => (
                    <div key={goal.id} className="flex items-center space-x-3 p-2">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        goal.completed 
                          ? 'bg-green-500 border-green-500' 
                          : 'border-slate-600'
                      }`}>
                        {goal.completed && <CheckCircle className="w-3 h-3 text-white" />}
                      </div>
                      <span className={`text-sm ${goal.completed ? 'text-slate-500 line-through' : 'text-slate-300'}`}>
                        {goal.task}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress:</span>
                    <span className="text-orange-400 font-medium">2 of 5</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trending */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Trending Careers</h2>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
                <div className="space-y-2">
                  {trendingCareers.map((career) => (
                    <div key={career.title} className="flex items-center justify-between p-2">
                      <div>
                        <h3 className="text-white text-sm font-medium">{career.title}</h3>
                        <span className="text-emerald-400 text-xs">{career.demand}</span>
                      </div>
                      <span className="text-green-400 font-bold text-sm">{career.growth}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Resume */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
            >
              <h2 className="text-xl font-semibold text-white mb-4">Resume Analysis</h2>
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-xl p-4">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div className="text-center p-2 bg-slate-800/50 rounded">
                    <div className="text-xl font-bold text-blue-400">--</div>
                    <div className="text-slate-400 text-xs">Score</div>
                  </div>
                  <div className="text-center p-2 bg-slate-800/50 rounded">
                    <div className="text-xl font-bold text-green-400">--</div>
                    <div className="text-slate-400 text-xs">Keywords</div>
                  </div>
                  <div className="text-center p-2 bg-slate-800/50 rounded">
                    <div className="text-xl font-bold text-purple-400">--</div>
                    <div className="text-slate-400 text-xs">Tips</div>
                  </div>
                </div>
                <Link
                  to="/resume-upload"
                  className="block w-full text-center py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  Upload Resume
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
