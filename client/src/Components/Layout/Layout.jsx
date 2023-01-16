import Navbar from "../Navbar/Navbar";

const Layout = (props) => {
  return (
    <>
      <Navbar></Navbar>
      {props.children}
    </>
  );
};
export default Layout;
