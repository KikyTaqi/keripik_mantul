import React, { useState } from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout, Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import Sidebar from "./components/Siderbar";
import Dashboard from "./pages/dashboard/Dashboard";
import Product from "./pages/dashboard/Product";
import AddProduct from "./pages/dashboard/ProductCreate";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UpdateProduct from "./pages/dashboard/ProductUpdate2";
import Footer from "./components/Footer";
import Header from "./components/Header";

const { Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/checkout/:id" element={<Checkout />} />
        <Route path="/signin" element={<Login />} />

        {/* Protected Routes - Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <Layout>
              
              {/* Main Content */}
              <Layout style={{ padding: '0', minHeight: '20vh' }}>
                <div className="flex">
                  <div className="flex-none w-14">
                    <Sidebar collapsed={collapsed} />
                  </div>
                  <div className="flex-1">
                    <Header />
                    <Content
                      style={{
                        margin: "16px",
                        padding: '16px',
                        background: '#fff',
                        minHeight: '200px',
                      }}
                    >
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/products" element={<Product />} />
                        <Route path="/products/create" element={<AddProduct />} />
                        <Route path="/product/:id" element={<UpdateProduct />} />
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