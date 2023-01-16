import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
} from "mdb-react-ui-kit";
import { useRef } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../Features/userSlice";
const UpdateBudget = ({ showModal, setShowModal }) => {
  const submitBtn = useRef(null);
  const budget = useSelector((state) => state.user.budget.data.budget);
  const [amount, setAmount] = useState(budget ?? 0);
  const dispatch = useDispatch();
  function toggleShow() {
    setShowModal(!showModal);
  }
  async function update() {
    let url = import.meta.env.VITE_DEPLOYMENT + "/api/user/updatebudget";
    let res = await fetch(url, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({ amount: amount }),
    });
    if (res.status === 201) {
      alert("updated successfully");
      dispatch(userActions.budgetUpdated());
    } else {
      res = await res.json();
      alert(res.message);
    }
  }

  return (
    <MDBModal show={showModal} setShow={setShowModal} staticBackdrop>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Set Budget</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={toggleShow}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await update();
              }}
            >
              <MDBInput
                label="Budget"
                type="number"
                onChange={(e) => {
                  if (e.target.value !== "") {
                    setAmount(parseFloat(e.target.value));
                  } else {
                    setAmount("");
                  }
                }}
                value={amount}
              />
              <button
                ref={submitBtn}
                style={{ display: "none" }}
                type="submit"
              ></button>
            </form>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={toggleShow}>
              Close
            </MDBBtn>
            <MDBBtn
              onClick={() => {
                submitBtn.current?.click();
              }}
            >
              Save changes
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};
export default UpdateBudget;
