import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/auth/login";
import RegistrationForm from "./components/auth/registration";
import ResetPasswordForm from "./components/auth/resetPassword";
import TenantPage from "./components/tenant/tenant";
import AddVehicle from "./components/tenant/addVehicle";
import ViewCustomer from "./components/tenant/viewCustomer";
import ViewOwner from "./components/tenant/viewOwner";
import ViewCars from "./components/tenant/viewCars";
import ViewRentals from "./components/tenant/viewRentals";
import AddCustomer from "./components/tenant/addCustomer";
import Customer from "./components/customer/customer";
import ViewAllCars from "./components/customer/viewAllCars";
import ReturnCars from "./components/customer/returnCars";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/registration" element={<RegistrationForm />} />
        <Route path="/forgotPassword" element={<ResetPasswordForm />} />
        <Route path="/tenant" element={<TenantPage />} />
        <Route path="/tenant/add-vehicle" element={<AddVehicle />} />
        <Route path="/tenant/customers" element={<ViewCustomer />} />
        <Route path="/tenant/owners" element={<ViewOwner />} />
        <Route path="/tenant/cars" element={<ViewCars />} />
        <Route path="/tenant/rental" element={<ViewRentals />} />
        <Route path="/tenant/add-customer" element={<AddCustomer />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/customer/view-all-cars" element={<ViewAllCars />} />
        <Route path="/customer/return-cars" element={<ReturnCars />} />
      </Routes>
    </Router>
  );
};

export default App;
