@@ .. @@
 import * as React from 'react'
-import { Button } from "@/components/ui/button"
-import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
-import { MapPin, MessageCircle, ThumbsUp, BarChart2, Shield } from 'lucide-react'
+import { Button } from "@/components/ui/enhanced-button"
+import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/enhanced-card"
+import { MapPin, MessageCircle, ThumbsUp, BarChart2, Shield, ArrowRight, CheckCircle, Users, Zap, Globe } from 'lucide-react'
 import MidPart from '@/components/MidPart'
 import { Link } from 'react-router-dom'
+import { motion } from 'framer-motion'
 
 export default function LandingPage() {
   return (
-    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
+    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
+      {/* Hero Section */}
+      <section className="relative overflow-hidden">
+        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/10 via-transparent to-secondary-600/10" />
+        <div className="container relative py-24 sm:py-32">
+          <motion.div 
+            initial={{ opacity: 0, y: 20 }}
+            animate={{ opacity: 1, y: 0 }}
+            transition={{ duration: 0.6 }}
+            className="text-center max-w-4xl mx-auto"
+          >
+            <motion.div
+              initial={{ scale: 0 }}
+              animate={{ scale: 1 }}
+              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
+              className="inline-flex items-center gap-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-8"
+            >
+              <Zap className="w-4 h-4" />
+              Empowering Communities Since 2024
+            </motion.div>
+            
+            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
+              Report Issues,
+              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
+                {" "}Transform Cities
+              </span>
+            </h1>
+            
+            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
+              Join thousands of citizens making their communities better. Report civic issues, 
+              track progress, and drive positive change in your neighborhood.
+            </p>
+            
+            <motion.div
+              initial={{ opacity: 0, y: 20 }}
+              animate={{ opacity: 1, y: 0 }}
+              transition={{ delay: 0.4 }}
+              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
+            >
+              <Link to="/login">
+                <Button size="xl" className="group">
+                  Get Started Today
+                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
+                </Button>
+              </Link>
+              <Button variant="outline" size="xl">
+                Watch Demo
+              </Button>
+            </motion.div>
+            
+            {/* Stats */}
+            <motion.div
+              initial={{ opacity: 0, y: 20 }}
+              animate={{ opacity: 1, y: 0 }}
+              transition={{ delay: 0.6 }}
+              className="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200"
+            >
+              <div className="text-center">
+                <div className="text-3xl font-bold text-gray-900">10K+</div>
+                <div className="text-sm text-gray-600">Issues Resolved</div>
+              </div>
+              <div className="text-center">
+                <div className="text-3xl font-bold text-gray-900">50+</div>
+                <div className="text-sm text-gray-600">Cities Connected</div>
+              </div>
+              <div className="text-center">
+                <div className="text-3xl font-bold text-gray-900">25K+</div>
+                <div className="text-sm text-gray-600">Active Citizens</div>
+              </div>
+            </motion.div>
+          </motion.div>
+        </div>
+      </section>

-      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
-        <section className="text-center mb-16">
-          <h2 className="text-6xl text-center font-bold text-blue-700/90 mb-4 ">Report Public Issues, <br /> Improve Your City!</h2>
-          <p className="text-xl text-gray-600 text-center mb-8">Civic Connect bridges the gap between citizens and local government, 
-            making it easy to report issues,<br /> engage in community discussions, and drive positive change.</p>
-            <Link to="/login" >
-            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">Get Started</Button>
-            </Link>
-        </section>
-
-        <section id="features" className="mb-16">
-          <h3 className="text-3xl font-bold text-blue-700 text-center mb-8">Key Features</h3>
-          <div className="grid md:grid-cols-3 gap-8">
-            <Card>
-              <CardHeader>
-                <CardTitle className="flex items-center">
-                  <MapPin className="mr-2 h-5 w-5 text-blue-500" />
-                  Issue Reporting
-                </CardTitle>
-              </CardHeader>
-              <CardContent>
-                Easily report local problems with geo-tagging and photo uploads for quick resolution.
-              </CardContent>
-            </Card>
-            <Card>
-              <CardHeader>
-                <CardTitle className="flex items-center">
-                  <ThumbsUp className="mr-2 h-5 w-5 text-green-500" />
-                  Community Voting
-                </CardTitle>
-              </CardHeader>
-              <CardContent>
-                Vote on reported issues to help prioritize the most pressing community concerns.
-              </CardContent>
-            </Card>
-            <Card>
-              <CardHeader>
-                <CardTitle className="flex items-center">
-                  <MessageCircle className="mr-2 h-5 w-5 text-orange-500" />
-                  Public Discussion
-                </CardTitle>
-              </CardHeader>
-              <CardContent>
-                Engage in meaningful conversations about local issues and proposed solutions.
-              </CardContent>
-            </Card>
+      {/* Features Section */}
+      <section className="py-24 bg-white">
+        <div className="container">
+          <motion.div
+            initial={{ opacity: 0, y: 20 }}
+            whileInView={{ opacity: 1, y: 0 }}
+            viewport={{ once: true }}
+            className="text-center mb-16"
+          >
+            <h2 className="text-4xl font-bold text-gray-900 mb-4">
+              Everything You Need to Make a Difference
+            </h2>
+            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
+              Powerful tools designed to connect communities and drive meaningful change
+            </p>
+          </motion.div>
+          
+          <div className="grid md:grid-cols-3 gap-8">
+            {[
+              {
+                icon: MapPin,
+                title: "Smart Issue Reporting",
+                description: "Report problems with precise location tracking, photo evidence, and automatic categorization for faster resolution.",
+                color: "text-blue-600",
+                bgColor: "bg-blue-100"
+              },
+              {
+                icon: ThumbsUp,
+                title: "Community Voting",
+                description: "Democratic prioritization system where community votes determine which issues get attention first.",
+                color: "text-green-600",
+                bgColor: "bg-green-100"
+              },
+              {
+                icon: BarChart2,
+                title: "Real-time Analytics",
+                description: "Track progress, view resolution statistics, and see the impact of your community engagement.",
+                color: "text-purple-600",
+                bgColor: "bg-purple-100"
+              }
+            ].map((feature, index) => (
+              <motion.div
+                key={feature.title}
+                initial={{ opacity: 0, y: 20 }}
+                whileInView={{ opacity: 1, y: 0 }}
+                viewport={{ once: true }}
+                transition={{ delay: index * 0.1 }}
+              >
+                <Card className="h-full hover:shadow-lg transition-all duration-300 group">
+                  <CardHeader>
+                    <div className={`w-12 h-12 rounded-xl ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
+                      <feature.icon className={`h-6 w-6 ${feature.color}`} />
+                    </div>
+                    <CardTitle className="text-xl">{feature.title}</CardTitle>
+                  </CardHeader>
+                  <CardContent>
+                    <p className="text-gray-600 leading-relaxed">{feature.description}</p>
+                  </CardContent>
+                </Card>
+              </motion.div>
+            ))}
           </div>
-        </section>
+        </div>
+      </section>

         <MidPart />
         
-        <section id="benefits" className="mb-16">
-          <h3 className="text-3xl font-bold text-blue-700 text-center mb-8">Benefits</h3>
-          <div className="grid md:grid-cols-2 gap-8">
-            <Card className="">
-              <CardHeader>
-                <CardTitle>For Citizens</CardTitle>
-              </CardHeader>
-              <CardContent className="space-y-2">
-                <p className="flex items-center"><ThumbsUp className="mr-2 h-4 w-4 text-blue-500" /> Direct impact on local governance</p>
-                <p className="flex items-center"><MessageCircle className="mr-2 h-4 w-4 text-blue-500" /> Enhanced community engagement</p>
-                <p className="flex items-center"><Shield className="mr-2 h-4 w-4 text-blue-500" /> Increased transparency in issue resolution</p>
-              </CardContent>
-            </Card>
-            <Card className="">
-              <CardHeader>
-                <CardTitle>For Government</CardTitle>
-              </CardHeader>
-              <CardContent className="space-y-2">
-                <p className="flex items-center"><MapPin className="mr-2 h-4 w-4 text-green-500" /> Efficient issue tracking and management</p>
-                <p className="flex items-center"><BarChart2 className="mr-2 h-4 w-4 text-green-500" /> Data-driven decision making</p>
-                <p className="flex items-center"><ThumbsUp className="mr-2 h-4 w-4 text-green-500" /> Improved citizen satisfaction and trust</p>
-              </CardContent>
-            </Card>
+      {/* Benefits Section */}
+      <section className="py-24 bg-gray-50">
+        <div className="container">
+          <motion.div
+            initial={{ opacity: 0, y: 20 }}
+            whileInView={{ opacity: 1, y: 0 }}
+            viewport={{ once: true }}
+            className="text-center mb-16"
+          >
+            <h2 className="text-4xl font-bold text-gray-900 mb-4">
+              Built for Everyone
+            </h2>
+            <p className="text-xl text-gray-600">
+              Empowering both citizens and government officials
+            </p>
+          </motion.div>
+          
+          <div className="grid lg:grid-cols-2 gap-12">
+            <motion.div
+              initial={{ opacity: 0, x: -20 }}
+              whileInView={{ opacity: 1, x: 0 }}
+              viewport={{ once: true }}
+            >
+              <Card className="h-full">
+                <CardHeader>
+                  <div className="flex items-center gap-3 mb-4">
+                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
+                      <Users className="h-6 w-6 text-blue-600" />
+                    </div>
+                    <CardTitle className="text-2xl">For Citizens</CardTitle>
+                  </div>
+                </CardHeader>
+                <CardContent className="space-y-4">
+                  {[
+                    "Make your voice heard in local governance",
+                    "Track the progress of your reported issues",
+                    "Connect with neighbors on community concerns",
+                    "Earn recognition for civic participation"
+                  ].map((benefit, index) => (
+                    <div key={index} className="flex items-center gap-3">
+                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
+                      <span className="text-gray-700">{benefit}</span>
+                    </div>
+                  ))}
+                </CardContent>
+              </Card>
+            </motion.div>
+            
+            <motion.div
+              initial={{ opacity: 0, x: 20 }}
+              whileInView={{ opacity: 1, x: 0 }}
+              viewport={{ once: true }}
+            >
+              <Card className="h-full">
+                <CardHeader>
+                  <div className="flex items-center gap-3 mb-4">
+                    <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
+                      <Shield className="h-6 w-6 text-green-600" />
+                    </div>
+                    <CardTitle className="text-2xl">For Government</CardTitle>
+                  </div>
+                </CardHeader>
+                <CardContent className="space-y-4">
+                  {[
+                    "Streamlined issue management and tracking",
+                    "Data-driven insights for better decision making",
+                    "Improved citizen satisfaction and trust",
+                    "Efficient resource allocation and planning"
+                  ].map((benefit, index) => (
+                    <div key={index} className="flex items-center gap-3">
+                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
+                      <span className="text-gray-700">{benefit}</span>
+                    </div>
+                  ))}
+                </CardContent>
+              </Card>
+            </motion.div>
           </div>
-        </section>
+        </div>
+      </section>

-        <section className="text-center">
-          <h3 className="text-2xl font-semibold mb-4">Ready to make a difference in your community?</h3>
-          <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">Join Civic Connect Today</Button>
-        </section>
-      </main>
+      {/* CTA Section */}
+      <section className="py-24 bg-gradient-to-r from-primary-600 to-secondary-600">
+        <div className="container text-center">
+          <motion.div
+            initial={{ opacity: 0, y: 20 }}
+            whileInView={{ opacity: 1, y: 0 }}
+            viewport={{ once: true }}
+          >
+            <h2 className="text-4xl font-bold text-white mb-6">
+              Ready to Transform Your Community?
+            </h2>
+            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
+              Join thousands of citizens already making a difference. Start reporting issues and driving positive change today.
+            </p>
+            <Link to="/login">
+              <Button size="xl" variant="secondary" className="group">
+                Join CivicTrack Today
+                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
+              </Button>
+            </Link>
+          </motion.div>
+        </div>
+      </section>

-      <footer className="bg-gray-200 mt-16">
-        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
-          <div className="grid md:grid-cols-3 gap-8">
+      {/* Footer */}
+      <footer className="bg-gray-900 text-white">
+        <div className="container py-16">
+          <div className="grid md:grid-cols-4 gap-8">
+            <div className="md:col-span-2">
+              <div className="flex items-center gap-3 mb-4">
+                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
+                  <span className="text-white font-bold text-lg">C</span>
+                </div>
+                <div>
+                  <h3 className="text-xl font-bold">CivicTrack</h3>
+                  <p className="text-gray-400 text-sm">Community Platform</p>
+                </div>
+              </div>
+              <p className="text-gray-400 mb-6 max-w-md">
+                Empowering citizens and governments to build better communities together through technology and collaboration.
+              </p>
+            </div>
             <div>
-              <h4 className="font-semibold mb-4">About Civic Connect</h4>
-              <p className="text-sm text-gray-600">Empowering citizens and governments to build better communities together.</p>
+              <h4 className="font-semibold mb-4 text-white">Quick Links</h4>
+              <ul className="space-y-2 text-gray-400">
+                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
+                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
+                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
+                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
+              </ul>
             </div>
             <div>
-              <h4 className="font-semibold mb-4">Quick Links</h4>
-              <ul className="space-y-2 text-sm text-gray-600">
-                <li><a href="#" className="hover:text-blue-600">How It Works</a></li>
-                <li><a href="#" className="hover:text-blue-600">Success Stories</a></li>
-                <li><a href="#" className="hover:text-blue-600">FAQs</a></li>
+              <h4 className="font-semibold mb-4 text-white">Contact</h4>
+              <ul className="space-y-2 text-gray-400">
+                <li>support@civictrack.com</li>
+                <li>1-800-CIVIC-HELP</li>
+                <li>Emergency: 911</li>
               </ul>
             </div>
-            <div>
-              <h4 className="font-semibold mb-4">Contact Us</h4>
-              <p className="text-sm text-gray-600">support@civicconnect.com</p>
-              <p className="text-sm text-gray-600">1-800-CIVIC-HELP</p>
-            </div>
           </div>
-          <div className="mt-8 pt-8 border-t border-gray-200 text-center text-sm text-gray-600">
-            &copy; 2024 Civic Connect. All rights reserved.
+          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
+            <p>&copy; 2024 CivicTrack. All rights reserved. Built with ❤️ for communities.</p>
           </div>
         </div>
       </footer>