Project Management Network Simulator (CPM + Crashing)

Overview
This is an interactive project management simulator that combines Critical Path Method (CPM), scheduling, and cost analysis in one tool.

It allows users to build a project network, compute ES, EF, LS, LF, and simulate project execution over time with cost and penalty tracking.

---

What This Tool Does

* Builds an Activity-on-Node (AON) project network
* Calculates:

  * ES (Earliest Start)
  * EF (Earliest Finish)
  * LS (Latest Start)
  * LF (Latest Finish)
  * Slack
  * Critical Path
* Visualizes the network dynamically
* Simulates project progress over time
* Tracks costs, penalties, and budget
* Allows crashing (reducing activity duration at a cost)

---

Key Features

* Automatic network generation from input table
* Drag-and-drop interactive network visualization
* Real-time CPM calculations
* Critical path highlighting
* Time-based simulation (day by day progress)
* Cost tracking:

  * committed cost
  * accrued cost
  * penalty for delays
* Budget and deadline constraints
* Crashing decisions to reduce project duration

---

Project Model

Each activity has:

* Duration
* Predecessors
* Minimum duration (crash limit)
* Normal cost
* Crash cost

The system calculates:

Forward Pass
ES → EF

Backward Pass
LF → LS

Slack
= LS − ES

Critical activities have zero slack.

---

Simulation Logic

During simulation:

* Activities start when predecessors are completed
* Progress accumulates over time
* Costs are accrued gradually
* If project exceeds deadline → penalty is added
* Project ends when all activities are completed

---

Crashing

Users can reduce activity duration (at a cost):

* Each crash reduces duration by 1 unit
* Additional cost is incurred
* CPM is recalculated dynamically
* Helps explore trade-off between time and cost

---

What You Can Analyze

* How project duration is determined by the critical path
* What happens when you shorten (crash) activities
* Cost vs time trade-offs
* Effect of budget constraints
* Impact of deadlines and penalties
* How delays propagate through the network
* Resource and schedule sensitivity

---

How to Run

Open the HTML file in your browser:


Then:

1. Set number of activities
2. Define:

   * durations
   * predecessors
   * costs
3. Generate the network
4. Start simulation
5. Optionally crash activities to reduce project time

---

Technologies

HTML
CSS
JavaScript
SVG (for network visualization)

---

Purpose

This project was created to:

* Teach CPM and project scheduling interactively
* Combine theory (ES, EF, LS, LF) with simulation
* Show dynamic behavior of project execution
* Illustrate time–cost trade-offs in project management
* Demonstrate how optimization and scheduling logic can be implemented in software
