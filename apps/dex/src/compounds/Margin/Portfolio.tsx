import type { NextPage } from "next";

import { PortfolioTable } from "~/compounds/Margin/PortfolioTable";

const Portfolio: NextPage = () => {
  return (
    <section className="mt-4 border border-gold-800 rounded overflow-hidden">
      <PortfolioTable />
    </section>
  );
};

export default Portfolio;
