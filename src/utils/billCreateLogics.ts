import { User } from "../types/types";

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
  export const splitEqually = (splits: Split[], amount:number, groupMember:User[]) => {
    const splitsMember = countMember(splits);
    let remainingAmount = amount;
    const updatedSplits: Split[] = groupMember.map((user, index) => {
      let amount = splits[index]?.checked
        ? splitsMember > 0
          ? parseFloat((remainingAmount / (splitsMember || 1)).toFixed(2))
          : 0
        : 0;
      return {
        userId: user.id,
        amount: amount,
        paid: false,
        checked: splits[index]?.checked || false,
      } as Split;
    });
   return updatedSplits;
  };


  export const generateActualExpense = (splits: Split[], custom:boolean, customBill:number[], creatingId:string| undefined)=>{
    const ActualSplit: any = splits
      .map((split, index) => {
        const updatedSplit = {
          userId: split.userId,
          amount: !split.checked
            ? 0
            : !custom
            ? split.amount
            : Number(customBill[index]),
          paid:
            split.userId === creatingId || !split.checked
              ? true
              : split.paid || false,
        };
        return updatedSplit as Split;
      })
      .filter(Boolean);


      return ActualSplit;
  }