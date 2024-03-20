import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UserId {
  userId: string | undefined;
}

const initialState: UserId = {
  userId: "",
};

const userIdSlice = createSlice({
  name: "userid",
  initialState,
  reducers: {
    setUserId: (state, action: PayloadAction<string | undefined>) => {
      state.userId = action.payload;
    },
  },
});

export const { setUserId } = userIdSlice.actions;

export default userIdSlice.reducer;
