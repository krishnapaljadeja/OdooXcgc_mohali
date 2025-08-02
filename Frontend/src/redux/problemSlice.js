import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  problems: [],
};

const problemSlice = createSlice({
  name: "problems",
  initialState,
  reducers: {
    setProblems(state, action) {
      state.problems = action.payload;
    },
    addProblem: (state, action) => {
      state.problems.push(action.payload);
    },
    deleteProblem(state, action) {
      state.problems = state.problems.filter(
        (problem) => problem.id !== action.payload
      );
    },
    updateProblemRating: (state, action) => {
      const { problemId, averageRating } = action.payload;
      const problemIndex = state.problems.findIndex(
        (problem) => problem.id === problemId
      );
      if (problemIndex !== -1) {
        state.problems[problemIndex] = {
          ...state.problems[problemIndex],
          averageRating,
        };
      }
    },
  },
});

export const { setProblems, addProblem, deleteProblem, updateProblemRating } =
  problemSlice.actions;
export default problemSlice.reducer;
