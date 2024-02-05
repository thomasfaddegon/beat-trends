import Graph from "./graph";
import "./App.css";
import { data } from "./data";

function App() {
  return (
    <>
      <h1>Vite + React</h1>
      <div className="card"></div>
      <Graph data={data} />
    </>
  );
}

export default App;
