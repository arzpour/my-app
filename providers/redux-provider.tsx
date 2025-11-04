"use client";

import { store } from "@/redux/store";
import React from "react";
import { Provider } from "react-redux";

const ReduxProvider: React.FC<IChildren> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
