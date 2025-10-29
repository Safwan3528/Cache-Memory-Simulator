# Cache Memory Simulator - Next.js Application

## 🖥️ Overview

Aplikasi web interaktif untuk mensimulasikan dan menganalisis cache memory hierarchy (L1/L2). Dibangun menggunakan **Next.js 16**, **TypeScript**, **React**, dan **Chart.js** untuk Computer Architecture and Organization Project.

## ✨ Features

### 1. **Cache Configuration**
- **L1 Cache**: 16KB - 64KB, 1-way hingga 8-way associative
- **L2 Cache**: 128KB - 512KB, 4-way hingga 16-way associative
- **Replacement Policies**: LRU, FIFO, Random
- **Write Policies**: Write-Back, Write-Through
- **Block Sizes**: 32, 64, 128 bytes
- **Memory Accesses**: 1,000 - 100,000 simulations

### 2. **Simulation Engine**
- Realistic memory access patterns (70% sequential, 15% local random, 15% random)
- Temporal and spatial locality simulation
- Two-level cache hierarchy with hit/miss tracking
- AMAT (Average Memory Access Time) calculation

### 3. **Visualization**
- **Real-time Statistics**: Miss rates, hit rates, AMAT
- **Interactive Charts**: 
  - Hit Rate Comparison (Bar Chart)
  - Miss Rate Analysis (Doughnut Chart)
  - Performance Breakdown (Grouped Bar Chart)
- **Detailed Statistics Table**
- **Memory Access Trace Log** (last 50 accesses)

### 4. **Export Functionality**
- Export results to PDF report
- Professional report format dengan charts dan statistics

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm, yarn, pnpm, atau bun

### Installation

```powershell
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📁 Project Structure

```
cache_simulator/
├── app/
│   ├── components/
│   │   ├── ConfigSidebar.tsx      # Configuration panel
│   │   ├── ResultsDisplay.tsx     # Main results display
│   │   ├── PerformanceCharts.tsx  # Chart components
│   │   ├── StatsTable.tsx         # Statistics table
│   │   └── TraceLog.tsx           # Memory trace log
│   ├── globals.css                # Global styles
│   ├── layout.tsx                 # Root layout
│   └── page.tsx                   # Main page with state management
├── lib/
│   ├── cache-simulator.ts         # Cache simulation logic
│   └── types.ts                   # TypeScript interfaces
├── public/                        # Static assets
└── package.json
```

## 🔧 Technologies Used

- **Framework**: Next.js 16.0.1 (App Router)
- **Language**: TypeScript 5
- **UI Library**: React 19.2.0
- **Styling**: Tailwind CSS 4 + Custom CSS
- **Charts**: Chart.js 4 + react-chartjs-2
- **PDF Export**: jsPDF + html2canvas

## 📊 How to Use

1. **Configure Cache Parameters**
   - Adjust L1 and L2 cache sizes and associativity
   - Select replacement policy (LRU recommended)
   - Choose write policy
   - Set block size and number of memory accesses

2. **Run Simulation**
   - Click "▶ Run Simulation" button
   - Wait for simulation to complete

3. **Analyze Results**
   - View stat cards for quick metrics
   - Explore interactive charts
   - Check detailed statistics table
   - Review memory access trace log

4. **Export Report**
   - Click "📄 Export to PDF" button

## 🎓 Educational Context

Project ini adalah sebahagian daripada assignment untuk:
- **Course**: BTE2054 - Computer Architecture and Organization
- **Topic**: Design and Analysis of Cache Memory Solution
- **Institution**: Bachelor of Information Technology

### AMAT Formula
```
AMAT = Hit_Time_L1 + 
       Miss_Rate_L1 × (Hit_Time_L2 + Miss_Rate_L2 × Memory_Penalty)

Where:
- Hit_Time_L1 = 1 cycle
- Hit_Time_L2 = 8 cycles  
- Memory_Penalty = 100 cycles
```

## 👥 Team Members

- Safwan Rahimi bin Suhaili (B24070037)
- Norul Azwa binti Hassan (B24070014)
- Ahmad Fahmie Aizzat bin Abdul Majid (B24080028)
- Norazila binti Said (B24080009)

**Lecturer**: Ms. Noraini binti Ismail

## 📚 References

1. Hennessy, J. L., & Patterson, D. A. (2019). *Computer Architecture: A Quantitative Approach* (6th ed.). Morgan Kaufmann.
2. Patterson, D. A., & Hennessy, J. L. (2017). *Computer Organization and Design: RISC-V Edition*. Morgan Kaufmann.
3. Stallings, W. (2019). *Computer Organization and Architecture: Designing for Performance* (11th ed.). Pearson.

---

**Submission Date**: November 15, 2025  
**Institution**: Bachelor of Information Technology Program
