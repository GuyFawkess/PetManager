import React from "react";

const Button = ({text, handleClick}) => {
  return (
    <>
      <button 
      onClick={handleClick}
      className="px-2 py-1 my-6 bg-orange-400 text-white text-lg rounded-md">
        {text}
      </button>
    
    
    </>
  );
};

export default Button;
