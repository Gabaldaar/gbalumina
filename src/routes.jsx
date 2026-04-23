import { Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/dashboard/Dashboard";

import Budgets from "./pages/budgets/Budgets";
import BudgetCreate from "./pages/budgets/BudgetCreate";
import BudgetView from "./pages/budgets/BudgetView";
import BudgetPublic from "./pages/budgets/BudgetPublic";

import Clients from "./pages/clients/Clients";
import ClientNew from "./pages/clients/ClientNew";
import ClientView from "./pages/clients/ClientView";

import ProtectedRoute from "./components/ProtectedRoute";

import Contracts from "./pages/contracts/Contracts";
import ContractCreate from "./pages/contracts/ContractCreate";
import ContractView from "./pages/contracts/ContractView";
import ContractPublic from "./pages/contracts/ContractPublic";
import Settings from "./pages/settings/Settings";
import Selection from "./pages/selection/Selection";
import SelectionCreate from "./pages/selection/SelectionCreate";
import SelectionView from "./pages/selection/SelectionView";
import SelectionPublic from "./pages/selection/SelectionPublic";
import TestInput from "./TestInput";



export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/s/:id" element={<SelectionPublic />} />
      <Route path="/b/:id" element={<BudgetPublic />} />
      <Route path="/c/:id" element={<ContractPublic />} />

      {/* Protected area */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Budgets */}
      <Route
        path="/budgets"
        element={
          <ProtectedRoute>
            <Budgets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/selection"
        element={
          <ProtectedRoute>
            <Selection />
          </ProtectedRoute>
        }
      />
      <Route
        path="/selection/new"
        element={
          <ProtectedRoute>
            <SelectionCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/selection/:id"
        element={
          <ProtectedRoute>
            <SelectionView />
          </ProtectedRoute>
        }
      />

      <Route path="/test" element={<TestInput />} />


      <Route
        path="/budgets/new"
        element={
          <ProtectedRoute>
            <BudgetCreate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/budgets/:id"
        element={
          <ProtectedRoute>
            <BudgetView />
          </ProtectedRoute>
        }
      />

      {/* Clients */}
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <Clients />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clients/new"
        element={
          <ProtectedRoute>
            <ClientNew />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clients/:id"
        element={
          <ProtectedRoute>
            <ClientView />
          </ProtectedRoute>
        }
      />

      {/* Contracts — 🔥 moved inside ProtectedRoute */}
      <Route
        path="/contracts"
        element={
          <ProtectedRoute>
            <Contracts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/contracts/new"
        element={
          <ProtectedRoute>
            <ContractCreate />
          </ProtectedRoute>
        }
      />

      <Route
        path="/contracts/:id"
        element={
          <ProtectedRoute>
            <ContractView />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
