
import React from 'react';

const FeaturedIn: React.FC = () => {
  const logos = [
    { 
      name: "News 24", 
      src: "https://upload.wikimedia.org/wikipedia/en/thumb/2/23/News24_Bangladesh_Logo.svg/512px-News24_Bangladesh_Logo.svg.png",
      height: "h-12"
    },
    { 
      name: "Somoy TV", 
      src: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/Somoy_TV_Logo.svg/512px-Somoy_TV_Logo.svg.png",
      height: "h-12"
    },
    { 
      name: "Prothom Alo", 
      src: "https://upload.wikimedia.org/wikipedia/en/thumb/3/36/Prothom_Alo_logo.svg/512px-Prothom_Alo_logo.svg.png",
      height: "h-12"
    },
    { 
      name: "Daily Star", 
      src: "https://upload.wikimedia.org/wikipedia/en/thumb/5/52/The_Daily_Star_Logo.svg/512px-The_Daily_Star_Logo.svg.png",
      height: "h-10"
    },
    { 
      name: "Bdjobs", 
      src: "https://upload.wikimedia.org/wikipedia/en/3/3d/Bdjobs.com_logo.png",
      height: "h-12"
    },
  ];

  return (
    <div className="border-y border-gray-100 bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-gray-500 text-sm font-semibold uppercase tracking-wider mb-8">
          আমাদেরকে ফিচার করা হয়েছে:
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-14">
            {logos.map((logo, idx) => (
                <div key={idx} className="flex items-center justify-center opacity-70 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500 cursor-pointer">
                    <img 
                      src={logo.src} 
                      alt={logo.name} 
                      className={`${logo.height} w-auto object-contain`}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Fallback if image fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.parentElement!.innerHTML = `<span class="font-bold text-gray-400 text-lg">${logo.name}</span>`;
                      }}
                    />
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedIn;
