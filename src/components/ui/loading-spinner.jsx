@@ .. @@
 import { Loader2 } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 export function LoadingSpinner({
   size = "default",
   className,
   text = "Loading...",
+  variant = "default",
 }) {
   const sizeClasses = {
     sm: "w-4 h-4",
     default: "w-6 h-6",
     lg: "w-8 h-8",
     xl: "w-12 h-12",
   };
 
+  const variantClasses = {
+    default: "text-primary-600",
+    muted: "text-gray-400",
+    white: "text-white",
+  };
+
   return (
     <div
       className={cn(
-        "flex flex-col items-center justify-center gap-3",
+        "flex flex-col items-center justify-center gap-4",
         className
       )}
     >
-      <Loader2
-        className={cn("animate-spin text-blue-600", sizeClasses[size])}
-      />
-      {text && <p className="text-sm text-gray-600 animate-pulse">{text}</p>}
+      <div className="relative">
+        <Loader2
+          className={cn(
+            "animate-spin",
+            sizeClasses[size],
+            variantClasses[variant]
+          )}
+        />
+        <div className={cn(
+          "absolute inset-0 rounded-full border-2 border-transparent border-t-current opacity-20 animate-spin",
+          sizeClasses[size]
+        )} />
+      </div>
+      {text && (
+        <p className={cn(
+          "text-sm font-medium animate-pulse",
+          variant === "white" ? "text-white/80" : "text-gray-600"
+        )}>
+          {text}
+        </p>
+      )}
     </div>
   );
 }
 
-export function LoadingSkeleton({ className, lines = 3 }) {
+export function LoadingSkeleton({ 
+  className, 
+  lines = 3, 
+  variant = "default",
+  showAvatar = false 
+}) {
+  const variantClasses = {
+    default: "bg-gray-200",
+    light: "bg-gray-100",
+    card: "bg-white border border-gray-200 rounded-xl p-6",
+  };
+
   return (
-    <div className={cn("space-y-3", className)}>
+    <div className={cn(
+      "animate-pulse",
+      variant === "card" ? variantClasses[variant] : "space-y-3",
+      className
+    )}>
+      {showAvatar && (
+        <div className="flex items-center space-x-4 mb-4">
+          <div className="w-12 h-12 bg-gray-200 rounded-full" />
+          <div className="space-y-2 flex-1">
+            <div className="h-4 bg-gray-200 rounded w-1/4" />
+            <div className="h-3 bg-gray-200 rounded w-1/3" />
+          </div>
+        </div>
+      )}
       {Array.from({ length: lines }).map((_, i) => (
         <div
           key={i}
-          className="h-4 bg-gray-200 rounded animate-pulse"
+          className={cn(
+            "h-4 rounded loading-shimmer",
+            variant !== "card" && variantClasses[variant]
+          )}
           style={{ width: `${Math.random() * 40 + 60}%` }}
         />
       ))}
     </div>
   );
 }
+
+export function LoadingCard({ className }) {
+  return (
+    <div className={cn("bg-white rounded-xl border border-gray-200 p-6 animate-pulse", className)}>
+      <div className="space-y-4">
+        <div className="h-48 bg-gray-200 rounded-lg loading-shimmer" />
+        <div className="space-y-2">
+          <div className="h-6 bg-gray-200 rounded loading-shimmer" />
+          <div className="h-4 bg-gray-200 rounded loading-shimmer w-3/4" />
+        </div>
+        <div className="flex justify-between items-center">
+          <div className="h-8 bg-gray-200 rounded-full w-20 loading-shimmer" />
+          <div className="h-8 bg-gray-200 rounded w-24 loading-shimmer" />
+        </div>
+      </div>
+    </div>
+  );
+}