import prisma from "../utils/prismClient.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import axios from "axios";

const TEXT_CLASSIFICATION_API_URL = "http://127.0.0.1:8000/api2/analyze/"; // Update with your Django API URL for text classification
const ML_CLUSTER_API_URL = "http://127.0.0.1:8000/api1/predict/"; // Django API URL for ML clustering prediction

// Function to classify text using Django API
const classifyText = async (text) => {
  try {
    const response = await axios.post(TEXT_CLASSIFICATION_API_URL, { text });
    return response.data.text_category || "Other";
  } catch (error) {
    console.error("Error classifying text:", error.message);
    return "Other";
  }
};

// Function to get cluster ID using Django ML API
const getClusterId = async (latitude, longitude) => {
  try {
    const response = await axios.get(ML_CLUSTER_API_URL, {
      params: { latitude, longitude },
    });
    // Assuming the Django API returns the cluster ID in "nearest_district"
    return response.data.nearest_district;
  } catch (error) {
    console.error("Error getting cluster ID:", error.message);
    // Return a default cluster id if an error occurs
    return 1;
  }
};

// Upload problem with text classification and ML cluster ID
export const uploadProblem = async (req, res) => {
  try {
    const { title, description } = req.body;
    const locationData = JSON.parse(req.body.location);
    const authorId = req.user.id;

    if (!title || !description || !locationData || !req.file) {
      return res.status(400).json(new ApiError(400, "All fields are required"));
    }

    const imageUrl = req.file.path;

    // Call Django API to classify text
    const category = await classifyText(description);
    // console.log(locationData)
    // Extract latitude and longitude from locationData and call ML API to get cluster ID
    const { lat, lng } = locationData;
    console.log(lat, lng);
    const clusterId = await getClusterId(lat, lng);

    const problem = await prisma.problem.create({
      data: {
        title,
        description,
        location: JSON.stringify(locationData),
        clustorId: clusterId, // Using the ML model cluster id
        image: imageUrl,
        category,
        user: {
          connect: {
            id: authorId,
          },
        },
      },
    });

    const updatedUser = await prisma.user.update({
      where: { id: authorId },
      data: {
        coins: {
          increment: 5,
        },
      },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Problem uploaded successfully", problem));
  } catch (err) {
    console.log(err.message);
    return res.status(500).json(new ApiError(500, err.message));
  }
};

export const getAllProblems = async (req, res) => {
  try {
    // const { clustorId } = req.body;
    const { latitude, longitude } = req.query;
    const clustorId = await getClusterId(latitude, longitude);
    console.log(clustorId);

    const problems = await prisma.problem.findMany({
      where: {
        clustorId,
      },
      include: {
        user: {
          select: {
            name: true,
            profilePic: true,
          },
        },
      },
    });

    if (!problems) {
      return res.status(404).json(new ApiError(404, "Problem not found"));
    }

    return res
      .status(200)
      .json(new ApiResponse(200, "Problem found", problems));
  } catch (err) {
    return res.status(500).json(new ApiError(500, err.message));
  }
};

export const voting = async (req, res) => {
  try {
    const problemId = parseInt(req.params.id);
    const userId = req.user.id;

    const existingVote = await prisma.vote.findFirst({
      where: { userId, problemId },
    });

    let updatedProblem;

    if (existingVote) {
      await prisma.$transaction([
        prisma.vote.delete({ where: { id: existingVote.id } }),
        prisma.problem.update({
          where: { id: problemId },
          data: { voteCount: { decrement: 1 } },
        }),
      ]);

      updatedProblem = await prisma.problem.findUnique({
        where: { id: problemId },
        select: { voteCount: true },
      });

      return res
        .status(200)
        .json(
          new ApiResponse(200, "Vote removed", {
            voteCount: updatedProblem.voteCount,
          })
        );
    } else {
      await prisma.$transaction([
        prisma.vote.create({ data: { userId, problemId } }),
        prisma.problem.update({
          where: { id: problemId },
          data: { voteCount: { increment: 1 } },
        }),
      ]);

      updatedProblem = await prisma.problem.findUnique({
        where: { id: problemId },
        select: { voteCount: true },
      });

      return res
        .status(200)
        .json(
          new ApiResponse(200, "Vote added", {
            voteCount: updatedProblem.voteCount,
          })
        );
    }
  } catch (err) {
    return res.status(500).json(new ApiError(500, err.message));
  }
};

export const checkUserVote = async (req, res) => {
  try {
    const problemId = parseInt(req.params.id, 10);
    const userId = req.user?.id;

    if (!problemId || isNaN(problemId)) {
      return res.status(400).json(new ApiError(400, "Invalid problem ID"));
    }
    if (!userId) {
      return res.status(401).json(new ApiError(401, "Unauthorized user"));
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_problemId: {
          userId: Number(userId),
          problemId: Number(problemId),
        },
      },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Vote status retrieved", {
          isVoted: !!existingVote,
        })
      );
  } catch (err) {
    console.error("Error checking vote:", err);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
};

export const rateProblem = async (req, res) => {
  // console.log("HYy");
  try {
    const problemId = parseInt(req.params.id);
    const userId = req.user.id;
    const { rating } = req.body;
    console.log(rating);

    const existingRating = await prisma.rating.findFirst({
      where: { userId, problemId },
    });
    console.log(existingRating);

    if (existingRating) {
      await prisma.rating.update({
        where: { id: existingRating.id },
        data: { rating },
      });
    } else {
      await prisma.rating.create({
        data: { userId, problemId, rating },
      });
    }

    const { _avg } = await prisma.rating.aggregate({
      where: { problemId },
      _avg: { rating: true },
    });

    await prisma.problem.update({
      where: { id: problemId },
      data: { rating: _avg.rating || 0 },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, {}, { averageRating: _avg.rating }));
  } catch (err) {
    return res.status(500).json(new ApiError(500, err.message));
  }
};

export const deleteProblem = async (req, res) => {
  try {
    const problemId = parseInt(req.params.problemId);
    const userId = req.user.id;

    const problem = await prisma.problem.findFirst({
      where: { id: problemId, userId },
    });

    if (!problem) {
      return res
        .status(403)
        .json(new ApiError(403, "You can't delete this problem"));
    }
    await prisma.problem.delete({
      where: { id: problemId },
    });

    return res
      .status(200)
      .json(new ApiResponse(200, "Problem deleted successfully"));
  } catch (err) {
    return res.status(500).json(new ApiError(500, err.message));
  }
};

export const addOrUpdateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const userId = req.user.id;
    const problemId = parseInt(req.params.problemId);

    // Check if user already rated
    const existingRating = await prisma.rating.findFirst({
      where: { userId, problemId },
    });

    if (existingRating) {
      // Update existing rating
      await prisma.rating.update({
        where: { id: existingRating.id },
        data: { rating },
      });
    } else {
      // Create new rating
      await prisma.rating.create({
        data: { userId, problemId, rating },
      });
    }

    // Recalculate average rating
    const avgRating = await prisma.rating.aggregate({
      where: { problemId },
      _avg: { rating: true },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Rating updated", {
          averageRating: avgRating._avg.rating || 0,
        })
      );
  } catch (err) {
    return res.status(500).json(new ApiError(500, err.message));
  }
};

// API to Get Average Rating
export const getAverageRating = async (req, res) => {
  try {
    const problemId = parseInt(req.params.problemId);

    const avgRating = await prisma.rating.aggregate({
      where: { problemId },
      _avg: { rating: true },
    });

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Average rating fetched", {
          averageRating: avgRating._avg.rating || 0,
        })
      );
  } catch (err) {
    return res.status(500).json(new ApiError(500, err.message));
  }
};

export const fetchUserRating = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user.id;
    console.log(problemId, userId);

    const rating = await prisma.rating.findUnique({
      where: {
        userId_problemId: {
          userId: Number(userId),
          problemId: Number(problemId),
        },
      },
    });

    res.json({
      success: true,
      userRating: rating ? rating.rating : 0,
    });
  } catch (error) {
    return res.status(500).json(new ApiError(500, error.message));
  }
};
