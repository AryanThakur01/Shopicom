"use client";

/* Core */
import { Provider } from "react-redux";

/* Instruments */
import { reduxStore, useDispatch, userDataAsync } from "./redux/";
import { useEffect } from "react";

export const Providers = (props: React.PropsWithChildren) => {
  return (
    <Provider store={reduxStore}>
      <DefaultCalls />
      {props.children}
    </Provider>
  );
};

export const DefaultCalls = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userDataAsync());
  }, []);
  return <></>;
};
