import { useEffect, useState } from "react";

const Game = () => {
  const [turn, setTurn] = useState(0);
  const [color, setColor] = useState([50, 50, 50, 255]);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setColor([
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255),
        Math.round(Math.random() * 255),
      ]);
    }, 200); // Runs every 1000ms (1 second)
    // Cleanup function to clear the interval when the component unmounts or dependencies change
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return (
    <>
      {" "}
      <div
        style={
          {
            "--tw-color": `${color[0]}, ${color[1]}, ${color[2]}`,
          } as React.CSSProperties
        }
        className="rounded-2xl p-10 bg-[rgb(var(--tw-color))]"
      >
        <h1 className=" p-10">{turn}</h1>
        <button
          className=""
          onClick={() => {
            setTurn(turn == 0 ? 1 : 0);
          }}
        >
          {"switch turn"}
        </button>
      </div>
    </>
  );
};

export default Game;
