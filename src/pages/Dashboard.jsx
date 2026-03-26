import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../api/supabase'
import ProjectCard from '../components/Dashboard/ProjectCard'
import NewProjectForm from '../components/Dashboard/NewProjectForm'
import AIInsights from '../components/Dashboard/AIInsights'

const Dashboard = () => {
  const { user, signOut } = useAuth()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchProjects = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching projects:', error)
    } else {
      setProjects(data || [])
    }
    setLoading(false)
  }

  const addProject = async (projectData) => {
    const { data, error } = await supabase
      .from('projects')
      .insert([{ ...projectData, user_id: user.id }])
      .select()

    if (error) {
      alert('Error creating project: ' + error.message)
    } else {
      setProjects([data[0], ...projects])
      setIsModalOpen(false)
    }
  }

  const deleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      alert('Error deleting project: ' + error.message)
    } else {
      setProjects(projects.filter(p => p.id !== id))
    }
  }

  useEffect(() => {
    if (user) {
      fetchProjects()
    }
  }, [user])

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>JpayDashboard</h1>
          <p>Welcome, {user?.email}</p>
        </div>
        <div className="header-actions">
          <button className="add-btn" onClick={() => setIsModalOpen(true)}>+ New Project</button>
          <button className="signout-btn" onClick={signOut}>Sign Out</button>
        </div>
      </header>

      <main className="projects-section">
        <h3>Your Projects</h3>
        
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onDelete={deleteProject}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No projects found. Click "New Project" to get started!</p>
          </div>
        )}

        {projects.length > 0 && <AIInsights projects={projects} />}
      </main>

      {isModalOpen && (
        <NewProjectForm 
          onAdd={addProject} 
          onCancel={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  )
}

export default Dashboard
