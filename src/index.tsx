import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ThemeProvider as ThemeMaterialProvider } from '@material-ui/core/styles';

import theme from 'common/theme/theme';
import { MainWrapper } from 'common/styles/common.styled';
import './common/theme/fontFace.scss';
import { MainAppProvider } from 'contexts/MainApp';
import Router from './Router';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <ThemeMaterialProvider theme={theme}>
      <BrowserRouter>
        <MainWrapper>
          <MainAppProvider>
            <Router />
          </MainAppProvider>
        </MainWrapper>
      </BrowserRouter>
    </ThemeMaterialProvider>
  </ThemeProvider>,
  document.getElementById('mainApp')
);
