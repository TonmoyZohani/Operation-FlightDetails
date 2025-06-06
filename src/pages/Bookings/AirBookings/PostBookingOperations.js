import React from "react";
import { useParams } from "react-router-dom";
import VoidDetails from "./VoidDetails";
import IssueDetails from "./IssueDetails";
import RefundDetails from "./RefundDetails";
import ReissueDetails from "./ReissueDetails";
import RefundQuotation from "./RefundQuotation";
import CancelDetails from "./CancelDetails";
import ReissueQuotation from "./ReissueQuotation";
import VoidQuotation from "./VoidQuotation";

const PostBookingOperations = () => {
  const { status } = useParams();
  return (
    <div>
      {status === "issue" && <IssueDetails />}
      {status === "void" && <VoidDetails />}
      {status === "refund" && <RefundDetails />}
      {status === "reissue" && <ReissueDetails />}
      {status === "cancel" && <CancelDetails />}
      {status === "refundquotation" && <RefundQuotation />}
      {status === "reissuequotation" && <ReissueQuotation />}
      {status === "void-details" && <VoidQuotation />}
    </div>
  );
};

export default PostBookingOperations;
