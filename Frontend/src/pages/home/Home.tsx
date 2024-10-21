import { useEffect } from "react";
import Card from "../../globals/components/card/Card";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import Hero from "./components/Hero";
import { fetchProducts } from "../../store/productSlice";
import Footer from "../../globals/components/footer/Footer";

const Home = () => {
  const dispatch = useAppDispatch();
  const { product } = useAppSelector((state) => state.products);
  useEffect(() => {
    dispatch(fetchProducts());
  }, []);
  console.log(product);
  return (
    <>
      <Hero />
      <div>
        <h1 className="text-3xl text-black font-bold text-center mt-4">
          Top products:
        </h1>
        <div className="w-full">
          <section className="container w-full mx-auto p-0 md:py-2">
            <section className="p-2 md:p-0 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-4 items-start justify-center">
              {product.length > 0 &&
                product.map((pd) => {
                  return <Card key={pd.id} data={pd} />;
                })}
            </section>
          </section>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Home;
