import React from 'react';
import Navbar from '../../components/Home/Navbar';
import Footer from '../../components/Home/Footer';
import Hero from '../../components/Home/Hero';
import Payment from '../../components/Home/Payment';
import Product from '../../components/Home/Product';

const Home = () => {
    return (
        <div>
            <Navbar/>
            <Hero/>
            <Product/>
            <Payment/>
            <Footer/>
        </div>
    );
};

export default Home;