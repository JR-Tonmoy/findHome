import { useState } from "react";
import About from "../../components/Home/About";
import Footer from "../../components/Home/Footer";
import Hero from "../../components/Home/Hero/Hero";
import Navbar from "../../components/Home/Navbar";
import Payment from "../../components/Home/Payment";
import Product from "../../components/Home/Product";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div>
      <Navbar />
      <Hero
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <About />
      <Product selectedCategory={selectedCategory} />
      <Payment />
      <Footer />
    </div>
  );
};

export default Home;
