var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ArchiveSchema = new Schema({
    userId: {
        type: String,
        ref: 'User'
    },
    period: {
        type: String,
        required: true,
    },
    totalBudget: {
        type: Number,
        required: true
    },
    totalExpenses: {
        type: Number,
        required: true
    },
    totalSavings: {
        type: Number,
        required: true
    }
},
    {
        timestamps: true,
        id: false,
        versionKey: false,
        toJSON: {
            virtuals: true,
        },
        toObject: {
            virtuals: true
        }
    });

// ArchiveSchema
//     .post('save', (doc) => {
//         var data = {
//             'id': doc._id,
//             'totalSavings': doc.totalSavings,
//             'totalExpenses': doc.totalExpenses,
//             'totalBudget': doc.totalBudget
//         }
//         var csv = json2csv({
//             data: data
//         }).exec()
//             .then(fs.writeFile(csvFile, csv, function (err) {
//                 if (err) throw err;
//                 console.log(csv);
//                 res.send('done');
//             }));
//     });

ArchiveSchema
    .path('period')
    .validate((value) => {
        return this.constructor.findOne({ period: value })
            .exec()
            .then(archive => {
                if (archive) {
                    if (this._id === archive._id) {
                        return true;
                    }
                    return false;
                }
                return true;
            })
            .catch(err => {
                throw err;
            });
    }, 'Period Already exists, Please make sure that your saving your last Budget Profile');

module.exports = mongoose.model('Archive', ArchiveSchema);