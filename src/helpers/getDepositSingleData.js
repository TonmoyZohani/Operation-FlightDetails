export const getDepositSingleData = (depositType, data = {}) => {
  const depositData = {
    status: data?.status || null,
    amount: data.amount || null,
    reference: data.reference || null,
    attachment: data.attachment || null,
    requestDate: data.createdAt || null,
    depositIn: data.adminBankAccount?.bankName || null,
    transactionDate: data.transactionDate || null,
    depositId: data.depositId || null,
    branch: data.adminBranch?.branchName || null,
    depositFrom: null,
    issueDate: null,
    issueBank: null,
    depositDate: null,
    validity: null,
    remarks: data?.remarks,
    transferType: data.transferType || null,
  };

  switch (depositType) {
    case "bankDeposit":
      depositData.validity = data.bankDepositValidity || null;
      const bankDepositLogs = data?.bankDepositLogs?.[0];
      const bankFirstActivity =
        bankDepositLogs?.activityLog?.userActivities?.[0];
      const bankUser = bankFirstActivity?.user;

      depositData.requestBy =
        bankUser?.firstName && bankUser?.lastName
          ? `${bankUser.firstName} ${bankUser.lastName}, ${bankUser?.type}`
          : null;
      break;

    case "bankTransferDeposit":
      depositData.validity = data.bankTransferDepositValidity || null;
      depositData.depositFrom = data.userBankAccount?.bankName || null;

      const bankTransferDepositLogs = data?.bankTransferDepositLogs?.[0];
      const bankTransferFirstActivity =
        bankTransferDepositLogs?.activityLog?.userActivities?.[0];
      const bankTransferUser = bankTransferFirstActivity?.user;

      depositData.requestBy =
        bankTransferUser?.firstName && bankTransferUser?.lastName
          ? `${bankTransferUser.firstName} ${bankTransferUser.lastName}, ${bankTransferUser?.type}`
          : null;

      break;

    case "cashDeposit":
      depositData.validity = data.cashDepositValidity || null;
      depositData.moneyReceiptNumber = data.moneyReceiptNumber || null;

      const firstLog = data?.cashDepositLogs?.[0];
      const firstActivity = firstLog?.activityLog?.userActivities?.[0];
      const user = firstActivity?.user;

      depositData.requestBy =
        user?.firstName && user?.lastName
          ? `${user.firstName} ${user.lastName}, ${user?.type}`
          : null;

      break;
    case "chequeDeposit":
      depositData.validity = data.chequeDepositValidity || null;
      depositData.issueDate = data.issueDate || null;
      depositData.issueBank = data.userBankAccount?.bankName || null;
      depositData.depositDate = data.depositDate || null;

      const chequeDepositLogs = data?.chequeDepositLogs?.[0];
      const chequeFirstActivity =
        chequeDepositLogs?.activityLog?.userActivities?.[0];
      const chequeUser = chequeFirstActivity?.user;

      depositData.requestBy =
        chequeUser?.firstName && chequeUser?.lastName
          ? `${chequeUser.firstName} ${chequeUser.lastName}, ${chequeUser?.type}`
          : null;

      break;

    default:
      break;
  }

  return depositData;
};
