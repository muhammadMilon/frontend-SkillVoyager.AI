import CTA from "./pages/LandingPages/CTA";
import FAQ from "./pages/LandingPages/FAQ";
import Features from "./pages/LandingPages/Features";
import Hero from "./pages/LandingPages/Hero";
import HowItWorks from "./pages/LandingPages/HowItWorks";
import NewsLetter from "./pages/LandingPages/NewsLetter";
import PricingPreview from "./pages/LandingPages/PricingPreview";
import Stats from "./pages/LandingPages/Stats";
import Testimonials from "./pages/LandingPages/Testimonials";
import Trending from "./pages/LandingPages/Trending";

function App() {
  return (
    <div className="w-full">
      {/* 🔹 Hero Section (Landing Page Header + CTA) */}
      <Hero />

      {/* 🔹 Features Section (Key Features of SkillVoyager.AI) */}
      <Features />

      
      {/* 🔹 Testimonials Section (User feedback) */}
      <Testimonials />

      {/* 🔹 How It Works Section (Step-by-step explanation) */}
      <HowItWorks />

      {/* 🔹 Trending Skills Section */}
      <Trending />

      
      {/* 🔹 FAQ Section (Common Questions) */}
      <FAQ />


       {/* 🔹 Pricing Preview Section */}
      <PricingPreview />

      {/* 🔹 Stats Section (Numbers, Achievements, Metrics) */}
      <Stats />



      {/* 🔹 Call To Action Section */}
      <CTA />

      {/* 🔹 Newsletter Section (Email subscription) */}
      <NewsLetter />
    </div>
  );
}

export default App;
