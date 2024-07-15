import React, { useState, useEffect } from 'react';
import './Grid.css';

const generateEmptyGrid = (rows, cols) => {
  const grid = [];
  for (let i = 0; i < rows; i++) {
    grid.push(Array.from(Array(cols), () => 0));
  }
  return grid;
};

const Grid = () => {
  const [numRows, setNumRows] = useState(30);
  const [numCols, setNumCols] = useState(65);
  const [grid, setGrid] = useState(generateEmptyGrid(numRows, numCols));
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(100);
  const [theme, setTheme] = useState('default');

  const themes = {
    default: { alive: 'black', dead: 'white' },
    dark: { alive: 'white', dead: 'black' },
    neon: { alive: 'lime', dead: 'purple' }
  };

  const runSimulation = () => {
    if (!running) return;

    setGrid(g => {
      const newGrid = g.map(arr => [...arr]);

      for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
          let neighbors = 0;
          const directions = [
            [0, 1], [0, -1], [1, 0], [-1, 0],
            [1, 1], [1, -1], [-1, 1], [-1, -1]
          ];

          directions.forEach(([x, y]) => {
            const newI = i + x;
            const newJ = j + y;

            if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
              neighbors += g[newI][newJ];
            }
          });

          if (g[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
            newGrid[i][j] = 0;
          } else if (g[i][j] === 0 && neighbors === 3) {
            newGrid[i][j] = 1;
          }
        }
      }

      return newGrid;
    });

    setTimeout(runSimulation, speed);
  };

  useEffect(() => {
    if (running) {
      runSimulation();
    }
  }, [running, speed]);

  const handleSetGridSize = () => {
    setRunning(false);
    setGrid(generateEmptyGrid(numRows, numCols));
  };

  return (
    <main>
      <header className="title">
        Conway's Game of Life
      </header>
      <section className="controls">
        <button 
          onClick={() => setRunning(!running)}
        >
          {running ? 'Stop' : 'Start'}
        </button>
        <button className="secondary"
          onClick={() => {
            const rows = [];
            for (let i = 0; i < numRows; i++) {
              rows.push(
                Array.from(Array(numCols), () => (Math.random() > 0.7 ? 1 : 0))
              );
            }
            setGrid(rows);
          }}
        >
          Random
        </button>
        <button className="clear"
          onClick={() => {
            setGrid(generateEmptyGrid(numRows, numCols));
          }}
        >
          Clear
        </button>
        <div>
          <label htmlFor="speed">Speed: </label>
          <input
            type="range"
            id="speed"
            min="10"
            max="1000"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="theme">Theme: </label>
          <select
            id="theme"
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="neon">Neon</option>
          </select>
        </div>
        <div>
          <label htmlFor="numRows">Rows: </label>
          <input
            type="number"
            id="numRows"
            value={numRows}
            onChange={(e) => setNumRows(Number(e.target.value))}
            min="1"
            max="100"
          />
          <label htmlFor="numCols">Cols: </label>
          <input
            type="number"
            id="numCols"
            value={numCols}
            onChange={(e) => setNumCols(Number(e.target.value))}
            min="1"
            max="100"
          />
          <button onClick={handleSetGridSize}>Set Grid Size</button>
        </div>
      </section>
    <div className='grid-container'>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${numCols}, 20px)` }}>
        {grid.map((rows, i) =>
          rows.map((col, k) => (
            <div
              key={`${i}-${k}`}
              onClick={() => {
                const newGrid = [...grid];
                newGrid[i][k] = grid[i][k] ? 0 : 1;
                setGrid(newGrid);
              }}
              className={`cell ${grid[i][k] ? 'alive' : ''}`}
              style={{
                backgroundColor: grid[i][k] ? themes[theme].alive : themes[theme].dead,
                borderColor: '#999'
              }}
            />
          ))
        )}
       </div>
      </div>
    </main>
  );
};

export default Grid;
