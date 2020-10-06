import React, { useState, useEffect } from 'react';

import './App.css';
import api from './services/api';

import Header from './components/Header';

export default () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const response = await api.get('/projects');

    setProjects(response.data);
  };

  const handleAddProject = async () => {
    const project = {
      title: `Project ${Date.now()}`,
      owner: `Guilherme Peixoto`
    };

    const response = await api.post('/projects', project);

    setProjects([...projects, response.data])
  }

  return (
    <>
      <Header title='Homepage' >
        <ul>
          <li>Menu 1</li>
          <li>Menu 2</li>
          <li>Menu 3</li>
        </ul>
      </Header>
      <Header title='Projects' />

      <ul>
        {projects.map(project => <li key={project.id}>{project.title}</li>)}
      </ul>

      <button type="button" onClick={handleAddProject}>Adicionar Projeto</button>
    </>
  );
}