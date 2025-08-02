// import prisma from "../prismaClient.js";

import prisma from "../utils/prismClient.js";

export const approveProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await prisma.problem.update({
      where: { id: Number(problemId) },
      data: { status: "IN_PROGRESS" },
    });

    const problemData = await prisma.problem.findUnique({
      where: { id: Number(problemId) },
      select: { userId: true },
    });

    if (!problemData) {
      throw new Error("Problem not found");
    }

    const userId = problemData.userId;

    await prisma.user.update({
      where: { id: userId },
      data: {
        coins: { increment: 10 },
      },
    });

    res.json({
      success: true,
      message: "Problem approved successfully",
      problem,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to approve problem" });
  }
};

export const rejectProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await prisma.problem.update({
      where: { id: Number(problemId) },
      data: { status: "REJECTED" },
    });

    const problemData = await prisma.problem.findUnique({
      where: { id: Number(problemId) },
      select: { userId: true },
    });

    if (!problemData) {
      throw new Error("Problem not found");
    }

    const userId = problemData.userId;

    await prisma.user.update({
      where: { id: userId },
      data: {
        coins: { decrement: 5 },
      },
    });

    res.json({
      success: true,
      message: "Problem rejected successfully",
      problem,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to reject problem" });
  }
};

export const acceptProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    const id = isNaN(problemId) ? problemId : Number(problemId);
    console.log(id);
    const problem = await prisma.problem.update({
      where: { id },
      data: { status: "COMPLETED" },
    });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.json({
      success: true,
      message: "Problem Completed successfully",
      problem,
    });
  } catch (error) {
    console.error("Error accepting problem:", error);
    res.status(500).json({ error: "Failed to accept problem" });
  }
};

export const banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user.id; // Assuming you have user info in req.user

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.isGoverment) {
      return res.status(403).json({ error: "Cannot ban government officials" });
    }

    const bannedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        isBanned: true,
        bannedAt: new Date(),
        bannedBy: adminId,
      },
    });

    res.json({
      success: true,
      message: "User banned successfully",
      user: bannedUser,
    });
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({ error: "Failed to ban user" });
  }
};

export const unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const unbannedUser = await prisma.user.update({
      where: { id: Number(userId) },
      data: {
        isBanned: false,
        bannedAt: null,
        bannedBy: null,
      },
    });

    res.json({
      success: true,
      message: "User unbanned successfully",
      user: unbannedUser,
    });
  } catch (error) {
    console.error("Error unbanning user:", error);
    res.status(500).json({ error: "Failed to unban user" });
  }
};

export const flagIssue = async (req, res) => {
  try {
    const { problemId } = req.params;
    const { reason } = req.body;
    const userId = req.user.id;

    // Check if already flagged
    const existingFlag = await prisma.flaggedIssue.findUnique({
      where: {
        userId_problemId: {
          userId: Number(userId),
          problemId: Number(problemId),
        },
      },
    });

    if (existingFlag) {
      return res
        .status(400)
        .json({ error: "Issue already flagged by this user" });
    }

    const flaggedIssue = await prisma.flaggedIssue.create({
      data: {
        userId: Number(userId),
        problemId: Number(problemId),
        reason: reason || "Inappropriate content",
      },
    });

    res.json({
      success: true,
      message: "Issue flagged successfully",
      flaggedIssue,
    });
  } catch (error) {
    console.error("Error flagging issue:", error);
    res.status(500).json({ error: "Failed to flag issue" });
  }
};

export const unflagIssue = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user.id;

    const flaggedIssue = await prisma.flaggedIssue.delete({
      where: {
        userId_problemId: {
          userId: Number(userId),
          problemId: Number(problemId),
        },
      },
    });

    res.json({
      success: true,
      message: "Issue unflagged successfully",
    });
  } catch (error) {
    console.error("Error unflagging issue:", error);
    res.status(500).json({ error: "Failed to unflag issue" });
  }
};

export const getFlaggedIssues = async (req, res) => {
  try {
    const flaggedIssues = await prisma.flaggedIssue.findMany({
      include: {
        problem: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      success: true,
      flaggedIssues,
    });
  } catch (error) {
    console.error("Error fetching flagged issues:", error);
    res.status(500).json({ error: "Failed to fetch flagged issues" });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const [
      totalUsers,
      bannedUsers,
      totalProblems,
      reportedProblems,
      inProgressProblems,
      completedProblems,
      rejectedProblems,
      flaggedProblems,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { isBanned: true } }),
      prisma.problem.count(),
      prisma.problem.count({ where: { status: "REPORTED" } }),
      prisma.problem.count({ where: { status: "IN_PROGRESS" } }),
      prisma.problem.count({ where: { status: "COMPLETED" } }),
      prisma.problem.count({ where: { status: "REJECTED" } }),
      prisma.flaggedIssue.count(),
    ]);

    res.json({
      success: true,
      analytics: {
        userStats: {
          totalUsers,
          bannedUsers,
        },
        problemStats: {
          totalProblems,
          reportedProblems,
          inProgressProblems,
          completedProblems,
          rejectedProblems,
          flaggedProblems,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
};

export const getIssueFlagCount = async (req, res) => {
  try {
    const { problemId } = req.params;

    const flagCount = await prisma.flaggedIssue.count({
      where: {
        problemId: Number(problemId),
      },
    });

    res.json({
      success: true,
      flagCount,
    });
  } catch (error) {
    console.error("Error fetching flag count:", error);
    res.status(500).json({ error: "Failed to fetch flag count" });
  }
};
