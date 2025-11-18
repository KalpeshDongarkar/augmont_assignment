
const dbFn = require("../../core_srv/services/dbexecutable");

module.exports.insert_catModal = async (req, res) => {
  try {
    const { catName, catDescrptn } = req.body;
    const { usr_id } = req.headers.userdata;
    let catData = await dbFn.dbExecutableQuery(
      "SELECT COUNT(1) as datacount FROM categories WHERE cat_name = ? AND isactive = 1 AND created_by = ?",
      [catName, usr_id],
    );
    if (catData[0].datacount == 0) {
      let catResData = await dbFn.dbExecutableQuery(
        "INSERT INTO categories (cat_name, cat_desptn, created_by, modified_by) VALUES(?,?,?,?);",
        [catName, catDescrptn, usr_id, usr_id],
      );
      res
        .status(200)
        .send({ message: "Category Added Successfully", success: true });
    } else {
      res
        .status(200)
        .send({ message: "Category already exists" });
    }
  } catch (Err) {
    res
      .status(601)
      .json({ message: "Something went wrong", error: Err.message });
  }
}

module.exports.update_catModal = async (req, res) => {
  try {
    const { catName, catDescrptn, catId } = req.body;
    const { usr_id } = req.headers.userdata;
    let catData = await dbFn.dbExecutableQuery(
      "SELECT COUNT(1) as datacount FROM categories WHERE cat_name = ? AND isactive = 1 AND created_by = ?;",
      [catName, usr_id],
    );

    if (catData[0].datacount == 0) {
      let updCatRes = await dbFn.dbExecutableQuery(
        "UPDATE categories SET cat_name = ?, cat_desptn = ?, modified_by = ?, modified_on = NOW() WHERE cat_id = ? AND isactive = 1;",
        [catName, catDescrptn, usr_id, catId],
      );

      res
        .status(200)
        .send({ message: "Category Updated Successfully", success: true });
    } else {
      res
        .status(200)
        .send({ message: "Category not found" });
    }
  } catch (Err) {
    res
      .status(601)
      .json({ message: "Something went wrong", error: Err.message });
  }
}

module.exports.getdata_catModal = async (req, res) => {
  try {
    let { usr_id } = req.headers.userdata;
    let parmData = req.query?.data ? JSON.parse(req.query?.data) : {}
    let catData = await dbFn.dbExecutableQuery(
      "SELECT COUNT(1) as datacount FROM categories WHERE isactive = 1 AND created_by = ?;",
      [usr_id],
    );

    let dtCatRes = []
    if (catData[0].datacount != 0) {
      let curtPage = Number(parmData?.curtPage ?? 1);
      let pageSize = parmData.pageSize ? Number(parmData.pageSize ?? 10) : catData[0].datacount;
      let offset = Number((curtPage - 1) * pageSize);

      dtCatRes = await dbFn.dbExecutableQuery(
        `SELECT ct.cat_id, ct.cat_name, ct.cat_name 'Category Name', ct.cat_desptn, ct.cat_desptn 'Category Description', ad.usr_name 'Created By',  DATE_FORMAT(IFNULL(ct.modified_on, ct.created_on), '%m/%d/%Y %H:%i') 'Created On' FROM categories ct INNER JOIN authdetails ad ON ad.usr_id = IFNULL(ct.modified_by, ct.created_by) WHERE ct.isactive = 1 AND ct.created_by = ? LIMIT ${pageSize} OFFSET ${offset};`,
        [usr_id],
      );
    }




    let catDataSet = {
      count: catData[0].datacount,
      data: dtCatRes,
      dataHders: ['Category Name', 'Category Description', 'Created By', 'Created On'],
    }
    res
      .status(200)
      .send({ data: catDataSet, success: true });
  } catch (Err) {
    console.log(Err)
    res
      .status(601)
      .json({ message: "Something went wrong", error: Err.message });
  }
}

module.exports.delete_catModal = async (req, res) => {
  try {
    const { catId } = req.body;
    const { usr_id } = req.headers.userdata;
    let catData = await dbFn.dbExecutableQuery(
      "SELECT COUNT(1) as datacount FROM categories WHERE cat_id = ? AND isactive = 1 AND created_by = ?",
      [catId, usr_id],
    );

    if (catData[0].datacount > 0) {
      let delCatRes = await dbFn.dbExecutableQuery(
        "UPDATE categories SET isactive = 0, modified_by = ?, modified_on = NOW() WHERE cat_id = ? AND isactive = 1;",
        [usr_id, catId],
      );
      res
        .status(200)
        .send({ message: "Category Deleted Successfully", success: true });
    } else {
      res
        .status(200)
        .send({ message: "Category not found" });
    }
  } catch (Err) {
    res
      .status(601)
      .json({ message: "Something went wrong", error: Err.message });
  }
}

module.exports.getCatDrop_catModal = async (req, res) => {
  try {
    const { usr_id } = req.headers.userdata;
    let catDPData = await dbFn.dbExecutableQuery(
      "SELECT cat_id, cat_name FROM categories WHERE isactive = 1 AND created_by = ?",
      [usr_id],
    );
    res
      .status(200)
      .send({ data: catDPData });
  } catch (Err) {
    res
      .status(601)
      .json({ message: "Something went wrong", error: Err.message });
  }
}
