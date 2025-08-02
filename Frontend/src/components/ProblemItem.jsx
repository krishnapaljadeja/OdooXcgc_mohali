import * as React from "react";
import { ListFilter, PlusCircle, Search } from "lucide-react";
import { motion } from "framer-motion";
import img from "../assets/road.jpeg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  LoadingSpinner,
  LoadingSkeleton,
} from "@/components/ui/loading-spinner";
import { EmptyStateWithFilters } from "@/components/ui/empty-state";
import ProblemList from "./ProblemCard";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const categories = [
  "All",
  "INFRASTURCTURE",
  "ENVIROUNMENT",
  "COMMUNITY_SERVICES",
];
const statuses = ["All", "REPORTED", "IN_PROGRESS", "COMPLETED"];
const distances = ["All", "1km", "3km", "5km"];

export default function ProblemItem() {
  const user = useSelector((state) => state.user.user);
  const [role, setRole] = useState("user");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedDistance, setSelectedDistance] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);

  const problems = useSelector((state) => state.problem.problems);

  useEffect(() => {
    if (user) {
      setRole(user.isGoverment ? "goverment" : "user");
    }
  }, [user]);

  const isGovOfficial = role === "goverment";

  const filteredProblems = React.useMemo(() => {
    if (!problems || problems.length === 0) return [];

    let filtered = problems.filter(
      (problem) =>
        (selectedCategory === "All" || problem.category === selectedCategory) &&
        (selectedStatus === "All" || problem.status === selectedStatus) &&
        problem.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter flagged issues for government users
    if (isGovOfficial && showFlaggedOnly) {
      filtered = filtered.filter(
        (problem) => problem.flagCount > 0 || problem.isHidden
      );
    }

    return filtered;
  }, [
    problems,
    selectedCategory,
    selectedStatus,
    searchQuery,
    isGovOfficial,
    showFlaggedOnly,
  ]);

  const sortedProblems = React.useMemo(() => {
    const sorted = [...filteredProblems];
    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id)
        );
      case "voteCount":
        return sorted.sort((a, b) => (b.voteCount || 0) - (a.voteCount || 0));
      case "rating":
        // Sort by averageRating if available, otherwise by voteCount as fallback
        return sorted.sort((a, b) => {
          // Get the current averageRating from the Redux state
          const ratingA = a.averageRating || 0;
          const ratingB = b.averageRating || 0;
          if (ratingA === ratingB) {
            // If ratings are equal, sort by vote count
            return (b.voteCount || 0) - (a.voteCount || 0);
          }
          return ratingB - ratingA;
        });
      default:
        return sorted;
    }
  }, [filteredProblems, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategory("All");
    setSelectedStatus("All");
    setSelectedDistance("All");
    setSearchQuery("");
    setShowFlaggedOnly(false);
    toast.success("Filters cleared");
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <LoadingSkeleton lines={4} />
            </div>
          ))}
        </div>
      );
    }

    if (sortedProblems.length === 0) {
      return (
        <EmptyStateWithFilters
          onClearFilters={handleClearFilters}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
          selectedStatus={selectedStatus}
          selectedDistance={selectedDistance}
        />
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {sortedProblems.map((problem, index) => (
          <motion.div
            key={problem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <ProblemList problem={problem} isGovOfficial={isGovOfficial} />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen w-screen bg-gray-100">
      <div className="w-full px-8 py-3 flex gap-6">
        {/* Filters Sidebar */}
        <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-100 h-fit sticky top-24">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Filters
              </h3>
              <Input
                placeholder="Search issues..."
                className="w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                prefix={<Search className="w-4 h-4 text-gray-400" />}
              />
            </div>

            <div className="space-y-4">
              {/* Category Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Category
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {category === "All"
                              ? "All Categories"
                              : category.charAt(0).toUpperCase() +
                                category.slice(1).toLowerCase()}
                          </span>
                          <Badge variant="outline" className="ml-2">
                            {problems?.filter(
                              (p) =>
                                category === "All" || p.category === category
                            ).length || 0}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </label>
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        <div className="flex items-center justify-between w-full">
                          <span>
                            {status === "All"
                              ? "All Statuses"
                              : status.charAt(0).toUpperCase() +
                                status.slice(1).toLowerCase()}
                          </span>
                          <Badge variant="outline" className="ml-2">
                            {problems?.filter(
                              (p) => status === "All" || p.status === status
                            ).length || 0}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Distance Filter */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Distance
                </label>
                <Select
                  value={selectedDistance}
                  onValueChange={setSelectedDistance}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select distance" />
                  </SelectTrigger>
                  <SelectContent>
                    {distances.map((distance) => (
                      <SelectItem key={distance} value={distance}>
                        {distance === "All" ? "Any Distance" : distance}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Flagged Issues Filter - Only for Government Users */}
              {isGovOfficial && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Issue Status
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="flaggedOnly"
                      checked={showFlaggedOnly}
                      onChange={(e) => setShowFlaggedOnly(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="flaggedOnly"
                      className="text-sm text-gray-600"
                    >
                      Show flagged issues only
                    </label>
                  </div>
                </div>
              )}

              {/* Clear Filters Button */}
              {(selectedCategory !== "All" ||
                selectedStatus !== "All" ||
                selectedDistance !== "All" ||
                searchQuery ||
                showFlaggedOnly) && (
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="w-full mt-4"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ListFilter className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {selectedCategory === "All" ? "All" : selectedCategory} Issues
                  <span className="text-gray-400 mx-2">•</span>
                  <span className="text-blue-600">
                    {selectedStatus === "All" ? "All Statuses" : selectedStatus}
                  </span>
                  {selectedDistance !== "All" && (
                    <>
                      <span className="text-gray-400 mx-2">•</span>
                      <span className="text-green-600">{selectedDistance}</span>
                    </>
                  )}
                  {sortedProblems.length > 0 && (
                    <span className="text-gray-500 text-sm ml-2">
                      ({sortedProblems.length}{" "}
                      {sortedProblems.length === 1 ? "issue" : "issues"})
                    </span>
                  )}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="voteCount">Most Votes</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                  </SelectContent>
                </Select>

                {role === "user" && (
                  <Link to="/report-issue">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Report Issue
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  );
}
