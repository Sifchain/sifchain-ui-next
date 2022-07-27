export function createOpenPositionsRow() {
  const rand100 = () => Math.floor(Math.random() * 100);
  const rand2 = () => Math.floor(Math.random() * 2);
  const rand3 = () => Math.floor(Math.random() * 3);
  const sides = ["0", "1", "2"];
  const amounts = ["11.5432", "-32.9832", "8192331"];
  const unrealizedPLs = ["32.5432", "-2000.15"];
  return {
    id: Math.random().toString(16).slice(2),
    pool: "ETH",
    side: sides[rand3()] as string,
    asset: "ETH",
    amount: amounts[rand3()] as string,
    baseLeverage: `${Math.random() * 2}`,
    unrealizedPL: unrealizedPLs[rand2()] as string,
    interestRate: `${Math.random() * 0.1}`,
    unsettledInterest: "12893",
    nextPayment: new Date(),
    paidInterest: "81273",
    health: `${rand100()}`,
    dateOpened: new Date(),
    timeOpen: new Date(),
  };
}

export function createHistoryRow() {
  const rand2 = () => Math.floor(Math.random() * 2);
  const rand3 = () => Math.floor(Math.random() * 3);
  const sides = ["0", "1", "2"];
  const amounts = ["11.5432", "-32.9832", "8192331"];
  const realizedPLs = ["32.5432", "-2000.15"];
  return {
    id: Math.random().toString(16).slice(2),
    dateClosed: new Date(),
    timeOpen: new Date(),
    pool: "ETH",
    side: sides[rand3()] as string,
    asset: "ETH",
    amount: amounts[rand3()] as string,
    realizedPL: realizedPLs[rand2()] as string,
  };
}
