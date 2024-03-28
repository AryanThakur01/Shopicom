"use client";

/* Core */
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

/* Instruments */
import { reduxStore, useDispatch, userDataAsync } from "./redux/";
import { useEffect } from "react";
import { useGetOrdersQuery, useGetProfileQuery } from "./redux/services/user";
import { useGetCartQuery } from "./redux/services/cart";

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
  const visitor = useGetProfileQuery();
  const order = useGetOrdersQuery();
  const cart = useGetCartQuery();
  useEffect(() => {
    console.log("visitor", visitor.data);
    console.log("order", order.data);
    console.log("cart", cart.data);
  }, [visitor, order, cart]);
  return <></>;
};
