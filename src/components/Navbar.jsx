@@ .. @@
 import React from "react";
-import { Button } from "./ui/button";
+import { Button } from "./ui/enhanced-button";
 import {
   Home,
   BarChart,
   User,
   LineChart,
   Store,
   Shield,
   Flag,
   Map,
+  LogOut,
 } from "lucide-react";
-import { Link, useNavigate } from "react-router-dom";
+import { Link, useNavigate, useLocation } from "react-router-dom";
 import { toast } from "sonner";
 import { useDispatch, useSelector } from "react-redux";
 import axios from "axios";
 import { BASE_URL } from "@/lib/constant";
 import { setUser } from "@/redux/userSlice";
 import { setProblems } from "@/redux/problemSlice";
+import MobileNavigation from "./layout/MobileNavigation";
+import { motion } from "framer-motion";
 
 function Navbar() {
   const user = useSelector((state) => state.user.user);
   const navigate = useNavigate();
   const dispatch = useDispatch();
+  const location = useLocation();
 
   const logoutHandler = async () => {
-    console.log("Logging out");
     try {
-      // Pass withCredentials as the third argument to axios.post
       const res = await axios.post(
         `${BASE_URL}/auth/logout`,
         {},
         { withCredentials: true }
       );
       if (res.data.success) {
         toast.success("Logged out successfully");
         navigate("/");
         dispatch(setUser(null));
         dispatch(setProblems(null));
       }
     } catch (err) {
-      toast.error(err.message);
+      toast.error("Failed to logout. Please try again.");
     }
   };
 
+  const isActive = (path) => location.pathname === path;
+
+  const NavLink = ({ to, children, icon: Icon, className = "" }) => (
+    <Link to={to}>
+      <Button
+        variant={isActive(to) ? "default" : "ghost"}
+        size="sm"
+        className={`transition-all duration-200 ${className}`}
+      >
+        <Icon className="h-4 w-4 mr-2" />
+        {children}
+      </Button>
+    </Link>
+  );
+
   return (
-    <nav className="bg-white h-20 flex items-center fixed top-0 z-10 shadow-md w-full">
-      <div className="w-full px-8 py-4 flex justify-between items-center">
-        {/* Logo */}
-        <h1 className="text-2xl font-bold text-gray-800">Civic Connect</h1>
+    <motion.nav 
+      initial={{ y: -100 }}
+      animate={{ y: 0 }}
+      className="bg-white/95 backdrop-blur-md h-20 flex items-center fixed top-0 z-50 shadow-sm border-b border-gray-200 w-full"
+    >
+      <div className="container flex justify-between items-center">
+        {/* Logo */}
+        <Link to={user ? "/home" : "/"} className="flex items-center gap-3">
+          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg">
+            <span className="text-white font-bold text-lg">C</span>
+          </div>
+          <div className="hidden sm:block">
+            <h1 className="text-xl font-bold text-gray-900">CivicTrack</h1>
+            <p className="text-xs text-gray-500 -mt-1">Community Platform</p>
+          </div>
+        </Link>
 
-        {/* Menu Items */}
-        <div className="flex items-center gap-4">
+        {/* Desktop Navigation */}
+        <div className="hidden md:flex items-center gap-2">
           {user ? (
             <>
-              <Link to="/home">
-                <Button variant="outline" size="sm">
-                  <Home className="h-4 w-4 mr-2" />
-                  Home
-                </Button>
-              </Link>
-
-              <Link to="/leaderboard">
-                <Button variant="outline" size="sm">
-                  <BarChart className="h-4 w-4 mr-2" />
-                  Leaderboard
-                </Button>
-              </Link>
-
-              <Link to="/map">
-                <Button variant="outline" size="sm">
-                  <Map className="h-4 w-4 mr-2" />
-                  Map
-                </Button>
-              </Link>
+              <NavLink to="/home" icon={Home}>Home</NavLink>
+              <NavLink to="/leaderboard" icon={BarChart}>Leaderboard</NavLink>
+              <NavLink to="/map" icon={Map}>Map</NavLink>
 
-              {/* Analytics - Only for government users */}
               {user.isGoverment && (
                 <>
-                  <Link to="/analytics">
-                    <Button
-                      variant="outline"
-                      size="sm"
-                      className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
-                    >
-                      <Shield className="h-4 w-4 mr-2" />
-                      Analytics
-                    </Button>
-                  </Link>
-                  <Link to="/flagged-issues">
-                    <Button
-                      variant="outline"
-                      size="sm"
-                      className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
-                    >
-                      <Flag className="h-4 w-4 mr-2" />
-                      Flagged Issues
-                    </Button>
-                  </Link>
+                  <NavLink to="/analytics" icon={Shield}>Analytics</NavLink>
+                  <NavLink to="/flagged-issues" icon={Flag}>Flagged</NavLink>
                 </>
               )}
 
-              {/* Store - Only for regular users */}
               {!user.isGoverment && (
-                <Link to="/store-cart">
-                  <Button variant="outline" size="sm">
-                    <Store className="h-4 w-4 mr-2" />
-                    Store
-                  </Button>
-                </Link>
+                <NavLink to="/store-cart" icon={Store}>Store</NavLink>
               )}
 
-              <Link to={`/profile/${user.id}`}>
-                <Button variant="outline" size="sm">
-                  <User className="h-4 w-4 mr-2" />
-                  Profile
-                </Button>
-              </Link>
+              <NavLink to={`/profile/${user.id}`} icon={User}>Profile</NavLink>
 
               <Button
                 onClick={logoutHandler}
-                variant="outline"
-                className="bg-red-600 hover:bg-red-500 hover:text-white text-white"
+                variant="destructive"
+                size="sm"
+                className="ml-2"
               >
+                <LogOut className="h-4 w-4 mr-2" />
                 Logout
               </Button>
             </>
           ) : (
             <Link to="/login">
               <Button
-                variant="outline"
-                className="bg-blue-600 hover:bg-blue-500 text-white hover:text-white"
+                variant="default"
+                size="sm"
               >
                 Sign In
               </Button>
             </Link>
           )}
         </div>
+
+        {/* Mobile Navigation */}
+        {user && <MobileNavigation onLogout={logoutHandler} />}
       </div>
-    </nav>
+    </motion.nav>
   );
 }
 
 export default Navbar;