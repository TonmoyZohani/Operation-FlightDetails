export const findEmptyImagesIndices = (dataArray, journeyType) => {
  return dataArray
    .map((item, index) => {
      if (
        (!item.visaImage || !item.passportImage) &&
        (journeyType?.toLowerCase() === "outbound" ||
          (journeyType?.toLowerCase() === "inbound" &&
            item?.passportNation?.toLowerCase() !== "bd"))
      ) {
        return index;
      }
      return -1;
    })
    .filter((index) => index !== -1);
};
