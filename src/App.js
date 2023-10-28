import Assignment_Grading from "./components/Assignment_Grading";
import Sidebar from "./components/Sidebar";
import "./css/App.css";

function App() {
  return (
    <div className="App">
      <Sidebar />
      <Assignment_Grading />
    </div>
  );
}

export default App;
