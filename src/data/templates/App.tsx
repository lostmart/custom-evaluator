import { useState } from "react";

export default function App() {
  const [message, setState] = useState("The click will change this message !");

  const changeValue = () => setState("clicked");

  return (
    <>
      <h1>Simple Use State Exercise</h1>

      <button onClick={changeValue}> Click me !</button>

      <div style={{ marginTop: "1rem" }}>{message}</div>
    </>
  );
}
