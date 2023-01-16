import { MDBAccordionItem } from "mdb-react-ui-kit";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { transactionActions } from "../Features/transactionSlice";
import Loading from "./Loading/Loading";
import TransactionDetails from "./TransactionDetails";
const TransactionItem = ({ tid, index }) => {
  const loading = useSelector((state) => {
    if (tid in state.transaction) {
      return state.transaction[tid].loading;
    }
    return true;
  });
  const data = useSelector((state) => {
    if (tid in state.transaction) {
      return state.transaction[tid].data;
    }
    return {};
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
  return (
    <MDBAccordionItem
      collapseId={index}
      headerStyle={{ fontWeight: "700", fontSize: "16px", color: "red" }}
      headerTitle={loading ? "Loading..." : `Amount : ${data?.amount}`}
    >
      {loading ? (
        <Loading />
      ) : (
        <TransactionDetails
          data={data}
          amount={data.amount}
          listUpdated={txUpdated}
        />
      )}
    </MDBAccordionItem>
  );
};
export default TransactionItem;
