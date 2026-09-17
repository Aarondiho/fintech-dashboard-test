# Frontend Application (React 19 + TypeScript + Vite +Tailwind CSS v4)

This directory contains the standalone React 19 frontend for the Transaction Reporting Dashboard.

The frontend provides a responsive, interactive interface for viewing, filtering, searching, and analyzing financial transaction data through the FastAPI backend.

## Architecture & Structure
- `src/App.tsx`: Main application container with bidirectional URL query parameter synchronization, debounced state management, and API orchestration.
- `src/components/FilterBar.tsx`: Debounced search, multi-criteria filter dropdowns (Status, Channel, Currency), and quick presets.
- `src/components/SummaryCards.tsx`: Real-time aggregate telemetry cards (Total Volume, Success Rate, Transaction Count).
- `src/components/VolumeTrendChart.tsx`: Settlement Velocity & Volume interactive time-series chart with dynamic window toggles (7D, 30D, ALL).
- `src/components/TransactionTable.tsx`: Responsive ledger table with channel badges, status indicators, and audit modal triggers.
- `src/components/PaginationControls.tsx`: Server-driven page navigation with responsive page size controls.
- `src/components/TransactionModal.tsx`: Comprehensive audit ledger modal with cryptographic hash verification and JSON raw payload inspection.
- `src/components/ErrorBanner.tsx`: Resilient error banner and toast with automated retry trigger.
- `src/components/CosmicBackground.tsx`: Background moving icons for attractive design
- `src/components/Header.tsx`: Navbar's contents
- `src/utils/formatters.ts`: Subunit currency arithmetic (preventing floating-point rounding bugs) and timestamp formatting.


## Running Locally

```bash
cd frontend
npm install
npm run dev
```
