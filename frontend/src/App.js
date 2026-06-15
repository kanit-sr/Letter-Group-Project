import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Village from "./pages/Village";
import MyHouse from "./pages/MyHouse";
import HouseEditor from "./pages/HouseEditor";
import NeighborHouse from "./pages/NeighborHouse";
import Mailbox from "./pages/Mailbox";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/village"
            element={
              <ProtectedRoute>
                <Village />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-house"
            element={
              <ProtectedRoute>
                <MyHouse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-house/edit"
            element={
              <ProtectedRoute>
                <HouseEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/house/:userId"
            element={
              <ProtectedRoute>
                <NeighborHouse />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mailbox"
            element={
              <ProtectedRoute>
                <Mailbox />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/village" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
