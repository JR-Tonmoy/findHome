import About from "../../components/Home/About";
import Footer from "../../components/Home/Footer";
import Hero from "../../components/Home/Hero";
import Navbar from "../../components/Home/Navbar";
import Payment from "../../components/Home/Payment";
import Product from "../../components/Home/Product";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Hero />
      <About />
      <Product />
      <Payment />
      <Footer />
    </div>
  );
};

export default Home;
