import {
  ArrowLeft,
  Bath,
  BedDouble,
  Briefcase,
  Check,
  Layers,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { findPropertyById } from "../../../../utils/propertyStorage";

const ViewDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // Using localStorage for demo authentication consistency
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const [showAuthModal, setShowAuthModal] = useState(!isAuthenticated);

  // Fake database mimicking featured properties from Home page
  const featuredProperties = [
    {
      id: 1,
      category: "Family",
      title: "Premium Family Flat",
      location: "Dhanmondi",
      price: "25,000",
      beds: 3,
      baths: 3,
      sqft: 1500,
      image: "/2 Bedroom.png",
    },
    {
      id: 2,
      category: "Family",
      title: "Standard Family Apartment",
      location: "Mirpur 10",
      price: "18,000",
      beds: 2,
      baths: 2,
      sqft: 1100,
      image: "/3baderoom.png",
    },
    {
      id: 3,
      category: "Family",
      title: "Affordable Family House",
      location: "Uttara",
      price: "20,000",
      beds: 3,
      baths: 2,
      sqft: 1200,
      image: "/2 Bedroom.png",
    },
    {
      id: 4,
      category: "Bachelor",
      title: "Single Bachelor Room",
      location: "Mohammadpur",
      price: "6,000",
      beds: 1,
      baths: 1,
      sqft: 300,
      image: "/SingleRoom.png",
    },
    {
      id: 5,
      category: "Bachelor",
      title: "Shared Bachelor Mess",
      location: "Farmgate",
      price: "4,000",
      beds: 1,
      baths: 1,
      sqft: 500,
      image: "/Bacelor.png",
    },
    {
      id: 6,
      category: "Bachelor",
      title: "Executive Bachelor Flat",
      location: "Gulshan",
      price: "15,000",
      beds: 1,
      baths: 1,
      sqft: 600,
      image: "/SingleRoom.png",
    },
    {
      id: 7,
      category: "Office",
      title: "Corporate Office Space",
      location: "Banani",
      price: "80,000",
      beds: null,
      baths: 2,
      sqft: 2000,
      image: "/Master.png",
    },
    {
      id: 8,
      category: "Office",
      title: "Small Startup Office",
      location: "Badda",
      price: "30,000",
      beds: null,
      baths: 1,
      sqft: 800,
      image: "Office Floor Rent.png",
    },
    {
      id: 9,
      category: "Office",
      title: "Co-working Space Desk",
      location: "Karwan Bazar",
      price: "10,000",
      beds: null,
      baths: 1,
      sqft: 150,
      image:
        "https://dreamtouch-bd.com/wp-content/uploads/elementor/thumbs/small-duplex-house-design-in-bangladesh-%E2%80%93-modern-exterior-view-r1roygzxrj534v2p6nclwjnnucaof522he3574p1hk.webp",
    },
    {
      id: 20,
      category: "Office",
      title: "Office Floor Rent",
      location: "Uttara 10",
      price: "15,000",
      beds: null,
      baths: 1,
      sqft: 150,
      image:
        "https://dreamtouch-bd.com/wp-content/uploads/elementor/thumbs/small-duplex-house-design-in-bangladesh-%E2%80%93-modern-exterior-view-r1roygzxrj534v2p6nclwjnnucaof522he3574p1hk.webp",
    },
    {
      id: 10,
      category: "Sublet",
      title: "Sublet for Female",
      location: "Azimpur",
      price: "5,500",
      beds: 1,
      baths: 1,
      sqft: 250,
      image: "/SingleRoom.png",
    },
    {
      id: 11,
      category: "Sublet",
      title: "Master Bed Sublet",
      location: "Bashundhara R/A",
      price: "8,000",
      beds: 1,
      baths: 1,
      sqft: 400,
      image: "/Master.png",
    },
    {
      id: 12,
      category: "Sublet",
      title: "Single Room Sublet",
      location: "Khilgaon",
      price: "6,000",
      beds: 1,
      baths: 1,
      sqft: 300,
      image: "/Bacelor.png",
    },
    {
      id: 13,
      category: "Hostel",
      title: "Boys Premium Hostel",
      location: "Panthapath",
      price: "5,000",
      beds: 1,
      baths: 1,
      sqft: 200,
      image: "/SingleRoom.png",
    },
    {
      id: 14,
      category: "Hostel",
      title: "Girls Safe Hostel",
      location: "Shantinagar",
      price: "6,500",
      beds: 1,
      baths: 1,
      sqft: 250,
      image: "/Bacelor.png",
    },
    {
      id: 15,
      category: "Hostel",
      title: "Executive Working Hostel",
      location: "Tejgaon",
      price: "7,000",
      beds: 1,
      baths: 1,
      sqft: 220,
      image: "/SingleRoom.png",
    },
    {
      id: 16,
      category: "Shop",
      title: "Main Road Shop",
      location: "New Market",
      price: "50,000",
      beds: null,
      baths: null,
      sqft: 500,
      image: "https://old.thefinancialexpress.com.bd/uploads/1603899483.jpg",
    },
    {
      id: 17,
      category: "Shop",
      title: "Inside Mall Shop",
      location: "Bashundhara City",
      price: "80,000",
      beds: null,
      baths: null,
      sqft: 400,
      image: "https://old.thefinancialexpress.com.bd/uploads/1603899483.jpg",
    },
    {
      id: 18,
      category: "Shop",
      title: "Local Area Shop",
      location: "Moghbazar",
      price: "15,000",
      beds: null,
      baths: null,
      sqft: 200,
      image: "https://old.thefinancialexpress.com.bd/uploads/1603899483.jpg",
    },
  ];

  const parsedId = String(id);

  // Fallback to location pathname logic if needed
  const currentLocation = location.pathname + location.search;
  const homeFeature = featuredProperties.find((p) => String(p.id) === parsedId);

  // Fake database mimicking all properties
  const allProperties = [
    {
      id: 1,
      title: "2 Bedroom Apartment",
      price: "15,000",
      location: "Dhanmondi, Dhaka",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      floor: "4th Floor",
      type: "Apartment",
      description:
        "Beautiful 2 bedroom apartment in the heart of Dhanmondi. This modern flat features spacious rooms, excellent ventilation, and is located in a well-maintained building with 24/7 security. Perfect for small families.",
      features: [
        "Attached Bathroom",
        "Balcony",
        "24/7 Security",
        "Gas Connection",
        "Water Supply",
        "Lift Available",
        "Car Parking",
        "Generator Backup",
      ],
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1502672260266-1c1f51baffac3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
      ],
      owner: {
        name: "Ahmed Hassan",
        phone: "+880 1712-345678",
        email: "ahmed@example.com",
      },
    },
    {
      id: 2,
      title: "Bachelor Room",
      price: "6,000",
      location: "Mohammadpur, Dhaka",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 400,
      floor: "2nd Floor",
      type: "Room",
      description:
        "A compact and budget-friendly room perfect for bachelors or students. Great communication facility in a friendly neighborhood.",
      features: [
        "Attached Bathroom",
        "24/7 Security",
        "Water Supply",
        "Wi-Fi included",
      ],
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1f51baffac3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
      ],
      owner: {
        name: "Rahim Ali",
        phone: "+880 1812-444555",
        email: "rahim@example.com",
      },
    },
    {
      id: 3,
      title: "3 Bedroom Family House",
      price: "35,000",
      location: "Gulshan, Dhaka",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 2000,
      floor: "2nd Floor",
      type: "House",
      description:
        "Luxurious 3-bedroom apartment located in the prime area of Gulshan. Premium fittings, full generator backup, and modern amenities available.",
      features: [
        "Attached Bathrooms",
        "Large Balcony",
        "Central AC",
        "24/7 Security",
        "Elevator",
        "Car Parking",
        "Full Generator Backup",
        "CCTV Surveillance",
      ],
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
        "https://images.unsplash.com/photo-1502672260266-1c1f51baffac3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
      ],
      owner: {
        name: "Faisal Rahman",
        phone: "+880 1912-888999",
        email: "faisal@example.com",
      },
    },
    {
      id: 4,
      title: "Commercial Shop",
      price: "25,000",
      location: "Mirpur, Dhaka",
      bedrooms: 0,
      bathrooms: 1,
      sqft: 800,
      floor: "Ground Floor",
      type: "Shop",
      description:
        "Spacious commercial shop located on the main road with heavy foot traffic. Perfect for super shops, pharmacies, or branch offices.",
      features: [
        "Main Road Facing",
        "Washroom info",
        "24/7 Electricity",
        "Water Supply",
      ],
      images: [
        "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
      ],
      owner: {
        name: "Kabir Hossain",
        phone: "+880 1711-222333",
        email: "kabir@example.com",
      },
    },
    {
      id: 5,
      title: "Studio Apartment",
      price: "12,000",
      location: "Banani, Dhaka",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 600,
      floor: "5th Floor",
      type: "Apartment",
      description:
        "Cozy studio apartment with modern setup. Ideal for expats or working professionals. Includes a kitchenette and a beautiful view of the city.",
      features: [
        "Open Kitchen",
        "Attached Bathroom",
        "Balcony",
        "Security",
        "Lift Available",
        "Generator",
        "Water Supply",
      ],
      images: [
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
      ],
      owner: {
        name: "Anisur Rahman",
        phone: "+880 1612-777888",
        email: "anisur@example.com",
      },
    },
    {
      id: 6,
      title: "4 Bedroom Duplex",
      price: "45,000",
      location: "Uttara, Dhaka",
      bedrooms: 4,
      bathrooms: 4,
      sqft: 3200,
      floor: "1st & 2nd Floor",
      type: "House",
      description:
        "Premium duplex house with large living spaces, imported tiles, modern kitchen cabinets, and a private garden area. 2 car parking spaces available.",
      features: [
        "4 Attached Bathrooms",
        "Private Garden",
        "2 Car Parking spaces",
        "Servant Quarters",
        "Gas Connection",
        "CCTV",
        "24/7 Security",
      ],
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60",
      ],
      owner: {
        name: "Chowdhury Kamal",
        phone: "+880 1512-111000",
        email: "chowdhury@example.com",
      },
    },
    // ---- From Home/Product.jsx & Dashboard.jsx ----
    {
      id: 101,
      title: "2 Bedroom Family Flat",
      price: "15,000",
      location: "Dhanmondi 4/A",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1200,
      floor: "2nd Floor",
      type: "Flat",
      description:
        "A nice 2 bedroom family flat located in a very convenient place with all modern amenities.",
      features: ["Security", "Lift", "Generator"],
      images: [
        "/2 Bedroom.png",
        "https://images.unsplash.com/photo-1502672260266-1c1f51baffac3?w=800",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      ],
      owner: {
        name: "Abul Kashem",
        phone: "+880 1711-000111",
        email: "abul@example.com",
      },
    },
    {
      id: 102,
      title: "Bachelor Single Room",
      price: "6,000",
      location: "Mohammadpur Bus Stand",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 400,
      floor: "Ground Floor",
      type: "Room",
      description:
        "Affordable bachelor single room with shared or attached options.",
      features: ["Water Supply", "Wi-Fi"],
      images: [
        "/SingleRoom.png",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      ],
      owner: {
        name: "Shafiqur",
        phone: "+880 1811-222333",
        email: "shafiq@example.com",
      },
    },
    {
      id: 103,
      title: "Bachelor Single Room",
      price: "6,000",
      location: "Mohammadpur Bus Stand",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 400,
      floor: "Ground Floor",
      type: "Room",
      description:
        "Affordable bachelor single room with shared or attached options.",
      features: ["Water Supply", "Wi-Fi"],
      images: [
        "/SingleRoom.png",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      ],
      owner: {
        name: "Shafiqur",
        phone: "+880 1811-222333",
        email: "shafiq@example.com",
      },
    },
    {
      id: 104,
      title: "Bachelor Single Room",
      price: "6,000",
      location: "Mohammadpur Bus Stand",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 400,
      floor: "Ground Floor",
      type: "Room",
      description:
        "Affordable bachelor single room with shared or attached options.",
      features: ["Water Supply", "Wi-Fi"],
      images: [
        "/SingleRoom.png",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      ],
      owner: {
        name: "Shafiqur",
        phone: "+880 1811-222333",
        email: "shafiq@example.com",
      },
    },
    {
      id: 105,
      title: "Bachelor Single Room",
      price: "6,000",
      location: "Mohammadpur Bus Stand",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 400,
      floor: "Ground Floor",
      type: "Room",
      description:
        "Affordable bachelor single room with shared or attached options.",
      features: ["Water Supply", "Wi-Fi"],
      images: [
        "/SingleRoom.png",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      ],
      owner: {
        name: "Shafiqur",
        phone: "+880 1811-222333",
        email: "shafiq@example.com",
      },
    },
    {
      id: 106,
      title: "3 Bedroom Family Flat",
      price: "35,000",
      location: "Gulshan-2",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 1800,
      floor: "3rd Floor",
      type: "Flat",
      description:
        "Spacious luxury flat in Gulshan 2 with premium neighborhood facilities.",
      features: ["Lift", "Generator", "Parking"],
      images: [
        "/3baderoom.png",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
      ],
      owner: {
        name: "Rafiq Islam",
        phone: "+880 1511-444555",
        email: "rafiq@example.com",
      },
    },
    {
      id: 107,
      title: "Shop for Rent",
      price: "25,000",
      location: "Mirpur-10",
      bedrooms: 0,
      bathrooms: 1,
      sqft: 600,
      floor: "Ground Floor",
      type: "Shop",
      description: "Large store suitable for any commercial space in Mirpur.",
      features: ["Roadside", "Water Supply"],
      images: [
        "https://old.thefinancialexpress.com.bd/uploads/1603899483.jpg",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      ],
      owner: {
        name: "Jalil Rahman",
        phone: "+880 1711-555666",
        email: "jalil@example.com",
      },
    },
    {
      id: 108,
      title: "Bachelor Studio Flat",
      price: "12,000",
      location: "Banani Road-11",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 500,
      floor: "4th Floor",
      type: "Flat",
      description: "Beautiful bachelor studio with fine finishing in Banani.",
      features: ["Lift", "Security", "Furnished"],
      images: [
        "/Bacelor.png",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      ],
      owner: {
        name: "Anisur",
        phone: "+880 1811-777888",
        email: "anis@example.com",
      },
    },
    {
      id: 109,
      title: "Family Duplex House",
      price: "45,000",
      location: "Uttara Sector-7",
      bedrooms: 4,
      bathrooms: 4,
      sqft: 2500,
      floor: "Duplex",
      type: "House",
      description:
        "Premium duplex for family in a highly secure zone at Uttara.",
      features: ["Garden", "Parking", "Security", "Generator"],
      images: [
        "https://dreamtouch-bd.com/wp-content/uploads/elementor/thumbs/small-duplex-house-design-in-bangladesh-%E2%80%93-modern-exterior-view-r1roygzxrj534v2p6nclwjnnucaof522he3574p1hk.webp",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      ],
      owner: {
        name: "Mustafa",
        phone: "+880 1911-999000",
        email: "mustafa@example.com",
      },
    },
    {
      id: 201,
      title: "3 Bedroom Apartment",
      price: "28,000",
      location: "Bashundhara, Dhaka",
      bedrooms: 3,
      bathrooms: 3,
      sqft: 1500,
      floor: "5th Floor",
      type: "Apartment",
      description: "Wonderful apartment in Bashundhara residential area.",
      features: ["Security", "Parking"],
      images: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      ],
      owner: {
        name: "Zaman",
        phone: "+880 1911-666777",
        email: "zaman@example.com",
      },
    },
    {
      id: 202,
      title: "Bachelor Room",
      price: "8,000",
      location: "Rampura, Dhaka",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 350,
      floor: "3rd Floor",
      type: "Room",
      description: "Quiet room for bachelors in Rampura.",
      features: ["Water Supply", "Wi-Fi"],
      images: [
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800",
        "https://images.unsplash.com/photo-1502672260266-1c1f51baffac3?w=800",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      ],
      owner: {
        name: "Hasan",
        phone: "+880 1711-123123",
        email: "hasan@example.com",
      },
    },
    {
      id: 203,
      title: "Family Flat",
      price: "22,000",
      location: "Dhanmondi, Dhaka",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1100,
      floor: "4th Floor",
      type: "Flat",
      description: "Cozy family flat in Dhanmondi.",
      features: ["Lift", "Security"],
      images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      ],
      owner: {
        name: "Rahman",
        phone: "+880 1811-456456",
        email: "rahman@example.com",
      },
    },
    {
      id: 204,
      title: "Modern Studio",
      price: "18,000",
      location: "Banani, Dhaka",
      bedrooms: 1,
      bathrooms: 1,
      sqft: 600,
      floor: "2nd Floor",
      type: "Studio",
      description: "Premium studio apartment in Banani.",
      features: ["Furnished", "Security", "AC"],
      images: [
        "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800",
        "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      ],
      owner: {
        name: "Karim",
        phone: "+880 1911-789789",
        email: "karim@example.com",
      },
    },
  ];

  // Find the property that matches the id from URL
  let property =
    findPropertyById(parsedId) ||
    allProperties.find((p) => String(p.id) === parsedId);

  // If found in featuredProperties but not perfectly matching allProperties (or overriding it)
  if (homeFeature && (!property || property.title !== homeFeature.title)) {
    property = {
      id: homeFeature.id,
      title: homeFeature.title,
      price: homeFeature.price,
      location: homeFeature.location,
      bedrooms: homeFeature.beds || 0,
      bathrooms: homeFeature.baths || 0,
      sqft: homeFeature.sqft || 0,
      floor: "Varies",
      type: homeFeature.category,
      description: `This is a beautiful ${homeFeature.category} property located in ${homeFeature.location}. Perfect for those looking for comfort and convenience in the heart of the city.`,
      features: ["24/7 Security", "Water Supply", "Excellent Environment"],
      images: [
        homeFeature.image,
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "https://images.unsplash.com/photo-1502672260266-1c1f51baffac3?w=800",
      ],
      owner: {
        name: "Verified Owner",
        phone: "+880 1700-000000",
        email: "owner@example.com",
      },
    };
  }

  // Fallback if not found anywhere
  if (!property) {
    property = {
      // Fallback for any other IDs clicked from Home/Dashboard
      id: String(id),
      title: "Property Listing (ID: " + id + ")",
      price: "Negotiable",
      location: "Dhaka, Bangladesh",
      bedrooms: 2,
      bathrooms: 2,
      sqft: 1000,
      floor: "2nd Floor",
      type: "Property",
      description:
        "This is a great property available for rent. The exact details are dynamically loaded.",
      features: ["24/7 Security", "Water Supply", "Balcony"],
      images: [
        "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
        "https://images.unsplash.com/photo-1502672260266-1c1f51baffac3?w=800",
      ],
      owner: {
        name: "BashaLagbe Owner",
        phone: "+880 1700-000000",
        email: "contact@bashalagbe.com",
      },
    };
  }

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Header showing Navigation */}
      <div className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center mb-8 sticky top-0 z-50">
        <Link to="/dashboard/browse" className="flex flex-col">
          <div className="flex items-center gap-2 text-black text-xl font-bold">
            <div className="bg-black text-white p-1 rounded-lg">🏠</div>
            BashaLagbe
          </div>
          <span className="text-gray-600 text-[10px] font-medium mt-0.5">
            Find your perfect flat easily
          </span>
        </Link>
        <Link
          to="/dashboard/browse"
          className="flex items-center text-gray-500 hover:text-black font-medium"
        >
          <ArrowLeft size={18} className="mr-2" /> Back to Browse
        </Link>
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Images & Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images Gallery */}
            <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
              <div className="rounded-xl overflow-hidden mb-2">
                <img
                  src={property.images[0]}
                  alt="Main"
                  className="w-full h-87.5 md:h-112.5 object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl overflow-hidden h-32 md:h-48">
                  <img
                    src={property.images[1]}
                    alt="Sub 1"
                    className="w-full h-full object-cover relative"
                  />
                </div>
                <div className="rounded-xl overflow-hidden h-32 md:h-48">
                  <img
                    src={property.images[2]}
                    alt="Sub 2"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Details Card */}
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {property.title}
                  </h1>
                  <div className="flex items-center text-gray-500 mt-3 text-sm md:text-base">
                    <MapPin size={18} className="mr-1 text-gray-400" />
                    {property.location}
                  </div>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-3xl font-bold text-black flex items-end md:justify-end">
                    ৳{property.price}
                  </div>
                  <div className="text-gray-400 text-sm font-medium mt-1">
                    /month
                  </div>
                </div>
              </div>

              {/* Quick Summary Grid */}
              <div className="border-t border-b border-gray-100 py-6 my-8 grid grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center text-center">
                  <BedDouble size={24} className="text-gray-400 mb-2" />
                  <span className="font-bold text-gray-800 text-lg">
                    {property.bedrooms}
                  </span>
                  <span className="text-gray-500 text-xs md:text-sm">
                    Bedrooms
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <Bath size={24} className="text-gray-400 mb-2" />
                  <span className="font-bold text-gray-800 text-lg">
                    {property.bathrooms}
                  </span>
                  <span className="text-gray-500 text-xs md:text-sm">
                    Bathrooms
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <Layers size={24} className="text-gray-400 mb-2" />
                  <span className="font-bold text-gray-800 text-lg">
                    {property.sqft}
                  </span>
                  <span className="text-gray-500 text-xs md:text-sm">
                    Sq Ft
                  </span>
                </div>
                <div className="flex flex-col items-center justify-center text-center">
                  <ArrowLeft
                    size={24}
                    className="text-gray-400 mb-2 rotate-90"
                  />
                  <span className="font-bold text-gray-800 text-lg">
                    {property.floor}
                  </span>
                  <span className="text-gray-500 text-xs md:text-sm">
                    Floor
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 border-b-2 border-transparent inline-block pb-1 mb-4">
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed text-[15px]">
                  {property.description}
                </p>
              </div>

              {/* Features & Amenities */}
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-5">
                  Features & Amenities
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4">
                  {property.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-center text-gray-600 font-medium"
                    >
                      <span className="w-2 h-2 rounded-full bg-black mr-3"></span>
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Contact Owner
              </h3>

              <div className="space-y-5">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">
                    Owner Name
                  </p>
                  <p className="font-bold text-gray-800 text-lg">
                    {property.owner.name}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-50 rounded-lg">
                    <Phone size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-0.5">
                      Phone
                    </p>
                    <p className="font-bold text-gray-800">
                      {property.owner.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-gray-50 rounded-lg">
                    <Mail size={20} className="text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-0.5">
                      Email
                    </p>
                    <p className="font-bold text-gray-800">
                      {property.owner.email}
                    </p>
                  </div>
                </div>
              </div>

              <Link
                to={isAuthenticated ? `/order/${property.id}` : "/login"}
                state={{ from: currentLocation }}
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3.5 mt-8 items-center rounded-xl flex justify-center gap-2 transition-colors"
                style={{ color: "#fff" }}
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault();
                    setShowAuthModal(true);
                  }
                }}
              >
                {isAuthenticated ? (
                  <>
                    <Briefcase size={20} style={{ color: "#fff" }} />
                    <span style={{ color: "#fff" }}>Booking Now</span>
                  </>
                ) : (
                  <span className="text-white">👤 Login/Register</span>
                )}
              </Link>

              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-100">
                <span className="text-gray-500 font-medium">Availability</span>
                <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full">
                  Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Login Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full relative pt-10 pb-6 px-6 md:px-8 text-center">
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition cursor-pointer"
            >
              <X size={20} />
            </button>

            {/* Icon */}
            <div className="mx-auto w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mb-6">
              <Check size={32} className="text-black" />
            </div>

            {/* Title & Description */}
            <h3 className="text-xl font-semibold text-black mb-2">
              Please Login / Register
            </h3>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              We don&apos;t share any information without verified user.
              <br />
              So please login for get the full information of this property.
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4 border-t border-gray-100 pt-6">
              <button
                onClick={() => setShowAuthModal(false)}
                className="flex-1 py-2.5 px-4 bg-white border border-black text-black rounded-lg font-medium cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  navigate("/register", { state: { from: currentLocation } })
                }
                className="flex-1 py-2.5 px-4 bg-black border border-black text-white rounded-lg font-medium hover:bg-white hover:text-black transition cursor-pointer"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewDetails;
