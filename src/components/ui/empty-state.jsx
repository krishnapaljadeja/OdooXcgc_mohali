@@ .. @@
-import { Search, Inbox, AlertCircle, PlusCircle } from "lucide-react";
-import { Button } from "./button";
+import { Search, Inbox, AlertCircle, PlusCircle, RefreshCw } from "lucide-react";
+import { Button } from "./enhanced-button";
 import { cn } from "@/lib/utils";
+import { motion } from "framer-motion";
 
 export function EmptyState({
   icon = "search",
   title = "No results found",
   description = "Try adjusting your filters or search terms to find what you're looking for.",
   action,
   className,
+  animated = true,
 }) {
   const icons = {
     search: Search,
     inbox: Inbox,
     alert: AlertCircle,
     plus: PlusCircle,
+    refresh: RefreshCw,
   };
 
   const IconComponent = icons[icon];
 
+  const content = (
+    <div className="max-w-md mx-auto text-center">
+      <div className="mb-6">
+        <div className="mx-auto w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gray-200 transition-colors">
+          <IconComponent className="w-10 h-10 text-gray-400" />
+        </div>
+        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
+        <p className="text-gray-600 leading-relaxed">{description}</p>
+      </div>
+
+      {action && (
+        <div className="flex flex-col sm:flex-row gap-3 justify-center">
+          {action}
+        </div>
+      )}
+    </div>
+  );
+
   return (
     <div
       className={cn(
-        "text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100",
+        "group py-16 px-8 bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200",
         className
       )}
     >
-      <div className="max-w-md mx-auto">
-        <div className="mb-6">
-          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
-            <IconComponent className="w-8 h-8 text-gray-400" />
-          </div>
-          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
-          <p className="text-gray-600">{description}</p>
-        </div>
-
-        {action && (
-          <div className="flex flex-col sm:flex-row gap-3 justify-center">
-            {action}
-          </div>
+      {animated ? (
+        <motion.div
+          initial={{ opacity: 0, y: 20 }}
+          animate={{ opacity: 1, y: 0 }}
+          transition={{ duration: 0.4 }}
+        >
+          {content}
+        </motion.div>
+      ) : (
+        content
       )}
-      )}
     </div>
   );
 }
 
 export function EmptyStateWithFilters({
   onClearFilters,
+  onRefresh,
   searchQuery,
   selectedCategory,
   selectedStatus,
   selectedDistance,
   className,
 }) {
   const hasActiveFilters =
     searchQuery ||
     selectedCategory !== "All" ||
     selectedStatus !== "All" ||
     selectedDistance !== "All";
 
   if (!hasActiveFilters) {
     return (
       <EmptyState
         icon="inbox"
-        title="No issues found"
-        description="There are currently no issues reported in your area. Be the first to report an issue!"
+        title="No Issues Found"
+        description="There are currently no issues reported in your area. Be the first to make a difference in your community!"
         action={
-          <Button className="bg-blue-600 hover:bg-blue-700">
-            <PlusCircle className="w-4 h-4 mr-2" />
-            Report Issue
-          </Button>
+          <div className="flex gap-3">
+            <Button>
+              <PlusCircle className="w-4 h-4 mr-2" />
+              Report First Issue
+            </Button>
+            {onRefresh && (
+              <Button variant="outline" onClick={onRefresh}>
+                <RefreshCw className="w-4 h-4 mr-2" />
+                Refresh
+              </Button>
+            )}
+          </div>
         }
         className={className}
       />
     );
   }
 
   return (
     <EmptyState
       icon="search"
-      title="No matching issues"
-      description="No issues match your current filters. Try adjusting your search criteria."
+      title="No Matching Issues"
+      description="We couldn't find any issues matching your current filters. Try adjusting your search criteria or clearing filters to see more results."
       action={
-        <Button variant="outline" onClick={onClearFilters}>
-          Clear Filters
-        </Button>
+        <div className="flex gap-3">
+          <Button variant="outline" onClick={onClearFilters}>
+            Clear All Filters
+          </Button>
+          {onRefresh && (
+            <Button variant="ghost" onClick={onRefresh}>
+              <RefreshCw className="w-4 h-4 mr-2" />
+              Refresh
+            </Button>
+          )}
+        </div>
       }
       className={className}
     />
   );
 }