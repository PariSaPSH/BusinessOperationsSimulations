Supply Chain Shipping Game (Optimization Simulator)

Overview
Interactive web based simulator for a classic supply chain optimization problem. Users decide shipment quantities between plants and markets while minimizing cost and satisfying capacity, labor, and demand constraints.

This tool combines linear programming intuition with real time visual feedback and scenario analysis.

---

Key Features

* Interactive network flow visualization
* Real time cost calculation
* Automatic feasibility validation
* Constraint tracking (supply, labor, demand)
* Built-in optimal solution solver
* Scenario (what-if) analysis with sliders
* Trial history tracking

---

Model

Decision variables:

* x11: Phoenix → Chicago
* x12: Phoenix → Houston
* x21: Atlanta → Chicago
* x22: Atlanta → Houston

Objective:
Minimize total cost

Constraints:

* Plant capacities
* Labor-hour limits
* Market demand satisfaction
* Non-negativity

---

What-If Analysis

Test how optimal decisions change under:

* Demand fluctuations
* Capacity changes
* Labor constraints

This allows exploration of bottlenecks, trade offs, and system sensitivity.

---

How to Use

1. Enter shipment quantities
2. Check feasibility and cost
3. Click “Solve Optimal” for the best solution
4. Use sliders to explore scenarios
5. Record and compare different strategies

---

How to Run

Open the HTML file in any browser.
No setup required.

---

Technologies

HTML, CSS, JavaScript

---

Purpose

Designed for teaching and demonstrating:

* Supply chain optimization
* Linear programming concepts
* Managerial decision making under constraints
* Interactive learning through simulation
