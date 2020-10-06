import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, StatusBar, FlatList, SafeAreaView, TouchableOpacity } from 'react-native';

import api from './services/api';

export default () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    const response = await api.get('/projects');

    setProjects(response.data);
  };

  const handleAddProjects = async () => {
    const project = {
      title: `Novo Project ${Date.now()}`,
      owner: 'Guilherme Peixoto'
    };

    const response = await api.post('/projects', project);

    setProjects([...projects, response.data]);
  };

  return (
    <>
      <StatusBar barStyle='dark-content' backgroundColor='#7159c1' />

      <SafeAreaView style={styles.container}>
        <FlatList
          data={projects}
          keyExtractor={project => project.id}
          renderItem={({ item: project }) => (
            <View>
              <Text style={styles.items}>{project.title}</Text>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleAddProjects}
        >
          <Text style={styles.buttonText}>Adicionar Opacity</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159c1',
    paddingTop: 25
  },

  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold'
  },

  items: {
    color: '#fff',
    fontSize: 25
  },

  button: {
    backgroundColor: '#fff',
    margin: 20,
    height: 50,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },

  buttonText: {
    fontWeight: 'bold',
    fontSize: 16
  }
});