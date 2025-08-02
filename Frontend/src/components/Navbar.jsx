import React from "react";
import { Button } from "./ui/button";
import { Home, BarChart, User, LineChart, Store } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@/lib/constant";
import { setUser } from "@/redux/userSlice";
import { setProblems } from "@/redux/problemSlice";

function Navbar() {
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    console.log("Logging out");
    try {
      // Pass withCredentials as the third argument to axios.post
      const res = await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
      if (res.data.success) {
        toast.success("Logged out successfully");
        navigate("/");
        dispatch(setUser(null));
        dispatch(setProblems(null));
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <nav className="bg-white h-20 flex items-center fixed top-0 z-10 shadow-md w-full">
      <div className="w-full px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-gray-800">Civic Connect</h1>

        {/* Menu Items */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/home">
                <Button variant="outline" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  Home
                </Button>
              </Link>

              <Link to="/leaderboard">
                <Button variant="outline" size="sm">
                  <BarChart className="h-4 w-4 mr-2" />
                  Leaderboard
                </Button>
              </Link>


              <Link to="/analytics">
                <Button variant="outline" size="sm">
                  <LineChart className="h-4 w-4 mr-2" />
                  Analytics
                </Button>
              </Link>

              {!user.isGoverment && 

              <Link to="/store-cart">
                <Button variant="outline" size="sm">
                  <Store className="h-4 w-4 mr-2" />
                  Store
                </Button>
              </Link>
              }

              <Link to={`/profile/${user.id}`}>
                <Button variant="outline" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Button>
              </Link>

              <Button
                onClick={logoutHandler}
                variant="outline"
                className="bg-red-600 hover:bg-red-500 hover:text-white text-white"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline" className="bg-blue-600 hover:bg-blue-500 text-white hover:text-white">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
