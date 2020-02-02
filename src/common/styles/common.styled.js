import styled from 'styled-components';

export const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  font-family: ${({ theme }) => theme.typography.fontFamily};
  font-size: ${({ theme }) => theme.typography.fontSize};
  color: ${({ theme }) => theme.palette.common.black};
  background: #f2f2f2;
`;
