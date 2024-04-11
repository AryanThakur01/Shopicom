"use client";
import React, { useEffect, useState } from "react";
import SectionContainer from "./SectionContainer";
import { LuLoader, LuLoader2, LuTrash, LuUpload } from "react-icons/lu";
import {
  useGetOneProductQuery,
  useRemoveSinglePropertyMutation,
  useUpdateSinglePropertyMutation,
} from "@/lib/redux/services/products";
import { newProperty, property } from "@/db/schema/products";
import toast from "react-hot-toast";

interface IPropertiesUpdater {
  productId: number;
}
const PropertiesUpdater: React.FC<IPropertiesUpdater> = ({ productId }) => {
  const [propertyList, setPropertyList] = useState<newProperty[]>([]);
  const { data: product, isLoading } = useGetOneProductQuery({ productId });
  useEffect(() => {
    if (product) setPropertyList([...product.properties]);
  }, [product]);
  return (
    <SectionContainer
      title="Property Table"
      ctaFunction={
        propertyList.length < 8
          ? () => {
              if (propertyList.length < 8)
                setPropertyList([
                  ...propertyList,
                  { key: "", value: "", productId: productId },
                ]);
            }
          : undefined
      }
      ctaText="Add Property"
    >
      <div>
        <div className="my-4 flex flex-col gap-8">
          {propertyList.map((item, i) => (
            <SingleProperty
              productKey={item.key}
              value={item.value}
              productId={item.productId}
              id={item.id}
              key={"Property-" + i}
            />
          ))}
          {!isLoading && propertyList.length === 0 && (
            <p className="my-4 text-center">No Properties Yet</p>
          )}
          {isLoading && <LuLoader2 className="animate-spin mx-auto my-12" />}
        </div>
      </div>
    </SectionContainer>
  );
};

interface ISingleProp {
  productKey: string;
  value: string;
  id?: number;
  productId: number;
}
const SingleProperty: React.FC<ISingleProp> = ({
  productKey,
  value,
  id,
  productId,
}) => {
  const [processing, setProcessing] = useState(false);
  const [myKey, setMyKey] = useState(productKey);
  const [myValue, setMyValue] = useState(value);
  const [uploadProp] = useUpdateSinglePropertyMutation();
  const [removeProp] = useRemoveSinglePropertyMutation();
  const uploadHandler = async () => {
    setProcessing(true);
    try {
      const res = await uploadProp({
        key: myKey,
        value: myValue,
        productId: productId,
        id: id,
      }).unwrap();
      toast.success("Uploaded Successfully");
    } catch (error) {
      console.log(error);
      toast.error("It's not you it's us");
    }
    setProcessing(false);
  };
  const deleteHandler = async () => {
    setProcessing(true);
    try {
      if (!id) throw new Error("'id' not present");
      await removeProp(id).unwrap();
      toast.success("Removed Successfully");
    } catch (error) {
      toast.error("It's not you it's us");
    }
    setProcessing(false);
  };
  return (
    <div className="flex gap-4 items-center">
      <input
        type="text"
        className="w-[32%] bg-background rounded border border-border outline-none px-4 py-2"
        name="key"
        placeholder="Key"
        value={myKey}
        onChange={(e) => setMyKey(e.target.value)}
      />
      <input
        type="text"
        name="value"
        className="w-[60%] bg-background rounded border border-border outline-none px-4 py-2"
        placeholder="Value"
        value={myValue}
        onChange={(e) => setMyValue(e.target.value)}
      />
      <button
        className="ml-auto bg-success/80 h-10 w-8 flex justify-center items-center hover:bg-success rounded"
        onClick={uploadHandler}
      >
        {processing ? <LuLoader2 className="animate-spin" /> : <LuUpload />}
      </button>
      {id && (
        <button
          className="ml-auto bg-destructive/80 h-10 w-8 flex justify-center items-center hover:bg-destructive rounded"
          onClick={deleteHandler}
        >
          {processing ? <LuLoader2 className="animate-spin" /> : <LuTrash />}
        </button>
      )}
    </div>
  );
};

export default PropertiesUpdater;
