import Image from "next/image";
import React from "react";
import { LuBox, LuLocate, LuMapPin, LuPhone } from "react-icons/lu";

interface IQueuedOrderCard {
  image: string;
  name: string;
  qty: number;
  location: string;
  color: string;
  country?: string;
  mobile: string;
}
const QueuedOrderCard: React.FC<IQueuedOrderCard> = ({
  image,
  qty,
  name,
  color,
  location,
  country,
  mobile,
}) => {
  return (
    <div className="flex gap-4 bg-card p-4">
      <div className="w-fit shrink-0">
        <Image
          src={image}
          alt={"name"}
          width={400}
          height={400}
          className="sm:h-32 sm:w-32 w-20 h-20 rounded"
        />
      </div>
      <div className="flex flex-col justify-between">
        <h2 className="text-xl">{name}</h2>
        <div className="flex gap-4">
          <div
            className="w-6 h-6 rounded-full"
            style={{
              backgroundColor: color,
            }}
          />
          <div className="w-[3px] h-full bg-muted rounded" />
          <p className="flex items-center gap-2">
            <span>
              <LuLocate />
            </span>
            <span>{country}</span>
          </p>
          <div className="w-[3px] h-full bg-muted rounded" />
          <p className="text-muted-foreground text-lg flex gap-2 items-center">
            <b>
              <LuPhone />
            </b>
            {mobile}
          </p>
        </div>
        <p className="text-muted-foreground text-lg flex gap-2 items-center">
          <b>
            <LuMapPin />
          </b>
          {location}
        </p>
      </div>
      <div className="ml-auto text-xl">
        <p className="flex items-center gap-2">
          <span>
            <LuBox />
          </span>
          <span>{qty}</span>
        </p>
      </div>
    </div>
  );
};

export default QueuedOrderCard;
