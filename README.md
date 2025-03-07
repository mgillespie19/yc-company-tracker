# YC Analytics Dashboard

A modern, interactive dashboard for analyzing Y Combinator startup batches, industry trends, and top companies.

## Features

- **Batch Analytics**: View detailed statistics for each YC batch
- **Industry Breakdown**: Visualize industry distribution within batches
- **Top Companies**: Showcase of the most successful YC companies
- **Multi-Batch Comparison**: Compare trends across different YC batches
- **Industry Trends**: Track how industries evolve across batches
- **Responsive Design**: Optimized for both desktop and mobile viewing

## Tech Stack

- **Framework**: Next.js
- **UI Components**: React with Tailwind CSS
- **State Management**: Custom store using React hooks
- **Data Visualization**: Interactive charts and graphs
- **Animations**: Smooth transitions and infinite scrolling cards

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/yc-analytics-dashboard.git
cd yc-analytics-dashboard

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
/
├── components/            # React components
│   ├── ui/               # UI components (cards, buttons, etc.)
│   ├── BatchSelector.tsx # Batch selection component
│   ├── CompanyList.tsx   # List of companies in a batch
│   ├── Dashboard.tsx     # Main dashboard component
│   ├── IndustryChart.tsx # Industry breakdown visualization
│   ├── IndustryTrends.tsx# Multi-batch industry trends
│   ├── StatsOverview.tsx # Key statistics display
│   └── TopCompanies.tsx  # Top YC companies showcase
├── lib/                  # Utilities and data handling
│   ├── api.ts            # API functions for data fetching
│   ├── store.ts          # State management
│   └── types.ts          # TypeScript type definitions
├── public/               # Static assets
└── app/                  # Next.js app directory
```

## Data Sources

The dashboard uses data from Y Combinator's public API and other public sources to compile information about startups, funding rounds, and industry categorizations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Y Combinator for providing the data
- All the amazing startups that make this data interesting
