# CPU Scheduling Animation (SRTF – Preemptive SJF)

## Project Overview
This project demonstrates **Shortest Remaining Time First (SRTF)** scheduling (also known as Preemptive Shortest Job First).  
It includes:
- Process scheduling table
- Step-by-step Gantt chart filling animation
- Calculation of Response Time, Completion Time, Turnaround Time (TAT), and Waiting Time.

The example used:

| Process | Arrival Time | Burst Time |
|---------|--------------|------------|
| P1      | 0            | 7          |
| P2      | 2            | 4          |
| P3      | 4            | 1          |
| P4      | 5            | 4          |

---

## Animation Flow
The animation shows how the Gantt chart is filled step by step:

1. **Time 0–2:** P1 starts execution.  
2. **Time 2:** P2 arrives → Preempts P1 (shorter remaining time).  
3. **Time 4:** P3 arrives → Preempts P2 (shortest burst).  
4. **Time 5:** P3 finishes → P2 resumes until time 7.  
5. **Time 5:** P4 arrives and starts after P2 completes.  
6. **Time 7–11:** P4 executes fully.  
7. **Time 11–16:** P1 resumes and completes.  

Final Gantt Chart:


---

## Scheduling Table

| Process | Arrival Time | Burst Time | Completion Time | TAT | Waiting Time | Response Time |
|---------|--------------|------------|-----------------|-----|--------------|---------------|
| P1      | 0            | 7          | 16              | 16  | 9            | 0             |
| P2      | 2            | 4          | 7               | 5   | 1            | 0             |
| P3      | 4            | 1          | 5               | 1   | 0            | 0             |
| P4      | 5            | 4          | 11              | 6   | 2            | 2             |

---

## Features
- Demonstrates Preemptive SJF (SRTF) scheduling.
- Step-by-step Gantt chart animation.
- Automatically updates process table values.
- Educational visualization for Operating Systems concepts.

---
