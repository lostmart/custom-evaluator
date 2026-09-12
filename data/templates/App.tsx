import { useState } from "react";

export default function App() {
  const [message, setState] = useState("nunca temas")

  const chanegValue = () => setState("clicked !")

  return (
    <>
      <h1>Hello world</h1>

      <button onClick={chanegValue}> Click me !</button>

      <div>{message}</div>
    </>
  )
}
