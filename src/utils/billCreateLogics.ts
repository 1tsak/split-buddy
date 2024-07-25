export type Split = {
    userId: string;
    amount: number;
    paid: boolean;
    checked: boolean;
};
export const validateBill = (splits: Split[] | [], amount: number) => {
    if (!splits) {
      return { success: false, message: `Error While Generating Bill` };
    }
    const totalCustomAmount = splits.reduce((acc, split) => {
      return acc + split.amount;
    }, 0);
    if (Math.ceil(totalCustomAmount) === Number(amount)) {
      return { success: true };
    } else {
      const msg =
        Math.ceil(totalCustomAmount) === 0
          ? "At least one member is required in the expense."
          : totalCustomAmount < amount
          ? "Total expenses are less than amount."
          : "Total expenses are greater than amount.";

      return { success: false, message: msg };
    }
  };

  export const countMember = (splits: Split[]) => {
    let count = 0;
    for (let i = 0; i < splits.length; i++) {
      if (splits[i].checked) count++;
    }
    return count;
  };