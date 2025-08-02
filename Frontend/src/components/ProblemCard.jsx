import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  MoreVertical,
  Star,
  ThumbsUp,
  Clock,
  Calendar,
  Image as ImageIcon,
  Loader2,
  Flag,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "./ui/badge";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@/lib/constant";
import { toast } from "sonner";
import { deleteProblem, updateProblemRating } from "@/redux/problemSlice";
import IssueDetailModal from "./IssueDetailModal";

function ProblemCard({ problem, isGovOfficial }) {
  const [isHovered, setIsHovered] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [isVoted, setIsVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(problem.voteCount || 0);
  const [status, setStatus] = useState(problem.status);
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);

  const author = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  // Fetch vote status
  useEffect(() => {
    let isMounted = true;
    const fetchVoteStatus = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${BASE_URL}/issue/check/${problem.id}`,
          { withCredentials: true }
        );
        if (isMounted && response.data.success) {
          setIsVoted(response.data.message.isVoted);
        }
      } catch (error) {
        console.error("Error fetching vote status:", error);
        // Don't show toast for this error as it's not critical
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchVoteStatus();
    return () => {
      isMounted = false;
    };
  }, [problem.id]);

  // Fetch average rating and user rating
  useEffect(() => {
    let isMounted = true;

    const fetchAverageRating = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/issue/rating/${problem.id}`,
          { withCredentials: true }
        );
        if (data.success && isMounted) {
          setAverageRating(data.message.averageRating);
          // Update Redux state properly instead of mutating
          dispatch(
            updateProblemRating({
              problemId: problem.id,
              averageRating: data.message.averageRating,
            })
          );
        }
      } catch (error) {
        console.error("Error fetching average rating:", error);
        // Don't show toast for this error as it's not critical
      }
    };

    const fetchUserRating = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/issue/user-rating/${problem.id}`,
          { withCredentials: true }
        );
        if (data.success && isMounted) {
          setUserRating(data.userRating);
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
        // Don't show toast for this error as it's not critical
      }
    };

    // Only fetch if modal is not open to prevent duplicate API calls
    if (!showDetailModal) {
      fetchAverageRating();
      fetchUserRating();
    }

    return () => {
      isMounted = false;
    };
  }, [problem.id, showDetailModal]);

  const handleRating = async (rating) => {
    try {
      setUserRating(rating);
      const { data } = await axios.post(
        `${BASE_URL}/issue/rating/${problem.id}`,
        { rating },
        { withCredentials: true }
      );
      if (data.success) {
        setAverageRating(data.message.averageRating);
        // Update Redux state properly instead of mutating
        dispatch(
          updateProblemRating({
            problemId: problem.id,
            averageRating: data.message.averageRating,
          })
        );
        // Removed success toast for rating
      }
    } catch (error) {
      toast.error("Failed to submit rating. Please try again.");
      // Revert the rating if it failed
      setUserRating(0);
    }
  };

  const handleVote = async () => {
    try {
      const response = await axios.post(
        `${BASE_URL}/issue/voting/${problem.id}`,
        {},
        { withCredentials: true }
      );
      if (response.data.success) {
        setIsVoted((prev) => !prev);
        setVoteCount((prev) => (isVoted ? prev - 1 : prev + 1));
        // Removed success toast for voting
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
        `${BASE_URL}/issue/report-spam/${problem.id}`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsReported(true);
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

  // Handle government actions: approve, reject, mark as completed
  const handleStatusAction = async (action) => {
    setLoading(true);
    try {
      let endpoint;
      switch (action) {
        case "approve":
          endpoint = `${BASE_URL}/gov/approve/${problem.id}`;
          break;
        case "reject":
          endpoint = `${BASE_URL}/gov/reject/${problem.id}`;
          break;
        case "complete":
          endpoint = `${BASE_URL}/gov/complete/${problem.id}`;
          break;
        default:
          throw new Error("Invalid action");
      }

      const res = await axios.post(endpoint, {}, { withCredentials: true });
      if (res.data.success) {
        setStatus(
          action === "approve"
            ? "IN_PROGRESS"
            : action === "reject"
            ? "REJECTED"
            : action === "complete"
            ? "COMPLETED"
            : status
        );
        toast.success(
          action === "approve"
            ? "Problem approved successfully"
            : action === "reject"
            ? "Problem rejected successfully"
            : "Problem marked as completed"
        );
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

  // Render government action buttons based on current status
  const renderActionButton = () => {
    if (!isGovOfficial) return null;
    if (loading) {
      return (
        <Button disabled className="flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Processing...
        </Button>
      );
    }
    switch (status?.toUpperCase()) {
      case "REPORTED":
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusAction("approve")}
              className="bg-green-600 hover:bg-green-500 text-white"
            >
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusAction("reject")}
              className="bg-red-600 hover:bg-red-500 text-white"
            >
              Reject
            </Button>
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
            Mark as Completed
          </Button>
        );
      case "COMPLETED":
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return null;
    }
  };

  const onDelete = async () => {
    try {
      const res = await axios.delete(`${BASE_URL}/issue/delete/${problem.id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(deleteProblem(problem.id));
        toast.success("Issue deleted successfully");
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Failed to delete issue. Please try again."
      );
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

  const handleStatusUpdate = (problemId, newStatus) => {
    if (problemId === problem.id) {
      setStatus(newStatus);
    }
  };

  return (
    <>
      <Card
        className="group overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 rounded-xl border border-gray-100 cursor-pointer"
        onClick={() => setShowDetailModal(true)}
      >
        <div className="relative aspect-[16/9]">
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          )}

          {imageError ? (
            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
              <div className="text-center">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Image not available</p>
              </div>
            </div>
          ) : (
            <motion.img
              src={problem.image || "/placeholder.svg"}
              alt={problem.title}
              className="absolute inset-0 h-full w-full object-cover"
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.4 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onLoad={handleImageLoad}
              onError={handleImageError}
              style={{ display: imageLoading ? "none" : "block" }}
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          <div className="absolute top-4 left-4 flex gap-2">
            <Badge
              className={`px-3 py-1.5 text-sm font-medium rounded-full shadow-lg backdrop-blur-sm ${
                status === "REPORTED"
                  ? "bg-red-500/90 text-white hover:bg-red-500"
                  : status === "IN_PROGRESS"
                  ? "bg-yellow-400/90 text-black/90 hover:bg-yellow-400/90"
                  : status === "COMPLETED"
                  ? "bg-green-500/90 text-white hover:bg-green-500/90"
                  : status === "REJECTED"
                  ? "bg-gray-500/90 text-white hover:bg-gray-500/90"
                  : "bg-gray-500/90 text-white hover:bg-gray-500/90"
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {status}
              </div>
            </Badge>
          </div>

          <div className="absolute bottom-4 left-4">
            <Badge
              variant="outline"
              className="px-3 py-1 text-sm font-medium bg-white/90 text-gray-800 border-none shadow-lg backdrop-blur-sm"
            >
              {problem.category}
            </Badge>
          </div>
        </div>

        <div className="p-5">
          <CardHeader className="p-0 mb-4">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors cursor-pointer group-hover:text-blue-600">
                  {problem.title}
                </CardTitle>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Posted {formatTimeAgo(problem.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div
                className="flex items-center gap-2"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Spam Report Button */}
                {!isGovOfficial && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReportSpam}
                    disabled={reportLoading || isReported}
                    className={`flex items-center gap-1 ${
                      isReported
                        ? "text-green-600 hover:text-green-700"
                        : "text-gray-500 hover:text-red-600"
                    }`}
                  >
                    {reportLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isReported ? (
                      <AlertTriangle className="w-4 h-4" />
                    ) : (
                      <Flag className="w-4 h-4" />
                    )}
                    {isReported ? "Reported" : "Report"}
                  </Button>
                )}

                {/* More Options Menu */}
                {problem.userId === author?.id && !author?.isGoverment && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full"
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {!isGovOfficial && (
                        <DropdownMenuItem className="cursor-pointer text-red-500 hover:text-red-600">
                          <Button
                            variant="ghost"
                            className="hover:text-red-600"
                            onClick={onDelete}
                          >
                            Delete Issue
                          </Button>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              {problem.description}
            </p>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
                {problem?.user?.profilePic ? (
                  <img
                    src={problem.user.profilePic}
                    alt={problem.user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full bg-gray-300 text-[#333] flex items-center justify-center font-bold uppercase ${
                    problem?.user?.profilePic ? "hidden" : "flex"
                  }`}
                >
                  {problem?.user?.name?.slice(0, 2) || "U"}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {problem.isAnonymous
                    ? "Anonymous User"
                    : problem?.user?.name || "Unknown User"}
                </p>
                <p className="text-xs text-gray-500">Community Member</p>
              </div>
            </div>
          </CardContent>

          <CardFooter className="p-0 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                {!isGovOfficial && (
                  <>
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className={`w-5 h-5 cursor-pointer transition-colors ${
                          index < userRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200 hover:fill-yellow-400 hover:text-yellow-400"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRating(index + 1);
                        }}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      <p className="mt-2 text-sm text-gray-600">
                        ({averageRating?.toFixed(1) || "0.0"})
                      </p>
                    </span>
                  </>
                )}
              </div>

              {!isGovOfficial ? (
                <Button
                  variant={isVoted ? "default" : "outline"}
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote();
                  }}
                  disabled={loading}
                  className={`flex items-center gap-2 ${
                    isVoted
                      ? "bg-blue-600 text-white"
                      : "hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ThumbsUp
                      className={`w-4 h-4 ${isVoted ? "fill-white" : ""}`}
                    />
                  )}
                  <span>{voteCount}</span>
                </Button>
              ) : (
                <div onClick={(e) => e.stopPropagation()}>
                  {renderActionButton()}
                </div>
              )}
            </div>
          </CardFooter>
        </div>
      </Card>

      <IssueDetailModal
        issue={problem}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        isGovOfficial={isGovOfficial}
        onStatusUpdate={handleStatusUpdate}
      />
    </>
  );
}

export default ProblemCard;
