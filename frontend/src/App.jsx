import React, { useState } from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout, Button } from "antd";

// Components
import Sidebar from "./components/Siderbar";
import Footer from "./components/Footer";
import Header from "./components/Header";

import Dashboard from "./pages/dashboard/Dashboard";

// Product
import Home from "./pages/Home";
import Product from "./pages/dashboard/Product";
import AddProduct from "./pages/dashboard/ProductCreate";
import Checkout from "./pages/Checkout";
import UpdateProduct from "./pages/dashboard/ProductUpdate2";

// Auth
import Login from "./pages/Login";
import Signup from "./pages/SignUp"; 
import EmailConfirm from "./pages/passwordReset/EmailConfirm";
import ResetCode from "./pages/passwordReset/ResetCode";
import ChangePassword from "./pages/passwordReset/ChangePassword";
import ConfirmAccount from "./pages/ConfirmAccount";

const { Content } = Layout;

const App = () => {
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/signin" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signup/confirm" element={<ConfirmAccount />} />
        <Route path="/password/reset" element={<EmailConfirm />} />
        <Route path="/password/reset/code" element={<ResetCode />} />
        <Route path="/password/change" element={<ChangePassword />} />

        {/* Protected Routes - Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <Layout style={{backgroundColor: "white"}}>
              
              {/* Main Content */}
              <Layout style={{ padding: '0', minHeight: '20vh', backgroundColor: "white" }}>
                <div className="flex">
                  <div className="flex-none w-14">
                    <Sidebar/>
                  </div>
                  <div className="flex-1">
                    <Header />
                    <Content
                      style={{
                        margin: '16px', 
                        background: '#fff',
                        minHeight: '200px',
                      }}
                    >
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<Product />} />
                        <Route path="/products/create" element={<AddProduct />} />
                        <Route path="/products/:id" element={<UpdateProduct />} />
                      </Routes>
                    </Content>
                  </div>
                </div>
              {/* Sidebar */}
                
              </Layout>
              <Footer />
            </Layout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App;