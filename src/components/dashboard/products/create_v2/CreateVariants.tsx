"use client";
import React, { useEffect, useState } from "react";
import { LuLoader2 } from "react-icons/lu";
import Link from "next/link";
import { useGetProductVariantsQuery } from "@/lib/redux/services/products";
import VariantForm from "./VariantForm";
import Carousel from "@/components/Carousel";
import ImagesForm from "./ImagesForm";
import { IVariants } from "@/types/products";

interface ICreateVariants {
  id: number;
}
const CreateVariants: React.FC<ICreateVariants> = ({ id }) => {
  const [variants, setVariants] = useState<Array<IVariants | null>>([]);
  const { data, isLoading } = useGetProductVariantsQuery(id);
  useEffect(() => {
    if (data) {
      setVariants([...data]);
    }
  }, [data]);
  return (
    <>
      {isLoading ? (
        <div className="flex flex-col my-auto">
          <LuLoader2 className="mx-auto my-auto animate-spin" size={80} />
        </div>
      ) : (
        variants.map((item, i) => (
          <div className="my-2" key={`variant-${i}`}>
            <Carousel>
              <div className="flex">
                <div className="shrink-0 w-3/4">
                  <div className="w-full">
                    <VariantForm variant={item} id={id} />
                  </div>
                </div>
                <div className="shrink-0 w-3/4 px-8">
                {!!item && (
                  <div className="w-full h-full">
                    <ImagesForm
                      id={item.id}
                      color={item.color}
                      images={item.images}
                    />
                  </div>
                )}
                </div>
              </div>
            </Carousel>
          </div>
        ))
      )}
      <div className="grid grid-cols-2 mt-auto pt-8 gap-4">
        <Link
          href="/dashboard/products"
          className="mx-auto w-full h-10 bg-primary rounded flex items-center justify-center"
        >
          Create Product
        </Link>
        {variants.length < 8 && (
          <button
            className="mx-auto h-10 bg-success rounded w-full"
            onClick={() => {
              if (variants.length < 8) setVariants([...variants, null]);
            }}
          >
            Add Another Variant
          </button>
        )}
      </div>
    </>
  );
};

export default CreateVariants;
