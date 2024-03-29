"use client";

/* Core */
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

/* Instruments */
import { reduxStore, useDispatch, userDataAsync } from "./redux/";
import { useEffect } from "react";
import { useGetCartQuery } from "./redux/services/cart";
import { useGetOrdersQuery } from "./redux/services/user";

export const Providers = (props: React.PropsWithChildren) => {
  return (
    <>
      <Provider store={reduxStore}>
        <DefaultCalls />
        {props.children}
      </Provider>
    </>
  );
};

export const ToasterProvider = () => {
  return <Toaster />;
};

export const DefaultCalls = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(userDataAsync());
  }, []);
  return <></>;
};
