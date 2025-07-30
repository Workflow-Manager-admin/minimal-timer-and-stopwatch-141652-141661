import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// PUBLIC_INTERFACE
/**
 * Minimal Timer & Stopwatch App
 * A minimal, accessible timer and stopwatch with mode switch, start/pause/reset controls,
 * responsive design, and KAVIA brand colors.
 */
function App() {
  // 'timer' or 'stopwatch'
  const [mode, setMode] = useState('timer');
  // For timer: set duration (in seconds). For stopwatch: not used.
  const [timerDuration, setTimerDuration] = useState(5 * 60);
  // elapsed time (in seconds) for stopwatch, or remaining time for timer
  const [time, setTime] = useState(mode === 'timer' ? timerDuration : 0);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const intervalRef = useRef(null);

  // Reset time, pause, etc. when mode switches
  useEffect(() => {
    setIsRunning(false);
    setIsComplete(false);
    if (mode === 'timer') {
      setTime(timerDuration);
    } else {
      setTime(0);
    }
    // eslint-disable-next-line
  }, [mode]);

  // Keep current timerDuration on time if timer duration changed
  useEffect(() => {
    if (mode === 'timer') setTime(timerDuration);
    // eslint-disable-next-line
  }, [timerDuration]);

  // Timer/Stopwatch operation
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }
    intervalRef.current = setInterval(() => {
      setTime((prev) => {
        if (mode === 'timer') {
          if (prev <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            clearInterval(intervalRef.current);
            return 0;
          }
          return prev - 1;
        } else {
          // stopwatch
          return prev + 1;
        }
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line
  }, [isRunning, mode]);

  // Display time as MM:SS
  const formatTime = (t) => {
    const minutes = Math.floor(t / 60);
    const seconds = t % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  };

  // PUBLIC_INTERFACE
  const handleReset = () => {
    setIsRunning(false);
    setIsComplete(false);
    if (mode === 'timer') {
      setTime(timerDuration);
    } else {
      setTime(0);
    }
  };

  // PUBLIC_INTERFACE
  const handleStartPause = () => {
    setIsRunning((r) => !r);
  };

  // PUBLIC_INTERFACE
  const handleModeSwitch = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
  };

  // PUBLIC_INTERFACE
  const handleTimerInputChange = (e) => {
    // Allow only up to 99:59 (5999 seconds)
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    let numValue = Number(value);
    if (isNaN(numValue) || numValue < 0) numValue = 0;
    if (numValue > 5999) numValue = 5999;
    setTimerDuration(numValue);
  };

  // Display timerDuration input as MMSS for user edit
  const padInput = (n) => n.toString().padStart(4, '0');

  return (
    <main className="minimal-timer-outer" tabIndex={-1}>
      <section className="minimal-timer-inner" aria-label="Minimal Timer and Stopwatch">
        <h1 className="minimal-heading">🕑 Minimal Timer & Stopwatch</h1>
        <div className="minimal-mode-switch" role="tablist" aria-label="Switch timer or stopwatch">
          <button
            className={`minimal-mode-btn${mode === 'timer' ? ' active' : ''}`}
            aria-selected={mode === 'timer'}
            aria-label="Switch to timer"
            onClick={() => handleModeSwitch('timer')}
            tabIndex={0}
          >
            Timer
          </button>
          <button
            className={`minimal-mode-btn${mode === 'stopwatch' ? ' active' : ''}`}
            aria-selected={mode === 'stopwatch'}
            aria-label="Switch to stopwatch"
            onClick={() => handleModeSwitch('stopwatch')}
            tabIndex={0}
          >
            Stopwatch
          </button>
        </div>

        <div className="minimal-display" aria-live="polite">
          {mode === 'timer' ? (
            <div className="timer-block">
              <label htmlFor="timerInput" className="visually-hidden">
                Set duration in MMSS for timer
              </label>
              <input
                id="timerInput"
                className="duration-input"
                type="text"
                value={padInput(timerDuration)}
                maxLength={4}
                disabled={isRunning}
                pattern="[0-9]*"
                inputMode="numeric"
                onChange={handleTimerInputChange}
                aria-label="Set timer duration, MMSS"
              />
              <span className="display-value">{formatTime(time)}</span>
            </div>
          ) : (
            <span className="display-value">{formatTime(time)}</span>
          )}
        </div>

        <nav className="minimal-controls" aria-label="Timer controls">
          <button
            className={`control-btn start${isRunning ? ' running' : ''}`}
            aria-label={isRunning ? 'Pause' : 'Start'}
            onClick={handleStartPause}
            disabled={
              (mode === 'timer' && time === 0) || isComplete
            }
            tabIndex={0}
          >
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button
            className="control-btn reset"
            aria-label="Reset"
            onClick={handleReset}
            disabled={time === (mode === 'timer' ? timerDuration : 0) && !isComplete}
            tabIndex={0}
          >
            Reset
          </button>
        </nav>
        {mode === 'timer' && isComplete && (
          <div className="timer-complete-message" role="status">
            Time&apos;s up!
          </div>
        )}
        <footer className="minimal-footer" aria-label="Attribution">
          <span>
            Built with <span aria-label="love">💙</span> and React • KAVIA Minimal
          </span>
        </footer>
      </section>
    </main>
  );
}

export default App;
