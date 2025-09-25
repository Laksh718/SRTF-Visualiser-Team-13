import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./SRTFVisualization.css";

const SRTFVisualization = () => {
  // Process data
  const processes = [
    { id: "P1", arrivalTime: 0, burstTime: 7, color: "#3b82f6" }, // blue
    { id: "P2", arrivalTime: 2, burstTime: 4, color: "#10b981" }, // green
    { id: "P3", arrivalTime: 4, burstTime: 1, color: "#f59e0b" }, // orange
    { id: "P4", arrivalTime: 5, burstTime: 4, color: "#8b5cf6" }, // purple
  ];

  // Gantt chart data
  const ganttData = [
    { process: "P1", startTime: 0, endTime: 2 },
    { process: "P2", startTime: 2, endTime: 4 },
    { process: "P3", startTime: 4, endTime: 5 },
    { process: "P2", startTime: 5, endTime: 7 },
    { process: "P4", startTime: 7, endTime: 11 },
    { process: "P1", startTime: 11, endTime: 16 },
  ];

  // Timeline steps for animation
  const timelineSteps = [
    {
      time: 0,
      description: "Process P1 arrives at time 0 with burst time 7",
      running: "P1",
      readyQueue: [],
      completed: [],
      chartData: [{ time: 0, p1: 7, p2: 0, p3: 0, p4: 0 }],
    },
    {
      time: 2,
      description:
        "Process P2 arrives at time 2 with burst time 4. P2 has shorter remaining time than P1 (4 < 5), so P1 is preempted.",
      running: "P2",
      readyQueue: ["P1"],
      completed: [],
      chartData: [
        { time: 0, p1: 7, p2: 0, p3: 0, p4: 0 },
        { time: 2, p1: 5, p2: 4, p3: 0, p4: 0 },
      ],
    },
    {
      time: 4,
      description:
        "Process P3 arrives at time 4 with burst time 1. P3 has shortest remaining time (1 < 3), so P2 is preempted.",
      running: "P3",
      readyQueue: ["P1", "P2"],
      completed: [],
      chartData: [
        { time: 0, p1: 7, p2: 0, p3: 0, p4: 0 },
        { time: 2, p1: 5, p2: 4, p3: 0, p4: 0 },
        { time: 4, p1: 5, p2: 2, p3: 1, p4: 0 },
      ],
    },
    {
      time: 5,
      description:
        "Process P3 completes execution. P2 has shortest remaining time (3 < 5), so it resumes execution.",
      running: "P2",
      readyQueue: ["P1", "P4"],
      completed: ["P3"],
      chartData: [
        { time: 0, p1: 7, p2: 0, p3: 0, p4: 0 },
        { time: 2, p1: 5, p2: 4, p3: 0, p4: 0 },
        { time: 4, p1: 5, p2: 2, p3: 1, p4: 0 },
        { time: 5, p1: 5, p2: 2, p3: 0, p4: 0 },
      ],
    },
    {
      time: 7,
      description:
        "Process P2 completes execution. P4 has shortest remaining time (4 < 5), so it starts execution.",
      running: "P4",
      readyQueue: ["P1"],
      completed: ["P3", "P2"],
      chartData: [
        { time: 0, p1: 7, p2: 0, p3: 0, p4: 0 },
        { time: 2, p1: 5, p2: 4, p3: 0, p4: 0 },
        { time: 4, p1: 5, p2: 2, p3: 1, p4: 0 },
        { time: 5, p1: 5, p2: 2, p3: 0, p4: 0 },
        { time: 7, p1: 5, p2: 0, p3: 0, p4: 4 },
      ],
    },
    {
      time: 11,
      description:
        "Process P4 completes execution. P1 is the only remaining process, so it resumes execution.",
      running: "P1",
      readyQueue: [],
      completed: ["P3", "P2", "P4"],
      chartData: [
        { time: 0, p1: 7, p2: 0, p3: 0, p4: 0 },
        { time: 2, p1: 5, p2: 4, p3: 0, p4: 0 },
        { time: 4, p1: 5, p2: 2, p3: 1, p4: 0 },
        { time: 5, p1: 5, p2: 2, p3: 0, p4: 0 },
        { time: 7, p1: 5, p2: 0, p3: 0, p4: 4 },
        { time: 11, p1: 5, p2: 0, p3: 0, p4: 0 },
      ],
    },
    {
      time: 16,
      description:
        "Process P1 completes execution. All processes have finished.",
      running: null,
      readyQueue: [],
      completed: ["P3", "P2", "P4", "P1"],
      chartData: [
        { time: 0, p1: 7, p2: 0, p3: 0, p4: 0 },
        { time: 2, p1: 5, p2: 4, p3: 0, p4: 0 },
        { time: 4, p1: 5, p2: 2, p3: 1, p4: 0 },
        { time: 5, p1: 5, p2: 2, p3: 0, p4: 0 },
        { time: 7, p1: 5, p2: 0, p3: 0, p4: 4 },
        { time: 11, p1: 5, p2: 0, p3: 0, p4: 0 },
        { time: 16, p1: 0, p2: 0, p3: 0, p4: 0 },
      ],
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < timelineSteps.length - 1) {
      interval = setInterval(() => {
        setCurrentStep((prev) => prev + 1);
      }, 3000); // Change step every 3 seconds
    } else if (currentStep >= timelineSteps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep]);

  const handleNext = () => {
    if (currentStep < timelineSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const currentStepData = timelineSteps[currentStep];

  // Chart data for the current step
  const chartData = currentStepData.chartData || [];

  return (
    <div className="srtf-visualization landscape">
      {/* Header Section */}
      <div className="header-section">
        <h1>SRTF (Shortest Remaining Time First) CPU Scheduling</h1>
        <p className="subtitle">Preemptive Shortest Job First Algorithm</p>
      </div>

      {/* Main Content Area - Landscape Layout */}
      <div className="main-content">
        {/* Left Column - Process Table and Controls */}
        <div className="left-column">
          {/* Process Table */}
          <motion.div
            className="process-table"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
          >
            <h2>Process Information</h2>
            <table>
              <thead>
                <tr>
                  <th>Process</th>
                  <th>AT</th>
                  <th>BT</th>
                  <th>RT</th>
                  <th>CT</th>
                </tr>
              </thead>
              <tbody>
                {processes.map((process, index) => {
                  const stepData = timelineSteps[currentStep];
                  const completedProcess = stepData.completed.find(
                    (p) => p === process.id
                  );
                  const isRunning = stepData.running === process.id;

                  // Calculate remaining time
                  let remainingTime = process.burstTime;
                  let completionTime = "-";

                  // Update remaining time based on current step
                  if (currentStep >= 1) {
                    for (let i = 1; i <= currentStep; i++) {
                      const step = timelineSteps[i];
                      const prevStep = timelineSteps[i - 1];

                      if (step.running === process.id) {
                        remainingTime -= step.time - prevStep.time;
                      }
                    }
                  }

                  // Set completion time if process is completed
                  if (completedProcess) {
                    // Find completion time from timeline
                    for (let i = 0; i < timelineSteps.length; i++) {
                      if (
                        timelineSteps[i].completed.includes(process.id) &&
                        !timelineSteps[i - 1]?.completed.includes(process.id)
                      ) {
                        completionTime = timelineSteps[i].time;
                        break;
                      }
                    }
                  }

                  return (
                    <motion.tr
                      key={process.id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{
                        opacity: 1,
                        y: 0,
                        backgroundColor: isRunning
                          ? `${process.color}20`
                          : "transparent",
                      }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className={isRunning ? "running" : ""}
                      whileHover={{
                        scale: 1.02,
                        backgroundColor: `${process.color}10`,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <td>
                        <motion.span
                          className="process-id"
                          style={{ backgroundColor: process.color }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 300,
                            delay: index * 0.1,
                          }}
                          whileHover={{
                            scale: 1.2,
                            rotate: 360,
                            transition: { duration: 0.5 },
                          }}
                        >
                          {process.id}
                        </motion.span>
                      </td>
                      <td>{process.arrivalTime}</td>
                      <td>{process.burstTime}</td>
                      <td>
                        <motion.span
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                            color: remainingTime === 0 ? "#10b981" : "#ef4444",
                          }}
                          transition={{ delay: index * 0.1 + 0.2 }}
                        >
                          {completedProcess ? 0 : remainingTime}
                        </motion.span>
                      </td>
                      <td>
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.1 + 0.3 }}
                          style={{
                            color:
                              completionTime !== "-" ? "#10b981" : "#6b7280",
                            fontWeight:
                              completionTime !== "-" ? "bold" : "normal",
                          }}
                        >
                          {completionTime}
                        </motion.span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>

          {/* Controls */}
          <motion.div
            className="controls"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
          >
            <motion.button
              onClick={handlePrev}
              disabled={currentStep === 0}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Previous
            </motion.button>
            <motion.button
              onClick={togglePlay}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isPlaying ? "Pause" : "Play"}
            </motion.button>
            <motion.button
              onClick={handleNext}
              disabled={currentStep === timelineSteps.length - 1}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Next
            </motion.button>
            <motion.button
              onClick={handleReset}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset
            </motion.button>
          </motion.div>
        </div>

        {/* Right Column - Visualizations */}
        <div className="right-column">
          {/* Current Time Indicator */}
          <div className="time-indicator">
            <motion.h3
              key={currentStepData.time}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
              whileHover={{
                scale: 1.1,
                textShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
              }}
            >
              Current Time: {currentStepData.time}
            </motion.h3>
          </div>

          {/* Description */}
          <div className="description">
            <motion.p
              key={currentStep}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, type: "spring", stiffness: 100 }}
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
            >
              {currentStepData.description}
            </motion.p>
          </div>

          {/* Visualization Area */}
          <motion.div
            className="visualization-area"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {/* Ready Queue */}
            <motion.div
              className="ready-queue"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <h3>Ready Queue</h3>
              <div className="queue-container">
                <AnimatePresence>
                  {currentStepData.readyQueue.map((processId, index) => {
                    const process = processes.find((p) => p.id === processId);
                    return (
                      <motion.div
                        key={processId}
                        initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                          rotate: 0,
                          x: 0,
                        }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 180 }}
                        transition={{
                          duration: 0.5,
                          type: "spring",
                          stiffness: 300,
                        }}
                        whileHover={{
                          scale: 1.1,
                          boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
                          zIndex: 1,
                        }}
                        className="process-box queue"
                        style={{
                          backgroundColor: process.color,
                          boxShadow: `0 4px 15px ${process.color}40`,
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {processId}
                        <motion.div
                          className="pulse"
                          animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.7, 0.3, 0.7],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
                {currentStepData.readyQueue.length === 0 && (
                  <motion.div
                    className="empty-queue"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    Empty
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* CPU Execution */}
            <motion.div
              className="cpu-execution"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              <h3>CPU Execution</h3>
              <div className="cpu-container">
                {currentStepData.running ? (
                  <motion.div
                    key={currentStepData.running}
                    initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      rotate: 0,
                      y: [0, -15, 0],
                    }}
                    transition={{
                      duration: 0.7,
                      y: { repeat: Infinity, duration: 1.5 },
                      type: "spring",
                      stiffness: 200,
                    }}
                    whileHover={{
                      scale: 1.1,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
                    }}
                    className="process-box cpu"
                    style={{
                      backgroundColor: processes.find(
                        (p) => p.id === currentStepData.running
                      )?.color,
                      boxShadow: `0 8px 25px ${
                        processes.find((p) => p.id === currentStepData.running)
                          ?.color
                      }60`,
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {currentStepData.running}
                    <motion.div
                      className="pulse"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.7, 0.3, 0.7],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    className="cpu-idle"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    CPU Idle
                  </motion.div>
                )}
                <div className="cpu-icon">
                  <motion.div
                    className="cpu-body"
                    animate={{
                      boxShadow: currentStepData.running
                        ? `0 0 20px ${
                            processes.find(
                              (p) => p.id === currentStepData.running
                            )?.color
                          }80`
                        : "0 0 10px #9ca3af",
                    }}
                    transition={{ duration: 0.5 }}
                    whileHover={{
                      scale: 1.05,
                      rotate: [0, 2, 0, -2, 0],
                      transition: { duration: 0.5 },
                    }}
                  >
                    <div className="cpu-led"></div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Remaining Time Chart */}
          <motion.div
            className="remaining-time-chart"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <h3>Remaining Time Progress</h3>
            <div className="chart-container">
              <div className="chart-grid">
                {/* Y-axis labels */}
                <div className="y-axis">
                  {[0, 2, 4, 6, 8].map((value) => (
                    <motion.div
                      key={value}
                      className="y-label"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: value * 0.1 }}
                    >
                      {value}
                    </motion.div>
                  ))}
                </div>

                {/* Chart area */}
                <div className="chart-area">
                  {/* Grid lines */}
                  {[0, 2, 4, 6, 8].map((value) => (
                    <div
                      key={value}
                      className="grid-line"
                      style={{ bottom: `${(value / 8) * 100}%` }}
                    />
                  ))}

                  {/* Data lines for each process */}
                  {processes.map((process, processIndex) => {
                    const processKey = process.id.toLowerCase();
                    return (
                      <motion.div
                        key={process.id}
                        className="data-line"
                        style={{
                          borderColor: process.color,
                          boxShadow: `0 0 10px ${process.color}60`,
                        }}
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{
                          duration: 1.5,
                          delay: processIndex * 0.3,
                        }}
                      >
                        {chartData.map((point, index) => {
                          const value = point[processKey];

                          return (
                            <motion.div
                              key={index}
                              className="data-point"
                              style={{
                                left: `${(point.time / 16) * 100}%`,
                                bottom: `${(value / 8) * 100}%`,
                                backgroundColor: process.color,
                                border: `2px solid ${process.color}`,
                              }}
                              initial={{
                                scale: 0,
                                opacity: 0,
                              }}
                              animate={{
                                scale: value > 0 ? 1 : 0,
                                opacity: value > 0 ? 1 : 0,
                              }}
                              transition={{
                                duration: 0.5,
                                delay: index * 0.2,
                              }}
                              whileHover={{
                                scale: 1.5,
                                zIndex: 10,
                              }}
                            >
                              {value > 0 && (
                                <motion.div
                                  className="point-label"
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.2 + 0.3 }}
                                >
                                  {value}
                                </motion.div>
                              )}
                            </motion.div>
                          );
                        })}
                      </motion.div>
                    );
                  })}

                  {/* X-axis */}
                  <div className="x-axis">
                    {[0, 2, 4, 6, 8, 10, 12, 14, 16].map((time, index) => (
                      <motion.div
                        key={time}
                        className="x-label"
                        style={{ left: `${(time / 16) * 100}%` }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        {time}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="chart-legend">
                {processes.map((process, index) => (
                  <motion.div
                    key={process.id}
                    className="legend-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    whileHover={{ scale: 1.1 }}
                  >
                    <div
                      className="legend-color"
                      style={{ backgroundColor: process.color }}
                    />
                    <span>{process.id}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Enhanced Gantt Chart */}
          <motion.div
            className="gantt-chart"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3, duration: 0.8 }}
          >
            <h3>Gantt Chart</h3>
            <div className="gantt-container">
              {ganttData.map((item, index) => {
                const process = processes.find((p) => p.id === item.process);
                const isCompleted = currentStep > index;
                const isCurrent = currentStep === index;

                // Calculate width as percentage of total time (16 units)
                const widthPercentage =
                  ((item.endTime - item.startTime) / 16) * 100;

                return (
                  <motion.div
                    key={index}
                    className={`gantt-item ${isCompleted ? "completed" : ""} ${
                      isCurrent ? "current" : ""
                    }`}
                    style={{
                      backgroundColor: isCompleted
                        ? process.color
                        : isCurrent
                        ? `${process.color}80`
                        : "#e5e7eb",
                      width: `${widthPercentage}%`,
                    }}
                    initial={{
                      opacity: 0,
                      scale: 0.8,
                      height: "0px",
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                      height: "100px",
                      backgroundColor: isCompleted
                        ? process.color
                        : isCurrent
                        ? `${process.color}80`
                        : "#e5e7eb",
                    }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.2,
                      height: { duration: 0.5, delay: index * 0.2 },
                    }}
                    whileHover={{
                      scale: 1.05,
                      zIndex: 2,
                    }}
                  >
                    {/* Animated progress bar for current item */}
                    {isCurrent && (
                      <motion.div
                        className="gantt-progress"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 2 }}
                        style={{ backgroundColor: process.color }}
                      />
                    )}

                    <span className="process-label">{item.process}</span>
                    <span className="time-label">{item.startTime}</span>

                    {/* End time label */}
                    <span className="time-label end-time">{item.endTime}</span>
                  </motion.div>
                );
              })}
            </div>
            <div className="gantt-timeline">
              {[0, 2, 4, 5, 7, 11, 16].map((time, index) => (
                <motion.div
                  key={time}
                  className="timeline-marker"
                  style={{ left: `${(time / 16) * 100}%` }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {time}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SRTFVisualization;
