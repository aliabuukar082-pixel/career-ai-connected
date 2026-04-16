import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

interface ResumeAnalysis {
  skills: string[]
  experience_years: number
  education_level: string
  job_titles: string[]
  skill_categories: Record<string, string[]>
  career_suggestions: Array<{
    title: string
    match_score: number
    matched_skills: string[]
    missing_skills: string[]
  }>
  confidence_score: number
  processing_time: number
}

const ResumeAnalysisResults = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [resumeId, setResumeId] = useState<string | null>(null)

  useEffect(() => {
    if (location.state) {
      setAnalysis(location.state.analysis)
      setResumeId(location.state.resumeId)
    } else {
      // If no state, redirect to upload page
      navigate('/resume-upload')
    }
  }, [location.state, navigate])

  const handleViewJobMatches = () => {
    if (resumeId) {
      // Navigate to Job Search page with analysis data for matching
      navigate('/job-search', { state: { resumeId, analysis } })
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!analysis) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', color: 'white', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2>Loading analysis results...</h2>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)', color: 'white', padding: '40px 20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#10b981' }}>
            🧠 Resume Analysis Results
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.8, marginBottom: '15px' }}>
            Your resume has been analyzed by our AI. Here's what we found:
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '30px',
            flexWrap: 'wrap'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
                {Math.round(analysis.confidence_score * 100)}%
              </div>
              <div style={{ opacity: 0.7 }}>Confidence Score</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>
                {analysis.skills.length}
              </div>
              <div style={{ opacity: 0.7 }}>Skills Detected</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {analysis.experience_years || 'N/A'}
              </div>
              <div style={{ opacity: 0.7 }}>Years Experience</div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Skills Section */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '30px'
          }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#667eea' }}>
              💼 Extracted Skills
            </h2>
            <div style={{ marginBottom: '20px' }}>
              <strong>Total Skills Found:</strong> {analysis.skills.length}
            </div>
            
            {/* Skills by Category */}
            {analysis.skill_categories && Object.keys(analysis.skill_categories).length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <strong>Skills by Category:</strong>
                {Object.entries(analysis.skill_categories).map(([category, skills]) => (
                  <div key={category} style={{ marginTop: '15px' }}>
                    <div style={{ 
                      background: 'rgba(102, 126, 234, 0.2)', 
                      padding: '8px 12px', 
                      borderRadius: '8px',
                      marginBottom: '8px',
                      fontWeight: '600'
                    }}>
                      {category.replace('_', ' ').toUpperCase()}
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingLeft: '10px' }}>
                      {skills.map((skill: string, index: number) => (
                        <span key={index} style={{
                          background: 'rgba(255,255,255,0.1)',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          border: '1px solid rgba(255,255,255,0.2)'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* All Skills */}
            <div>
              <strong>All Skills:</strong>
              <div style={{ 
                marginTop: '10px', 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '8px',
                maxHeight: '300px',
                overflowY: 'auto',
                padding: '10px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px'
              }}>
                {analysis.skills.map((skill: string, index: number) => (
                  <span key={index} style={{
                    background: 'rgba(102, 126, 234, 0.2)',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    border: '1px solid rgba(102, 126, 234, 0.3)'
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Experience & Education Section */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '30px'
          }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#f59e0b' }}>
              📊 Experience & Education
            </h2>
            
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#10b981' }}>
                Work Experience
              </h3>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Years of Experience:</strong> {analysis.experience_years || 'Not specified'}
                </div>
                {analysis.job_titles && analysis.job_titles.length > 0 && (
                  <div>
                    <strong>Job Titles Detected:</strong>
                    <div style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {analysis.job_titles.map((title: string, index: number) => (
                        <span key={index} style={{
                          background: 'rgba(16, 185, 129, 0.2)',
                          padding: '6px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}>
                          {title}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#8b5cf6' }}>
                Education
              </h3>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <div style={{ marginBottom: '15px' }}>
                  <strong>Highest Education Level:</strong> {analysis.education_level || 'Not specified'}
                </div>
              </div>
            </div>
            
            <div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#ef4444' }}>
                Analysis Details
              </h3>
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px',
                padding: '20px'
              }}>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Processing Time:</strong> {analysis.processing_time?.toFixed(2) || 'N/A'} seconds
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Confidence Score:</strong> {Math.round(analysis.confidence_score * 100)}%
                </div>
                <div>
                  <strong>Resume ID:</strong> {resumeId}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Career Suggestions Section */}
        {analysis.career_suggestions && analysis.career_suggestions.length > 0 && (
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '30px',
            marginTop: '30px'
          }}>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '20px', color: '#10b981' }}>
              🎯 Career Suggestions
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px' 
            }}>
              {analysis.career_suggestions.map((suggestion, index) => (
                <div key={index} style={{
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                  border: `2px solid rgba(16, 185, 129, ${suggestion.match_score / 100})`
                }}>
                  <div style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: '600', 
                    marginBottom: '10px',
                    color: '#10b981'
                  }}>
                    {suggestion.title}
                  </div>
                  <div style={{ 
                    background: 'rgba(16, 185, 129, 0.2)', 
                    padding: '8px 12px', 
                    borderRadius: '8px',
                    textAlign: 'center',
                    marginBottom: '15px',
                    fontWeight: 'bold'
                  }}>
                    Match Score: {Math.round(suggestion.match_score)}%
                  </div>
                  {suggestion.matched_skills && suggestion.matched_skills.length > 0 && (
                    <div style={{ marginBottom: '10px' }}>
                      <strong style={{ fontSize: '0.9rem' }}>Matched Skills:</strong>
                      <div style={{ 
                        marginTop: '5px', 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '4px' 
                      }}>
                        {suggestion.matched_skills.map((skill: string, skillIndex: number) => (
                          <span key={skillIndex} style={{
                            background: 'rgba(102, 126, 234, 0.2)',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '10px'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {suggestion.missing_skills && suggestion.missing_skills.length > 0 && (
                    <div>
                      <strong style={{ fontSize: '0.9rem', color: '#f59e0b' }}>Skills to Develop:</strong>
                      <div style={{ 
                        marginTop: '5px', 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: '4px' 
                      }}>
                        {suggestion.missing_skills.map((skill: string, skillIndex: number) => (
                          <span key={skillIndex} style={{
                            background: 'rgba(245, 158, 11, 0.2)',
                            padding: '2px 6px',
                            borderRadius: '8px',
                            fontSize: '10px'
                          }}>
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ 
          display: 'flex', 
          gap: '20px', 
          justifyContent: 'center', 
          marginTop: '40px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={handleViewJobMatches}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            🎯 View Job Matches
          </button>
          <button
            onClick={() => navigate('/resume-upload')}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'transform 0.2s ease'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            📄 Upload New Resume
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResumeAnalysisResults
