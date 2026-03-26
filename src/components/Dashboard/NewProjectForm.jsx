import React, { useState } from 'react'

const NewProjectForm = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [totalTasks, setTotalTasks] = useState(1)

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd({ name, description, total_tasks: parseInt(totalTasks), completed_tasks: 0 })
    setName('')
    setDescription('')
    setTotalTasks(1)
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>New Project</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Project Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              placeholder="e.g. Website Overhaul"
            />
          </div>
          <div>
            <label>Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Briefly describe the project..."
            />
          </div>
          <div>
            <label>Total Tasks</label>
            <input 
              type="number" 
              value={totalTasks} 
              onChange={(e) => setTotalTasks(e.target.value)} 
              min="1"
              required 
            />
          </div>
          <div className="modal-actions">
            <button type="button" className="secondary-btn" onClick={onCancel}>Cancel</button>
            <button type="submit">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewProjectForm
