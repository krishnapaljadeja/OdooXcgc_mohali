import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, Sparkles, Crown, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const items = [
  {
    id: 1,
    title: "Premium Avatar",
    category: "Avatars",
    price: 300,
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=375&q=80",
    icon: Crown,
    description: "Stand out with this exclusive premium avatar",
    popular: true,
  },
  {
    id: 2,
    title: "Galaxy Background",
    category: "Backgrounds",
    price: 500,
    image: "https://images.unsplash.com/photo-1539721972319-f0e80a00d424?ixlib=rb-1.2.1&auto=format&fit=crop&w=375&q=80",
    icon: Sparkles,
    description: "Transform your profile with this stunning galaxy theme",
  },
  {
    id: 3,
    title: "Elite Badge",
    category: "Badges",
    price: 200,
    image: "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=375&q=80",
    icon: Star,
    description: "Show off your status with this elite badge",
    featured: true,
  },
];

const StoreItem = ({ item, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const user = useSelector((state) => state.user?.user) || { coins: 0 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Card
        className={`relative overflow-hidden transform transition-all duration-300 ${
          isHovered ? "scale-105" : ""
        } ${item.popular ? "border-2 border-blue-500" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {item.popular && (
          <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
            Popular
          </div>
        )}
        {item.featured && (
          <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium z-10">
            Featured
          </div>
        )}
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
        <CardHeader className="relative z-10">
          <div className="flex items-center space-x-2">
            <item.icon className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-xl font-bold">{item.title}</CardTitle>
          </div>
          <p className="text-sm text-gray-500">{item.category}</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">{item.description}</p>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
              <Coins className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-blue-600">{item.price}</span>
            </div>
            <Button
              className={`transition-all duration-300 ${
                isHovered ? "shadow-lg bg-blue-700" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Purchase
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function StorePage() {
  const user = useSelector((state) => state.user?.user) || { coins: 0 };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-blue-700 mb-4">
            Welcome to the Store
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Unlock exclusive items and customize your experience with our premium collection.
          </p>
        </motion.div>

        {/* Coins Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex justify-center mt-8"
        >
          <div className="bg-white border-2 border-blue-200 rounded-full px-6 py-3 shadow-lg flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Coins className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xl font-bold text-blue-900">
              {user.coins} Coins
            </span>
          </div>
        </motion.div>
      </div>

      {/* Store Items Grid */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <StoreItem key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>

      {/* Bottom Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto mt-16 bg-gradient-to-r from-blue-600 to-blue-600 rounded-2xl p-8 text-white text-center"
      >
        <h2 className="text-2xl font-bold mb-2">Special Offer!</h2>
        <p className="mb-4">Get 20% extra coins on your next purchase</p>
        <Button className="bg-white text-blue-600 hover:bg-gray-100">
          Buy Coins
        </Button>
      </motion.div>
    </div>
  );
}
