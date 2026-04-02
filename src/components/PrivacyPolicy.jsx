import React from "react";

const PrivacyPolicy = () => {
  return (
    <section
      className="min-h-screen text-white py-28 px-6"
      style={{
        background:
          "linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">
          Privacy <span style={{ color: "#17B6A8" }}>Policy</span>
        </h1>

        <p className="text-gray-300 mb-6">
          Your privacy is important to us. This Privacy Policy explains how we
          collect, use, and protect your personal information when using our
          platform.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2 text-teal-400">
          Information We Collect
        </h3>
        <p className="text-gray-400">
          We may collect personal information such as your name, email address,
          learning preferences, and platform usage data.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2 text-teal-400">
          How We Use Your Data
        </h3>
        <p className="text-gray-400">
          Your data helps us personalize AI-generated roadmaps, improve user
          experience, and provide better support.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-2 text-teal-400">
          Data Security
        </h3>
        <p className="text-gray-400">
          We implement industry-standard security measures to protect your
          information from unauthorized access.
        </p>
      </div>
    </section>
  );
};

export default PrivacyPolicy;