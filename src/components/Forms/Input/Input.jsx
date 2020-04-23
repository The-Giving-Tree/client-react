import * as React from 'react';
import { Input as BaseUIInput } from 'baseui/input';

function Input(props) {
  const {
    value,
    onChange,
    placeholder,
    className
  } = props;
  
  return(
    <BaseUIInput
      className={className}
      value={value}
      onChange={event => onChange(event.currentTarget.value)}
      placeholder={placeholder}
    />
  );
}

export default Input;