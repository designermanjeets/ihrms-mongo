const shortid = require('shortid');
const Upload = require('../../../models/upload')
const fs = require('fs');
const path = require('path');
const os = require('os');
const tmpDir = os.tmpdir();
const excelReader = require('../../../utils/excel-reader');
const User = require('../../../models/user');

let tmppath = '';

const uploadFile =  async ( _, { file },{ me, tenantid}) => new Promise(async (resolve, reject) => {
  fs.mkdtemp(path.join(os.tmpdir(), 'foo-'), (err, directory) => {
    if (err) throw err;
    tmppath = directory;
    // Prints: /tmp/foo-itXde2 or C:\Users\...\AppData\Local\Temp\foo-itXde2
    processUpload(file, tmppath).then(upload => {
      if(!upload) reject(new Error('Upload failed!'));
      Upload.create(upload).then( async up => {
        if(!up) reject(new Error('Upload failed!'));
        const employees = excelReader.readExcel(upload.path);
        const IDsArr = []; 
        await employees.forEach(async x => {
          x.eCode && IDsArr.push(x.eCode);
          x['tenantid'] = tenantid;
          (x.status == null || x.status == "") && (x['status'] = true);
        });
        const DBUsers = await User.find({ 'eCode': { $in: IDsArr } });

        // Find Duplicates
        const lookup = employees.reduce((a, e) => {
          a[e.eCode] = ++a[e.eCode] || 0;
          return a;
        }, {});
        const dups = employees.filter(e => lookup[e.eCode]);

        // Find Invalid Users i.e. without eCode, usernames etc
        const invalids = [];
        employees.forEach(u => {
          if(
            !u.hasOwnProperty('eCode') ||
            !u.hasOwnProperty('username')
          ) {
            invalids.push(u);
          }
        })
        
        resolve([{employees, dups, invalids, DBUsers}]);
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


module.exports = uploadFile;
