import * as React  from "react";
import MainAppContext, { useMainInterface } from "contexts/MainApp";
 
export const useMainApp = (): useMainInterface => {
 
    const mainContext = React.useContext<useMainInterface>(MainAppContext);
    
    return mainContext;
}

export default useMainApp;