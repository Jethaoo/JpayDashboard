import React from 'react'

const ProjectCard = ({ project, onDelete }) => {
  const progress = project.total_tasks > 0 
    ? Math.round((project.completed_tasks / project.total_tasks) * 100) 
    : 0

  return (
    <div className="project-card">
      <div className="project-header">
        <h4>{project.name}</h4>
        <button className="delete-btn" onClick={() => onDelete(project.id)}>×</button>
      </div>
      <p className="project-desc">{project.description}</p>
      
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${progress}%` }}></div>
      </div>
      <div className="progress-labels">
        <span>{progress}% Complete</span>
        <span>{project.completed_tasks}/{project.total_tasks} Tasks</span>
      </div>
    </div>
  )
}

export default ProjectCard
