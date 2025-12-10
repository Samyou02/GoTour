import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const MyBookings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [currentBookings, setCurrentBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllBookings = async () => {
    setCurrentBookings([]);
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/get-allUserBookings/${currentUser?._id}?searchTerm=${searchTerm}`
      );
      const data = await res.json();
      if (data?.success) {
        setCurrentBookings(data?.bookings);
        setLoading(false);
        setError(false);
      } else {
        setLoading(false);
        setError(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllBookings();
  }, [searchTerm]);

  const handleCancel = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/booking/cancel-booking/${id}/${currentUser._id}`,
        {
          method: "POST",
        }
      );
      const data = await res.json();
      if (data?.success) {
        setLoading(false);
        alert(data?.message);
        getAllBookings();
      } else {
        setLoading(false);
        alert(data?.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-[95%] shadow-xl rounded-lg p-3 flex flex-col gap-2">
        {loading && <h1 className="text-center text-2xl">Loading...</h1>}
        {error && <h1 className="text-center text-2xl">{error}</h1>}
        <div className="w-full border-b-4">
          <input
            className="border rounded-lg p-2 mb-2"
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        {!loading &&
          currentBookings &&
          currentBookings.map((booking, i) => {
            return (
              <div
                className="w-full border-y-2 p-3 flex flex-wrap overflow-auto gap-3 items-center justify-between"
                key={i}
              >
                <Link to={`/package/${booking?.packageDetails?._id}`}>
                  <img
                    className="w-12 h-12"
                    src={booking?.packageDetails?.packageImages[0]}
                    alt="Package Image"
                  />
                </Link>
                <Link to={`/package/${booking?.packageDetails?._id}`}>
                  <p className="hover:underline">
                    {booking?.packageDetails?.packageName}
                  </p>
                </Link>
                <p>{booking?.buyer?.username}</p>
                <p>{booking?.buyer?.email}</p>
                <p>{booking?.date}</p>
                <p className={
                  booking?.status === "Cancelled"
                    ? "px-2 py-1 rounded bg-red-100 text-red-700"
                    : booking?.status === "Completed"
                    ? "px-2 py-1 rounded bg-green-100 text-green-700"
                    : booking?.status === "Started"
                    ? "px-2 py-1 rounded bg-blue-100 text-blue-700"
                    : "px-2 py-1 rounded bg-gray-100 text-gray-700"
                }>
                  {booking?.status}
                </p>
                <button
                  onClick={() => {
                    handleCancel(booking._id);
                  }}
                  disabled={booking?.status !== "Booked"}
                  className="p-2 rounded bg-red-600 text-white hover:opacity-95 disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MyBookings;
