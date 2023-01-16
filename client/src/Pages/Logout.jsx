import { MDBContainer, MDBSpinner } from "mdb-react-ui-kit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../Components/Layout/Layout";
import { userActions } from "../Features/userSlice";

const Logout = () => {
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    if (loggedIn) {
      dispatch(userActions.logOut());
    } else {
      navigate("/login");
    }
  }, [loggedIn, dispatch, navigate]);
  return (
    <Layout>
      <MDBContainer style={{ marginTop: "120px" }}>
        <span className="fs-1">Logging out...</span>
        <MDBSpinner color="danger">
          <span className="visually-hidden">Loading...</span>
        </MDBSpinner>
      </MDBContainer>
    </Layout>
  );
};
export default Logout;
