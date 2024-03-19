"use client";
import QueuedOrderCard from "@/components/dashboard/deliveryqueue/QueuedOrderCard";
import { order } from "@/db/schema/orders";
import { image, product, variant } from "@/db/schema/products";
import { url } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import { type ContactOption } from "@stripe/stripe-js";

interface IVariant extends variant {
  images: image[];
  product: product;
}
interface IOrders extends order {
  product: IVariant;
}
const Page = () => {
  const [orderData, setOrderData] = useState<IOrders[]>([]);
  const [address, setAddress] = useState("");
  const fetchQueue = async () => {
    const res = await fetch(url + "/api/user/getorderqueue", { method: "GET" });
    const { data }: { data: IOrders[] } = await res.json();
    setOrderData(data);
  };
  useEffect(() => {
    fetchQueue();
  }, []);
  return (
    <main>
      <h1 className="text-4xl font-bold">Delivery Queue</h1>
      <hr className="my-10 border-border" />
      <section className="flex flex-col gap-4">
        {orderData.map((item) => {
          const address: ContactOption["address"] = JSON.parse(item.address);
          const location = address.line1 + (address.line2 || ", ") + address.city + ", " + address.state; //prettier-ignore
          console.log(address);
          return (
            <QueuedOrderCard
              key={item.id}
              image={item.product.images[0].value}
              location={location}
              color={item.product.color}
              name={item.product.product.name}
              qty={item.qty}
              country={address.country}
              mobile={item.phone}
            />
          );
        })}
      </section>
    </main>
  );
};

export default Page;
