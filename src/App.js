import React, { createContext, useState, useEffect } from "react";

// Create a context for feelings
const FeelingsContext = createContext();

const App = () => {
  // State to store feelings
  const [feelings, setFeelings] = useState([]);

  // Fetch feelings from the API on component mount
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

  // Component to render a feeling
  const Feeling = ({ element = "div", kind, children, ...feelingprops }) => {
    const Element = element;
    return (
      <Element
        className={`feeling ${kind} ${children ? null : 'padding'}`}
        children={children}
        styles={children ? null : '1rem'}
        {...feelingprops}
      />
    );
  };

  // Component to render buttons for each feeling
  const Feelings = () => {
    const feels = ["trust", "fear", "surprise", "sadness", "disgust", "anger", "anticipation", "joy"];

    // Handle click event to add a new feeling
    const handleClick = async (kind) => {
      try {
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

        const nextId = existingData.record.feelings.length > 0 
          ? Math.max(...existingData.record.feelings.map(f => f.id)) + 1 
          : 1;

        const currentDate = new Date().toISOString();

        const newEntry = {
          id: nextId,
          name: kind,
          date: currentDate
        };

        const updatedData = [...existingData.record.feelings, newEntry];

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

        setFeelings(updatedData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    return (
      <div className="choose-feeling">
        {feels.map((index) => (
          <Feeling 
            element="button" 
            type="button" 
            kind={index} 
            key={index} 
            children={index} 
            onClick={() => handleClick(index)} 
          />
        ))}
      </div>
    )
  };

  // Parse date string to Date object
  const parseDateString = (dateString) => {
    if (dateString.includes('T')) {
      return new Date(dateString);
    }
    const [datePart, timePart] = dateString.split(' ');
    if (!datePart || !timePart) {
      return new Date(dateString);
    }
    const [day, month, year] = datePart.split('/');
    if (!day || !month || !year) {
      return new Date(dateString);
    }
    const paddedMonth = month.padStart(2, '0');
    const paddedDay = day.padStart(2, '0');
    const date = new Date(`${year}-${paddedMonth}-${paddedDay}T${timePart}`);
    return date;
  };

  // Format Date object to readable string
  const formatDate = (date) => {
    const options = { 
      year: 'numeric', 
      month: 'numeric', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    };
    return date.toLocaleString('en-US', options);
  };

  // Component to render past feelings
  const FeelingsPast = () => {
    return (
      <div className="past-feelings" data-element="list">
        {feelings.map((feeling) => {
          const parsedDate = parseDateString(feeling.date);
          return (
            <div className="past-feelings-container" key={feeling.id}>
              <Feeling kind={feeling.name} />
              <div className="tooltip">
                {feeling.date ? (
                  <>
                    <p>{feeling.name}</p>
                    <p>{formatDate(parsedDate)}</p>
                  </>
                ) : (
                  feeling.name
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="wrap">
      <FeelingsContext.Provider value={{ feelings, setFeelings }}>
        <h2 className="heading">
          How Do You Feel Today?
        </h2>
        <Feelings />
        <h2 className="heading">
          Past Feelings
        </h2>
        <FeelingsPast />
      </FeelingsContext.Provider>
    </div>
  )
};

export default App;
