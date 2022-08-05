const fs = require('fs')

exports.getAPI = (res) => {
    return fs.readFile(`${__dirname}/endpoints.json`, 'utf-8', (err, data) => {
        if(err){
            return Promise.reject(err)
        }
        res.status(200).send({api: JSON.parse(data)})
    })
}