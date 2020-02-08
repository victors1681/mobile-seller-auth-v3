import * as React from 'react';
import MainAppContext, { UseMainInterface } from 'contexts/MainApp';

export const useMainApp = (): UseMainInterface => {
  const mainContext: UseMainInterface = React.useContext<UseMainInterface>(MainAppContext);

  return mainContext;
};

export default useMainApp;
