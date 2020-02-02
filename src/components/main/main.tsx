import * as React from 'react';

export interface MainProps {
  buttonLabel: string;
  onInit: () => {};
}

const Main = (props: MainProps) => (
  <div>
    <button onClick={() => props.onInit()}> {props.buttonLabel}</button>
  </div>
);

export default Main;
