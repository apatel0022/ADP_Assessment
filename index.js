const axios = require('axios')

const app = async () => {
    // Making Get Request
    const {data} = await axios.get('https://interview.adpeai.com/api/v2/get-task')

    //Initializing local dictionary
    const temp = {}

    //Filtering data get transaction of prior calander year
    data.transactions.filter(trans => new Date(trans.timeStamp).getFullYear() == new Date().getFullYear() - 1)
        .map(trans => {
            //adding the ammount and transIds(alpha) in local dictionary
            if (trans.employee.id in temp) {
                temp[`${trans.employee.id}`]['amount'] += trans.amount
                trans.type === "alpha" ? temp[`${trans.employee.id}`]['transIds'].push(trans.transactionID) : null
            } else {
                temp[`${trans.employee.id}`] = {
                    'amount': trans.amount,
                    'transIds': trans.type === "alpha" ? [trans.transactionID] : []
                }
            }

        })


    let maxAmount = 0;
    let maxEmp = {}

    //Finding the year's top earner
    Object.keys(temp).map((emp) => {
        if (temp[emp].amount > maxAmount) {
            maxAmount = temp[emp].amount
            maxEmp = temp[emp]

        }
    })

    //Sending the POST reuest
    let res = await axios.post('https://interview.adpeai.com/api/v2/submit-task', {
        id: data.id,
        result: maxEmp.transIds
    })

    //printing response status and status code
    console.log(res.status, res.statusText)
}

app()