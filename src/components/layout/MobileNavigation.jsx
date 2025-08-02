import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Menu,
  X,
  Home,
  BarChart,
  User,
  Store,
  Shield,
  Flag,
  Map,
  PlusCircle,
} from "lucide-react";
import { Button } from "../ui/enhanced-button";

const MobileNavigation = ({ onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const user = useSelector((state) => state.user.user);

  const navigationItems = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/leaderboard", label: "Leaderboard", icon: BarChart },
    { href: "/map", label: "Map", icon: Map },
    ...(user?.isGoverment
      ? [
          { href: "/analytics", label: "Analytics", icon: Shield },
          { href: "/flagged-issues", label: "Flagged Issues", icon: Flag },
        ]
      : [
          { href: "/store-cart", label: "Store", icon: Store },
          { href: "/report-issue", label: "Report Issue", icon: PlusCircle },
        ]),
    { href: `/profile/${user?.id}`, label: "Profile", icon: User },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="md:hidden"
        aria-label="Open navigation menu"
      >
        <Menu className="h-6 w-6" />
      </Button>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            />

            {/* Navigation Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 md:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="text-primary-600 font-semibold text-lg">
                        {user?.name?.charAt(0) || "U"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close navigation menu"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 p-6">
                  <ul className="space-y-2">
                    {navigationItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            isActive(item.href)
                              ? "bg-primary-50 text-primary-700 border border-primary-200"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      onLogout();
                      setIsOpen(false);
                    }}
                    className="w-full"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;