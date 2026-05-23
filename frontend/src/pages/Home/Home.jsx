import { useEffect, useState } from "react";
import Footer from "../../components/Home/Footer";
import Hero from "../../components/Home/Hero/Hero";
import Navbar from "../../components/Home/Navbar";
import Product from "../../components/Home/Product";
import {
  fetchHomeCategories,
  fetchHomePropertiesByCategory,
} from "../../utils/homeService";

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [homeData, setHomeData] = useState({
    latestProperties: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadHomeCategories = async () => {
      try {
        const categories = await fetchHomeCategories();
        if (active) {
          setHomeData((currentData) => ({
            ...currentData,
            categories,
          }));
        }
      } catch {
        if (active) {
          setHomeData((currentData) => ({
            ...currentData,
            categories: [],
          }));
        }
      }
    };

    loadHomeCategories();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const loadProperties = async () => {
      setLoading(true);

      try {
        const properties =
          await fetchHomePropertiesByCategory(selectedCategory);

        if (active) {
          setHomeData((currentData) => ({
            ...currentData,
            latestProperties: properties,
          }));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProperties();

    return () => {
      active = false;
    };
  }, [selectedCategory]);

  return (
    <div>
      <Navbar />
      <Hero
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={homeData.categories}
      />
      <Product
        title="Latest Properties"
        subtitle="Fresh listings pulled from the backend in real time."
        properties={homeData.latestProperties}
        loading={loading}
      />
      <Footer />
    </div>
  );
};

export default Home;
