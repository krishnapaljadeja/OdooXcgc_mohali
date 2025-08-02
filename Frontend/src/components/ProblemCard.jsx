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
} from "lucide-react";
import { Badge } from "./ui/badge";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "@/lib/constant";
import { toast } from "sonner";
import { deleteProblem } from "@/redux/problemSlice";

function ProblemCard({ problem, isGovOfficial }) {
  const [isHovered, setIsHovered] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [isVoted, setIsVoted] = useState(false);
  const [voteCount, setVoteCount] = useState(problem.voteCount);
  const [status, setStatus] = useState(problem.status);
  const [loading, setLoading] = useState(false);

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
        if (isMounted) {
          setIsVoted(response.data.message.isVoted);
        }
      } catch (error) {
        console.error("Error fetching vote status:", error);
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
    const fetchAverageRating = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/issue/rating/${problem.id}`,
          { withCredentials: true }
        );
        setAverageRating(data.message.averageRating);
      } catch (error) {
        console.error(
          "Error fetching average rating:",
          error.response?.data || error.message
        );
      }
    };

    const fetchUserRating = async () => {
      try {
        const { data } = await axios.get(
          `${BASE_URL}/issue/user-rating/${problem.id}`,
          { withCredentials: true }
        );
        if (data.success) {
          setUserRating(data.userRating);
        }
      } catch (error) {
        console.error(
          "Error fetching user rating:",
          error.response?.data || error.message
        );
      }
    };

    fetchAverageRating();
    fetchUserRating();
  }, [problem.id]);

  const handleRating = async (rating) => {
    setUserRating(rating);
    try {
      const { data } = await axios.post(
        `${BASE_URL}/issue/rating/${problem.id}`,
        { rating },
        { withCredentials: true }
      );
      setAverageRating(data.message.averageRating);
    } catch (error) {
      console.error(
        "Error submitting rating:",
        error.response?.data || error.message
      );
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
      }
    } catch (error) {
      toast.error(error.message);
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
      {console.log(endpoint)}
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
      toast.error(err.response?.data?.message || err.message);
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
        return (
          <Badge className="bg-green-100 text-green-800">Completed</Badge>
        );
      case "REJECTED":
        return (
          <Badge className="bg-red-100 text-red-800">Rejected</Badge>
        );
      default:
        return null;
    }
  };

  const onDelete = async () => {
    try {
      const res = await axios.delete(
        `${BASE_URL}/issue/delete/${problem.id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        dispatch(deleteProblem(problem.id));
        toast.success("Issue deleted successfully");
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Card className="group overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 rounded-xl border border-gray-100">
      <div className="relative aspect-[16/9]">
        <motion.img
          src={problem.image || "/placeholder.svg"}
          alt={problem.title}
          className="absolute inset-0 h-full w-full object-cover"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4 }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        />
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
                  <span>Posted 2 minutes ago</span>
                </div>
              </div>
            </div>

            {problem.userId === author.id && !author.isGoverment && (
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
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
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {problem.description}
          </p>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
              {problem.authorAvatar ? (
                <img
                  src={problem?.user?.profilePic}
                  alt={problem?.user?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 text-[#333] flex items-center justify-center font-bold uppercase">
                  {problem?.user?.name?.slice(0, 2)}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                {problem?.user?.name || "Vasu"}
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
                      onClick={() => handleRating(index + 1)}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    <p className="mt-2 text-sm text-gray-600">
                      ({averageRating || 0})
                    </p>
                  </span>
                </>
              )}
            </div>

            {!isGovOfficial ? (
              <Button
                variant={isVoted ? "default" : "outline"}
                size="sm"
                onClick={handleVote}
                className={`flex items-center gap-2 ${
                  isVoted
                    ? "bg-blue-600 text-white"
                    : "hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${isVoted ? "fill-white" : ""}`} />
                <span>{voteCount}</span>
              </Button>
            ) : (
              renderActionButton()
            )}
          </div>
        </CardFooter>
      </div>
    </Card>
  );
}

export default ProblemCard;
