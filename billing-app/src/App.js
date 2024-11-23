import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import Create from './components/Create';
import Retrieve from './components/Retrieve';
import './App.css';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <NavLink to="/create" activeClassName="active-link">Create Bill</NavLink>
          <NavLink to="/retrieve" activeClassName="active-link">Retrieve Bill</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<Create />} />
          <Route path="/create" element={<Create />} />
          <Route path="/retrieve" element={<Retrieve />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
