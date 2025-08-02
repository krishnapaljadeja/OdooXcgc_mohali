import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  MapPin,
  Calendar,
  User,
  Clock,
  Star,
  ThumbsUp,
  AlertTriangle,
  Info,
  Flag,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { toast } from "sonner";
import axios from "axios";
import { BASE_URL } from "@/lib/constant";
import { useDispatch } from "react-redux";
import { updateProblemRating } from "@/redux/problemSlice";

export default function IssueDetailModal({
  issue,
  isOpen,
  onClose,
  isGovOfficial,
  onStatusUpdate,
}) {
  const [userRating, setUserRating] = React.useState(0);
  const [averageRating, setAverageRating] = React.useState(0);
  const [isVoted, setIsVoted] = React.useState(false);
  const [voteCount, setVoteCount] = React.useState(issue?.voteCount || 0);
  const [loading, setLoading] = React.useState(false);
  const [statusHistory, setStatusHistory] = React.useState([]);
  const [flagCount, setFlagCount] = React.useState(0);
  const [isModerated, setIsModerated] = React.useState(false);
  const [imageLoading, setImageLoading] = React.useState(true);
  const [imageError, setImageError] = React.useState(false);
  const [isReported, setIsReported] = React.useState(false);
  const [reportLoading, setReportLoading] = React.useState(false);

  const dispatch = useDispatch();

  React.useEffect(() => {
    let isMounted = true;

    if (issue && isOpen) {
      const fetchData = async () => {
        await fetchIssueDetails();
        await fetchStatusHistory();
        await fetchModerationData();
      };

      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [issue, isOpen]);

  const fetchIssueDetails = async () => {
    try {
      // Fetch vote status
      const voteResponse = await axios.get(
        `${BASE_URL}/issue/check/${issue.id}`,
        { withCredentials: true }
      );
      if (voteResponse.data.success) {
        setIsVoted(voteResponse.data.message.isVoted);
      }

      // Fetch average rating
      const ratingResponse = await axios.get(
        `${BASE_URL}/issue/rating/${issue.id}`,
        { withCredentials: true }
      );
      if (ratingResponse.data.success) {
        setAverageRating(ratingResponse.data.message.averageRating);
        // Update Redux state properly
        dispatch(
          updateProblemRating({
            problemId: issue.id,
            averageRating: ratingResponse.data.message.averageRating,
          })
        );
      }

      // Fetch user rating
      const userRatingResponse = await axios.get(
        `${BASE_URL}/issue/user-rating/${issue.id}`,
        { withCredentials: true }
      );
      if (userRatingResponse.data.success) {
        setUserRating(userRatingResponse.data.userRating);
      }
    } catch (error) {
      console.error("Error fetching issue details:", error);
    }
  };

  const fetchStatusHistory = async () => {
    try {
      // This would be a new API endpoint to fetch status history
      // For now, we'll create a mock status history based on the current status
      const history = [
        {
          status: "REPORTED",
          timestamp: issue.createdAt,
          description: "Issue reported by user",
        },
      ];

      if (issue.status === "IN_PROGRESS") {
        history.push({
          status: "IN_PROGRESS",
          timestamp: issue.updatedAt || issue.createdAt,
          description: "Issue approved and work started",
        });
      } else if (issue.status === "COMPLETED") {
        history.push(
          {
            status: "IN_PROGRESS",
            timestamp: issue.updatedAt || issue.createdAt,
            description: "Issue approved and work started",
          },
          {
            status: "COMPLETED",
            timestamp: issue.updatedAt || issue.createdAt,
            description: "Issue marked as completed",
          }
        );
      } else if (issue.status === "REJECTED") {
        history.push({
          status: "REJECTED",
          timestamp: issue.updatedAt || issue.createdAt,
          description: "Issue rejected by government official",
        });
      }

      setStatusHistory(history);
    } catch (error) {
      console.error("Error fetching status history:", error);
    }
  };

  const fetchModerationData = async () => {
    try {
      // This would be a new API endpoint to fetch moderation data
      // For now, we'll use mock data
      setFlagCount(Math.floor(Math.random() * 5)); // Mock flag count
      setIsModerated(issue.status !== "REPORTED");
    } catch (error) {
      console.error("Error fetching moderation data:", error);
    }
  };

  const handleRating = async (rating) => {
    try {
      setUserRating(rating);
      const { data } = await axios.post(
        `${BASE_URL}/issue/rating/${issue.id}`,
        { rating },
        { withCredentials: true }
      );
      if (data.success) {
        setAverageRating(data.message.averageRating);
        // Update Redux state properly
        dispatch(
          updateProblemRating({
            problemId: issue.id,
            averageRating: data.message.averageRating,
          })
        );
      }
    } catch (error) {
      toast.error("Failed to submit rating. Please try again.");
      setUserRating(0);
    }
  };

  const handleVote = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/issue/voting/${issue.id}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsVoted((prev) => !prev);
        setVoteCount((prev) => (isVoted ? prev - 1 : prev + 1));
      }
    } catch (error) {
      toast.error("Failed to vote. Please try again.");
    }
  };

  const handleReportSpam = async () => {
    if (isReported) {
      toast.info("You have already reported this issue");
      return;
    }

    setReportLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/issue/report-spam/${issue.id}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsReported(true);
        setFlagCount((prev) => prev + 1);
        toast.success(
          "Issue reported for review. Thank you for helping keep the community safe."
        );
      }
    } catch (error) {
      toast.error("Failed to report issue. Please try again.");
    } finally {
      setReportLoading(false);
    }
  };

  const handleStatusAction = async (action) => {
    setLoading(true);
    try {
      let endpoint;
      switch (action) {
        case "approve":
          endpoint = `${BASE_URL}/gov/approve/${issue.id}`;
          break;
        case "reject":
          endpoint = `${BASE_URL}/gov/reject/${issue.id}`;
          break;
        case "complete":
          endpoint = `${BASE_URL}/gov/complete/${issue.id}`;
          break;
        case "ban":
          endpoint = `${BASE_URL}/gov/ban/${issue.id}`;
          break;
        default:
          throw new Error("Invalid action");
      }

      const res = await axios.post(endpoint, {}, { withCredentials: true });
      if (res.data.success) {
        const newStatus =
          action === "approve"
            ? "IN_PROGRESS"
            : action === "reject"
            ? "REJECTED"
            : action === "complete"
            ? "COMPLETED"
            : action === "ban"
            ? "BANNED"
            : issue.status;

        onStatusUpdate(issue.id, newStatus);
        toast.success(
          action === "approve"
            ? "Problem approved successfully"
            : action === "reject"
            ? "Problem rejected successfully"
            : action === "complete"
            ? "Problem marked as completed"
            : "Problem banned successfully"
        );

        // Refresh status history
        fetchStatusHistory();
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to update status. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async () => {
    if (!issue.user?.id) {
      toast.error("Cannot ban anonymous user");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/gov/ban-user/${issue.user.id}`,
        {},
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success("User banned successfully");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to ban user. Please try again."
      );
    }
  };

  const formatTimeAgo = (dateString) => {
    if (!dateString) return "Recently";

    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60)
      return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24)
      return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleString();
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
      case "BANNED":
        return "bg-red-100 text-red-800";
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
      case "BANNED":
        return <Ban className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const renderActionButtons = () => {
    if (!isGovOfficial) return null;
    if (loading) {
      return (
        <Button disabled className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </Button>
      );
    }

    switch (issue.status?.toUpperCase()) {
      case "REPORTED":
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusAction("approve")}
                className="bg-green-600 hover:bg-green-500 text-white"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusAction("reject")}
                className="bg-red-600 hover:bg-red-500 text-white"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleStatusAction("ban")}
                className="bg-red-800 hover:bg-red-700 text-white"
              >
                <Ban className="w-4 h-4 mr-1" />
                Ban Issue
              </Button>
              {issue.user?.id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBanUser}
                  className="bg-red-900 hover:bg-red-800 text-white"
                >
                  <Ban className="w-4 h-4 mr-1" />
                  Ban User
                </Button>
              )}
            </div>
          </div>
        );
      case "IN_PROGRESS":
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStatusAction("complete")}
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Mark as Completed
          </Button>
        );
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "BANNED":
        return <Badge className="bg-red-100 text-red-800">Banned</Badge>;
      default:
        return null;
    }
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  if (!issue) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {issue.title}
                  </h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(issue.status)}>
                      {getStatusIcon(issue.status)}
                      <span className="ml-1">{issue.status}</span>
                    </Badge>
                    <Badge variant="outline">{issue.category}</Badge>
                    {flagCount > 0 && (
                      <Badge variant="outline" className="text-red-600">
                        <Flag className="w-3 h-3 mr-1" />
                        {flagCount} flags
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  </div>
                )}

                {imageError ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        Image not available
                      </p>
                    </div>
                  </div>
                ) : (
                  <img
                    src={issue.image || "/placeholder.svg"}
                    alt={issue.title}
                    className="w-full h-full object-cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    style={{ display: imageLoading ? "none" : "block" }}
                  />
                )}
              </div>

              {/* Issue Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Issue Details */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Issue Details */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="w-5 h-5" />
                        Issue Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        {issue.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Reported {formatTimeAgo(issue.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-gray-600">
                          <User className="w-4 h-4" />
                          <span>
                            {issue.isAnonymous
                              ? "Anonymous User"
                              : issue.user?.name || "Unknown User"}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Location */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Location
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">
                        {issue.location?.address ||
                          "Location coordinates available"}
                      </p>
                      {issue.location?.coordinates && (
                        <p className="text-sm text-gray-500 mt-1">
                          {issue.location.coordinates.lat.toFixed(6)},{" "}
                          {issue.location.coordinates.lng.toFixed(6)}
                        </p>
                      )}
                    </CardContent>
                  </Card>

                  {/* Status History */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        Status History
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {statusHistory.map((status, index) => (
                          <div key={index} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                              {getStatusIcon(status.status)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <Badge
                                  className={getStatusColor(status.status)}
                                >
                                  {status.status}
                                </Badge>
                                <span className="text-sm text-gray-500">
                                  {formatDateTime(status.timestamp)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">
                                {status.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Engagement & Actions */}
                <div className="space-y-6">
                  {/* Community Engagement */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Community Engagement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Votes</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant={isVoted ? "default" : "outline"}
                            size="sm"
                            onClick={handleVote}
                            className="flex items-center gap-2"
                          >
                            <ThumbsUp
                              className={`w-4 h-4 ${
                                isVoted ? "fill-white" : ""
                              }`}
                            />
                            {voteCount}
                          </Button>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <span className="text-sm text-gray-600">Rating</span>
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`w-5 h-5 cursor-pointer transition-colors ${
                                index < userRating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "fill-gray-200 text-gray-200 hover:fill-yellow-400 hover:text-yellow-400"
                              }`}
                              onClick={() => handleRating(index + 1)}
                            />
                          ))}
                          <span className="text-sm text-gray-600 ml-2">
                            ({averageRating?.toFixed(1) || "0.0"})
                          </span>
                        </div>
                      </div>

                      <Separator />

                      {/* Spam Report Button */}
                      {!isGovOfficial && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            Report Issue
                          </span>
                          <Button
                            variant={isReported ? "outline" : "outline"}
                            size="sm"
                            onClick={handleReportSpam}
                            disabled={reportLoading || isReported}
                            className={`flex items-center gap-2 ${
                              isReported
                                ? "text-green-600 border-green-200 hover:bg-green-50"
                                : "text-gray-600 hover:text-red-600 hover:border-red-200"
                            }`}
                          >
                            {reportLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : isReported ? (
                              <AlertTriangle className="w-4 h-4" />
                            ) : (
                              <Flag className="w-4 h-4" />
                            )}
                            {isReported ? "Reported" : "Report Spam"}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Government Actions */}
                  {isGovOfficial && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Moderation Tools
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {renderActionButtons()}

                        {flagCount > 0 && (
                          <div className="mt-4 p-3 bg-red-50 rounded-lg">
                            <div className="flex items-center gap-2 text-red-700">
                              <Flag className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {flagCount} user{flagCount > 1 ? "s" : ""}{" "}
                                flagged this issue
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
