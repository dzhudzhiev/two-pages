import React from 'react';
import { Router } from '@reach/router';
import Weather from './pages/Weather';
import List from './pages/List';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 700px;
  margin: 0 auto;
`;

const App = () => (
  <Wrapper>
    <Router>
      <List path="/" />
      <Weather path="/weather" />
    </Router>
  </Wrapper>
);

export default App;
