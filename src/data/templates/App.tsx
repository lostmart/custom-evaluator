import { useState } from "react";

export default function App() {
  const [message, setState] = useState("The click will change this message !");

  const changeValue = () => {
    console.log("running the thing ")
  }

  return (
    <>
      <h1>Simple Use State Exercise</h1>

      <button> Click me !</button>

      <div style={{ marginTop: "1rem" }}>dynamic message here !</div>
    </>
  );
}