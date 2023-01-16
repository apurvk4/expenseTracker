import { useEffect } from "react";
import { useState } from "react";

const useValidate = (url_path) => {
  const [data, setData] = useState(undefined);
  const [isValid, setIsValid] = useState(true);
  const [feedback, setFeedback] = useState("");
  useEffect(() => {
    if (typeof data !== "undefined") {
      check();
    }
  }, [data]);
  let validEmail = true;
  async function check() {
    try {
      let res = await fetch(
        import.meta.env.VITE_DEPLOYMENT + url_path + `/${data}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );
      if (res.status === 200) {
        setIsValid(true);
        res = await res.json();
        if ("validEmail" in res) {
          validEmail = res.validEmail;
        }
        setFeedback("data is valid");
      } else {
        res = await res.json();
        setIsValid(false);
        setFeedback(res.message);
      }
    } catch (err) {
      setIsValid(false);
      setFeedback(err.message);
    }
  }
  return [{ data, isValid, feedback, validEmail }, setData];
};
export default useValidate;
