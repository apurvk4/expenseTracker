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
  MDBAccordion,
  MDBAccordionItem,
  MDBIcon,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { useState } from "react";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { transactionActions } from "../../Features/transactionSlice";
import ValidationItem from "./ValidationItem";
const Add = ({ showModal, toggleShow, setShowModal }) => {
  const [tname, setTname] = useState({ data: "", isValid: true, feedback: "" });
  const [payer, setPayer] = useState([
    { data: "", isValid: true, validEmail: false, feedback: "" },
  ]);
  const [payerChecked, setPayerChecked] = useState(false);
  const [tdate, setTDate] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState(0);
  const [friendDetails, setFriendDetails] = useState([
    { data: "", isValid: true, validEmail: false, feedback: "" },
  ]);
  const { name, email } = useSelector((state) => state.user.data?.user);
  const submit = useRef(null);
  const dispatch = useDispatch();
  function addFeilds() {
    let res = [];
    for (let i = 0; i < friendDetails.length; i++) {
      res.push(
        <MDBAccordion key={i} className={i === 0 ? "mt-5" : "mt-0"}>
          <MDBAccordionItem collapseId={1} headerTitle="Friend details">
            <ValidationItem
              i={i}
              data={friendDetails}
              setData={setFriendDetails}
            />
            <div>
              <span>Please add Name of Friend</span>
              <MDBInput
                type={"text"}
                required
                label={"Enter Name"}
                data-index={i}
                onChange={(e) => {
                  let temp = [...friendDetails];
                  let index = parseInt(e.target.dataset.index);
                  temp[index].name = e.target.value;
                  setFriendDetails(temp);
                }}
                value={friendDetails[i].name ?? ""}
                readOnly={
                  friendDetails[i].isValid &&
                  friendDetails[i].validEmail &&
                  friendDetails[i].name
                    ? true
                    : false
                }
              />
              <MDBBtn
                floating
                className="my-2"
                color="danger"
                data-index={i}
                onClick={(e) => {
                  e.stopPropagation();
                  let v = parseInt(e.target.dataset.index);
                  let temp = [...friendDetails];
                  temp.splice(v, 1);
                  setFriendDetails(temp);
                }}
              >
                <MDBIcon fas icon="minus" />
              </MDBBtn>
            </div>
          </MDBAccordionItem>
        </MDBAccordion>
      );
    }
    return res;
  }
  function checkFriends() {
    for (let i = 0; i < friendDetails.length; i++) {
      if (!(friendDetails[i].validEmail && friendDetails[i].name)) {
        return false;
      }
    }
    return true;
  }
  async function add() {
    let payerEmail = payer[0].data;
    let ind = friendDetails.findIndex((val) => val.data === payerEmail);
    if (ind === -1) {
      alert("need to add payer in friend details also");
      return;
    }
    let url = import.meta.env.VITE_DEPLOYMENT + "/api/transaction/add";
    try {
      let res = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          tname: tname.data,
          category: category,
          date: tdate,
          amount: amount,
          friends: friendDetails.map((val) => {
            if (val.data === payerEmail) {
              return { email: val.data, name: val.name, paid: true };
            }
            return { email: val.data, name: val.name, paid: false };
          }),
          payer: { email: payer[0].data, name: payer[0].name },
        }),
      });
      if (res.status === 201) {
        alert("transaction added successfully");
        dispatch(transactionActions.listUpdated());
        return;
      } else {
        res = await res.json();
        alert(res.message);
      }
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <MDBModal show={showModal} setShow={setShowModal} staticBackdrop>
      <MDBModalDialog centered>
        <MDBModalContent>
          <MDBModalHeader>
            <MDBModalTitle>Add new Transaction</MDBModalTitle>
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
                await add();
              }}
            >
              <div>
                <MDBInput
                  tabIndex={0}
                  className="mb-4"
                  type="text"
                  id="form1Example1"
                  label="Transaction name"
                  required
                  value={tname.data}
                  onChange={(e) => {
                    if (e.target.value.length < 5) {
                      setTname({
                        ...tname,
                        data: e.target.value,
                        isValid: false,
                        feedback: "name is too short",
                      });
                    } else {
                      setTname({
                        ...tname,
                        data: e.target.value,
                        isValid: true,
                        feedback: "name is valid",
                      });
                    }
                  }}
                />
                {!tname.isValid ? (
                  <span style={{ color: "red" }}>{tname.feedback}</span>
                ) : (
                  ""
                )}
              </div>
              <div className="mt-5">
                <MDBInput
                  className="mb-4"
                  value={category}
                  onChange={(e) => {
                    setCategory(e.target.value);
                  }}
                  type="text"
                  id="form1Example2"
                  label="Category"
                  required
                  tabIndex={1}
                />
              </div>
              <div className="mt-5">
                <MDBInput
                  className="mt-5"
                  type={"date"}
                  required
                  label={"Transaction Date"}
                  value={tdate}
                  onChange={(e) => {
                    let d = new Date(e.target.value);
                    if (d <= Date.now()) {
                      setTDate(e.target.value);
                    } else {
                      alert("cannot add future dates");
                    }
                  }}
                />
              </div>
              <div className="mt-5">
                <MDBInput
                  className="mb-4"
                  type="number"
                  id="form1Example3"
                  label="Total Amount"
                  required
                  value={amount}
                  onChange={(e) => {
                    if (e.target.value !== "") {
                      setAmount(parseFloat(e.target.value));
                    } else {
                      setAmount("");
                    }
                  }}
                />
              </div>
              {addFeilds()}
              <MDBBtn
                floating
                className="my-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setFriendDetails([
                    ...friendDetails,
                    {
                      data: "",
                      isValid: true,
                      validEmail: false,
                      feedback: "",
                    },
                  ]);
                }}
              >
                <MDBIcon fas icon="plus" />
              </MDBBtn>
              <MDBAccordion>
                <MDBAccordionItem collapseId={1} headerTitle="Payer details">
                  <MDBCheckbox
                    label={"payed by me"}
                    onClick={(e) => {
                      setPayerChecked(e.target.checked);
                      if (e.target.checked) {
                        let temp = [...payer];
                        temp[0].data = email;
                        temp[0].name = name;
                        temp[0].feedback = "";
                        temp[0].isValid = true;
                        temp[0].validEmail = true;
                        setPayer(temp);
                      }
                    }}
                  />
                  <div className="mt-5">
                    <ValidationItem
                      i={0}
                      data={payer}
                      setData={setPayer}
                      readOnly={payerChecked}
                    />

                    <span>Please add Name of Friend</span>
                    <MDBInput
                      type={"text"}
                      required
                      label={"Enter Name"}
                      onChange={(e) => {
                        let temp = [...payer];
                        temp[0].name = e.target.value;
                        setPayer(temp);
                      }}
                      value={payer[0].name ?? ""}
                      readOnly={
                        (payer[0].isValid &&
                          payer[0].validEmail &&
                          payer[0].name) ||
                        payerChecked
                          ? true
                          : false
                      }
                    />
                  </div>
                </MDBAccordionItem>
              </MDBAccordion>
              <button
                ref={submit}
                type="submit"
                style={{ display: "hidden", visibility: "hidden" }}
              ></button>
            </form>
          </MDBModalBody>
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={toggleShow}>
              Close
            </MDBBtn>
            <MDBBtn
              disabled={
                !tname.isValid ||
                !checkFriends() ||
                !(category.length >= 3) ||
                !(tdate !== "") ||
                !(amount !== 0 && amount !== "") ||
                !(payer[0].validEmail && payer[0].name)
              }
              onClick={() => submit.current.click()}
            >
              Save changes
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
  );
};
export default Add;
