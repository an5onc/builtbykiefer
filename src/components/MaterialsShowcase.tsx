'use client';

import { useState } from 'react';

type Material = {
  category: string;
  items: {
    name: string;
    brand: string;
    benefits: string[];
    image: string;
  }[];
};

const materials: Material[] = [
  {
    category: 'Flooring',
    items: [
      {
        name: 'Luxury Vinyl Plank',
        brand: 'COREtec & Shaw',
        benefits: ['Waterproof', 'Scratch resistant', 'Pet-friendly', '25-year warranty'],
        image: '/images/materials/lvp.jpg'
      },
      {
        name: 'Hardwood',
        brand: 'Bruce & Mohawk',
        benefits: ['Timeless appeal', 'Adds home value', 'Can be refinished', 'Natural beauty'],
        image: '/images/materials/hardwood.jpg'
      },
      {
        name: 'Porcelain Tile',
        brand: 'Daltile & American Olean',
        benefits: ['Extremely durable', 'Water resistant', 'Easy maintenance', 'Design versatility'],
        image: '/images/materials/tile.jpg'
      }
    ]
  },
  {
    category: 'Countertops',
    items: [
      {
        name: 'Quartz',
        brand: 'Caesarstone & Silestone',
        benefits: ['Non-porous', 'Stain resistant', 'Low maintenance', 'Consistent patterns'],
        image: '/images/materials/quartz.jpg'
      },
      {
        name: 'Granite',
        brand: 'Natural Stone',
        benefits: ['Heat resistant', 'Unique patterns', 'Increases value', 'Extremely durable'],
        image: '/images/materials/granite.jpg'
      },
      {
        name: 'Butcher Block',
        brand: 'John Boos & Lumber Liquidators',
        benefits: ['Warm aesthetic', 'Eco-friendly', 'Can be sanded', 'Antibacterial'],
        image: '/images/materials/butcher-block.jpg'
      }
    ]
  },
  {
    category: 'Cabinetry',
    items: [
      {
        name: 'Shaker Style',
        brand: 'KraftMaid & Merillat',
        benefits: ['Timeless design', 'Versatile finish options', 'Clean lines', 'Wide availability'],
        image: '/images/materials/shaker.jpg'
      },
      {
        name: 'Modern Flat Panel',
        brand: 'IKEA & Custom',
        benefits: ['Sleek appearance', 'Space efficient', 'Contemporary look', 'Easy to clean'],
        image: '/images/materials/modern.jpg'
      },
      {
        name: 'Raised Panel',
        brand: 'Thomasville & Diamond',
        benefits: ['Traditional elegance', 'Adds depth', 'Premium appearance', 'Classic appeal'],
        image: '/images/materials/raised.jpg'
      }
    ]
  },
  {
    category: 'Exterior',
    items: [
      {
        name: 'Fiber Cement Siding',
        brand: 'James Hardie',
        benefits: ['Fire resistant', '50-year warranty', 'Low maintenance', 'Weather resistant'],
        image: '/images/materials/hardie.jpg'
      },
      {
        name: 'Stone Veneer',
        brand: 'Cultured Stone & Eldorado',
        benefits: ['Natural appearance', 'Increases curb appeal', 'Durable', 'Energy efficient'],
        image: '/images/materials/stone.jpg'
      },
      {
        name: 'Composite Decking',
        brand: 'Trex & TimberTech',
        benefits: ['No splinters', 'Fade resistant', '25-year warranty', 'Low maintenance'],
        image: '/images/materials/composite.jpg'
      }
    ]
  }
];

export default function MaterialsShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string>(materials[0].category);

  const currentMaterials = materials.find(m => m.category === selectedCategory);

  return (
    <section className="py-16 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Quality Materials We Trust
          </h2>
          <p className="text-lg text-gray-600">
            We partner with industry-leading suppliers to bring you the best materials for your project
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {materials.map(material => (
            <button
              key={material.category}
              onClick={() => setSelectedCategory(material.category)}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                selectedCategory === material.category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {material.category}
            </button>
          ))}
        </div>

        {/* Materials Grid */}
        {currentMaterials && (
          <div className="grid md:grid-cols-3 gap-8">
            {currentMaterials.items.map((item, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Material Image Placeholder */}
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl opacity-50">🏗️</span>
                  </div>
                </div>

                {/* Material Info */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-blue-600 font-medium mb-4">
                    {item.brand}
                  </p>

                  {/* Benefits */}
                  <ul className="space-y-2">
                    {item.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <svg
                          className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Quality Promise */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Our Quality Promise
          </h3>
          <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
            We only use materials that meet our strict quality standards. Every product is selected for durability, aesthetic appeal, and value. We&apos;ll help you choose the perfect materials for your budget and style.
          </p>
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span className="text-gray-700">Licensed Suppliers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span className="text-gray-700">Warranty Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span className="text-gray-700">Colorado Climate Tested</span>
            </div>
          </div>
          <a
            href="/contact"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Discuss Your Material Options
          </a>
        </div>
      </div>
    </section>
  );
}