import React from 'react';
import FormCheckLabel from 'react-bootstrap/FormCheckLabel';

type TCheckboxLabel = {
  children: React.ReactNode;
};
const CheckboxLabel = ({ children }: TCheckboxLabel) => {
  return <FormCheckLabel>{children}</FormCheckLabel>;
};

export default CheckboxLabel;
