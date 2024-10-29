import Navbar from '../specific/Navbar';

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
