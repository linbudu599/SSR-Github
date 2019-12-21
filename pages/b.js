import React, { useState, useEffect, useRef } from "react";

export default () => {
  const [name, setName] = useState("linbudu");
  const [count, setCount] = useState(0);

  const inputRef = useRef();

  useEffect(() => {
    console.log("effect on");
    console.log(inputRef);
    return () => {
      console.log("effect destroyed");
    };
  });

  return (
    <>
      <input
        ref={inputRef}
        value={name}
        onChange={e => {
          setName(e.target.value);
        }}
      />
      <button
        onClick={() => {
          console.log("1");
          setCount(count + 1);
        }}
      >
        {count}
      </button>
    </>
  );
};
