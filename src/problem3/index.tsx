// interface WalletBalance {
//   currency: string;
//   amount: number;
// }
// interface FormattedWalletBalance {
//   currency: string;
//   amount: number;
//   formatted: string;
// }

import { CURRENCY_PRIORITY } from "./contants.common";

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
  usdValue: number;
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

        // where the lhsPriority? it wrong, replace it with balancePriority and use a clean condition for filter
        // if (lhsPriority > -99) {
        //   if (balance.amount <= 0) {
        //     return true;
        //   }
        // }
        // return false;

        // I don't get requirements here, but if we just need balance rows with the default currency, then we can use this condition, otherwise we can use only balance.amount > 0
        return !!CURRENCY_PRIORITY[balance.currency] && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        // with simple case like this, just use this function sort
        // const leftPriority = getPriority(lhs.blockchain);
        const leftPriority = CURRENCY_PRIORITY[lhs.currency];
        // const rightPriority = getPriority(rhs.blockchain);
        const rightPriority = CURRENCY_PRIORITY[rhs.currency];
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
        return !!CURRENCY_PRIORITY[balance.currency] && balance.amount > 0
          ? {
              ...balance,
              formatted: balance.amount.toFixed(),
              usdValue: prices[balance.currency] * balance.amount,
            }
          : undefined;
      })
      .filter(Boolean)
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = CURRENCY_PRIORITY[lhs.currency];
        const rightPriority = CURRENCY_PRIORITY[rhs.currency];
        return rightPriority - leftPriority;
      });
  }, [balances, prices]);

  // use wrong array, should be formattedBalances, and change it to function instead, in case we need to reuse it or make code cleaner
  // const rows = sortedBalances.map(
  const renderRows = formattedBalances.map(
    (balance: FormattedWalletBalance, index: number) => (
      <WalletRow
        className={classes.row}
        // if can, should not use index as key in React,in this case i usse currency because it unique
        // key={index}
        key={balance.currency}
        amount={balance.amount}
        usdValue={balance.usdValue}
        formattedAmount={balance.formatted}
      />
    )
  );
  // where the children? i don't see UI, so maybe this page use as a template or something like that, so i put children in bottom
  return (
    <div className="flex flex-col gap-6 " {...rest}>
      <div className="flex flex-col gap-2 ">{renderRows()}</div>
      {children}
    </div>
  );
};
