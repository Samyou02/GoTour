import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import defaultProfileImg from "../../assets/images/profile.png";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <>
      <div className="bg-gradient-to-r from-teal-600 to-indigo-600 p-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <Link to={`/`} className="select-none">
          <span className="text-white text-3xl font-extrabold tracking-tight">GoTour</span>
        </Link>
        <ul className="flex flex-wrap items-center justify-end gap-4 text-white font-semibold list-none">
          <li className="hover:scale-105 transition-all duration-150 hover:drop-shadow">
            <Link to={`/`}>Home</Link>
          </li>
          <li className="hover:scale-105 transition-all duration-150 hover:drop-shadow">
            <Link to={`/search`}>Packages</Link>
          </li>
          <li className="hover:scale-105 transition-all duration-150 hover:drop-shadow">
            <Link to={`/about`}>About</Link>
          </li>
          <li className="w-10 h-10 flex items-center justify-center">
            {currentUser ? (
              <Link
                to={`/profile/${
                  currentUser.user_role === 1 ? "admin" : "user"
                }`}
              >
                <img
                  src={currentUser.avatar || defaultProfileImg}
                  alt={currentUser.username}
                  className="border w-10 h-10 border-white rounded-[50%] shadow-sm"
                />
              </Link>
            ) : (
              <Link className="hover:scale-105 transition-all duration-150" to={`/login`}>Login</Link>
            )}
          </li>
        </ul>
      </div>
    </>
  );
};

export default Header;
