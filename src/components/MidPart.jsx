@@ .. @@
 "use client"
 
 import { useState } from "react";
-import { Card, CardContent } from "@/components/ui/card";
-import { ChevronDown, ChevronRight } from "lucide-react";
-import { Button } from "@/components/ui/button";
+import { Card, CardContent } from "@/components/ui/enhanced-card";
+import { ChevronDown, ChevronRight, Camera, MapPin, BarChart3, Brain, Zap, Target } from "lucide-react";
+import { Button } from "@/components/ui/enhanced-button";
+import { motion } from "framer-motion";
 
 export default function MidPart() {
   const [openAIItem, setOpenAIItem] = useState(null);
 
   const toggleAIItem = (item) => {
     setOpenAIItem(openAIItem === item ? null : item);
   };
 
+  const steps = [
+    { 
+      step: "1", 
+      title: "Capture & Report", 
+      description: "Take photos and describe the issue with precise location data.", 
+      icon: Camera,
+      color: "bg-blue-500"
+    },
+    { 
+      step: "2", 
+      title: "Community Review", 
+      description: "Citizens vote and discuss to prioritize important issues.", 
+      icon: MapPin,
+      color: "bg-green-500"
+    },
+    { 
+      step: "3", 
+      title: "Track Progress", 
+      description: "Monitor resolution status and receive real-time updates.", 
+      icon: BarChart3,
+      color: "bg-purple-500"
+    }
+  ];
+
+  const aiFeatures = [
+    { 
+      title: "Smart Image Recognition", 
+      description: "AI automatically categorizes issues from photos and suggests appropriate departments for faster routing.",
+      icon: Brain
+    },
+    { 
+      title: "Priority Assessment", 
+      description: "Machine learning algorithms analyze severity, location, and community impact to prioritize urgent issues.",
+      icon: Target
+    },
+    { 
+      title: "Predictive Analytics", 
+      description: "Identify patterns and predict potential issues before they become major problems in your community.",
+      icon: Zap
+    },
+    { 
+      title: "Resource Optimization", 
+      description: "AI-powered recommendations for optimal resource allocation and efficient issue resolution workflows.",
+      icon: BarChart3
+    }
+  ];
+
   return (
-    <div className="bg-gradient-to-b from-blue-50 to-green-50 text-gray-800 py-16 px-4 sm:px-6 lg:px-8">
-      <h2 className="text-center font-bold text-3xl mb-12 text-blue-700 ">
-        How It Works
-      </h2>
+    <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-green-50">
+      <div className="container">
+        <motion.div
+          initial={{ opacity: 0, y: 20 }}
+          whileInView={{ opacity: 1, y: 0 }}
+          viewport={{ once: true }}
+          className="text-center mb-16"
+        >
+          <h2 className="text-4xl font-bold text-gray-900 mb-4">
+            How It Works
+          </h2>
+          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
+            Simple steps to make a lasting impact in your community
+          </p>
+        </motion.div>
       
-      <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
-        {[ 
-          { step: "1", title: "Take a Photo", description: "Capture the issue with your phone or camera.", icon: "📸" },
-          { step: "2", title: "Describe & Locate", description: "Add details and pin the exact location.", icon: "📍" },
-          { step: "3", title: "Track Progress", description: "Get updates as your report is processed.", icon: "📊" }
-        ].map((item, index) => (
-          <Card
-            key={index}
-            className="bg-white w-full sm:w-[30%] text-center p-8 rounded-2xl border border-white/40 shadow-lg shadow-blue-200"
-          >
-            <CardContent className="p-0">
-              <div className="text-5xl mb-4">{item.icon}</div>
-              <div className="text-xl font-bold bg-blue-600 text-white rounded-full w-10 h-10 mx-auto flex items-center justify-center mb-4 shadow-md">
-                {item.step}
-              </div>
-              <h3 className="text-lg font-semibold text-blue-900 mb-2">{item.title}</h3>
-              <p className="text-gray-700">{item.description}</p>
-            </CardContent>
-          </Card>
-        ))}
-      </div>
+        <div className="grid md:grid-cols-3 gap-8 mb-20">
+          {steps.map((item, index) => (
+            <motion.div
+              key={index}
+              initial={{ opacity: 0, y: 20 }}
+              whileInView={{ opacity: 1, y: 0 }}
+              viewport={{ once: true }}
+              transition={{ delay: index * 0.1 }}
+              className="relative"
+            >
+              <Card className="text-center p-8 h-full hover:shadow-lg transition-all duration-300 group">
+                <CardContent className="p-0">
+                  <div className={`w-16 h-16 ${item.color} rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform`}>
+                    <item.icon className="w-8 h-8 text-white" />
+                  </div>
+                  <div className="text-2xl font-bold bg-gray-100 text-gray-800 rounded-full w-12 h-12 mx-auto flex items-center justify-center mb-4">
+                    {item.step}
+                  </div>
+                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{item.title}</h3>
+                  <p className="text-gray-600 leading-relaxed">{item.description}</p>
+                </CardContent>
+              </Card>
+              
+              {/* Connection Line */}
+              {index < steps.length - 1 && (
+                <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-gray-300 to-gray-200 transform -translate-y-1/2 z-10" />
+              )}
+            </motion.div>
+          ))}
+        </div>

-      {/* AI-Powered Analysis */}
-      <div className="flex justify-center mt-12">
-        <Card className="bg-white shadow-lg text-gray-800 p-8 rounded-2xl border border-blue-200 w-full max-w-2xl">
-          <h3 className="text-3xl font-semibold mb-6 text-blue-900 text-center">AI-Powered Analysis</h3>
-          <div className="space-y-6">
-            {[ 
-              { title: "Image Recognition", description: "Uses AI to detect and classify issues from images." },
-              { title: "Priority Assessment", description: "Determines issue severity to prioritize fixes." },
-              { title: "Trend Analysis", description: "Identifies patterns in reported issues over time." },
-              { title: "Resource Allocation", description: "Suggests optimal resource distribution for issue resolution." }
-            ].map((item, index) => (
-              <div key={index} className="border-b border-blue-100 pb-4 last:border-b-0 last:pb-0">
-                <Button
-                  variant="ghost"
-                  className="w-full justify-between text-left font-medium text-blue-700 hover:text-blue-600"
-                  onClick={() => toggleAIItem(item.title)}
-                >
-                  {item.title}
-                  {openAIItem === item.title ? (
-                    <ChevronDown className="h-5 w-5 text-blue-600" />
-                  ) : (
-                    <ChevronRight className="h-5 w-5 text-blue-600" />
-                  )}
-                </Button>
-                {openAIItem === item.title && (
-                  <p className="mt-2 text-gray-700 pl-4">{item.description}</p>
-                )}
-              </div>
-            ))}
+        {/* AI-Powered Analysis */}
+        <motion.div
+          initial={{ opacity: 0, y: 20 }}
+          whileInView={{ opacity: 1, y: 0 }}
+          viewport={{ once: true }}
+          className="max-w-4xl mx-auto"
+        >
+          <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-xl">
+            <div className="p-8">
+              <div className="text-center mb-8">
+                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center">
+                  <Brain className="w-8 h-8 text-white" />
+                </div>
+                <h3 className="text-3xl font-bold text-gray-900 mb-2">AI-Powered Intelligence</h3>
+                <p className="text-gray-600">Advanced technology working behind the scenes</p>
+              </div>
+              
+              <div className="grid md:grid-cols-2 gap-6">
+                {aiFeatures.map((item, index) => (
+                  <motion.div
+                    key={index}
+                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
+                    whileInView={{ opacity: 1, x: 0 }}
+                    viewport={{ once: true }}
+                    transition={{ delay: index * 0.1 }}
+                    className="group"
+                  >
+                    <div className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/50 transition-all duration-200">
+                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
+                        <item.icon className="w-5 h-5 text-blue-600" />
+                      </div>
+                      <div>
+                        <h4 className="font-semibold text-gray-900 mb-2">{item.title}</h4>
+                        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
+                      </div>
+                    </div>
+                  </motion.div>
+                ))}
+              </div>
+            </div>
+          </Card>
+        </motion.div>
+      </div>
+    </section>
+  );
+}
+