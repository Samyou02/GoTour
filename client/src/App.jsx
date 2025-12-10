import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Header from "./pages/components/Header";
import Profile from "./pages/Profile";
import About from "./pages/About";
import PrivateRoute from "./pages/Routes/PrivateRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AllBookings from "./pages/admin/AllBookings";
import AddPackages from "./pages/admin/AddPackages";
import AllPackages from "./pages/admin/AllPackages";
import AllUsers from "./pages/admin/AllUsers";
import Payments from "./pages/admin/Payments";
import RatingsReviews from "./pages/admin/RatingsReviews";
import History from "./pages/admin/History";
import AdminUpdateProfile from "./pages/admin/AdminUpdateProfile";
import SiteContent from "./pages/admin/SiteContent";
import AdminRoute from "./pages/Routes/AdminRoute";
import UpdatePackage from "./pages/admin/UpdatePackage";
import Package from "./pages/Package";
import RatingsPage from "./pages/RatingsPage";
import Booking from "./pages/user/Booking";
import Search from "./pages/Search";
import GroupTours from "./pages/GroupTours";
import GroupDestinationPackages from "./pages/GroupDestinationPackages";
import International from "./pages/International";
import InternationalDestinationPackages from "./pages/InternationalDestinationPackages";
import Domestic from "./pages/Domestic";
import DomesticDestinationPackages from "./pages/DomesticDestinationPackages";
import Honeymoon from "./pages/Honeymoon";
import HoneymoonDestinationPackages from "./pages/HoneymoonDestinationPackages";
import Itinerary from "./pages/Itinerary";
import Footer from "./pages/components/Footer";

const App = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/search" element={<Search />} />
        <Route path="/group-tours" element={<GroupTours />} />
        <Route path="/group-packages/:destination" element={<GroupDestinationPackages />} />
        <Route path="/international" element={<International />} />
        <Route path="/international-packages/:destination" element={<InternationalDestinationPackages />} />
        <Route path="/domestic" element={<Domestic />} />
        <Route path="/domestic-packages/:destination" element={<DomesticDestinationPackages />} />
        <Route path="/honeymoon" element={<Honeymoon />} />
        <Route path="/honeymoon-packages/:destination" element={<HoneymoonDestinationPackages />} />
        <Route path="/package/:id/itinerary" element={<Itinerary />} />
        {/* user */}
        <Route path="/profile" element={<PrivateRoute />}>
          <Route path="user" element={<Profile />} />
        </Route>
        {/* admin */}
        <Route path="/profile" element={<AdminRoute />}>
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/site-content" element={<SiteContent />} />
          <Route path="admin/bookings" element={<AllBookings />} />
          <Route path="admin/add-packages" element={<AddPackages />} />
          <Route path="admin/all-packages" element={<AllPackages />} />
          <Route path="admin/users" element={<AllUsers />} />
          <Route path="admin/payments" element={<Payments />} />
          <Route path="admin/ratings-reviews" element={<RatingsReviews />} />
          <Route path="admin/history" element={<History />} />
          <Route path="admin/update-package/:id" element={<UpdatePackage />} />
          <Route path="admin/update-profile" element={<AdminUpdateProfile />} />
        </Route>
        <Route path="/about" element={<About />} />
        <Route path="/package/:id" element={<Package />} />
        <Route path="/package/ratings/:id" element={<RatingsPage />} />
        {/* checking user auth before booking */}
        <Route path="/booking" element={<PrivateRoute />}>
          <Route path=":packageId" element={<Booking />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
