// first make a sum array with number from 0 to n, then we use reduce to sum it,because it start from 0 and stop before n, so we need to plus 1 to each number
const sum_to_n_a = function (n) {
  const arraySum = new Array(n).keys();
  const summary = [...arraySum].reduce((total, num) => {
    return (total += (num + 1));
  }, 0);
  return summary
};

// we use Recursion here, first make condition to stop Recursion process, then we return the number plus the function itself with n-1, it will nonstop summary until n = 0, and return everything to the first summary
const sum_to_n_b = function (n) {
  if (n === 0) {
    return 0;
  }
  return n + sumToN(n - 1);
};

// we use for loop to sum the number from 0 to n
const sum_to_n_c = function (n) {
  let sum = 0;
  for (let i = 0; i <= n; i++) {
    sum += i;
  }
  return sum;
};
