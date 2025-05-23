import Link from "next/link";
import { useState } from "react";

export const PolicyCheckBox = ({ payload }) => {
  const { isAcceptedPolicy, setIsAcceptedPrivacy } = payload || {};
  const [isAccepted, setIsAccepted] = useState(true);

  const handleToggle = () => {
    setIsAcceptedPrivacy(!isAcceptedPolicy);

    if (isAccepted) {
      sessionStorage.setItem("ivy-policy", "accepted");
    } else {
      sessionStorage.clear("ivy-policy");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full mx-4 transform transition-all duration-300 ease-out scale-100">
        {/* Header */}
        <div className="px-6 pt-6 pb-4">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              IVY Privacy Policy
            </h3>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Please review and accept our privacy policy to continue using our
            services.
          </p>
        </div>

        {/* Content */}
        <div className="px-6 pb-6">
          {/* Custom Checkbox */}
          <div
            className="flex items-start space-x-4 cursor-pointer group"
            onClick={() => setIsAccepted(!isAccepted)}
          >
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                id="policy-checkbox"
                checked={isAccepted}
                onClick={() => setIsAccepted(!isAccepted)}
                className="sr-only"
              />
              <div
                className={`
                w-5 h-5 rounded border-2 transition-all duration-200 ease-in-out
                ${
                  isAccepted
                    ? "bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500"
                    : "border-gray-300 dark:border-gray-600 group-hover:border-blue-400"
                }
              `}
              >
                <svg
                  className={`
                    w-3 h-3 text-white absolute top-0.5 left-0.5 transition-opacity duration-200
                    ${isAccepted ? "opacity-100" : "opacity-0"}
                  `}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            <label
              htmlFor=""
              className="space-x-1 text-sm text-gray-700 dark:text-gray-300 cursor-pointer leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-200"
            >
              <button
                className="cursor-pointer"
                onClick={() => setIsAccepted(!isAccepted)}
              >
                I have read and agree to the
              </button>
              <Link
                href={"/privacy-policy"}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline decoration-1 underline-offset-2"
              >
                Privacy Policy
              </Link>
              <span>and</span>
              <Link
                href="/terms-of-service"
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium underline decoration-1 underline-offset-2"
              >
                Terms of Service
              </Link>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mt-6">
            <button
              onClick={handleToggle}
              disabled={!isAccepted}
              className={`
                flex-1 py-2.5 px-4 rounded-xl font-medium text-sm transition-all duration-200
                ${
                  isAccepted
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 cursor-pointer"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                }
              `}
            >
              {isAccepted ? "Continue" : "Please accept to continue"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-2xl border-t border-gray-100 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center leading-relaxed">
            Your privacy is important to us. We use your data responsibly and
            transparently.
          </p>
        </div>
      </div>
    </div>
  );
};
