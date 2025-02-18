import React, { useState } from "react"; 
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Layout, Button } from "antd";

// Components
import Sidebar from "./components/Siderbar";
import ProfileSidebar from "./pages/user_profile/ProfileSidebar";
import Footer from "./components/Footer";
import Header from "./components/Header";

import Dashboard from "./pages/dashboard/Dashboard";
import DashboardProfile from "./pages/dashboard/ProfileAdmin/DashboardProfile";
import DashboardEditProfile from "./pages/dashboard/ProfileAdmin/DashboardEditProfile";
import DashboardChangePassword from "./pages/dashboard/ProfileAdmin/DashboardChangePassword";

import UserProfile from "./pages/user_profile/Profile";
import ProfileEdit from "./pages/user_profile/ProfileEdit";
import AlamatTersimpan from "./pages/user_profile/AlamatTersimpan";
import AddAlamat from "./pages/user_profile/AlamatCreate";
import UserChangePassword from "./pages/user_profile/UserChangePassword";
import Order from "./pages/user_profile/Order";
import OrderDetail from "./pages/user_profile/OrderDetail";
import Review from "./pages/user_profile/Review";

// Product
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import HomeProduct from "./pages/HomeProduct";
import UserDetailProduct from "./pages/DetailProduct";
import ProductsKategori from "./pages/ProductsKategori";
import PilihKategori from "./pages/PilihKategori";
import About from "./pages/About";
import Product from "./pages/dashboard/Product";
import DetailProduct from "./pages/dashboard/ProductDetail";
import AddProduct from "./pages/dashboard/ProductCreate";
import Checkout from "./pages/Checkout";
import UpdateProduct from "./pages/dashboard/ProductUpdate2";
import Kategori from "./pages/dashboard/Kategori";
import AddKategori from "./pages/dashboard/KategoriCreate";
import UpdateKategori from "./pages/dashboard/KategoriUpdate";
import Ongkir from "./pages/dashboard/Ongkir";
import AddOngkir from "./pages/dashboard/OngkirCreate";
import UpdateOngkir from "./pages/dashboard/OngkirUpdate";
import Ulasan from "./pages/dashboard/Ulasan";
import Pesanan from "./pages/dashboard/Pesanan";
import DetailPesanan from "./pages/dashboard/PesananDetail";

// Auth
import Login from "./pages/Login";
import Signup from "./pages/SignUp"; 
import EmailConfirm from "./pages/passwordReset/EmailConfirm";
import ResetCode from "./pages/passwordReset/ResetCode";
import ChangePassword from "./pages/passwordReset/ChangePassword";
import ConfirmAccount from "./pages/ConfirmAccount";

// Customers
import Customer from "./pages/dashboard/Customer";

const { Content } = Layout;

const App = () => {
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/*" element={
            <Layout style={{backgroundColor: "white"}}>
                  
              {/* Main Content */}
              <Layout style={{ padding: '0', minHeight: '20vh', backgroundColor: "white" }}>
                <div className="flex">
                  <div className="flex-1">
                    <Header />
                    <Content
                      style={{
                        // margin: '16px', 
                        background: '#fff',
                        minHeight: '200px',
                      }}
                    >
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products" element={<HomeProduct />} />
                        <Route path="/products/:id" element={<UserDetailProduct />} />
                        <Route path="/products/kategori" element={<ProductsKategori />} />
                        <Route path="/products/kategori/:category_id" element={<PilihKategori />} />
                        <Route path="/products/checkout/:id" element={<Checkout />} />
                        <Route path="/products/checkout/" element={<Checkout />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/profile/*" element={
                              <Layout style={{backgroundColor: "white"}}>
              
                                {/* Main Content */}
                                <Layout style={{ padding: '0', minHeight: '20vh', backgroundColor: "white" }}>
                                  
                                  <div className="flex">
                                    <div className="flex-none ms-4 me-1 mt-4 w-14">
                                      <ProfileSidebar/>
                                    </div>
                                    <div className="flex-1">
                                      <Content
                                        style={{
                                          margin: '16px', 
                                          background: '#fff',
                                          minHeight: '200px',
                                        }}
                                      >
                                        <Routes>
                                          <Route path="/" element={<UserProfile />} />
                                          <Route path="/edit" element={<ProfileEdit />} />
                                          <Route path="/products" element={<Product />} />
                                          <Route path="/alamat" element={<AlamatTersimpan />} />
                                          <Route path="/alamat/add" element={<AddAlamat />} />
                                          <Route path="/password/change" element={<UserChangePassword />} />
                                          <Route path="/order" element={<Order />} />
                                          <Route path="/order/detail/:id" element={<OrderDetail />} />
                                          <Route path="/order/review/:id" element={<Review />} />
                                        </Routes>
                                      </Content>
                                    </div>
                                  </div>
                                  
                                </Layout>
                              </Layout>
                          } />
                      </Routes>
                    </Content>
                  </div>
                </div>
                
              </Layout>
              <Footer />
            </Layout>
          } />
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
                        <Route path="/profile" element={<DashboardProfile />} />
                        <Route path="/profile/edit" element={<DashboardEditProfile />} />
                        <Route path="/profile/edit/password" element={<DashboardChangePassword />} />
                        <Route path="/products" element={<Product />} />
                        <Route path="/products/create" element={<AddProduct />} />
                        <Route path="/products/edit/:id" element={<UpdateProduct />} />
                        <Route path="/products/detail/:id" element={<DetailProduct />} />
                        <Route path="/kategori" element={<Kategori />} />
                        <Route path="/kategori/create" element={<AddKategori />} />
                        <Route path="/kategori/edit/:id" element={<UpdateKategori />} />
                        <Route path="/ongkir" element={<Ongkir />} />
                        <Route path="/ongkir/create" element={<AddOngkir />} />
                        <Route path="/ongkir/:id" element={<UpdateOngkir />} />
                        <Route path="/customer" element={<Customer />} />
                        <Route path="/ulasan" element={<Ulasan />} />
                        <Route path="/pesanan" element={<Pesanan />} />
                        <Route path="/pesanan/detail/:id" element={<DetailPesanan />} />
                      </Routes>
                    </Content>
                  </div>
                </div>
                
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