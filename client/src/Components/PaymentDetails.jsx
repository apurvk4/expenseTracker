import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from "mdb-react-ui-kit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { transactionActions } from "../Features/transactionSlice";
import Loading from "./Loading/Loading";
import TransactionDetails from "./TransactionDetails";
const PaymentDetails = ({ tid, showModal, setShowModal }) => {
  const data = useSelector((state) => {
    if (tid in state.transaction) {
      return state.transaction[tid].data;
    }
    return {};
  });
  const loading = useSelector((state) => {
    if (tid in state.transaction) {
      return state.transaction[tid].loading;
    }
    return true;
  });
  const stale = useSelector((state) => {
    if (tid in state.transaction) {
      return state.transaction[tid].stale;
    }
    return true;
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(transactionActions.get(tid));
  }, [tid, stale, dispatch]);
  function txUpdated() {
    dispatch(transactionActions.txUpdated(tid));
  }
  function toggleShow() {
    setShowModal(!showModal);
  }
  return (
    <MDBModal show={showModal} setShow={setShowModal} staticBackdrop>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Transaction Details</MDBModalTitle>
            <MDBBtn
              className="btn-close"
              color="none"
              onClick={toggleShow}
            ></MDBBtn>
          </MDBModalHeader>
          <MDBModalBody>
            {loading ? (
              <Loading />
            ) : (
              <TransactionDetails
                data={data}
                amount={data.amount}
                listUpdated={txUpdated}
              />
            )}
          </MDBModalBody>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};
export default PaymentDetails;
