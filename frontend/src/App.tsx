import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import TodoList from "./components/TodoList";
import PipelineStatus from "./components/PipelineStatus";
import "./App.css";

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Liatrio Todo List</h1>
          <nav>
            <a href="/">Todos</a>
            <a href="/pipeline">Pipeline Status</a>
          </nav>
        </header>

        <main className="App-main">
          <Routes>
            <Route path="/" element={<TodoList />} />
            <Route path="/pipeline" element={<PipelineStatus />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="App-footer">
          <p>Built with React, TypeScript, and CI/CD best practices</p>
        </footer>
      </div>
    </Router>
  );
};

export default App;
