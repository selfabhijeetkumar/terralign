import type { Metadata } from 'next';
import { PortfolioOptimizerView } from '@/components/portfolio/PortfolioOptimizerView';

export const metadata: Metadata = {
  title: 'Portfolio Optimizer — TERRALIGN',
  description:
    'Multi-site analog campaign rehearsal optimizer using greedy submodular set-cover across 30 Requirements Verification Matrix (RVM) requirements.',
};

export default function PortfolioOptimizerPage() {
  return <PortfolioOptimizerView />;
}
