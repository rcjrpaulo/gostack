import React from 'react';
import { useTransition } from 'react-spring';

import { ToastMessage } from '../../hooks/toast';
import Toast from './Toast';

import { Container } from './styles';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const messagesWithTransitions = useTransition(
    messages,
    message => message.id,
    {
      from: {
        right: '-120%',
        opacity: 0,
        transform: 'rotateX(0deg)',
        transition: 'transform 0.15s',
      },
      enter: {
        right: '0%',
        opacity: 1,
        transform: 'rotateX(360deg)',
        transition: 'transform 0.15s',
      },
      leave: {
        right: '-120%',
        opacity: 0,
        transform: 'rotateX(0deg)',
        transition: 'transform 0.15s',
      },
    },
  );

  return (
    <Container>
      {messagesWithTransitions.map(({ item, key, props }) => (
        <Toast key={key} style={props} message={item}></Toast>
      ))}
    </Container>
  );
};

export default ToastContainer;
