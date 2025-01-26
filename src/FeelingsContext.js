import React, { createContext, useState, useEffect } from 'react';

export const FeelingsContext = createContext();

export const FeelingsProvider = ({ children }) => {
  const [feelings, setFeelings] = useState([]);

  useEffect(() => {
    const fetchFeelings = async () => {
      try {
        const response = await fetch('https://api.jsonbin.io/v3/b/671cdf95e41b4d34e4491863/latest', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "X-Master-Key": process.env.REACT_APP_API_KEY
          }
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Network response was not ok: ${response.status} - ${errorText}`);
        }
        const data = await response.json();
        setFeelings(data.record.feelings);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchFeelings();
  }, []);

  return (
    <FeelingsContext.Provider value={{ feelings, setFeelings }}>
      {children}
    </FeelingsContext.Provider>
  );
};
