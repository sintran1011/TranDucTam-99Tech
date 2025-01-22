// interface WalletBalance {
//   currency: string;
//   amount: number;
// }
// interface FormattedWalletBalance {
//   currency: string;
//   amount: number;
//   formatted: string;
// }

import { PRIORITY_OBJECT } from "./contants.common";

// should seperate the interface and reuse it, it will be easier to maintain
// maybe split WalletBalance into separate file ts for reuseable interface
interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance extends WalletBalance {
  // this should be number
  // formatted: string;
  formatted: number;
}

// interface Props extends BoxProps {}
// should name the props make sense, in case to export it to use in another component
// there  have classes props, i don't know if BoxProps interface have this inside, so i keep it in operator props
interface WalletPageProps extends BoxProps {}

// remove interface Props inside the props params, because it have dynamic interface from React.FC
const WalletPage: React.FC<WalletPageProps> = (props) => {
  const { classes, children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // const getPriority = (blockchain: any): number => {
  //   switch (blockchain) {
  //     case "Osmosis":
  //       return 100;
  //     case "Ethereum":
  //       return 50;
  //     case "Arbitrum":
  //       return 30;
  //     case "Zilliqa":
  //       return 20;
  //     case "Neo":
  //       return 20;
  //     default:
  //       return -99;
  //   }
  // };

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        // should not use switch key in a simple case, we should use object instead, and change key to currency as we make interface
        // const balancePriority = getPriority(balance.blockchain);
        const balancePriority = balance.currency
          ? PRIORITY_OBJECT[balance.currency]
          : -99;

        // where the lhsPriority? it wrong, replace it with balancePriority and use a clean condition for filter
        // if (lhsPriority > -99) {
        //   if (balance.amount <= 0) {
        //     return true;
        //   }
        // }
        // return false;
        return balancePriority > -99 && balance.amount <= 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        // with simple case like this, just use this function sort
        // const leftPriority = getPriority(lhs.blockchain);
        const leftPriority = PRIORITY_OBJECT[lhs.currency];
        // const rightPriority = getPriority(rhs.blockchain);
        const rightPriority = PRIORITY_OBJECT[rhs.currency];
        // if (leftPriority > rightPriority) {
        //   return -1;
        // } else if (rightPriority > leftPriority) {
        //   return 1;
        // }
        return rightPriority - leftPriority;
      });
    // prices not be any params of this function, so we can remove it from dependencies
    // small tip : in this case balances we get from hooks useWalletBalances, so maybe it get it by interactive with wallet though Wagmi, then we have to sort it by FE, but if we get it from backend, we should sort it by BE
    // }, [balances, prices]);
  }, [balances]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // we can use another way for clean code

  const sortedBalances2 = useMemo(() => {
    return balances
      .map((balance: WalletBalance) => {
        // const balancePriority = getPriority(balance.blockchain);
        const balancePriority = balance.currency
          ? PRIORITY_OBJECT[balance.currency]
          : -99;
        return balancePriority > -99 && balance.amount <= 0
          ? { ...balance, formatted: balance.amount.toFixed() }
          : undefined;
      })
      .filter(Boolean)
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = PRIORITY_OBJECT[lhs.currency];
        const rightPriority = PRIORITY_OBJECT[rhs.currency];
        return rightPriority - leftPriority;
      });
  }, [balances]);

  // use wrong array, should be formattedBalances
  // const rows = sortedBalances.map(
  const rows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      // i think we should hide the empty assets, because it will make user confuse, bad UX
      if (usdValue > 0)
        return (
          <WalletRow
            className={classes.row}
            // if can, should not use index as key in React,in this case i usse currency because it unique
            // key={index}
            key={balance.currency}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      return null;
    }
  );
  // where the children? i don't see UI, so maybe this page use as a template or something like that, so i put children in bottom
  return (
    <div className="flex flex-col gap-6 " {...rest}>
      <div className="flex flex-col gap-2 ">{rows}</div>
      {children}
    </div>
  );
};
