"use client";
import React, { useEffect, useRef, useState } from "react";
import { url } from "@/lib/constants";
import { IOrders } from "@/types/orders";
import Image from "next/image";
import {
  LuAlertCircle,
  LuCheckCircle,
  LuLoader,
  LuLoader2,
  LuShoppingBag,
  LuTruck,
} from "react-icons/lu";

const Page = () => {
  const [orders, setOrders] = useState<IOrders[]>([]);
  const [loading, setLoading] = useState(false);
  const fetchMyOrders = async () => {
    setLoading(true);
    const res = await fetch(url + "/api/user/orders", {
      method: "GET",
    });
    const { data }: { data: IOrders[] } = await res.json();
    console.log(data);
    setOrders(data);
    setLoading(false);
  };
  useEffect(() => {
    fetchMyOrders();
  }, []);
  return (
    <main>
      <h1 className="text-4xl font-bold">My Orders</h1>
      <hr className="border-border my-10" />
      {orders?.map((item) => (
        <ProductItem
          key={item.id}
          itemId={item.id}
          name={item.product.product.name}
          image={item.product.images[0].value}
          color={item.product.color}
          qty={item.qty}
          cost={(item.paymentAmount / 100).toLocaleString()}
          status={item.deliveryStatus}
          refetch={fetchMyOrders}
        />
      ))}
      {loading && (
        <LuLoader2 className="mx-auto mt-20 mb-8 text-8xl animate-spin text-muted-foreground" />
      )}
    </main>
  );
};

interface IProductItem {
  itemId: number;
  image: string;
  name: string;
  color: string;
  qty: number;
  cost: string;
  status: string | null;
  refetch: () => Promise<void>;
}
const ProductItem: React.FC<IProductItem> = ({
  itemId,
  image,
  name,
  color,
  qty,
  cost,
  status,
  refetch,
}) => {
  const [loading, setLoading] = useState(false);
  const updateMyOrder = async () => {
    console.log(
      await fetch(url + `/api/user/orders/received?order_id=${itemId}`, {
        method: "PATCH",
      }),
    );
  };
  const receivedRef = useRef<HTMLButtonElement>(null);
  const ReceivedHandler = async () => {
    setLoading(true);
    const target = receivedRef.current;
    if (!target) return;

    target.classList.remove("border-b-[3px]");
    await updateMyOrder();
    await refetch();
    target.classList.add("border-b-[3px]");
    setLoading(false);
  };
  return (
    <div className="flex border border-border p-4 rounded items-center sm:gap-8 gap-3 shadow-md my-6">
      <div className="shrink-0">
        <Image
          src={image}
          alt={name}
          width={500}
          height={500}
          className="h-20 w-20 rounded"
        />
      </div>
      <div className="flex flex-col gap-2 overflow-hidden">
        <h2 className="sm:text-xl font-bold whitespace-nowrap overflow-ellipsis overflow-clip">
          {name[0].toUpperCase() + name.slice(1)}
        </h2>
        <div className="flex sm:gap-8 gap-3 items-center">
          <div
            className="h-6 w-6 rounded-full border-2 border-border/60 "
            style={{ backgroundColor: color }}
          />
          <div className="h-6 border border-border" />
          <p>Qty: {qty}</p>
        </div>
        <p className="flex gap-2">
          <span className="my-auto">
            {status === "ordered" ? (
              <LuShoppingBag />
            ) : status === "received" ? (
              <LuCheckCircle />
            ) : status === "dispatched" ? (
              <LuTruck size={20} />
            ) : (
              <LuAlertCircle />
            )}
          </span>
          <span
            className="text-muted-foreground"
            style={{
              color: `${
                status === "ordered"
                  ? "hsl(var(--muted-foreground))"
                  : status === "received"
                  ? "hsl(var(--success))"
                  : status === "dispatched"
                  ? "orange"
                  : "hsl(var(--destructive))"
              }`,
            }}
          >
            {status}
          </span>
        </p>
      </div>
      <span className="mx-auto" />
      <div className="self-start shrink-0">
        <p className="font-bold sm:text-xl">₹ {cost}</p>
        {status !== "received" ? (
          <button
            ref={receivedRef}
            className="bg-success p-1 sm:w-24 w-20 sm:text-md text-sm rounded-sm border-b-[3px] border-black/50 sm:h-10 h-8 sm:mt-5 mt-8"
            onMouseDown={ReceivedHandler}
          >
            {loading ? (
              <LuLoader className="animate-spin mx-auto" />
            ) : (
              "Received"
            )}
          </button>
        ) : (
          <button
            ref={receivedRef}
            className="bg-primary p-1 sm:w-24 w-20 sm:text-md text-sm rounded-sm border-b-[3px] border-black/50 sm:h-10 h-8 sm:mt-5 mt-8"
            // onMouseDown={ReceivedHandler}
          >
            {loading ? <LuLoader className="animate-spin mx-auto" /> : "Review"}
          </button>
        )}
      </div>
    </div>
  );
};

export default Page;
