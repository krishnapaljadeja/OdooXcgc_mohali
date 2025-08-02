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
    }

  },
});

export const { setProblems ,addProblem ,deleteProblem } = problemSlice.actions;
export default problemSlice.reducer;

