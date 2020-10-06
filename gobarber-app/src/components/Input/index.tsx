import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import { TextInputProps } from 'react-native';
import { useField } from '@unform/core';

import { Container, TextInput, Icon } from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.RefForwardingComponent<InputRef, InputProps> = (
  { name, icon, ...rest },
  ref,
) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);

  const inputElementRef = useRef<any>(null);

  const { registerField, defaultValue = '', error, fieldName } = useField(name);
  const inputValueRef = useRef<InputValueReference>({ value: defaultValue });

  const handleInputFocus = () => setIsFocused(true);

  const handleInputBlur = () => {
    setIsFocused(false);
    setIsFilled(!!inputValueRef.current.value);
  };

  useImperativeHandle(ref, () => ({
    focus() {
      inputElementRef.current.focus();
    },
  }));

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      ref: inputValueRef.current,
      path: 'value',
      setValue(ref: any, value) {
        inputValueRef.current.value = value;
        inputElementRef.current.setNativeProps({ text: value });
      },
      clearValue() {
        inputValueRef.current.value = '';
        inputElementRef.current.clear();
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container isFocused={isFocused} isFilled={isFilled} isErrored={!!error}>
      <Icon isFocused={isFocused} isFilled={isFilled} name={icon} size={20} />

      <TextInput
        ref={inputElementRef}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        keyboardAppearance='dark'
        placeholderTextColor='#666360'
        defaultValue={defaultValue}
        onChangeText={value => (inputValueRef.current.value = value)}
        {...rest}
      />
    </Container>
  );
};

export default forwardRef(Input);
