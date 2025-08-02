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
        coins: { increment: 10},
      },
    });
  

    res.json({ message: "Problem approved successfully", problem });
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
        coins: { decrement : 5},
      },
    });

    res.json({ message: "Problem rejected successfully", problem });
  } catch (error) {
    res.status(500).json({ error: "Failed to reject problem" });
  }
};

export const acceptProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    const id = isNaN(problemId) ? problemId : Number(problemId);
    console.log(id)
    const problem = await prisma.problem.update({
      where: { id },
      data: { status: "COMPLETED" },
    });

    if (!problem) {
      return res.status(404).json({ error: "Problem not found" });
    }

    res.json({ message: "Problem Completed successfully", problem });
  } catch (error) {
    console.error("Error accepting problem:", error);
    res.status(500).json({ error: "Failed to accept problem" });
  }
};

