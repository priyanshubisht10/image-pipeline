import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ImageEditor from "./pages/ImageEditor";
import Header from "./components/Layout/Header";

function App() {
  return (
    <>
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/image" element={<ImageEditor />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
