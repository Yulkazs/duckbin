import React from 'react';

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-24 h-24 animate-pulse-fade">
        <img 
          src="/svg/duckbin.svg" 
          alt="Loading..." 
          className="w-full h-full"
        />
      </div>

      <style jsx>{`
        @keyframes pulseFade {
          0% { opacity: 0.3; }
          50% { opacity: 1; }
          100% { opacity: 0.3; }
        }

        .animate-pulse-fade {
          animation: pulseFade 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export { Loading };
export default Loading;
