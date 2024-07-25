import { Box, CircularProgress } from "@mui/material";

import { FC } from "react";
import RecentBillCard from "./RecentBillCard";
import { RecentBillCardType } from "../../types/types";
import { useTranslation } from "react-i18next";

interface RecentBillCardContainerProps {
  bills: RecentBillCardType[];
}

const RecentBillCardContainer: FC<RecentBillCardContainerProps> = ({ bills }) => {
  const { t } = useTranslation();

  if (bills && bills.length === 0) {
    return (
      <div className="flex items-center justify-center">
        {t('noRecentBills')}
      </div>
    );
  }

  return (
    <div className="step6">
      {bills ? (
        <div className="grid grid-cols-2 min-h-8 lg:grid-cols-4 gap-4">
          {bills.map((bill, i) => (
            <RecentBillCard data={bill} key={i} />
          ))}
        </div>
      ) : (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "24vh",
          }}
        >
          <CircularProgress className="text-main" />
        </Box>
      )}
    </div>
  );
};

export default RecentBillCardContainer;
