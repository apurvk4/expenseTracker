import React, { useState } from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarToggler,
  MDBIcon,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBCollapse,
  MDBBtn,
} from "mdb-react-ui-kit";
import { Link, useMatch, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../../Features/userSlice";
export default function Navbar() {
  const [showBasic, setShowBasic] = useState(false);
  const home = useMatch("/");
  const login = useMatch("/login");
  const signup = useMatch("/signup");
  const budget = useMatch("/budget");
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const name = useSelector((state) => {
    //state.user.data?.user?.name ?? ""
    if ("user" in state.user.data) {
      if ("name" in state.user.data.user) {
        return state.user.data?.user?.name;
      }
    }
    return "";
  });
  function getValue() {
    if (loggedIn) {
      return (
        <MDBDropdown>
          <MDBDropdownToggle
            tag="a"
            className="nav-link"
            role="button"
            active={login || signup ? true : undefined}
          >
            {name}
          </MDBDropdownToggle>
          <MDBDropdownMenu>
            <MDBDropdownItem>
              <MDBNavbarLink tag={Link} className="text-dark" to="/logout">
                Logout
              </MDBNavbarLink>
            </MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
      );
    } else {
      return (
        <MDBDropdown>
          <MDBDropdownToggle
            tag="a"
            className="nav-link"
            role="button"
            active={login || signup ? true : undefined}
          >
            Register
          </MDBDropdownToggle>
          <MDBDropdownMenu>
            <MDBDropdownItem>
              <MDBNavbarLink tag={Link} className="text-dark" to="/login">
                Login
              </MDBNavbarLink>
            </MDBDropdownItem>
            <MDBDropdownItem>
              <MDBNavbarLink tag={Link} className="text-dark" to="/signup">
                Signup
              </MDBNavbarLink>
            </MDBDropdownItem>
          </MDBDropdownMenu>
        </MDBDropdown>
      );
    }
  }
  return (
    <MDBNavbar fixed="top" expand="lg" dark bgColor="primary">
      <MDBContainer fluid>
        <MDBNavbarBrand href="/">ExpenseTracker</MDBNavbarBrand>
        <MDBNavbarToggler
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setShowBasic(!showBasic)}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>

        <MDBCollapse navbar show={showBasic}>
          <MDBNavbarNav right={true} className=" mr-auto mb-2 mb-lg-0 ms-auto">
            <MDBNavbarItem>
              <MDBNavbarLink
                tag={Link}
                active={home ? true : undefined}
                aria-current="page"
                to="/"
              >
                Home
              </MDBNavbarLink>
            </MDBNavbarItem>
            <MDBNavbarItem>
              <MDBNavbarLink
                tag={Link}
                active={budget ? true : undefined}
                to="/budget"
              >
                Budget
              </MDBNavbarLink>
            </MDBNavbarItem>

            <MDBNavbarItem>{getValue()}</MDBNavbarItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
}
