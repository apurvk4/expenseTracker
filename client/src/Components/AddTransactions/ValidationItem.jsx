import { MDBInput } from "mdb-react-ui-kit";
import { useEffect } from "react";
import { useState } from "react";

const ValidationItem = ({ data, setData, i, readOnly }) => {
  const [tempdata, setTempData] = useState(data.data);
  useEffect(() => {
    if (tempdata !== data[i].data) {
      setTempData(data[i].data);
    }
  }, [data]);
  async function check() {
    const val = String(tempdata)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
    if (!val) {
      let temp = [...data];
      temp[i].data = tempdata;
      temp[i].isValid = false;
      temp[i].feedback = "invalid email";
      temp[i].validEmail = false;
      setData(temp);
      return;
    }
    try {
      let res = await fetch(
        import.meta.env.VITE_DEPLOYMENT + `/api/verifyemail/${tempdata}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );
      if (res.status === 200) {
        res = await res.json();
        let temp = [...data];
        temp[i].data = tempdata;
        temp[i].isValid = true;
        temp[i].feedback = "email is valid";
        temp[i].validEmail = true;
        temp[i].name = res.name;
        setData(temp);
      } else {
        res = await res.json();
        let temp = [...data];
        temp[i].data = tempdata;
        temp[i].isValid = false;
        temp[i].feedback = res.message ?? "there was an error";
        temp[i].validEmail = true;
        setData(temp);
      }
    } catch (err) {
      let temp = [...data];
      temp[i].data = tempdata;
      temp[i].isValid = false;
      temp[i].feedback = err.message ?? "there was an error";
      setData(temp);
    }
  }
  return (
    <div>
      <MDBInput
        className="mb-4"
        type={"email"}
        id={`form1Example4${i}`}
        label={"Email"}
        required
        value={tempdata}
        onInput={(e) => {
          setTempData(e.target.value);
          if (data[i].name) {
            let temp = [...data];
            delete temp[i].name;
            setData(temp);
          }
        }}
        onBlur={async () => {
          await check();
        }}
        readOnly={readOnly}
      ></MDBInput>
      {!data[i].isValid ? (
        <span style={{ color: "red" }}>{data[i].feedback}</span>
      ) : (
        ""
      )}
    </div>
  );
};
export default ValidationItem;
