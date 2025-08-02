import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  Flag,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Calendar,
  Filter,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/lib/constant";
import IssueDetailModal from "@/components/IssueDetailModal";

export default function FlaggedIssues() {
  const user = useSelector((state) => state.user.user);
  const [loading, setLoading] = useState(true);
  const [flaggedIssues, setFlaggedIssues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (user?.isGoverment) {
      fetchFlaggedIssues();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchFlaggedIssues = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/gov/flagged-issues`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setFlaggedIssues(response.data.flaggedIssues);
      }
    } catch (error) {
      console.error("Error fetching flagged issues:", error);
      toast.error("Failed to load flagged issues");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusAction = async (issueId, action) => {
    try {
      let endpoint;
      let newStatus;
      switch (action) {
        case "approve":
          endpoint = `${BASE_URL}/gov/approve/${issueId}`;
          newStatus = "IN_PROGRESS";
          break;
        case "reject":
          endpoint = `${BASE_URL}/gov/reject/${issueId}`;
          newStatus = "REJECTED";
          break;
        case "complete":
          endpoint = `${BASE_URL}/gov/complete/${issueId}`;
          newStatus = "COMPLETED";
          break;
        default:
          throw new Error("Invalid action");
      }

      const res = await axios.post(endpoint, {}, { withCredentials: true });
      if (res.data.success) {
        toast.success(
          action === "approve"
            ? "Issue approved successfully"
            : action === "reject"
            ? "Issue rejected successfully"
            : "Issue marked as completed"
        );
        // Refresh the list
        fetchFlaggedIssues();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update status. Please try again."
      );
    }
  };

  const handleBanUser = async (userId) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/gov/ban-user/${userId}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("User banned successfully");
        fetchFlaggedIssues();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to ban user. Please try again."
      );
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "REPORTED":
        return "bg-red-100 text-red-800";
      case "IN_PROGRESS":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "REJECTED":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case "REPORTED":
        return <AlertTriangle className="w-4 h-4" />;
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4" />;
      case "COMPLETED":
        return <CheckCircle className="w-4 h-4" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const filteredIssues = flaggedIssues.filter((flaggedIssue) => {
    if (filter === "all") return true;
    return flaggedIssue.problem.status === filter;
  });

  if (!user?.isGoverment) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You need government privileges to view flagged issues.
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading flagged issues..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Flagged Issues</h1>
            <p className="text-gray-600 mt-1">
              Review and manage flagged community issues
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Issues</SelectItem>
                <SelectItem value="REPORTED">Reported</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="REJECTED">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchFlaggedIssues} variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Flagged Issues
              </CardTitle>
              <Flag className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {flaggedIssues.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Issues requiring review
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Flagged Issues List */}
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Flag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No flagged issues
              </h3>
              <p className="text-gray-600">
                {filter === "all"
                  ? "All issues have been reviewed"
                  : `No ${filter.toLowerCase()} flagged issues`}
              </p>
            </motion.div>
          ) : (
            filteredIssues.map((flaggedIssue, index) => (
              <motion.div
                key={flaggedIssue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <Badge
                            className={getStatusColor(
                              flaggedIssue.problem.status
                            )}
                          >
                            {getStatusIcon(flaggedIssue.problem.status)}
                            <span className="ml-1">
                              {flaggedIssue.problem.status}
                            </span>
                          </Badge>
                          <Badge variant="outline">
                            {flaggedIssue.problem.category}
                          </Badge>
                          <Badge variant="outline" className="text-red-600">
                            <Flag className="w-3 h-3 mr-1" />
                            Flagged
                          </Badge>
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {flaggedIssue.problem.title}
                        </h3>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {flaggedIssue.problem.description}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>
                              {flaggedIssue.problem.user?.name || "Anonymous"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Flagged {formatTimeAgo(flaggedIssue.createdAt)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            <span>by {flaggedIssue.user.name}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedIssue(flaggedIssue.problem);
                            setShowDetailModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View Details
                        </Button>

                        {flaggedIssue.problem.status === "REPORTED" && (
                          <div className="flex flex-col gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusAction(
                                  flaggedIssue.problem.id,
                                  "approve"
                                )
                              }
                              className="bg-green-600 hover:bg-green-500 text-white"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                handleStatusAction(
                                  flaggedIssue.problem.id,
                                  "reject"
                                )
                              }
                              className="bg-red-600 hover:bg-red-500 text-white"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}

                        {flaggedIssue.problem.status === "IN_PROGRESS" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleStatusAction(
                                flaggedIssue.problem.id,
                                "complete"
                              )
                            }
                            className="bg-blue-600 hover:bg-blue-500 text-white"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Complete
                          </Button>
                        )}

                        {flaggedIssue.problem.user?.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleBanUser(flaggedIssue.problem.user.id)
                            }
                            className="bg-red-900 hover:bg-red-800 text-white"
                          >
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            Ban User
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedIssue(null);
          }}
          isGovOfficial={true}
          onStatusUpdate={(problemId, newStatus) => {
            // Update the local state if needed
            fetchFlaggedIssues();
          }}
        />
      )}
    </div>
  );
}
