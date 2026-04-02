import React from "react";
import { HelpCircle, Sparkles } from "lucide-react";

const HelpCenter = () => {
  return (
    <section
      className="min-h-screen text-white py-28 px-6"
      style={{
        background:
          "linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto text-center">
        <Sparkles className="mx-auto mb-6 text-teal-400" size={40} />

        <h1 className="text-4xl font-bold mb-6">
          Help <span style={{ color: "#17B6A8" }}>Center</span>
        </h1>

        <p className="text-gray-300 mb-10">
          Find answers, guides, and resources to help you use our AI-powered
          platform effectively.
        </p>

        <div className="grid md:grid-cols-2 gap-6 text-left">
          <div className="p-6 rounded-2xl border border-teal-500/20 bg-white/5">
            <HelpCircle className="text-teal-400 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Getting Started</h3>
            <p className="text-gray-400 text-sm">
              Learn how to create your AI roadmap and start your learning
              journey.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-teal-500/20 bg-white/5">
            <HelpCircle className="text-teal-400 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Account & Billing</h3>
            <p className="text-gray-400 text-sm">
              Manage your subscription, payment methods, and account settings.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-teal-500/20 bg-white/5">
            <HelpCircle className="text-teal-400 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Roadmap Guide</h3>
            <p className="text-gray-400 text-sm">
              Understand how our AI generates personalized learning paths.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-teal-500/20 bg-white/5">
            <HelpCircle className="text-teal-400 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Troubleshooting</h3>
            <p className="text-gray-400 text-sm">
              Solutions for common issues and technical problems.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HelpCenter;