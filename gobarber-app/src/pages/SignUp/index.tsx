import React, { useCallback, useRef } from 'react';
import {
  Image,
  Platform,
  View,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { Form } from '@unform/mobile';
import { FormHandles } from '@unform/core';
import * as Yup from 'yup';

import logoImg from '../../assets/logo.png';
import Input from '../../components/Input';
import Button from '../../components/Button';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import {
  Container,
  Title,
  BackToSignIn,
  BackToSignInText,
  KeyboardAvoidingView,
} from './styles';

interface SignUpDTO {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const inputEmailRef = useRef<TextInput>(null);
  const inputPasswordRef = useRef<TextInput>(null);

  const navigation = useNavigation();

  const handleSignUp = useCallback(
    async (data: SignUpDTO) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome obrigatório'),
          email: Yup.string()
            .required('E-mail obrigatório')
            .email('Digite um e-mail válido'),
          password: Yup.string().min(
            6,
            'Senha deve conter no mínimo 6 caracteres',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        Alert.alert(
          'Cadastro realizado com sucesso.',
          'Você já pode fazer logon na aplicação.',
        );

        await api.post('/users', data);

        navigation.navigate('SignIn');
      } catch (error) {
        if (error instanceof Yup.ValidationError) {
          const errors = getValidationErrors(error);

          formRef.current?.setErrors(errors);

          return;
        }

        Alert.alert(
          'Error ao se cadastrar.',
          'Houve uma falha ao tentar se cadastrar.',
        );
      }
    },
    [navigation],
  );

  return (
    <>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        enabled
      >
        <ScrollView keyboardShouldPersistTaps='handled'>
          <Container>
            <Image source={logoImg}></Image>
            <View>
              <Title>Crie sua conta</Title>
            </View>

            <Form ref={formRef} onSubmit={handleSignUp}>
              <Input
                autoCapitalize='words'
                name='name'
                icon='user'
                placeholder='Nome'
                returnKeyType='next'
                onSubmitEditing={() => inputEmailRef.current?.focus()}
              />
              <Input
                ref={inputEmailRef}
                autoCorrect={false}
                autoCapitalize='none'
                keyboardType='email-address'
                name='email'
                icon='mail'
                placeholder='E-mail'
                returnKeyType='next'
                onSubmitEditing={() => inputPasswordRef.current?.focus()}
              />
              <Input
                ref={inputPasswordRef}
                secureTextEntry
                name='password'
                icon='lock'
                placeholder='Senha'
                textContentType='newPassword'
                returnKeyType='send'
                onSubmitEditing={() => formRef.current?.submitForm()}
              />
            </Form>

            <Button onPress={() => formRef.current?.submitForm()}>
              Cadastrar
            </Button>
          </Container>
        </ScrollView>
      </KeyboardAvoidingView>

      <BackToSignIn onPress={() => navigation.goBack()}>
        <Icon name='arrow-left' size={20} color='#fff' />
        <BackToSignInText>Voltar para logon</BackToSignInText>
      </BackToSignIn>
    </>
  );
};

export default SignUp;
