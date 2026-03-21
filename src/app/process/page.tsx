import Image from 'next/image';
import Link from 'next/link';

export default function ProcessPage() {
  const processSteps = [
    {
      number: '01',
      title: 'Initial Consultation',
      duration: '1-2 days',
      description: 'Meet with our team to discuss your vision, budget, and timeline. We\'ll walk through your property and understand your goals.',
      tasks: [
        'Site visit and evaluation',
        'Budget discussion',
        'Timeline estimation',
        'Design preferences review'
      ]
    },
    {
      number: '02',
      title: 'Design & Planning',
      duration: '2-4 weeks',
      description: 'Our design team creates detailed plans and 3D renderings. We\'ll refine the design based on your feedback.',
      tasks: [
        'Architectural drawings',
        '3D renderings',
        'Material selection',
        'Permit applications'
      ]
    },
    {
      number: '03',
      title: 'Pre-Construction',
      duration: '1-2 weeks',
      description: 'Finalize contracts, secure permits, and prepare the site. We\'ll establish a detailed project schedule.',
      tasks: [
        'Contract finalization',
        'Permit approval',
        'Material ordering',
        'Site preparation'
      ]
    },
    {
      number: '04',
      title: 'Construction Phase',
      duration: '3-6 months',
      description: 'Our experienced crew brings your vision to life with meticulous attention to detail and quality craftsmanship.',
      tasks: [
        'Foundation and framing',
        'Electrical and plumbing',
        'Interior finishing',
        'Quality inspections'
      ]
    },
    {
      number: '05',
      title: 'Final Walkthrough',
      duration: '1 day',
      description: 'We\'ll tour your completed project together, addressing any final touches and ensuring your complete satisfaction.',
      tasks: [
        'Detailed inspection',
        'Touch-up work',
        'Systems demonstration',
        'Warranty review'
      ]
    },
    {
      number: '06',
      title: 'Project Handover',
      duration: '1 day',
      description: 'Receive all documentation, warranties, and maintenance guides. Your dream space is ready to enjoy!',
      tasks: [
        'Documentation delivery',
        'Warranty activation',
        'Maintenance schedule',
        'Follow-up support'
      ]
    }
  ];

  const faqs = [
    {
      question: 'How long does a typical home renovation take?',
      answer: 'Project timelines vary based on scope. A kitchen remodel typically takes 6-12 weeks, while a full home renovation can take 3-6 months. We\'ll provide a detailed timeline during consultation.'
    },
    {
      question: 'Do you handle permits and inspections?',
      answer: 'Yes! We manage all necessary permits and coordinate with local inspectors throughout the project, ensuring everything meets Northern Colorado building codes.'
    },
    {
      question: 'Can I live in my home during construction?',
      answer: 'For many projects, yes. We\'ll work with you to minimize disruption and maintain livable spaces. For extensive renovations, temporary relocation may be recommended.'
    },
    {
      question: 'How do you handle project changes?',
      answer: 'We understand visions can evolve. Any changes are documented with updated costs and timelines before proceeding, ensuring transparency throughout.'
    },
    {
      question: 'What warranty do you provide?',
      answer: 'We stand behind our work with a comprehensive 2-year warranty on craftsmanship, plus manufacturer warranties on all materials and appliances.'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 to-slate-800 text-white pt-32 pb-20">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Process</h1>
          <p className="text-xl text-gray-300 max-w-2xl">
            From initial concept to final walkthrough, we guide you through every step of your construction journey with transparency and expertise.
          </p>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-4">Project Timeline</h2>
            <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
              Every project is unique, but our proven process ensures quality results on time and within budget.
            </p>

            <div className="space-y-12">
              {processSteps.map((step, index) => (
                <div key={index} className="flex gap-8 group">
                  {/* Number */}
                  <div className="flex-shrink-0 w-20">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-grow pb-12 border-l-2 border-gray-200 pl-8 relative">
                    <div className="absolute w-4 h-4 bg-blue-600 rounded-full -left-[9px] top-8"></div>

                    <div className="bg-gray-50 rounded-lg p-6 group-hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {step.duration}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-4">{step.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {step.tasks.map((task, taskIndex) => (
                          <div key={taskIndex} className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-sm text-gray-700">{task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quality Commitment */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Our Quality Commitment</h2>
            <p className="text-xl text-gray-600 mb-12">
              Every Kiefer Built project is backed by our unwavering commitment to excellence
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Licensed & Insured</h3>
                <p className="text-gray-600">Fully licensed Colorado contractor with comprehensive insurance coverage</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">On-Time Delivery</h3>
                <p className="text-gray-600">We respect your time with realistic schedules and consistent communication</p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">2-Year Warranty</h3>
                <p className="text-gray-600">Comprehensive warranty on all our craftsmanship for your peace of mind</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-lg font-bold mb-2 flex items-start gap-2">
                    <span className="text-blue-600 mt-1">Q:</span>
                    <span>{faq.question}</span>
                  </h3>
                  <p className="text-gray-600 pl-7">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss your vision and create something extraordinary together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-white text-slate-900 font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get Free Consultation
            </Link>
            <a
              href="tel:9705155059"
              className="inline-block px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-lg hover:bg-white hover:text-slate-900 transition-colors"
            >
              Call (970) 515-5059
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}