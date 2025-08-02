@@ .. @@
 import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import { Toaster } from "sonner";
 import ErrorBoundary from "./components/ui/error-boundary";
 import Navbar from "./components/Navbar";
 import Home from "./components/Home";
 import Landing from "./pages/Landing";
 import LeaderBoard from "./pages/LeaderBoard";
 import Analytics from "./pages/Analytics";
 import FlaggedIssues from "./pages/FlaggedIssues";
 import ReportIssue from "./components/ReportIssue";
 import Login from "./pages/Login";
 import Profile from "./pages/Profile";
 import StorePage from "./pages/StorePage";
 import Analytics2 from "./pages/Analytics2";
 import IssuesMap from "./components/IssuesMap";
+import { motion, AnimatePresence } from "framer-motion";
+import { useLocation } from "react-router-dom";
+
+// Page transition wrapper
+const PageTransition = ({ children }) => {
+  const location = useLocation();
+  
+  return (
+    <AnimatePresence mode="wait">
+      <motion.div
+        key={location.pathname}
+        initial={{ opacity: 0, y: 20 }}
+        animate={{ opacity: 1, y: 0 }}
+        exit={{ opacity: 0, y: -20 }}
+        transition={{ duration: 0.3, ease: "easeInOut" }}
+      >
+        {children}
+      </motion.div>
+    </AnimatePresence>
+  );
+};
 
 function App() {
   return (
     <ErrorBoundary>
       <Router>
-        <Navbar />
-        <div className="pt-20">
-          <Routes>
-            <Route path="/" element={<Landing />} />
-            <Route path="/login" element={<Login />} />
-            <Route path="/home" element={<Home />} />
-            <Route path="/leaderboard" element={<LeaderBoard />} />
-            <Route path="/analytics" element={<Analytics />} />
-            <Route path="/flagged-issues" element={<FlaggedIssues />} />
-            <Route path="/report-issue" element={<ReportIssue />} />
-            <Route path="/profile/:userId" element={<Profile />} />
-            <Route path="/store-cart" element={<StorePage />} />
-            <Route path="/analytics2" element={<Analytics2 />} />
-            <Route path="/map" element={<IssuesMap />} />
-          </Routes>
-        </div>
+        <div className="min-h-screen bg-gray-50">
+          <Navbar />
+          <main className="pt-20">
+            <PageTransition>
+              <Routes>
+                <Route path="/" element={<Landing />} />
+                <Route path="/login" element={<Login />} />
+                <Route path="/home" element={<Home />} />
+                <Route path="/leaderboard" element={<LeaderBoard />} />
+                <Route path="/analytics" element={<Analytics />} />
+                <Route path="/flagged-issues" element={<FlaggedIssues />} />
+                <Route path="/report-issue" element={<ReportIssue />} />
+                <Route path="/profile/:userId" element={<Profile />} />
+                <Route path="/store-cart" element={<StorePage />} />
+                <Route path="/analytics2" element={<Analytics2 />} />
+                <Route path="/map" element={<IssuesMap />} />
+              </Routes>
+            </PageTransition>
+          </main>
+        </div>
         <Toaster
           position="bottom-right"
           richColors
           closeButton
           duration={4000}
+          toastOptions={{
+            style: {
+              background: 'white',
+              border: '1px solid #e5e7eb',
+              borderRadius: '12px',
+              fontSize: '14px',
+            },
+          }}
         />
       </Router>
     </ErrorBoundary>
   );
 }
 
 export default App;