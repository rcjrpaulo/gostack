import React, { useCallback, useRef, ChangeEvent } from 'react';
import { useHistory, Link } from 'react-router-dom';
import { FiMail, FiUser, FiLock, FiCamera, FiArrowLeft } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';
import api from '../../services/api';
import getValidationErrors from '../../utils/getValidationErrors';

import Input from '../../components/Input';
import Button from '../../components/Button';
import { Container, Content, AvatarInput } from './styles';

interface ProfileFormDTO {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormDTO) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string().required('Campo obrigatório'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string()
            .when('old_password', {
              is: val => !!val.length,
              then: Yup.string().required('Campo obrigatório'),
              otherwise: Yup.string(),
            })
            .oneOf([Yup.ref('password'), null], 'Confirmação incorreta'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await api.put('/profile', data);
        updateUser(response.data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Perfil atualizado.',
          description: 'Suas informações do perfil foi atualizado com sucesso!',
        });
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na atualização.',
          description: 'Houve um erro ao atualizar o perfil',
        });
      }
    },
    [addToast, history, updateUser],
  );

  const handleAvatarChange = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const data = new FormData();

        data.append('avatar', e.target.files[0]);

        const response = await api.patch('/users/avatar', data);

        updateUser(response.data);

        addToast({
          type: 'success',
          title: 'Avatar atualizado',
        });
      }
    },
    [addToast, updateUser],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to='/dashboard'>
            <FiArrowLeft />
          </Link>
        </div>
      </header>

      <Content>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <AvatarInput>
            <img src={user.avatar_url} alt={user.name} />
            <label htmlFor='avatar'>
              <FiCamera />

              <input
                type='file'
                id='avatar'
                onChange={handleAvatarChange}
                accept='image/*'
              />
            </label>
          </AvatarInput>

          <h1>Meu perfil</h1>

          <Input
            name='name'
            placeholder='Nome'
            icon={FiUser}
            defaultValue={user.name}
          />
          <Input
            name='email'
            placeholder='E-mail'
            icon={FiMail}
            defaultValue={user.email}
          />

          <Input
            containerStyle={{ marginTop: 24 }}
            name='old_password'
            type='password'
            placeholder='Senha atual'
            icon={FiLock}
          />

          <Input
            name='password'
            type='password'
            placeholder='Nova senha'
            icon={FiLock}
          />

          <Input
            name='password_confirmation'
            type='password'
            placeholder='Confirmar senha'
            icon={FiLock}
          />

          <Button type='submit'>Confirmar mudanças</Button>
        </Form>
      </Content>
    </Container>
  );
};

export default Profile;
