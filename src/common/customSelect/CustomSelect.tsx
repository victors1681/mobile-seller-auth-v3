import * as React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@material-ui/core';

interface ICustomSelect {
  defaultValue: string;
  handleChange: any;
  name: string;
  label: string;
  options: SelectOptions[];
  required: boolean;
}
export const CustomSelect = ({ defaultValue, handleChange, name, label, options, required }: ICustomSelect) => {
  return (
    <FormControl fullWidth>
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
    </FormControl>
  );
};

export default CustomSelect;
