import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const courseName = searchParams.get('course');
  const redirectPath = searchParams.get('redirect') || '/student/dashboard';

  useEffect(() => {
    // Auto redirect after 3 seconds
    const timer = setTimeout(() => {
      // Add a parameter to indicate we're coming from payment success
      navigate(`${redirectPath}?fromPayment=success`, { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate, redirectPath]);

  const handleRedirectNow = () => {
    navigate(`${redirectPath}?fromPayment=success`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <div className="mb-6">
          <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        
        {courseName && (
          <p className="text-gray-600 mb-6">
            You have successfully enrolled in <strong>{courseName}</strong>
          </p>
        )}
        
        <p className="text-gray-600 mb-6">
          You will be redirected to your dashboard in a few seconds...
        </p>
        
        <button
          onClick={handleRedirectNow}
          className="bg-yellow-400 hover:bg-[#473391] text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Go to Dashboard Now
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;