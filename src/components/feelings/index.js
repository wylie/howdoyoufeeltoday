import React, { useContext } from "react";
import Feeling from "../feeling";
import { FeelingsContext } from "./FeelingsContext";
import "./styled.css";

const Feelings = () => {
  const { setFeelings } = useContext(FeelingsContext);
  const feels = ["trust", "fear", "surprise", "sadness", "disgust", "anger", "anticipation", "joy"];

  const handleClick = async (kind) => {
    try {
      // Fetch existing data
      const getResponse = await fetch('https://api.jsonbin.io/v3/b/671cdf95e41b4d34e4491863/latest', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "X-Master-Key": process.env.REACT_APP_API_KEY
        }
      });
      if (!getResponse.ok) {
        const errorText = await getResponse.text();
        throw new Error(`Network response was not ok: ${getResponse.status} - ${errorText}`);
      }
      const existingData = await getResponse.json();

      // Determine the next ID
      const nextId = existingData.record.feelings.length > 0 
        ? Math.max(...existingData.record.feelings.map(f => f.id)) + 1 
        : 1;

      // Get current date and time in ISO 8601 format
      const currentDate = new Date().toISOString();

      // Create new data entry
      const newEntry = {
        id: nextId,
        name: kind,
        date: currentDate
      };

      // Append new data
      const updatedData = [...existingData.record.feelings, newEntry];

      // Update bin with new data
      const putResponse = await fetch('https://api.jsonbin.io/v3/b/671cdf95e41b4d34e4491863', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "X-Master-Key": process.env.REACT_APP_API_KEY
        },
        body: JSON.stringify({ feelings: updatedData })
      });
      if (!putResponse.ok) {
        const errorText = await putResponse.text();
        throw new Error(`Network response was not ok: ${putResponse.status} - ${errorText}`);
      }
      const data = await putResponse.json();
      console.log('Success:', data);

      // Update local state
      setFeelings(updatedData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="feels">
      {feels.map((index) => (
        <Feeling 
          element="button" 
          type="button" 
          theme={"primary"} 
          kind={index} 
          key={index} 
          children={index} 
          onClick={() => handleClick(index)} 
        />
      ))}
    </div>
  )
};

export default Feelings;