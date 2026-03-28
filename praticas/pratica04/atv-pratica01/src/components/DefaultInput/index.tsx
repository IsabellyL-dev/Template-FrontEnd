import styles from './styles.module.css';
import React from 'react';

type DefaultInputProps = {
  id: string;
  labelText: string;
} & React.ComponentProps<'input'>;

export function DefaultInput({
  id,
  type,
  labelText,
  ...rest 
}: DefaultInputProps) {
  return (
    // Recomendo envolver em uma div para facilitar o layout
    <div className={styles.inputContainer}> 
      <label htmlFor={id} className={styles.label}>
        {labelText}
      </label>
      
      <input 
        id={id} 
        type={type} 
        className={styles.input} // Aqui você aplica o estilo do input
        {...rest} 
      />
    </div>
  );
}