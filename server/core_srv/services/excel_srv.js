const XLSX = require("xlsx");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const upload = multer({ des: '../../media/excel-upload' }).single('fileupload')


const headers = ['Product Name', 'Product Description', 'Category Type', 'Product Price'];

module.exports.productsheet_dwnload = (params) => {
  try {
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet([headers]);
    XLSX.utils.book_append_sheet(workbook, worksheet, params.sheetname);

    const buffer = XLSX.write(workbook, {
      bookType: params.type,
      type: "buffer",
    })
    return buffer;
  } catch (Err) {
    throw new Error(Err.message);
  }
}

module.exports.productsheet_read = async (req, res) => {
  try {
    return new Promise((resolve, reject) => {
      upload(req, res, async (err) => {
        if (!req.file || err) {
          return res.status(400).send("No File Found or invalid Paramter Name");
        }
        let fileData = req.file
        const workbook = XLSX.read(fileData.buffer, { type: "buffer" });
        var wsname = workbook.SheetNames[0];
        var jsa = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);
        resolve(jsa)
      })
    });

  } catch (Err) {
    throw new Error(Err.message);
  }
}

