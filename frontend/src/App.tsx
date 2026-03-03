import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
const Stub = ({ label }: { label: string }) => (
  <div style={{ padding: 40, fontFamily: "sans-serif" }}>
    {" "}
    <p>Route test</p>{" "}
    <h2>{label}</h2>{" "}
  </div>
);
export default function App() {
  return (
    <BrowserRouter>
      {" "}
      <Routes>
        {" "}
        {/* Public routes */}{" "}
        <Route path="/login" element={<Stub label="Login Page" />} />{" "}
        <Route path="/activate" element={<Stub label="Activate Account" />} />{" "}
        {/* Role dashboards — stubs for Sprint 1 */}{" "}
        <Route path="/manager/*" element={<Stub label="Manager Dashboard" />} />{" "}
        <Route
          path="/designer/*"
          element={<Stub label="Designer Dashboard" />}
        />{" "}
        <Route path="/client/*" element={<Stub label="Client Dashboard" />} />{" "}
        {/* Default redirect */}{" "}
        <Route path="/" element={<Navigate to="/login" replace />} />{" "}
      </Routes>{" "}
    </BrowserRouter>
  );
}
