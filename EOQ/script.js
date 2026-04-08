let isPaused = true,
    autoOrder = false,
    stock,
    time,
    lostCustomers,
    pending,
    totalAccruedCost,
    totalRevenue,
    totalSalesUnits = 0,
    currentProcHit = 0,
    charts = {},
    engineTimeout = null;

function startMission() {
    document.getElementById('overlay').style.display = 'none';
    isPaused = false;
    resetSim();
}

function resetSim() {
    if (engineTimeout) clearTimeout(engineTimeout);

    const D = parseFloat(document.getElementById('inD').value) || 0;
    const LT = parseFloat(document.getElementById('inLT').value) || 0;
    const Q = parseFloat(document.getElementById('inQ').value) || 1;
    // const initialROP = D * LT;
    const initialROP = D * (LT % (Q / D));

    stock = parseFloat(document.getElementById('inInit').value) || 0;
    time = 0;
    lostCustomers = 0;
    currentProcHit = 0;
    totalAccruedCost = 0;
    totalRevenue = 0;
    totalSalesUnits = 0;
    pending = [];

    document.getElementById('dayCounter').innerText = "DAY 0";
    document.getElementById('stockVal').innerText = stock;
    document.getElementById('totalCostVal').innerText = "$0";
    document.getElementById('totalRevVal').innerText = "$0";
    document.getElementById('salesVal').innerText = "0";
    document.getElementById('lostVal').innerText = "0";
    document.getElementById('profitVal').innerText = "$0";
    document.getElementById('ropVal').innerText = Math.round(initialROP);
    document.getElementById('shipCount').innerText = "Shipments Pending: 0";

    Object.values(charts).forEach(c => {
        c.data.labels = ["0.0"];
        c.data.datasets.forEach(ds => ds.data = []);
    });

    charts.inv.data.datasets[0].data.push(stock.toFixed(1));
    charts.inv.data.datasets[1].data.push(initialROP.toFixed(1));

    Object.values(charts).forEach(c => c.update());

    if (!isPaused) {
        engine();
    }
}

const opt = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    scales: {
        x: {
            display: true,
            grid: { display: false },
            ticks: { maxTicksLimit: 8, color: '#94a3b8', font: { size: 9 } }
        },
        y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            ticks: { color: '#1e293b', font: { size: 10, weight: 'bold' } }
        }
    },
    plugins: {
        legend: {
            labels: { color: '#0f172a', font: { size: 10, weight: 'bold' }, boxWidth: 8 }
        }
    }
};

function initCharts() {
    charts.inv = new Chart(document.getElementById('inventoryChart'), {
        type: 'line',
        options: opt,
        data: {
            labels: [],
            datasets: [
                { label: 'Stock', data: [], borderColor: '#16a34a', backgroundColor: '#16a34a22', fill: true, tension: 0, pointRadius: 0 },
                { label: 'ROP', data: [], borderColor: '#ca8a04', borderDash: [5, 5], fill: false, pointRadius: 0 }
            ]
        }
    });

    charts.proc = new Chart(document.getElementById('procurementChart'), {
        type: 'bar',
        options: opt,
        data: {
            labels: [],
            datasets: [{ label: 'Order Costs ($)', data: [], backgroundColor: '#8b5cf6', barThickness: 10 }]
        }
    });

    charts.hold = new Chart(document.getElementById('holdingChart'), {
        type: 'line',
        options: opt,
        data: {
            labels: [],
            datasets: [{ label: 'Holding Cost ($)', data: [], borderColor: '#2563eb', backgroundColor: '#2563eb22', fill: true, tension: 0, pointRadius: 0 }]
        }
    });

    charts.lost = new Chart(document.getElementById('stockoutChart'), {
        type: 'line',
        options: opt,
        data: {
            labels: [],
            datasets: [{ label: 'Lost Sales (cumulative)', data: [], borderColor: '#dc2626', backgroundColor: '#dc262622', fill: true, tension: 0, pointRadius: 0 }]
        }
    });
}

function toggleFreeze() {
    isPaused = !isPaused;
    const btn = document.getElementById('freezeBtn');

    if (isPaused) {
        btn.innerText = "RESUME";
        btn.style.background = "var(--success)";
    } else {
        btn.innerText = "PAUSE";
        btn.style.background = "var(--danger)";
        engine();
    }
}

function toggleAutoOrder() {
    autoOrder = !autoOrder;
    const btn = document.getElementById('autoOrderBtn');
    btn.innerText = autoOrder ? "AUTO-ORDER: ON" : "AUTO-ORDER: OFF";
    btn.classList.toggle('active', autoOrder);
}

function placeOrder() {
    const Q = parseFloat(document.getElementById('inQ').value);
    const S = parseFloat(document.getElementById('inS').value);
    const P = parseFloat(document.getElementById('inP').value);
    const LT = parseFloat(document.getElementById('inLT').value);

    currentProcHit += (S + (P * Q));
    totalAccruedCost += (S + (P * Q));
    pending.push({ arrival: time + LT, qty: Q });

    document.getElementById('shipCount').innerText = `Shipments Pending: ${pending.length}`;
}

function engine() {
    if (isPaused) return;

    const D = parseFloat(document.getElementById('inD').value);
    const H = parseFloat(document.getElementById('inH').value);
    const LT = parseFloat(document.getElementById('inLT').value);
    const Q = parseFloat(document.getElementById('inQ').value);
    const sellPrice = parseFloat(document.getElementById('inSellPrice').value);
    const tickStep = 0.2;

    const rop = D * (LT % (Q / D));
    // const rop = D * LT;

    const truck = document.getElementById('truck');
    let anyTruckActive = false;

    pending.forEach((o, i) => {
        if (time >= o.arrival - 1.5 && !anyTruckActive) {
            anyTruckActive = true;
            truck.style.opacity = "1";
            truck.style.right = "calc(100% - 70px)";
        }

        if (time >= o.arrival) {
            stock += o.qty;
            pending.splice(i, 1);
            document.getElementById('shipCount').innerText = `Shipments Pending: ${pending.length}`;
            truck.style.opacity = "0";
            truck.style.right = "-100px";
        }
    });

    if (autoOrder && pending.length === 0 && stock <= (D * (LT + tickStep))) {
        placeOrder();
    }

    if (stock > 0) {
        let salesThisTick = Math.min(stock, D * tickStep);
        stock = Math.max(0, stock - (D * tickStep));
        totalAccruedCost += (stock * H * tickStep);
        totalRevenue += (salesThisTick * sellPrice);
        totalSalesUnits += salesThisTick;
    } else {
        lostCustomers += (D * tickStep);
    }

    time += tickStep;
    updateUI(rop);

    engineTimeout = setTimeout(engine, 600 - document.getElementById('speedRange').value);
}

function updateUI(rop) {
    const H = parseFloat(document.getElementById('inH').value);
    const netProfit = totalRevenue - totalAccruedCost;
    const profitEl = document.getElementById('profitVal');
    const profitCard = document.getElementById('profitCard');

    document.getElementById('dayCounter').innerText = "DAY " + Math.floor(time);
    profitEl.innerText = (netProfit >= 0 ? "$" : "-$") + Math.abs(Math.round(netProfit)).toLocaleString();
    profitEl.style.color = netProfit >= 0 ? 'var(--profit)' : 'var(--danger)';
    profitCard.style.borderColor = netProfit >= 0 ? 'var(--profit)' : 'var(--danger)';

    const label = time.toFixed(1);

    charts.inv.data.labels.push(label);
    charts.inv.data.datasets[0].data.push(stock.toFixed(1));
    charts.inv.data.datasets[1].data.push(rop.toFixed(1));

    charts.proc.data.labels.push(label);
    charts.proc.data.datasets[0].data.push(currentProcHit);
    currentProcHit = 0;

    charts.hold.data.labels.push(label);
    charts.hold.data.datasets[0].data.push((stock * H).toFixed(2));

    charts.lost.data.labels.push(label);
    charts.lost.data.datasets[0].data.push(lostCustomers.toFixed(0));

    Object.values(charts).forEach(c => {
        if (c.data.labels.length > 70) {
            c.data.labels.shift();
            c.data.datasets.forEach(ds => ds.data.shift());
        }
        c.update('none');
    });

    document.getElementById('stockVal').innerText = Math.round(stock);
    document.getElementById('salesVal').innerText = Math.round(totalSalesUnits).toLocaleString();
    document.getElementById('lostVal').innerText = Math.round(lostCustomers);
    document.getElementById('totalCostVal').innerText = "$" + Math.round(totalAccruedCost).toLocaleString();
    document.getElementById('totalRevVal').innerText = "$" + Math.round(totalRevenue).toLocaleString();
    document.getElementById('ropVal').innerText = Math.round(rop);
}

initCharts();
