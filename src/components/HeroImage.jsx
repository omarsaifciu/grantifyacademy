import React from 'react';

const HeroImage = () => {
  const placeholder = 'data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 800 600%22><rect width=%22800%22 height=%22600%22 fill=%22%23e5e7eb%22/></svg>';
  return (
    <div className='flex justify-center items-center'>
      <img 
        src='https://imagedelivery.net/LqiWLm-3MGbYHtFuUbcBtA/119580eb-abd9-4191-b93a-f01938786700/public' 
        alt='Hostinger Horizons' 
        referrerPolicy='no-referrer'
        onError={(e) => { e.currentTarget.src = placeholder; }}
      />
    </div>
  );
};

export default HeroImage;