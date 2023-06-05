const shortid = require('shortid');
const Upload = require('../../../models/upload')
const fs = require('fs');
const path = require('path');
const os = require('os');
const tmpDir = os.tmpdir();
const excelReader = require('../../../utils/excel-reader');
const User = require('../../../models/user');
const ShiftRoster = require('../../../models/shift-roster');
const Shift = require('../../../models/shifts');

let tmppath = '';

const uploadFileRoster =  async ( _, { file },{me, tenantid}) => new Promise(async (resolve, reject) => {
  fs.mkdtemp(path.join(os.tmpdir(), 'foo-'), (err, directory) => {
    if (err) throw err;
    tmppath = directory;
    // Prints: /tmp/foo-itXde2 or C:\Users\...\AppData\Local\Temp\foo-itXde2
    processUpload(file, tmppath).then(upload => {
      if(!upload) reject(new Error('Upload failed!'));
      Upload.create(upload).then( async up => {
        if(!up) reject(new Error('Upload failed!'));

        const uploadedRoster = excelReader.readExcel(upload.path);
        
        const newusers = [];
        uploadedRoster.forEach(async (ros, idx) => {
          const tempDateArr = [];
          for(let item in Object.keys(ros)) {
            if(
              Object.keys(ros)[item] !== "month" &&
              Object.keys(ros)[item] !== "eCode" &&
              Object.keys(ros)[item] !== "username" &&
              Object.keys(ros)[item] !== "Department"
              ) {
                const parse = new Date(Object.keys(ros)[item] + '-' + uploadedRoster[0]['month'] + 'GMT').toISOString();
                tempDateArr.push({
                  date: parse,
                  shifts: ros[Object.keys(ros)[item]],
                });
            }
          }
          if(tempDateArr.length) {
            newusers.push({
              month: tempDateArr[0].date,
              department: uploadedRoster[0].Department,
              eCode: ros.eCode,
              user: ros.eCode,
              username: ros.username,
              dateRange: tempDateArr
            })
          }
        })

        const entity = await ShiftRoster.findOne({ 
          $and: [
            { 
              month: newusers[0].month, 
              $and: [{ tenantid }] 
            }, 
            { 
              department: newusers[0].department, 
              $and: [{ tenantid }] 
            },
            { tenantid }
          ] 
        });

        if (entity) {
          reject(new Error('ShiftRoster Already Exist!'));
        } else {

          resolve(newusers);

          const newEntity = await new ShiftRoster({
            ...{
              name: upload.filename,
              status: true,
              month: newusers[0].month,
              department: newusers[0].department,
              users: newusers,
              tenantid,
              audit: {
                created_at: new Date(),
                created_by: me?.user?.username
              }
            }
          });
          if(!newEntity) {
            reject(new Error('Unable to create ShiftRoster!'));
          }
  
          await newEntity.save();
          
          ShiftRoster.findById(newEntity._id)
          .exec( async function (err, newEntity) {
            if (err) return reject(new Error('Unable to create ShiftRoster!'));
            resolve(newEntity);
          });

        }
        
      });
    })
  });
});

const storeUpload = async ({ stream, filename, mimetype }) => {
  const id = shortid.generate();
  const path = `${tmppath}/${id}-${filename}`;
  return new Promise((resolve, reject) =>
    stream
      .pipe(fs.createWriteStream(path))
      .on("finish", () => resolve({ id, path, filename, mimetype }))
      .on("error", reject)
  );
};
const processUpload = async (upload) => {
  const { file } = await upload;
  const stream = file.createReadStream();
  return await storeUpload({ stream, filename: file.filename, mimetype: file.mimetype });
};


module.exports = uploadFileRoster;
