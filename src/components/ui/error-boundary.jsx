@@ .. @@
 import React from "react";
-import { AlertTriangle, RefreshCw } from "lucide-react";
-import { Button } from "./button";
+import { AlertTriangle, RefreshCw, Home, Bug } from "lucide-react";
+import { Button } from "./enhanced-button";
+import { motion } from "framer-motion";
 
 class ErrorBoundary extends React.Component {
   constructor(props) {
     super(props);
     this.state = { hasError: false, error: null, errorInfo: null };
   }
 
   static getDerivedStateFromError(error) {
     return { hasError: true };
   }
 
   componentDidCatch(error, errorInfo) {
     this.setState({
       error: error,
       errorInfo: errorInfo,
     });
 
     // Log error to console in development
     if (process.env.NODE_ENV === "development") {
       console.error("Error caught by boundary:", error, errorInfo);
     }
   }
 
   render() {
     if (this.state.hasError) {
       return (
-        <div className="min-h-screen flex items-center justify-center bg-gray-50">
-          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
-            <div className="mb-6">
-              <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
-              <h2 className="text-2xl font-bold text-gray-900 mb-2">
-                Something went wrong
-              </h2>
-              <p className="text-gray-600 mb-6">
-                We're sorry, but something unexpected happened. Please try
-                refreshing the page.
-              </p>
-            </div>
+        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-orange-50 p-4">
+          <motion.div
+            initial={{ opacity: 0, scale: 0.95 }}
+            animate={{ opacity: 1, scale: 1 }}
+            className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-red-100 p-8 text-center"
+          >
+            <motion.div
+              initial={{ scale: 0 }}
+              animate={{ scale: 1 }}
+              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
+              className="mb-8"
+            >
+              <div className="w-20 h-20 bg-red-100 rounded-2xl mx-auto mb-6 flex items-center justify-center">
+                <AlertTriangle className="w-10 h-10 text-red-500" />
+              </div>
+              <h1 className="text-3xl font-bold text-gray-900 mb-3">
+                Oops! Something went wrong
+              </h1>
+              <p className="text-gray-600 leading-relaxed mb-8">
+                We encountered an unexpected error. Don't worry, our team has been notified and we're working to fix it.
+              </p>
+            </motion.div>
 
-            <div className="space-y-3">
+            <motion.div
+              initial={{ opacity: 0, y: 20 }}
+              animate={{ opacity: 1, y: 0 }}
+              transition={{ delay: 0.4 }}
+              className="space-y-4"
+            >
               <Button
                 onClick={() => window.location.reload()}
-                className="w-full bg-blue-600 hover:bg-blue-700"
+                className="w-full"
+                size="lg"
               >
                 <RefreshCw className="w-4 h-4 mr-2" />
-                Refresh Page
+                Try Again
               </Button>
 
               <Button
-                variant="outline"
+                variant="ghost"
                 onClick={() =>
                   this.setState({
                     hasError: false,
                     error: null,
                     errorInfo: null,
                   })
                 }
                 className="w-full"
               >
-                Try Again
+                <Home className="w-4 h-4 mr-2" />
+                Go Back
               </Button>
-            </div>
+            </motion.div>
 
             {process.env.NODE_ENV === "development" && this.state.error && (
-              <details className="mt-6 text-left">
-                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
-                  Error Details (Development)
+              <motion.details
+                initial={{ opacity: 0 }}
+                animate={{ opacity: 1 }}
+                transition={{ delay: 0.6 }}
+                className="mt-8 text-left"
+              >
+                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700 flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
+                  <Bug className="w-4 h-4" />
+                  Show Error Details (Development Mode)
                 </summary>
-                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded overflow-auto">
+                <pre className="mt-4 text-xs text-red-600 bg-red-50 p-4 rounded-lg overflow-auto max-h-40 border border-red-200">
                   {this.state.error && this.state.error.toString()}
                   <br />
                   {this.state.errorInfo.componentStack}
                 </pre>
-              </details>
+              </motion.details>
             )}
-          </div>
+          </motion.div>
         </div>
       );
     }
 
     return this.props.children;
   }
 }
 
 export default ErrorBoundary;