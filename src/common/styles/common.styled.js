import styled from 'styled-components';

export const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  font-family: ${({ theme }) => theme.font.family};
  font-size: ${({ theme }) => theme.font.size};
  color: ${({ theme }) => theme.font.color};
  background: #f2f2f2;
`;
