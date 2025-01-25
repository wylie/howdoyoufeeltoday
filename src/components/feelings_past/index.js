import React, { useContext } from "react";
import Feeling from "../feeling";
import { FeelingsContext } from "../feelings/FeelingsContext";
import "./styled.css";

const parseDateString = (dateString) => {
  if (dateString.includes('T')) {
    // Handle ISO date strings directly
    return new Date(dateString);
  }
  const [datePart, timePart] = dateString.split(' ');
  if (!datePart || !timePart) {
    return new Date(dateString); // Fallback to creating date directly
  }
  const [day, month, year] = datePart.split('/');
  if (!day || !month || !year) {
    return new Date(dateString); // Fallback to creating date directly
  }
  const paddedMonth = month.padStart(2, '0');
  const paddedDay = day.padStart(2, '0');
  const date = new Date(`${year}-${paddedMonth}-${paddedDay}T${timePart}`);
  return date;
};

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

const FeelingsPast = () => {
  const { feelings } = useContext(FeelingsContext);

  return (
    <div className="feelings_past" data-element="list">
      {feelings.map((feeling) => {
        const parsedDate = parseDateString(feeling.date);
        return (
          <div className="feeling-container" key={feeling.id}>
            <Feeling theme={"secondary"} kind={feeling.name} />
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

export default FeelingsPast;