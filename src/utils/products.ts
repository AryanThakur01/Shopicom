import { image, product, variant } from "@/db/schema/products";
import { IProductProps } from "@/types/products";

interface IProduct {
  products: product;
  variants: variant;
  images: image;
}

const getDefaultProduct = (
  allProducts: IProduct[],
  index: number,
  sellerId: number,
) => {
  return {
    id: allProducts[index].products.id,
    name: allProducts[index].products.name,
    description: allProducts[index].products.description,
    variants: [
      {
        ...allProducts[index].variants,
        imageList: [allProducts[index].images || { value: "" }],
      },
    ],
    sellerId: sellerId,
    properties: [],
  };
};

export const productJoinMerger = (
  allProducts: IProduct[],
  sellerId: number,
) => {
  const productList: IProductProps[] = [
    getDefaultProduct(allProducts, 0, sellerId),
  ];
  let j = 0;
  let k = 0;
  for (let i = 1; i < allProducts.length; i++) {
    // console.log(allProducts.length);
    // console.log(productList[j], allProducts[i].properties);
    // if (productList[j].id === allProducts[i].properties.productId)
    //   productList[j].properties.push(allProducts[i].properties);
    if (productList[j].id === allProducts[i].products.id) {
      if (productList[j].variants[k].id === allProducts[i].variants.id)
        productList[j].variants[k].imageList.push(
          allProducts[i].images || { value: null },
        );
      else {
        productList[j].variants.push({
          ...allProducts[i].variants,
          imageList: [allProducts[i].images || { value: null }],
        });
        k++;
      }
    } else {
      k = 0;
      j++;
      productList[j] = getDefaultProduct(allProducts, i, sellerId);
    }
  }
  return productList;
};
