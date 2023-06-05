const shortid = require('shortid');
const Upload = require('../../../models/upload')
const fs = require("fs");
const readline = require('readline');
const async = require('async');
const path = require('path');
const os = require('os');
const tmpDir = os.tmpdir();
const excelReader = require('../../../utils/excel-reader');
const User = require('../../../models/user');
const Attendances = require('../../../models/attendances');
let tmppath = '';
const moment = require('moment');

const uploadFileAttendance = async (_, {
    file
}, {
    me,
    tenantid
}) => new Promise(async (resolve, reject) => {

    fs.mkdtemp(path.join(os.tmpdir(), 'foo-'), (err, directory) => {
        if (err) throw err;
        tmppath = directory;
        processUpload(file, tmppath).then(upload => {
            if (!upload) reject(new Error('Upload failed!'));
            Upload.create(upload).then(async up => {
                if (!up) reject(new Error('Upload failed!'));
                // const employees = excelReader.readExcel(upload.path);
                // console.log('===========employees===========');
                // console.log(employees);

                let employees = [];
                const fileStream = fs.createReadStream(upload.path);
                const rl = readline.createInterface({
                    input: fileStream,
                    crlfDelay: Infinity
                });

                var json = {}

                function getArray(cb) {
                    data = []

                    rl.on('line', (line) => {
                        if (line == ";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;") {
                            console.log("Jumping...")
                        } else {
                            line = line.replaceAll(/�/g, ' ')
                            line_splited = line.split(";")
                            data.push(line_splited)
                        }

                    });

                    rl.on('close', () => {
                        console.log('Converted from csv to array...');
                        cb(data)
                    });
                }

                function extractJson(cbfinal) {
                    cnt = 0
                    employee_cnt = 1

                    getArray((data) => {

                        var d = 0

                        async.whilst(
                            (cb) => {
                                // perform before each execution of iterFunctionInside, you need a condition(or other related condition) in 2nd params.
                                cb(null, d < 10)
                            },
                            // this func is called each time when functionName1 invoked
                            (cb) => {

                              if(data[d][0].includes('Performance Register from')) {
                                month = data[d][0].substring(29, 31);
                                year = data[d][0].substring(32, 36);
                              }
                                if (data[d][0] == '"PAYCODE, CARD NO. & NAME"'){

                                    json[`Employee${employee_cnt}`] = {}
                                    employee_cnt++

                                    var p = parseInt(d)

                                    var i = 1
                                    while (i < data[d].length) {
                                        try {


                                            var num_m = data[p - 1][i]
                                            num_m = num_m.trim()
                                            if (num_m != "") {
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`] = {}
                                                employee_data = data[d][4].split(" ")

                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["paycode"] = employee_data[0]
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["eCode"] = employee_data[0]
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["card no."] = employee_data[1]
                                                employee_name = ""
                                                var b = 2;


                                                while (b < employee_data.length) {
                                                    employee_name = `${employee_name} ${employee_data[b]}`
                                                    b++
                                                }

                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["name"] = employee_name.trim()
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["present"] = data[d][10]
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["holiday"] = data[d][13]
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["w. off"] = data[d][16]
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["absent"] = data[d][19]
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["absent"] = data[d][22]
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["hour work"] = data[d][25]
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["ot"] = data[d][28]
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["designation"] = data[p + 1][2].substring(12, )
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["department"] = data[p + 1][10].substring(11, )
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["in1"] = data[p + 2][i].trim()
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["inTime"] = moment(`${year}-${month}-${num_m}` + " " + data[p + 2][i].trim())
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["out1"] = data[p + 3][i].trim()
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["outTime"] = moment(`${year}-${month}-${num_m}` + " " + data[p + 3][i].trim())
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["in2"] = data[p + 4][i].trim()
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["out2"] = data[p + 5][i].trim()
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["h work"] = data[p + 6][i].trim()
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["ot"] = data[p + 7][i].trim()
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["status"] = data[p + 11][i].trim()
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["shift"] = data[p + 12][i].trim()
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["date"] = `${num_m}`.trim() 
                                                json[`Employee${employee_cnt - 1}`][`${num_m}`]["date"] = moment(`${year}-${month}-${num_m}`);

                                            }
                                        } catch (e) {

                                        }
                                        i++
                                    }
                                }

                                d++

                                // console.log(d)

                                setTimeout(() => {
                                    cb()
                                }, 1)

                            },
                            (err, n) => {
                                console.log('end');

                                cbfinal(json)
                            }
                        );

                    })
                }

                extractJson(async (json) => {
                    employees = json;
                    const aggrrArr = [];
                    for (let x in employees) {
                      let count = 0;
                      for (let y in employees[x]) {
                        if(count < 1) {
                         // console.log(this.emp_data[x][y].paycode)
                          // const user  = async User.findByID(this.emp_data[x][y].paycode)
                        }
                        aggrrArr.push(employees[x][y])
                        ++count
                      }
                    }
                      try {
                       
                        const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
                        await Promise.all(aggrrArr.map(async delay => {
                            await wait(delay)
                            delay.user = await User.findOne({
                                eCode: delay.eCode
                            });

                        }))
                        let newSplitArr = [];
                        await aggrrArr.forEach(async (u) => {
                            delete u.paycode;
                            delete u.name;
                            delete u.present;
                            delete u.holiday;
                            delete u.absent;
                            delete u.designation;
                            delete u.department;
                            delete u.in1;
                            delete u.out2;
                            delete u.status;
                            delete u.in2;
                            delete u.out1;
                            delete u.date;
                            delete u["card no."];
                            delete u["w. off"];
                            delete u["h work"];
                            Total_hour =  u["hour work"];
                            delete u["hour work"];
                            u.userId = u.user._id;
                            u.user = u.user._id;
                            u.shift = u.shift;
                            u.overTime = u.ot;
                            u.totalDayWorkingHours = Total_hour;
                            u.tenantid = tenantid;
                            u.date = u.inTime;
                            u.audit = {
                                created_at: new Date(),
                                tenantid: tenantid,
                                created_by: me.user.username
                            };

                            if(u.inTime) {
                                newSplitArr.push(
                                  Object.assign({}, u, { outTime: null }),
                                  Object.assign({}, u, { inTime: null })
                                )
                              }

                        });
                        
                        resolve(newSplitArr);
                    } catch (e) {
                        reject()
                    }
   
                    // try {
                       
                    //     const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
                    //     await Promise.all(employees.map(async delay => {
                    //         await wait(delay)
                    //         delay.user = await User.findOne({
                    //             eCode: delay.eCode
                    //         });

                    //     }))
                    //    //  console.log(employees);
                    //     await employees.forEach(async (u) => {
                    //         u.userId = u.user._id;
                    //         u.user = u.user._id;
                    //         u.tenantid = tenantid;
                    //         u.date = u[0].inTime;
                    //         u.audit = {
                    //             created_at: new Date(),
                    //             tenantid: tenantid,
                    //             created_by: me.user.username
                    //         };

                    //     });
                    //     resolve(employees);
                    // } catch (e) {
                    //     reject()
                    // }
                })

            });
        })
    });
});

const storeUpload = async ({
    stream,
    filename,
    mimetype
}) => {
    const id = shortid.generate();
    const path = `${tmppath}/${id}-${filename}`;
    return new Promise((resolve, reject) =>
        stream
        .pipe(fs.createWriteStream(path))
        .on("finish", () => resolve({
            id,
            path,
            filename,
            mimetype
        }))
        .on("error", reject)
    );
};
const processUpload = async (upload) => {
    const {
        file
    } = await upload;
    const stream = file.createReadStream();
    return await storeUpload({
        stream,
        filename: file.filename,
        mimetype: file.mimetype
    });
};


module.exports = uploadFileAttendance;