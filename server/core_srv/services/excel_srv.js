const XLSX = require("xlsx");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const upload = multer({ des: '../../media/excel-upload' }).single('fileupload')


const headers = ['Product Name', 'Product Description', 'Category Type', 'Product Price'];

module.exports.productsheet_dwnload = (params) => {
  try {
    const workbook = XLSX.utils.book_new();
    let jsonArr = Array.from({ length: 1 }, (_, indx) => ({ 'Product Name': `Product no ${indx + 1}`, 'Product Description': `Product Description ${indx + 1}`, [`Category Type: \nChoose(${params.catTypeList})`]: "", 'Product Price': Math.floor(Math.random() * 12000) + 1000 }));
    const worksheet = XLSX.utils.json_to_sheet(jsonArr)
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

