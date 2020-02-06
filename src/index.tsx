import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter} from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import theme from 'common/theme/theme';
import { MainWrapper } from 'common/styles/common.styled';
import './common/theme/fontFace.scss';
import { MainAppProvider } from "contexts/MainApp";
import Router from "./Router";

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <BrowserRouter>
      <MainWrapper>
      <MainAppProvider> 
        <Router/>
        </MainAppProvider>
      </MainWrapper>
    </BrowserRouter>
 
  </ThemeProvider>,
  document.getElementById('mainApp')
);
