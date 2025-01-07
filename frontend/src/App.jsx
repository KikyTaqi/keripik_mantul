import React, { useState } from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout, Button } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import Sidebar from "./components/Siderbar"
import Dashboard from "./pages/dashboard/Dashboard"
import Checkout from "./pages/Checkout"
import Home from "./pages/Home"
import Login from "./pages/Login"
import UpdateProduct from "./pages/dashboard/ProductUpdate2  "

const { Header, Content } = Layout;

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
        <Route path="/sigin" element={<Login />} />

        {/* Protected Routes - Dashboard */}
        <Route
          path="/dashboard/*"
          element={
            <Layout style={{ minHeight: "100vh" }}>
              {/* Sidebar */}
              <Sidebar collapsed={collapsed} />

              {/* Main Content */}
              <Layout>
                <Header
                  style={{
                    padding: 0,
                    background: "#fff",
                    boxShadow: "0 2px 8px #f0f1f2"
                  }}
                >
                  <Button
                    type="text"
                    icon={
                      collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
                    }
                    onClick={toggleSidebar}
                    style={{ fontSize: "16px", marginLeft: "16px" }}
                  />
                </Header>
                <Content
                  style={{
                    margin: "16px",
                    padding: '16px',
                    background: '#fff',
                    minHeight: '200px'
                  }}
                >
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/products" element={<Product />} />
                    <Route path="/products/create" element={<AddProduct />} />
                    <Route path="/product/:id" element={<UpdateProduct />} />
                  </Routes>
                </Content>
              </Layout>
            </Layout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App;