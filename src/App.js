import React, { useState, useEffect, useRef } from 'react';
import app from './firbase'
import './App.css';
import {baseURL} from './axios'
import logo from './components/images/logo.png';
import { async } from 'q';

const db = app.firestore()

function App() {

  const [project, setProject] = useState({})
  const [projects, setProjects] = useState([])
  const [imageUrl, setImageUrl] = useState(null)
  const [newProject, setNewProject] = useState(false)
  const wrapperRef = useRef(null)

  const id = (new Date().valueOf()).toString()

  const handleFileChange = async (e)=>{
    const file = e.target.files[0];
    const storageRef = app.storage().ref()
    const fileRef = storageRef.child(file.name)
    await fileRef.put(file)
    const imageUrl = await fileRef.getDownloadURL()
    setImageUrl(imageUrl)
  }

  useEffect(() => {
    const fetch = async () => {
      const projectsList = await db.collection('projects').get()
      setProjects(projectsList.docs.map(doc => (
        doc.data()
      )))
    }

    fetch()
  }, [])
  
  const handleChange = (e)=>{
    const {name, value} = e.target
    setProject(prev => ({
      ...prev,
      [name] : value
    }))
  }

  useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);

        return ()=>{
            document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [])

    function handleClickOutside(e){
        const {current : wrap} = wrapperRef;
        if(wrap && !wrap.contains(e.target)){
            setNewProject(false)
        }
    }

  const handleSubmit = async()=>{
    if (!project.title) {
      alert('Please add a project title')
    }
    if (project.title) {
      if (!project.description) {
        alert('Please Add Project Description')
      }
    }
    if (project.title) {
      if (project.description) {
        const projectData = {
          id: id,
          title: project.title,
          description: project.description,
          url: imageUrl
        }
        await db.collection('projects').doc(projectData.id).set(projectData).then(async res =>{
          const projectsList = await db.collection('projects').get()
          setProjects(projectsList.docs.map(doc => (
            doc.data()
          ))) 
          setProject({})
          setImageUrl(null)
          setNewProject(false)
        })
      }
    }
  }

  const handleDelete = async(project)=>{
    await db.collection('projects').doc(project.id).delete().then(async res=>{
      const projectsList = await db.collection('projects').get()
      setProjects(projectsList.docs.map(doc => (doc.data()
      )))
    })
  }

  return (
    <>
      <div className='App'>
      <div className="headerSection">
        <div className="headImageContainer">
          <img src={logo} alt="Water Tech Logo" />
        </div>
        <div>
          <button className="btn" onClick={()=>{setNewProject(true)}}>New Project</button>
        </div>
      </div>
      
        { newProject &&
        <div className="newProjectForm" ref={wrapperRef}>
          <div>
            <input type="text" name="title" id="title" value={project.title} onChange={handleChange} placeholder='Enter project title' />
          </div>
          <div>
            <textarea name="description" id="description" value={project.description} onChange={handleChange} placeholder='Enter project description'></textarea>
          </div>
            <div>
              <input type="file" name="project" onChange={handleFileChange} />
            </div>

            <div className='image-container'>
              {
                imageUrl ? <img src={imageUrl} alt={project.title} /> : <button className='btnSubmitt'><span></span></button>
              }
            </div>
            <div className='submitOptions'>
                <div>
                  <button className='btnCancel btn' onClick={()=>{
                    setNewProject(false);
                  }}>Cancel</button>
                </div>
              
              <div>
                {
                  imageUrl &&  <button className="btnSubmit btn" onClick={handleSubmit}> Add Project </button>
                }
              </div>
            </div>
        </div>
        }

        
      </div>

      <div className='projects'>
        {
          projects?.sort((a, b)=> b.id - a.id).map(project => (
            <div className="elementGrid">
              <div className="imageContainer">
                <img src={project.url} alt="" />
              </div>
              
              <p className="imageTitle">
                {project.title}
                <i className="fas fa-trash" onClick={()=>{handleDelete(project)}}></i>
              </p>
            </div>
          ))
        }
      </div>
    </>
  );
}

export default App;
