import React from "react";
import { Mail, MessageCircle } from "lucide-react";

const ContactSupport = () => {
  return (
    <section
      className="min-h-screen text-white py-28 px-6"
      style={{
        background:
          "linear-gradient(150deg, #071320 0%, #0b1d2e 55%, #060f1a 100%)",
      }}
    >
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-6">
          Contact <span style={{ color: "#17B6A8" }}>Support</span>
        </h1>

        <p className="text-gray-300 mb-10">
          Need help? Our support team is available to assist you anytime.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-2xl border border-teal-500/20 bg-white/5">
            <MessageCircle className="mx-auto text-teal-400 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
            <p className="text-gray-400 text-sm">
              Chat instantly with our AI support assistant.
            </p>
          </div>

          <div className="p-8 rounded-2xl border border-teal-500/20 bg-white/5">
            <Mail className="mx-auto text-yellow-400 mb-3" />
            <h3 className="font-semibold text-lg mb-2">Email Support</h3>
            <p className="text-gray-400 text-sm">
              Send us an email and we'll respond within 2 hours.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSupport;