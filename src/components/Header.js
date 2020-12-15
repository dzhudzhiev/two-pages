import styled from 'styled-components';
import { Link } from '@reach/router';

const Nav = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 20px 0;
`;

const Header = ({ dest }) => (
  <Nav>
    <Link to={dest.to}>{dest.label}</Link>
  </Nav>
);

export default Header;
