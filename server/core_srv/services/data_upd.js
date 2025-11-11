


module.exports.cleanJson = async (dataSet, res) => {
  let vldKeys = [
    "Product Name",
    "Product Description",
    "Category Type",
    "Product Price",
  ];
  let xlVldDt = await this.getInvalidArr(dataSet[0], vldKeys);
  if (!xlVldDt) {
    return res.status(400).send("Invalid Excel Columns");
  }
  let dupArr = dataSet
    .filter(
      (ele, indx, arr) =>
        arr.findIndex(
          (elem) => elem["Product Name"] === ele["Product Name"]
        ) !== indx
    )
    .filter(
      (mele, indx, arr) =>
        arr.findIndex(
          (elem) => elem["Product Name"] === mele["Product Name"]
        ) === indx
    );
  let uniqArr = dataSet.filter(
    (ele, indx, arr) =>
      arr.findIndex((elem) => elem["Product Name"] === ele["Product Name"]) ===
      indx
  );



  return {
    noOfDupEntry: dupArr.length,
    noOfUniqEntry: uniqArr.length,
    dupArr: dupArr,
    uniqArr: uniqArr,
  };
};


module.exports.getInvalidArr = async (dtObj, validKeys) => {
  const vldSet = new Set(validKeys);
  const inVldEnt = [];
  const vldEnt = [];


  for (const key in dtObj) {
    if (!vldSet.has(key) && vldEnt.length != dtObj) {
      inVldEnt.push(key);
    } else {
      vldEnt.push(key);
    }
  }
  return inVldEnt.length === 0;
};

