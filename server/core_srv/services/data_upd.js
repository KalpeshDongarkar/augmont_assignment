


module.exports.cleanJson = async (dataSet, res) => {
  let vldKeys = [
    "Product Name",
    "Product Description",
    "Category Type",
    "Product Price",
  ];

  const mainset = dataSet.map(row => {
    const catKey = Object.keys(row).find(k => k.toLowerCase().startsWith('category type'));
    return {
      "Product Name": row["Product Name"]?.trim() || "",
      "Product Description": row["Product Description"]?.trim() || "",
      "Category Type": row[catKey]?.trim() || "",
      "Product Price": row["Product Price"] || 0
    };
  });
  let xlVldDt = await this.getInvalidArr(mainset[0], vldKeys);

  if (!xlVldDt) {
    return res.status(400).send("Invalid Excel Columns");
  }

  const map = new Map();
  const dupArr = [];
  const uniqArr = [];

  for (const row of mainset) {
    const key = row["Product Name"];

    if (map.has(key)) {
      map.get(key).push(row);
    } else {
      map.set(key, [row]);
    }
  }

  for (const [key, rows] of map.entries()) {
    if (rows.length === 1) uniqArr.push(rows[0]);
    else dupArr.push(...rows);
  }

  console.log(dupArr.length, uniqArr.length)
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

