import Banner from "@/components/Home/Banner";
import BestSellers from "@/components/Home/BestSellers";
import Sponsored from "@/components/Home/Sponsored";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "./api/uploadthing/core";

export const dynamic = "force-dynamic";
export default function Home() {
  return (
    <main className="bg-background">
      <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
      <Banner />
      <Sponsored />
      <BestSellers />
    </main>
  );
}
