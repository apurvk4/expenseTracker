import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBListGroup,
  MDBListGroupItem,
  MDBModalFooter,
  MDBRadio,
} from "mdb-react-ui-kit";
import { useDispatch, useSelector } from "react-redux";
import { transactionActions } from "../Features/transactionSlice";
const Remove = ({ showModal, toggleShow, setShowModal }) => {
  const list = useSelector((state) => state.transaction.list);
  const id = useSelector((state) => state.user.data?.user._id);
  const transaction = useSelector((state) => state.transaction);
  const dispatch = useDispatch();
  const update = async () => {
    let l = list.filter((val) => val.createdBy === id);
    let res = false;
    let index = -1;
    for (let i = 0; i < l.length; i++) {
      if (document.getElementById(`radio${i}`).checked) {
        res = true;
        index = i;
        break;
      }
    }
    if (res) {
      let id = l[index].for;
      let url = import.meta.env.VITE_DEPLOYMENT + `/api/removetx?tid=${id}`;
      res = await fetch(url, {
        method: "DELETE",
        credentials: "include",
        headers: {
          accept: "application/json",
        },
      });
      if (res.status === 200) {
        alert("deleted successfully");
        dispatch(transactionActions.listUpdated());
        dispatch(transactionActions.txUpdated(id));
      } else {
        res = await res.json();
        alert(res.message);
      }
    }
  };
  return (
    <MDBModal show={showModal} setShow={setShowModal} staticBackdrop>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Delete Transaction</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={toggleShow}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            <MDBListGroup style={{ minWidth: "22rem" }} light>
              {list
                .filter((val) => {
                  return val.createdBy === id;
                })
                .map((val, i) => {
                  return (
                    <MDBListGroupItem key={i}>
                      <MDBRadio
                        name="flexRadioDefault"
                        id={`radio${i}`}
                        defaultChecked
                        label={transaction[val.for].data.name}
                      />
                    </MDBListGroupItem>
                  );
                })}
            </MDBListGroup>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={toggleShow}>
              Close
            </MDBBtn>
            <MDBBtn onClick={() => update()}>Save changes</MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};
export default Remove;
