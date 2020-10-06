const express = require('express');
const cors = require('cors');
const { uuid, isUuid } = require('uuidv4');
const app = express();

app.use(express.json());
app.use(cors());

const projects = [];

const logRequest = (request, response, next) => {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel);
};

const validateProjectId = (request, response, next) => {
  const { id } = request.params;

  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid Project ID.' });
  }

  return next();
};

app.use(logRequest);
app.use('/projects/:id', validateProjectId);

app.get('/projects', (request, response) => {
  const { title, owner } = request.query;

  const results = title
    ? projects.filter((project) => project.title.includes(title))
    : projects;

  response.json(results);
});

app.post('/projects', (request, response) => {
  const { title, owner } = request.body;

  const project = {
    id: uuid(),
    title,
    owner
  };

  projects.push(project);

  response.json(project);
});

app.put('/projects/:id', (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response
      .status(400)
      .json({
        error: 'Project not found!'
      });
  }

  projects[projectIndex] = {
    id,
    title,
    owner
  };

  response.json(projects[projectIndex]);
});

app.delete('/projects/:id', (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response
      .status(400)
      .json({
        error: 'Project not found!'
      });
  }

  projects.splice(projectIndex, 1);

  response.status(204).send()
});

app.listen(3333, () => console.log('> App listening in port 3333'));