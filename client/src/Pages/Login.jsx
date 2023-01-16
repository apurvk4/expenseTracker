import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBInput,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Layout from "../Components/Layout/Layout";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../Features/userSlice";
import useValidate from "../utils/useValidation";
import { useEffect } from "react";
const Login = () => {
  const [showModal, setShowModal] = useState(true);
  const toggleShow = () => setShowModal(true);
  const [email, setEmail] = useValidate("/api/verifyemail");
  const [password, setPassword] = useState({
    data: "",
    feedback: "",
    isValid: true,
  });
  const loading = useSelector((state) => state.user.loading);
  const loggedIn = useSelector((state) => state.user.loggedIn);
  const { error } = useSelector((state) => state.user.error);
  const { isError } = useSelector((state) => state.user.isError);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  function verifyPassword() {
    if (password.data.length < 5) {
      setPassword({
        ...password,
        isValid: false,
        feedback: "password too short",
      });
    } else {
      setPassword({
        ...password,
        isValid: true,
        feedback: "password is valid",
      });
    }
  }
  async function login() {
    dispatch(userActions.logIn({ email: email.data, password: password.data }));
  }
  useEffect(() => {
    if (loggedIn) {
      navigate("/");
    }
  }, [loggedIn, navigate]);
  return (
    <Layout>
      <MDBModal show={showModal} setShow={toggleShow} staticBackdrop>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Login</MDBModalTitle>
            </MDBModalHeader>
            <MDBModalBody>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  login();
                }}
              >
                <div>
                  <MDBInput
                    className="mb-4"
                    type="email"
                    id="form2Example1"
                    label="Email address"
                    value={email.data}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  {!email.isValid ? (
                    <span style={{ color: "red" }}>{email.feedback}</span>
                  ) : (
                    ""
                  )}
                </div>
                <div>
                  <MDBInput
                    className="mb-4"
                    type="password"
                    id="form2Example2"
                    label="Password"
                    value={password.data}
                    onInput={(e) => {
                      setPassword({ ...password, data: e.target.value });
                    }}
                    onBlur={verifyPassword}
                  />
                  {!password.isValid ? (
                    <span style={{ color: "red" }}>{password.feedback}</span>
                  ) : (
                    ""
                  )}
                </div>

                <MDBBtn
                  type="submit"
                  disabled={!email.isValid || !password.isValid}
                  className="mb-4"
                  block
                >
                  {loading ? (
                    <>
                      <MDBSpinner size="sm" role="status" tag="span" />
                      <span className="visually-hidden">Logging in...</span>
                    </>
                  ) : (
                    ""
                  )}
                  Sign in
                </MDBBtn>
                {isError ? <span>{error.message}</span> : ""}
                <div className="text-center">
                  <p>
                    Not a member? <Link to="/signup">Register</Link>
                  </p>
                </div>
              </form>
            </MDBModalBody>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </Layout>
  );
};
export default Login;
