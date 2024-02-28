import Banner from "@/components/Home/Banner";
import BestSellers from "@/components/Home/BestSellers";
import Sponsored from "@/components/Home/Sponsored";

export default function Home() {
  return (
    <main className="bg-background">
      <Banner />
      <Sponsored />
      <BestSellers />
    </main>
  );
}