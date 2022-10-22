import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { ThemeProvider as ThemeMaterialProvider } from '@material-ui/core/styles';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import theme from 'common/theme/theme';
import { MainWrapper } from 'common/styles/common.styled';
import './common/theme/fontFace.scss';
import { MainAppProvider } from 'contexts/MainApp';
import RouteBase from './Router';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    <ToastContainer />
    <ThemeMaterialProvider theme={theme}>
      <BrowserRouter>
        <MainWrapper>
          <MainAppProvider>
            <RouteBase />
          </MainAppProvider>
        </MainWrapper>
      </BrowserRouter>
    </ThemeMaterialProvider>
  </ThemeProvider>,
  document.getElementById('mainApp')
);
