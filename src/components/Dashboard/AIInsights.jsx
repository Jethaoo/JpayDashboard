import React from 'react'

const AIInsights = ({ projects }) => {
  return (
    <div className="ai-insights-panel">
      <h3>AI Insights</h3>
      <div className="ai-content">
        <p className="placeholder-text">
          Once you have configured your OpenAI API key and Netlify functions, 
          you can analyze your projects here for risks and suggestions.
        </p>
        <button className="analyze-btn" disabled>Analyze Projects</button>
      </div>
    </div>
  )
}

export default AIInsights
