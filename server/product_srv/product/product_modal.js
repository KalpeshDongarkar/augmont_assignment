
const dbFn = require("../../core_srv/services/dbexecutable");
const excel_srv = require("../../core_srv/services/excel_srv");
const datafn = require("../../core_srv/services/data_upd");
const fs = require("fs");
const multer = require("multer");
const uploadImages = multer({ des: '../../media/product' }).any();
const path = require("path");


module.exports.insert_prodModal = async (req, res) => {
  try {
    uploadImages(req, res, async (err) => {
      if (err) {
        console.log(err)
        return res.status(400).send("No File Found or invalid Paramter Name");
      }

      const { prdName, prdDescrptn, prdPrice, prdCattype } = req.body;
      const { usr_id } = req.headers.userdata;

      let prdData = await dbFn.dbExecutableQuery(
        "SELECT COUNT(1) as datacount FROM productdetails WHERE prd_name = ? AND isactive = 1",
        [prdName],
      );

      if (prdData[0].datacount == 0) {
        let prdResData = await dbFn.dbExecutableQuery(
          "INSERT INTO productdetails (prd_name, prd_descrptn, prd_price, prd_cattype, created_by, modified_by) VALUES(?,?,?,?,?,?);",
          [prdName, prdDescrptn, prdPrice, prdCattype, usr_id, usr_id],
        );
        const prdID = prdResData.insertId;
        if (prdID) {
          let imgArray = []
          let prdMediaPath = path.join(__dirname, '../../media/product/')
          let prdFolderPath = path.join(prdMediaPath, `${prdName}`)
          if (!fs.existsSync(prdFolderPath)) {
            fs.mkdirSync(prdFolderPath)
          }
          req.files.forEach(ele => {
            let filePath = path.join(prdFolderPath, `${ele.originalname}`)
            imgArray.push({ fileName: ele.originalname, fileStrgPath: path.join('../../media/product/', `${prdName}/${ele.originalname}`), mimeType: ele.mimetype, mimeType: ele.mimetype, filesize: ele.size })
            fs.writeFile(filePath, ele.buffer, (fErr) => {
              if (fErr) {
                throw new Error("Something went wrong while saving the file");
              };
            });
          });

          if (imgArray.length != 0) {
            let imgQueryStr = 'INSERT INTO productdetails_img (prd_id, prd_img_ordid, prd_img_name, prd_img_filepath, prd_mimetype, created_by, modified_by) VALUES'
            for (let idx = 0; idx < imgArray.length; idx++) {
              imgQueryStr += `(${prdID},${idx + 1},'${imgArray[idx].fileName}','${imgArray[idx].fileStrgPath}','${imgArray[idx].mimeType}',${usr_id},${usr_id})${idx == imgArray.length - 1 ? ';' : ','}`
            }
            let prdRes = await dbFn.dbExecutableQuery(imgQueryStr, []);
          }
          return res
            .status(200)
            .send({ message: "Product Added Successfully", success: true });
        } else {
          return res
            .status(200)
            .send({ message: "Invalid Product", success: true });
        }
      } else {
        return res
          .status(200)
          .send({ message: "Product already exists" });
      }
    })
  } catch (Err) {
    res
      .status(601)
      .json({ message: "Something went wrong", error: Err.message });
  }
}

module.exports.update_prodModal = async (req, res) => {
  try {
    uploadImages(req, res, async (err) => {
      if (err) {
        console.log(err)
        return res.status(400).send("No File Found or invalid Paramter Name");
      }
      const { prdId, prdName, prdDescrptn, prdPrice, prdCattype } = req.body;
      const { usr_id } = req.headers.userdata;

      let prdDataChek = await dbFn.dbExecutableQuery(
        "SELECT COUNT(1) as datacount FROM productdetails WHERE prd_id = ? AND isactive = 1",
        [prdId],
      );

      if (prdDataChek[0].datacount != 0) {
        let prdData = await dbFn.dbExecutableQuery(
          "UPDATE productdetails SET prd_name = ?, prd_descrptn = ?, prd_price = ?, prd_cattype = ?, modified_by = ?, modified_on = NOW() WHERE prd_id = ? AND isactive = 1",
          [prdName, prdDescrptn, prdPrice, prdCattype, usr_id, prdId],
        );


        let imgArray = []
        let prdMediaPath = path.join(__dirname, '../../media/product/')
        let prdFolderPath = path.join(prdMediaPath, `${prdName}`)
        if (!fs.existsSync(prdFolderPath)) {
          fs.mkdirSync(prdFolderPath)
        }
        req.files.forEach((ele, index) => {
          const fieldKey = ele.fieldname;
          const imgOrdData = fieldKey.match(/\d+$/);
          const imgOrdID = imgOrdData ? parseInt(imgOrdData[0]) : (index + 1);
          console.log(fieldKey)
          let filePath = path.join(prdFolderPath, `${ele.originalname}`)
          if (ele.img_id) {
            imgArray.push(ele)
          } else {
            imgArray.push({ order_id: imgOrdID, fileName: ele.originalname, fileStrgPath: path.join('../../media/product/', `${prdName}/${ele.originalname}`), mimeType: ele.mimetype, mimeType: ele.mimetype, filesize: ele.size })
            fs.writeFile(filePath, ele.buffer, (fErr) => {
              if (fErr) {
                throw new Error("Something went wrong while saving the file");
              };
            });
          }
        });

        if (imgArray.length != 0) {
          let imgQueryStr = 'INSERT INTO productdetails_img (prd_id, prd_img_ordid, prd_img_name, prd_img_filepath, prd_mimetype, created_by, modified_by) VALUES'
          let imgdataQuery = ''
          for (let idx = 0; idx < imgArray.length; idx++) {
            if (imgArray[idx].img_id == undefined) {
              imgdataQuery += `(${prdId},${imgArray[idx].order_id},'${imgArray[idx].fileName}','${imgArray[idx].fileStrgPath}','${imgArray[idx].mimeType}',${usr_id},${usr_id})${idx == imgArray.length - 1 ? ';' : ','}`
            }
          }
          if (imgdataQuery) {
            let prdRes = await dbFn.dbExecutableQuery(imgQueryStr + imgdataQuery, []);
          }
        }
        return res
          .status(200)
          .send({ message: "Product Updated Successfully", success: true });
      } else {
        return res
          .status(200)
          .send({ message: "Product already exists" });
      }

    })
  } catch (Err) {
    res
      .status(601)
      .json({ message: "Something went wrong", error: Err.message });
  }
}

module.exports.getdata_prodModal = async (req, res) => {
  try {

    const prdColMap = {
      'Product Name': 'prd_name',
      'Product Price': 'prd_price',
      'Category Type': 'prd_cattype'
    };

    let { usr_id } = req.headers.userdata;
    let parmData = req.query?.data ? JSON.parse(req.query?.data) : {}
    let pdtinput = [usr_id]
    let pdtDtQuery2 = ''

    let curtPage = Number(parmData?.curtPage ?? 1);
    let pageSize = parmData.pageSize ? Number(parmData.pageSize ?? 10) : pdtData[0].datacount;
    let offset = Number((curtPage - 1) * pageSize);

    let querySet = `SELECT SQL_CALC_FOUND_ROWS pd.prd_id, pd.prd_name, pd.prd_name 'Product Name', pd.prd_descrptn, pd.prd_descrptn 'Product Description', pd.prd_price, pd.prd_price 'Product Price', pd.prd_cattype, c.cat_name 'Category Type', ad.usr_name 'Created By', DATE_FORMAT(IFNULL(pd.modified_on, pd.created_on), '%m/%d/%Y %H:%i') 'Created On' FROM productdetails pd INNER JOIN categories c ON c.cat_id = pd.prd_cattype INNER JOIN authdetails ad ON ad.usr_id = IFNULL(pd.modified_by, pd.created_by) AND pd.isactive = 1 AND pd.created_by = ? `

    if (parmData?.srchTrm && parmData?.srchTrm.length != 0) {
      pdtDtQuery2 += `AND (`
      for (let idx = 0; idx < parmData.srchTrm.length; idx++) {
        pdtinput.push(`%${parmData.srchTrm[idx].searchTerm}%`)
        pdtDtQuery2 += `${prdColMap[parmData.srchTrm[idx].hdrName]} LIKE ?`
        if (idx == (parmData.srchTrm.length - 1)) {
          pdtDtQuery2 += `) `
        } else {
          pdtDtQuery2 += " OR "
        }
      }
    }

    if (pdtDtQuery2 != '') {
      querySet += pdtDtQuery2
    }
    if (parmData?.sortby && parmData?.sortby.srtBy && parmData?.sortby.srtBy != '') {
      querySet += `ORDER BY ${prdColMap[parmData.sortby.hdrName]} ${parmData?.sortby.srtBy.toUpperCase()} `;
    }

    let prd_dataRes = await dbFn.dbExecutableQuery(querySet + `LIMIT ${pageSize} OFFSET ${offset}; SELECT FOUND_ROWS() AS datacount;`, pdtinput);
    let pdtDataSet = {
      count: prd_dataRes[1][0].datacount,
      data: prd_dataRes[1][0].datacount == 0 ? [] : prd_dataRes[0],
      dataHders: ['Product Name', 'Product Description', 'Product Price', 'Category Type', 'Created By', 'Created On'],
      sortArr: ['Product Price'],
      srchArr: ['Product Name', 'Category Type'],
    }
    res
      .status(200)
      .send({ data: pdtDataSet, success: true });

  } catch (Err) {
    res
      .status(601)
      .json({ message: "Something went wrong", error: Err.message });
  }
}

module.exports.delete_prodModal = async (req, res) => {
  try {
    const { pdtId } = req.body;
    const { usr_id } = req.headers.userdata;
    let pdtData = await dbFn.dbExecutableQuery(
      "SELECT COUNT(1) as datacount FROM productdetails WHERE prd_id = ? AND isactive = 1 AND created_by = ?",
      [pdtId, usr_id],
    );

    if (pdtData[0].datacount > 0) {
      let delPdtRes = await dbFn.dbExecutableQuery(
        "UPDATE productdetails SET isactive = 0, modified_by = ?, modified_on = NOW() WHERE prd_id = ? AND isactive = 1;",
        [usr_id, pdtId],
      );
      let delPdtImgRes = await dbFn.dbExecutableQuery(
        "UPDATE productdetails_img SET isactive = 0, modified_by = ?, modified_on = NOW() WHERE prd_id = ? AND isactive = 1;",
        [usr_id, pdtId],
      );
      res
        .status(200)
        .send({ message: "Product Deleted Successfully", success: true });
    } else {
      res
        .status(200)
        .send({ message: "Product not found" });
    }
  } catch (Err) {
    res
      .status(601)
      .json({ message: "Something went wrong", error: Err.message });
  }
}

module.exports.delete_prdimage = async (req, res) => {
  try {
    const { prdId, imgId, filepath } = req.body;
    const { usr_id } = req.headers.userdata;
    let pdtData = await dbFn.dbExecutableQuery(
      "SELECT COUNT(1) as datacount FROM productdetails_img WHERE img_id = ? AND prd_id = ? AND isactive = 1 AND created_by = ?",
      [imgId, prdId, usr_id],
    );

    if (pdtData[0].datacount > 0) {
      let delPdtImgRes = await dbFn.dbExecutableQuery(
        "UPDATE productdetails_img SET isactive = 0, modified_by = ?, modified_on = NOW() WHERE img_id = ? AND prd_id = ? AND isactive = 1;",
        [usr_id, imgId, prdId],
      );
      if (fs.existsSync(path.join(__dirname, '../../media/product', filepath))) {
        fs.unlinkSync(path.join(__dirname, '../../media/product', filepath));
      }
      res
        .status(200)
        .send({ message: "Product Image Deleted Successfully", success: true });
    } else {
      res
        .status(200)
        .send({ message: "Product not found" });
    }
  } catch (Err) {
    res
      .status(601)
      .json({ message: "Something went wrong", error: Err.message });
  }
}

module.exports.sheet_prodModal = async (req, res) => {
  try {
    const { usr_id } = req.headers.userdata;
    let parmData = req.query?.data ? JSON.parse(req.query?.data) : {}
    let catTypeData = await dbFn.dbExecutableQuery(
      "SELECT GROUP_CONCAT(cat_name SEPARATOR '|') AS catTypes FROM categories WHERE isactive = 1 AND created_by = ?",
      [usr_id],
    );
    console.log(catTypeData)
    if (catTypeData[0].catTypes != '') {
      parmData.catTypeList = catTypeData[0].catTypes
    }
    const bufferData = await excel_srv.productsheet_dwnload(parmData)
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader('Content-Disposition', `attachment; filename=Product.${parmData.type}`);
    res.send(bufferData)
  } catch (Err) {
    res
      .status(601)
      .json({ message: "Something went wrong", error: Err.message });
  }
}

module.exports.readproduct_sheet = async (req, res) => {
  try {
    const { usr_id } = req.headers.userdata;
    let jsonArr = await excel_srv.productsheet_read(req, res)
    let clenedData = await datafn.cleanJson(jsonArr, res)
    if (clenedData.noOfUniqEntry != 0) {
      const prdNames = clenedData.uniqArr.map(item => item['Product Name'].trim().toLowerCase()).join(',');

      let prdData = await dbFn.dbExecutableQuery(
        "SELECT count(1) 'datacount' FROM productdetails p WHERE FIND_IN_SET(p.prd_name,?)",
        [prdNames],
      );
      let catTypeData = await dbFn.dbExecutableQuery(
        "SELECT cat_id, cat_name FROM categories WHERE isactive = 1 AND created_by = ?",
        [usr_id],
      );
      const catMap = new Map();
      for (const cat of catTypeData) {
        catMap.set(cat.cat_name.toLowerCase(), cat.cat_id);
      }
      let mappedData = clenedData.uniqArr.map(elem => {
        const key = (elem["Category Type"] || "").toLowerCase();
        return {
          ...elem,
          cat_id: catMap.get(key) || null
        };
      });

      if (prdData[0].datacount != 0) {
        let prdDataSet = await dbFn.dbExecutableQuery(
          "SELECT GROUP_CONCAT(prd_name) as prodctnames FROM productdetails p WHERE FIND_IN_SET(p.prd_name,?)",
          [prdNames],
        );
        prdDataSet = prdDataSet[0].prodctnames != '' || prdDataSet[0].prodctnames != null ? prdDataSet[0].prodctnames.split(',') : []
        mappedData = [...new Set(
          mappedData.map(item => {
            if (!prdDataSet.includes(item['Product Name'])) {
              return item
            }
          })
        )].filter(ele => ele != undefined || ele != null)
      }

      if (mappedData.length != 0) {
        const batchsize = 1000;
        for (let i = 0; i < mappedData.length; i += batchsize) {
          const batch = mappedData.slice(i, i + batchsize);
          const values = batch.map(item => [item['Product Name'], item['Product Description'], item['Product Price'], item['cat_id'], usr_id, usr_id]);

          await dbFn.dbtranQuery(
            "INSERT INTO productdetails (prd_name, prd_descrptn, prd_price, prd_cattype, created_by, modified_by) VALUES ?",
            [values]
          );
        }
        res
          .status(200)
          .json({ message: "Data Inserted Sucessfully" });
      } else {
        res
          .status(200)
          .json({ message: "No Unique Entry Found Data Already Existed" });
      }
    } else {
      res
        .status(200)
        .json({ message: "No Unique Entry Found" });
    }
  } catch (Err) {
    res
      .status(601)
      .json({ message: "Something went wrong", error: Err.message });
  }
}

module.exports.downloadReport_sheet = async (req, res) => {
  try {
    const query = "SELECT p.prd_name, p.prd_descrptn, p.prd_price FROM productdetails p WHERE p.isactive = 1"
    const prse_date = Date.parse(new Date());
    const fileName = path.join(__dirname, '../../media/excel-upload', `${prse_date}_Active_Product_Reports`)
    const result = await dbFn.dbQueryStream(query, fileName)
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);
    res.send(result)
    res.status(200).send(result.message)
  } catch (Err) {
    res
      .status(601)
      .json({ message: "Something went wrong", error: Err.message });
  }
}
