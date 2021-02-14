import * as React from 'react';
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@material-ui/core';

interface ICustomSelect {
  defaultValue: string;
  handleChange: any;
  name: string;
  label: string;
  options: SelectOptions[];
  required?: boolean;
  error: boolean | undefined;
  helperText: string | undefined;
  disabled?: boolean;
}
export const CustomSelect = ({ disabled, defaultValue, handleChange, name, label, options, required, error, helperText }: ICustomSelect) => {
  return (
    <FormControl fullWidth error={error} disabled={disabled}>
      <InputLabel id={name} required={required}>
        {label}
      </InputLabel>
      <Select labelId={name} id={`${name}-${label}`} name={name} value={defaultValue} onChange={handleChange}>
        {options.map((option: SelectOptions) => (
          <MenuItem key={option.name} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;
