import React from 'react';

const FooterComponent = () => {
  return (
    <footer 
      style={{ 
        background: 'linear-gradient(to bottom, rgb(0,0,0,0.2), rgba(0, 0, 0, 0.1))',
        width: '100%',
        height: '10rem',
        padding: '16px 24px',
        marginTop: 'auto',
        display:'flex',
        justifyContent:'center',
        textAlign:'center',
        alignItems:'center',
        
      }}
    >
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center">
          <img style={{ 
        
        width: '50px',
        height: '50px'
        
        
        
      }}
            src="/logo.png" 
            alt="Movie App Logo" 
            
            onError={(e) => {
              // Fallback if logo.png doesn't exist
              e.target.style.display = 'none';
            }}
          />
          <div className="text-gray-700 text-sm font-medium">
            CineSearch
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-gray-500 text-sm">
          © This is for educational purposes only<br /> Used for another project named Bhale Chithram
        </div>
      </div>

    </footer>
  );
};

export default FooterComponent;