// src/pages/AboutUs.jsx
import React from "react";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 text-center">
            <h1 className="text-4xl font-extrabold text-emerald-900">
              Hakkımızda
            </h1>
            <p className="mt-2 text-emerald-600 text-base">{/* intro */}</p>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Mission & Vision — aynı genişlik */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 border-l-4 border-emerald-500 text-center">
            <h2 className="text-3xl font-bold text-emerald-900 mb-6">
              Mission and Vision
            </h2>

            <div className="mb-8">
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">
                🎯 Mission
              </h3>
              <p className="text-gray-700 text-[15px] leading-relaxed">
                By establishing a trustless, transparent, and decentralized
                infrastructure, we aim to create a lasting value bridge between
                employers and developers. Our goal is to create a fair and
                efficient ecosystem, free from the constraints of traditional
                intermediary systems, where the rights of both parties are
                secured through smart contracts. This allows talented developers
                to access the opportunities they deserve in the global
                marketplace, while employers can confidently find the right
                talent.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-emerald-800 mb-3">
                🚀 Vision
              </h3>
              <p className="text-gray-700 text-[15px] leading-relaxed">
                To reshape the global talent market by building a decentralized
                and transparent ecosystem where every developer is fully
                compensated for their work and every employer has unwavering
                access to the right talent.
              </p>
            </div>
          </div>
        </div>

        {/* Values — aynı genişlik */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-emerald-900 mb-8">Values</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💡</span>
                </div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                  Innovation
                </h3>
                <p className="text-gray-700 text-[15px] leading-relaxed">
                  We view innovation as the most crucial element of our
                  decentralized structure. We bring a breath of fresh air to the
                  industry with transparent and secure smart contract
                  technologies that facilitate interaction between developers
                  and clients. By continuously developing next-generation
                  solutions, we aim to transform the market and elevate the user
                  experience to the highest level.
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                  Reliability
                </h3>
                <p className="text-gray-700 text-[15px] leading-relaxed">
                  Trust is at the core of our project, but we achieve this
                  through technology, not traditional methods. By transparently
                  recording all transactions on the blockchain, we create a
                  trustless environment between parties. This ensures every
                  transaction is verifiable and immutable, safeguarding both the
                  developer&apos;s effort and the employer&apos;s investment.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Our Team — aynı genişlik */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-emerald-900 mb-8">
              Our Team
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="text-center">
                <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="text-lg font-semibold text-emerald-800">
                  Arda Karahan
                </h3>
                <p className="text-sm text-emerald-600 mb-2">
                  Team Lead and Blockchain Developer
                </p>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  A third-year Computer Engineering student at Muğla Sıtkı
                  Koçman University. A software developer focusing on blockchain
                  and smart contracts.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="text-lg font-semibold text-emerald-800">
                  Hale Sezin Ozorman
                </h3>
                <p className="text-sm text-emerald-600 mb-2">
                  Frontend Developer and UX/UI Designer
                </p>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  A fourth-year student in the Department of Information Systems
                  Engineering at Muğla Sıtkı Koçman University. A passionate
                  front-end developer and UX/UI designer who prioritizes
                  aesthetics and usability.
                </p>
              </div>

              <div className="text-center">
                <div className="w-24 h-24 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl">👤</span>
                </div>
                <h3 className="text-lg font-semibold text-emerald-800">
                  Tuyan Alimler
                </h3>
                <p className="text-sm text-emerald-600 mb-2">
                  Frontend Developer
                </p>
                <p className="text-[13px] text-gray-600 leading-relaxed">
                  A third-year student in the Electrical and Electronics
                  Engineering Department at Muğla Sıtkı Koçman University. After
                  a summer front-end internship, now on the way to becoming a
                  developer—also a very talented designer.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info — aynı genişlik */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-emerald-900 mb-6">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">📍</span>
                </div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-1">
                  MSKU Engineering Faculty in Kotekli/Mugla.
                </h3>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl">📧</span>
                </div>
                <a
                  href="mailto:ieeemsku@gmail.com"
                  className="text-lg font-semibold text-emerald-800 mb-1 hover:underline"
                >
                  ieeemsku@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* CTA — aynı genişlik */}
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl shadow-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">Bizimle İletişime Geçin</h2>
            <p className="text-emerald-100 mb-6">
              Sorularınız mı var? Projeleriniz için bizimle çalışmak mı
              istiyorsunuz?
            </p>
            <a
              href="mailto:ieeemsku@gmail.com?subject=Freelandser%20Contact&body=Hello%20Freelandser%20team,"
              className="inline-block bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
            >
              İletişime Geç
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
