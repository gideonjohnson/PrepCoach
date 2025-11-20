'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import { toast } from 'react-hot-toast';

function ContactForm() {
  const searchParams = useSearchParams();
  const position = searchParams.get('position');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: position ? 'career' : '',
    message: position ? `I would like to apply for the ${position} position.\n\n` : '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (you can replace this with actual API call)
    setTimeout(() => {
      toast.success('Message sent! We&apos;ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50">
      <Header />

      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Get in <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-xl text-gray-600">
              Have a question? We&apos;d love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="feature">Feature Request</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="career">Job Application</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              {/* Email */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-2xl flex-shrink-0">
                    📧
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                    <p className="text-gray-600 text-sm">Get in touch via email</p>
                    <a href="mailto:gideonbosiregj@gmail.com" className="text-orange-500 hover:text-orange-600 font-medium mt-2 block">
                      gideonbosiregj@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Help Center */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-2xl flex-shrink-0">
                    ❓
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Help Center</h3>
                    <p className="text-gray-600 text-sm">Find answers to common questions</p>
                    <Link href="/help" className="text-blue-500 hover:text-blue-600 font-medium mt-2 block">
                      Visit Help Center →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white text-2xl flex-shrink-0">
                    🌐
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Follow Us</h3>
                    <p className="text-gray-600 text-sm mb-3">Stay updated with the latest</p>
                    <div className="flex gap-3">
                      <a href="https://x.com/prep_coach" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition">
                        <span className="text-sm">𝕏</span>
                      </a>
                      <a href="https://www.linkedin.com/in/enggidpro/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition">
                        <span className="text-sm">in</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="font-semibold mb-2">⚡ Quick Response</h3>
                <p className="text-sm opacity-90">
                  We typically respond within 24 hours during business days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <ContactForm />
    </Suspense>
  );
}
