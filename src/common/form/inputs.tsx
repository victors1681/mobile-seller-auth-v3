import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { FormControlLabel, FormGroup, ListItemText, Switch } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Checkbox from '@material-ui/core/Checkbox';
import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Select from '@material-ui/core/Select';

import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { useField, useFormikContext } from 'formik';
import * as React from 'react';

export interface SelectOption {
  value: string;
  label: string;
  location?: number;
}

export interface Props {
  name: string;
  label: string;
  value?: string;
  error?: string | null | undefined;
  type?: string;
  hideLabel?: boolean;
  handleChange?: (value: any) => void;
  options?: SelectOption[];
  disabled?: boolean;
  multiple?: boolean;
  tooltip?: string;
}

interface InputHeaderProps {
  name: string;
  label: string;
  error?: string | null | undefined;
}
export const InputHeader = ({ label, name, error }: InputHeaderProps): JSX.Element => {
  return (
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', marginRight: '15px' }}>
      <InputLabel htmlFor={`${name}-input`}>{label}</InputLabel>
      {error && (
        <Tooltip title={error || ''} placement="top">
          <ErrorOutlineIcon fontSize="small" style={{ marginLeft: 1 }} color="error" />
        </Tooltip>
      )}
    </div>
  );
};
export const InputText = ({ name, label, error, type, hideLabel = false, disabled }: Props): JSX.Element => {
  const [field, meta] = useField({ name });
  const { isSubmitting } = useFormikContext();

  return (
    <React.Fragment>
      {!hideLabel && <InputHeader label={label} error={meta.error} name={name} />}
      <TextField
        name={name}
        fullWidth
        disabled={disabled || isSubmitting}
        type={type || 'text'}
        error={!!(meta.error || error)}
        id={`${name}-input`}
        onChange={field.onChange}
        value={field.value}
        size="small"
      />
    </React.Fragment>
  );
};

export const CurrencyInput = ({ name, label, error, disabled }: Props): JSX.Element => {
  const [field, meta, helpers] = useField({ name });
  const { isSubmitting } = useFormikContext();
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    helpers.setValue(event.target.value);
  };

  return (
    <React.Fragment>
      <InputHeader label={label} error={meta.error || error} name={name} />
      <OutlinedInput
        disabled={disabled || isSubmitting}
        error={!!(meta.error || error)}
        id={`${name}-adornment-amount`}
        onChange={handleChange}
        value={field.value}
        startAdornment={<InputAdornment position="start">$</InputAdornment>}
      />
    </React.Fragment>
  );
};

export const SelectInput = ({ name, label, options, error, disabled }: Props): JSX.Element => {
  const [field, meta, helpers] = useField({ name });
  const { isSubmitting } = useFormikContext();
  const _handleChange = (event: any) => {
    helpers.setValue(event.target.value);
  };

  return (
    <React.Fragment>
      <InputHeader label={label} error={meta.error || error} name={name} />
      <FormControl fullWidth>
        <Select disabled={disabled || isSubmitting} labelId={`${name}-select-label`} id={`${name}-select`} onChange={_handleChange} value={field.value} error={!!(meta.error || error)}>
          {options &&
            options.map((o) => {
              return (
                <MenuItem key={`${name}-${o.value}`} value={o.value}>
                  {o.label}
                </MenuItem>
              );
            })}
        </Select>
      </FormControl>
    </React.Fragment>
  );
};

const ITEM_HEIGHT = 37;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

export const MultiSelectInput = ({ name, label, options, error, disabled }: Props): JSX.Element => {
  const [field, meta, helpers] = useField({ name });

  const handleChange = (event: any) => {
    helpers.setValue(typeof event.target.value === 'string' ? event.target.value.split(',') : event.target.value);
  };

  return (
    <div>
      <InputHeader label={label} error={meta.error || error} name={name} />
      <FormControl fullWidth>
        <Select
          labelId={`${name}-select-label`}
          id={`${name}-select`}
          multiple
          value={field.value || []}
          onChange={handleChange}
          input={<OutlinedInput />}
          renderValue={(selected) => Array.isArray(selected) && selected.join(', ')}
          MenuProps={MenuProps}
        >
          {options &&
            options.map((o) => (
              <MenuItem key={`${name}-${o.value}`} value={o.value}>
                <Checkbox checked={field.value.indexOf(name) > -1} />
                <ListItemText primary={o.label} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};

export const AutoCompleteInput = ({ name, label, options, error, disabled, multiple = false }: Props): JSX.Element => {
  const [field, meta, helpers] = useField({ name });
  const { isSubmitting } = useFormikContext();
  const [incomingError, setIncomingError] = React.useState(error);
  const handleChange = (_event: any, newValue: any) => {
    if (multiple) {
      incomingError && setIncomingError(null);
      helpers.setValue(newValue.map((v) => v.value));
    } else {
      incomingError && setIncomingError(null);
      helpers.setValue(newValue ? newValue.value : []);
    }
  };

  const currentError = meta.error && error ? `${meta.error} | ${error}` : meta.error || error;

  const selectedValue = multiple ? options?.filter((f) => field.value.includes(f.value)) || [] : options?.find((f) => f.value === field.value) || [];

  return (
    <React.Fragment>
      <InputHeader label={label} error={currentError} name={name} />
      <FormControl fullWidth>
        <Autocomplete
          multiple={multiple}
          disabled={disabled || isSubmitting}
          disablePortal
          id={`${name}-select`}
          options={options || []}
          value={selectedValue}
          getOptionLabel={(option) => option.label || ''}
          //isOptionEqualToValue={(option, value) => option.value === value.value}
          onInputChange={handleChange}
          renderInput={(params) => <TextField inputProps={params} error={!!(meta.error || incomingError)} size="small" />}
        />
      </FormControl>
    </React.Fragment>
  );
};

export const CheckboxInput = ({ name, label, disabled }: Props): JSX.Element => {
  const [field, , helpers] = useField({ name });
  const { isSubmitting } = useFormikContext();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    helpers.setValue(!!event.target.checked);
  };
  return (
    <FormGroup>
      <FormControlLabel
        control={<Checkbox name={name} checked={field.value} onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />}
        disabled={disabled || isSubmitting}
        label={label}
      />
    </FormGroup>
  );
};

export const SwitchInput = ({ name, label, disabled, tooltip }: Props): JSX.Element => {
  const [field, , helpers] = useField({ name });
  const { isSubmitting } = useFormikContext();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    helpers.setValue(!!event.target.checked);
  };
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Tooltip title={tooltip || ''}>
            <Switch name={name} onChange={handleChange} disabled={disabled || isSubmitting} checked={!!field.value} />
          </Tooltip>
        }
        label={label}
      />
    </FormGroup>
  );
};
