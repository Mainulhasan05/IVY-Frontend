import Link from "next/link";
import React from "react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <a
            href="/"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Title Section */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-8 py-12 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Terms of Service
            </h1>
            <p className="text-purple-100 text-lg">
              Our terms and conditions for using our services
            </p>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-6 mb-8">
                <p className="text-purple-700 dark:text-purple-300 text-sm">
                  Please read these Terms of Service carefully before using our
                  services. By accessing or using our services, you agree to be
                  bound by these terms.
                </p>
              </div>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                      1
                    </span>
                  </span>
                  Acceptance of Terms
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-gray-600 dark:text-gray-300">
                  <p className="mb-4">
                    By accessing and using our services, you acknowledge that
                    you have read, understood, and agree to be bound by these
                    Terms of Service and all applicable laws and regulations. If
                    you do not agree with any of these terms, you are prohibited
                    from using or accessing our services.
                  </p>
                  <p>
                    These terms apply to all visitors, users, and others who
                    access or use our services, whether as a guest or registered
                    user.
                  </p>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                      2
                    </span>
                  </span>
                  Use License & Restrictions
                </h2>
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Permitted Uses
                    </h3>
                    <ul className="text-green-700 dark:text-green-300 text-sm space-y-1">
                      <li>
                        • Use our services for personal or commercial purposes
                        as intended
                      </li>
                      <li>
                        • Create an account and maintain accurate information
                      </li>
                      <li>
                        • Access and use our content for legitimate business
                        purposes
                      </li>
                      <li>• Share feedback and suggestions for improvement</li>
                    </ul>
                  </div>

                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <h3 className="font-semibold text-red-800 dark:text-red-200 mb-2 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Prohibited Uses
                    </h3>
                    <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                      <li>
                        • Violate any local, state, national, or international
                        law
                      </li>
                      <li>
                        • Transmit or procure the sending of any advertising or
                        promotional material without our prior written consent
                      </li>
                      <li>
                        • Impersonate or attempt to impersonate the company, a
                        company employee, another user, or any other person or
                        entity
                      </li>
                      <li>
                        • Engage in any other conduct that restricts or inhibits
                        anyone's use or enjoyment of our services
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                      3
                    </span>
                  </span>
                  User Accounts
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                      Account Registration
                    </h3>
                    <p className="text-blue-700 dark:text-blue-300 text-sm mb-3">
                      When you create an account with us, you must provide
                      information that is accurate, complete, and current at all
                      times.
                    </p>
                    <ul className="text-blue-600 dark:text-blue-400 text-sm space-y-1">
                      <li>• Valid email address required</li>
                      <li>• Strong password recommended</li>
                      <li>• Regular information updates</li>
                    </ul>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <h3 className="font-semibold text-orange-800 dark:text-orange-200 mb-2">
                      Account Security
                    </h3>
                    <p className="text-orange-700 dark:text-orange-300 text-sm mb-3">
                      You are responsible for safeguarding the password and for
                      maintaining the confidentiality of your account.
                    </p>
                    <ul className="text-orange-600 dark:text-orange-400 text-sm space-y-1">
                      <li>• Keep login credentials secure</li>
                      <li>• Notify us of unauthorized access</li>
                      <li>• Use two-factor authentication</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                      4
                    </span>
                  </span>
                  Privacy Policy
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-gray-600 dark:text-gray-300">
                  <p className="mb-4">
                    Your privacy is important to us. Our Privacy Policy explains
                    how we collect, use, and protect your information when you
                    use our services. By using our services, you agree to the
                    collection and use of information in accordance with our
                    Privacy Policy.
                  </p>
                  <div className="flex items-center text-blue-600 dark:text-blue-400">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                    <a href="/privacy-policy" className="hover:underline">
                      View our Privacy Policy
                    </a>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                      5
                    </span>
                  </span>
                  Payment Terms
                </h2>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-gray-600 dark:text-gray-300">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Billing and Subscription
                    </h3>
                    <p className="mb-4">
                      Some of our services may be provided for a fee. You agree
                      to pay all fees and charges incurred in connection with
                      your account in accordance with the fees, charges, and
                      billing terms in effect at the time the fee or charge
                      becomes payable.
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                          Payment Processing
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Secure payment processing</li>
                          <li>• Multiple payment methods accepted</li>
                          <li>• Automatic billing for subscriptions</li>
                          <li>• Invoice history available</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">
                          Refund Policy
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• 30-day money-back guarantee</li>
                          <li>• Pro-rated refunds available</li>
                          <li>• Cancellation anytime</li>
                          <li>• No hidden fees</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                      6
                    </span>
                  </span>
                  Intellectual Property Rights
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-gray-600 dark:text-gray-300">
                  <p className="mb-4">
                    The service and its original content, features, and
                    functionality are and will remain the exclusive property of
                    our company and its licensors. The service is protected by
                    copyright, trademark, and other laws.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Our Rights
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>• All content and materials are our property</li>
                        <li>• Trademarks and logos are protected</li>
                        <li>• Technology and processes are proprietary</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Your Rights
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>• Limited license to use our services</li>
                        <li>• You retain rights to your own content</li>
                        <li>• Fair use of our materials permitted</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                      7
                    </span>
                  </span>
                  Disclaimers and Limitation of Liability
                </h2>
                <div className="space-y-4">
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                    <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2 flex items-center">
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Service Disclaimer
                    </h3>
                    <p className="text-yellow-700 dark:text-yellow-300 text-sm">
                      Our services are provided on an "as is" and "as available"
                      basis. We make no representations or warranties of any
                      kind, express or implied, regarding the use or results of
                      our services.
                    </p>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-gray-600 dark:text-gray-300">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                      Limitation of Liability
                    </h3>
                    <p className="text-sm">
                      In no event shall our company, its directors, employees,
                      partners, agents, suppliers, or affiliates be liable for
                      any indirect, incidental, special, consequential, or
                      punitive damages, including without limitation loss of
                      profits, data, use, goodwill, or other intangible losses.
                    </p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                      8
                    </span>
                  </span>
                  Termination
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 text-gray-600 dark:text-gray-300">
                  <p className="mb-4">
                    We may terminate or suspend your account and bar access to
                    the service immediately, without prior notice or liability,
                    under our sole discretion, for any reason whatsoever,
                    including without limitation if you breach the Terms.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Reasons for Termination
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>• Violation of terms</li>
                        <li>• Fraudulent activity</li>
                        <li>• Abusive behavior</li>
                        <li>• Non-payment of fees</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Upon Termination
                      </h3>
                      <ul className="text-sm space-y-1">
                        <li>• Access immediately revoked</li>
                        <li>• Data may be deleted</li>
                        <li>• Outstanding fees still due</li>
                        <li>• Terms survive termination</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                      9
                    </span>
                  </span>
                  Changes to Terms
                </h2>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                  <p className="text-blue-800 dark:text-blue-200 mb-4">
                    We reserve the right, at our sole discretion, to modify or
                    replace these Terms at any time. If a revision is material,
                    we will provide at least 30 days notice prior to any new
                    terms taking effect.
                  </p>
                  <div className="flex items-start space-x-3">
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">
                        How You'll Be Notified
                      </h3>
                      <p className="text-blue-700 dark:text-blue-300 text-sm">
                        We'll send email notifications and post updates on our
                        website. Continued use of our services after changes
                        constitutes acceptance of the new terms.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-purple-600 dark:text-purple-400 font-bold text-sm">
                      10
                    </span>
                  </span>
                  Contact Information
                </h2>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-6">
                  <p className="text-purple-800 dark:text-purple-200 mb-4">
                    If you have any questions about these Terms of Service,
                    please contact us using the information below.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center text-purple-700 dark:text-purple-300">
                        <svg
                          className="w-5 h-5 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm">infoexpress@vyrtium.com</span>
                      </div>
                      <div className="flex items-center text-purple-700 dark:text-purple-300">
                        <svg
                          className="w-5 h-5 mr-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <span className="text-sm">+57 320 481 7387</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start text-purple-700 dark:text-purple-300">
                        <svg
                          className="w-5 h-5 mr-3 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <div className="text-sm">
                          10115 KESSLER COVE LANE. KATY, TX 77494. U.S.A.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {new Date().getFullYear()} Vyrtium Marketing. All rights
              reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                href="/terms-of-service"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy-policy"
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
