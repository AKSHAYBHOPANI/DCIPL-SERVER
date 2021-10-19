const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')
const PORT = process.env.PORT || 8000;
const fastcsv = require("fast-csv");
const Json2csvParser = require("json2csv").Parser;
const fs = require("fs");
const ws = fs.createWriteStream("./users.csv");
const ws2 = fs.createWriteStream("./investment.csv");
const ws3 = fs.createWriteStream("./tax.csv");
const wsEstate = fs.createWriteStream("./estate.csv");
const nodemailer = require("nodemailer");
const nodeMail = require('./nodemail');
const { captureRejectionSymbol } = require('events');
const multer = require("multer");
const Meeting = require('google-meet-api').meet;
const { getMaxListeners } = require('process');
const stripe = require('stripe')('sk_test_51JfjGDSCvFaRLDQmeZZUCO1rHRjTBKgmBmYuO5XbH7Bn3RkjGb9IuuNgDVDy7hqJm7b9ONGfdRjgXwW90M4eO1lf00VxeQ4JC1');
const YOUR_DOMAIN = 'https://dcipl.yourtechshow.com';
const db = knex({
  // Enter your own database information here based on what you created
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '12345',
    database: 'dc'
  }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());

app.get('/resumes', (req, res) => {
    let filenames = fs.readdirSync('./Resumes');
    filenames.forEach((file) => {
    console.log("File:", file);
});
    res.send(filenames)

})

app.get('/stats-users', (req, res) => {
  db.select().from('users').then(data => {
    var data = {
      "users": data.length
    }
    res.send(data)
  })
})

app.get('/getUserCsv', (req, res) => {
  db.select().from('users').then(data => {

    res.send(200)
    const json2csvParser = new Json2csvParser({ header: true });
    const csv = json2csvParser.parse(data);

    fs.writeFile("users.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to users.csv successfully!");
    });
  })
})

app.get('/getOnboardingCsv', (req, res) => {
  db.select().from('onboarding').then(data => {

    res.send("Success")
    const json2csvParser = new Json2csvParser({ header: true });
    const csv = json2csvParser.parse(data);

    fs.writeFile("onboarding.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to onboarding.csv successfully!");
    });
  })
})

app.get('/getInvestmentCsv', (req, res) => {
  db.select().from('investment').then(data => {

    res.send("Success")
    const json2csvParser = new Json2csvParser({ header: true });
    const csv = json2csvParser.parse(data);

    fs.writeFile("investment.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to investment.csv successfully!");
    });
  })
})



app.get('/getTaxCsv', (req, res) => {
  db.select().from('tax').then(data => {

    res.send("Success")
    const json2csvParser = new Json2csvParser({ header: true });
    const csv = json2csvParser.parse(data);

    fs.writeFile("tax.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to tax.csv successfully!");
    });
  })
})


app.get('/stats-tax', (req, res) => {
  db.select().from('tax').then(data => {
    var data = {
      "tax": data.length
    }
    res.send(data)
  })
})


app.get('/stats-investment', (req, res) => {
  db.select().from('investment').then(data => {
    var data = {
      "investment": data.length
    }
    res.send(data)
  })
})

app.get('/getRetirementCsv', (req, res) => {
  db.select().from('retirement').then(data => {

    res.send("Success")
    const json2csvParser = new Json2csvParser({ header: true });
    const csv = json2csvParser.parse(data);

    fs.writeFile("retirement.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to retirement.csv successfully!");
    });
  })
})

app.get('/stats-retirement', (req, res) => {
  db.select().from('retirement').then(data => {
    var data = {
      "retirement": data.length
    }
    res.send(data)
  })
})

app.get('/onboarding-data', (req, res) => {
  db.select().from('onboarding').then(data => {
    res.send(data)
  })

})

app.get('/portfolio-data', (req, res) => {
  db.select().from('investmentportfolio').then(data => {
    res.send(data)
  })

})

app.get('/portfolio-data/:email', (req, res) => {
  const { email } = req.params;
  db.select('*').from('investmentportfolio').where({ email })
    .then(user => {
      if (user[0].id) {
        res.json(user)
      } else {
        res.status(400).json('Not found')
        console.log(user)
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})


app.get('/portfolioequity-data/:id', (req, res) => {
  const { id } = req.params;
  db.select().from(`${id}`).then(data => {
    res.send(data)
  })

})

app.get('/wealthportfolioequity-data/:id', (req, res) => {
  const { id } = req.params;
  db.select().from(`${id}`).then(data => {
    res.send(data)
  })

})

app.get('/wealth-portfolio-data', (req, res) => {
  db.select().from('wealthportfolio').then(data => {
    res.send(data)
  })

})

app.get('/wealth-portfolio-data/:email', (req, res) => {
  const { email } = req.params;
  db.select('*').from('wealthportfolio').where({ email })
    .then(user => {
      if (user[0].id) {
        res.json(user)
      } else {
        res.status(400).json('Not found')
        console.log(user)
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})


app.get('/retirementportfolioequity-data/:id', (req, res) => {
  const { id } = req.params;
  db.select().from(`${id}`).then(data => {
    res.send(data)
  })

})

app.get('/retirement-portfolio-data', (req, res) => {
  db.select().from('retirementportfolio').then(data => {
    res.send(data)
  })

})

app.get('/retirement-portfolio-data/:email', (req, res) => {
  const { email } = req.params;
  db.select('*').from('retirementportfolio').where({ email })
    .then(user => {
      if (user[0].id) {
        res.json(user)
      } else {
        res.status(400).json('Not found')
        console.log(user)
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})

app.get('/taxportfolioequity-data/:id', (req, res) => {
  const { id } = req.params;
  db.select().from(`${id}`).then(data => {
    res.send(data)
  })

})

app.get('/tax-portfolio-data', (req, res) => {
  db.select().from('taxportfolio').then(data => {
    res.send(data)
  })

})

app.get('/tax-portfolio-data/:email', (req, res) => {
  const { email } = req.params;
  db.select('*').from('taxportfolio').where({ email })
    .then(user => {
      if (user[0].id) {
        res.json(user)
      } else {
        res.status(400).json('Not found')
        console.log(user)
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})

app.get('/getRetirementCsv', (req, res) => {
  db.select().from('retirement').then(data => {

    res.send("Success")
    const json2csvParser = new Json2csvParser({ header: true });
    const csv = json2csvParser.parse(data);

    fs.writeFile("retirement.csv", csv, function (error) {
      if (error) throw error;
      console.log("Write to retirement.csv successfully!");
    });
  })
})

app.get('/stats-retirement', (req, res) => {
  db.select().from('retirement').then(data => {
    var data = {
      "retirement": data.length
    }
    res.send(data)
  })
})

app.get('/users', (req, res) => {
  db.select().from('users').then(data => {
    res.send(data)
  })

})

app.get('/investment', (req, res) => {
  db.select().from('investment').then(data => {
    res.send(data)
  })

})
app.get('/retirement', (req, res) => {
  db.select().from('retirement').then(data => {
    res.send(data)
  })

})

app.get('/tax', (req, res) => {
  db.select().from('tax').then(data => {
    res.send(data)
  })

})



app.get('/getEstateCSV', async (req, res) => {
  try {
    const estateData = await db.select().from('estate');

    const json2csvParser = new Json2csvParser({ header: true });
    const csv = json2csvParser.parse(estateData);

    fs.writeFile("estate.csv", csv, function (error) {
      if (error) {
        throw error;
      }
      console.log("Write to investment.csv successfully!");
    });

    res.status(200).json('Success');
  } catch (error) {
    res.status(400).json('Something went Wrong!');
  }
});

app.get('/stats-estate', async (req, res) => {
  try {
    const estateData = await db.select().from('estate');

    res.status(200).json({ 'Estate': estateData.length });
  } catch (error) {
    res.status(400).json('Something went Wrong!');
  }
});

app.get('/estate', async (req, res) => {
  try {
    const estateData = await db.select().from('estate');

    res.status(200).json(estateData);
  } catch (error) {
    res.status(400).json('Something went Wrong!')
  }
});

app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (isValid) {
        return db.select('*').from('users')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('unable to get user'))
      } else {
        res.status(400).json('wrong credentials')
      }
    })
    .catch(err => res.status(400).json('wrong credentials'))
})

app.post('/register', (req, res) => {
  const { email, name, mobile, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
      .into('login')
      .returning('email')
      .then(loginEmail => {
        return trx('users')
          .returning('*')
          .insert({
            email: loginEmail[0],
            mobile: mobile,
            name: name,
            joined: new Date()
          })
          .then(user => {
            res.json(user[0]);
          })
      })
      .then(trx.commit)
      .catch(trx.rollback)
  })
    .catch(err => res.status(400).json(err))
})

app.post('/onboarding', (req, res) => {
  const {
    name,
    email,
    age,
    assets,
    liabilities,
    cibil,
    fixedincome,
    fixedexpense,
    expectedSal,
    withdrawPrincipal,
    period,
    sourceOfIncome,
    majorExpense,
    stockInvest,
    bondInvest,
    goal,
    yearsInvested,
    overtime,
    yearlyExpect,
    longtermGrowth,
    portfolio,
    outlookShorterm,
    outlookLongterm,
    objective

  } = req.body;

  // calculation of risk ability

  var points = 0;
  var DI = parseInt(liabilities) / parseInt(fixedincome);
  var FOIR = parseInt(fixedexpense) / parseInt(fixedincome);
  var DA = parseInt(liabilities) / parseInt(assets);
  var recurring = parseInt(fixedincome) / parseInt(expectedSal);
  var riskability = "";


  if (parseInt(expectedSal) >= 3000000)
    points += 4;
  else if (parseInt(expectedSal) >= 2000000)
    points += 3;
  else if (parseInt(expectedSal) >= 1000000)
    points += 2;
  else if (parseInt(expectedSal) >= 500000)
    points += 1;


  if (parseInt(withdrawPrincipal) >= 20)
    points += 4;
  else if (parseInt(withdrawPrincipal) >= 10)
    points += 3;
  else if (parseInt(withdrawPrincipal) >= 5)
    points += 2;
  else if (parseInt(withdrawPrincipal) >= 1)
    points += 1;


  if (parseInt(period) >= 20)
    points += 3;
  else if (parseInt(period) >= 10)
    points += 2;
  else if (parseInt(period) >= 5)
    points += 1;


  if (sourceOfIncome === "Unstable") points += 1;
  else if (sourceOfIncome === "Somewhat Stable") points += 2;
  else if (sourceOfIncome === "Stable") points += 3;
  else if (sourceOfIncome === "Very Stable") points += 4;

  if (majorExpense === "Strongly Agree") points += 4;
  else if (majorExpense === "Agree") points += 3;
  else if (majorExpense === "Neutral") points += 2;
  else if (majorExpense === "Disagree") points += 1;


  if (DI <= 0.3) points += 2;
  else if (DI <= 0.5) points += 1;


  if (FOIR <= 0.3) points += 2;
  else if (FOIR <= 0.5) points += 1;

  if (cibil >= 750) points += 2;
  else if (cibil >= 550) points += 1;

  if (DA <= 0.3) points += 2;
  else if (DA <= 0.5) points += 1;

  if (recurring >= 0.80) points += 2;
  else if (recurring >= 0.50) points += 1;


  if (points > 19) riskability = "High";
  else if (points >= 10) riskability = "Medium";
  else riskability = "Low";



  // Calculation for risk willingness

  var willingness_points = 0;
  var riskWillingness = "";

  if (parseInt(age) >= 60) willingness_points += 1;
  else if (parseInt(age) >= 45) willingness_points += 2;
  else if (parseInt(age) >= 31) willingness_points += 3;
  else willingness_points += 4;

  if (stockInvest === "Sell a portion of remaining investments") willingness_points += 1;
  else if (stockInvest === "Hold on to investments and sell nothing") willingness_points += 2;
  else if (stockInvest === "Buy more of the investments") willingness_points += 3;

  if (bondInvest === "Sell a portion of remaining investments") willingness_points += 1;
  else if (bondInvest === "Hold on to investments and sell nothing") willingness_points += 2;
  else if (bondInvest === "Buy more of the investments") willingness_points += 3;

  if (goal === "Secure the safety of my hard earned investment principal") willingness_points += 3;
  else if (goal === "Get Income as a Primary concern, Capital Appreciation as Secondary") willingness_points += 2;
  else if (goal === "Potentially increase my portfolioâ€™s value at a moderate pace while accepting moderate to high levels of risk or loss of principal") willingness_points += 1;

  if (yearsInvested === "eight - fifteen years") willingness_points += 1;
  else if (yearsInvested === "one - seven years") willingness_points += 2;
  else if (yearsInvested === "Never Invested") willingness_points += 3;

  if (overtime === "Outpace the market, have higher volatility") willingness_points += 3;
  else if (overtime === "Generally keep pace with the market") willingness_points += 2;
  else if (overtime === "have lower risk and lower returns") willingness_points += 1;

  if (yearlyExpect === "Potential gain of 6% and a potential loss of 2%") willingness_points += 1;
  else if (overtime === "Potential gain of 8% and a potential loss of 4%") willingness_points += 2;
  else if (overtime === "Potential gain of 12% and a potential loss of 8%") willingness_points += 3;
  else if (overtime === "Potential gain of 20% and a potential loss of 15%") willingness_points += 4;

  if (longtermGrowth === "Strongly Agree") willingness_points += 4;
  else if (longtermGrowth === "Agree") willingness_points += 3;
  else if (longtermGrowth === "Neutral") willingness_points += 2;
  else if (longtermGrowth === "Disagree") willingness_points += 1;


  if (portfolio === "Portfolio 1") willingness_points += 3;
  else if (portfolio === "Portfolio 2") willingness_points += 2;
  else if (portfolio === "Portfolio 3") willingness_points += 1;

  if (outlookShorterm === "Very Positive") willingness_points += 4;
  else if (outlookShorterm === "Modestly Positive") willingness_points += 3;
  else if (outlookShorterm === "Neutral") willingness_points += 2;
  else if (outlookShorterm === "Very Negative") willingness_points += 1;


  if (outlookLongterm === "Very Positive") willingness_points += 4;
  else if (outlookLongterm === "Modestly Positive") willingness_points += 3;
  else if (outlookLongterm === "Neutral") willingness_points += 2;
  else if (outlookLongterm === "Very Negative") willingness_points += 1;


  if (objective === "To assure the safety for principal") willingness_points += 4;
  else if (objective === "To accumulate assets for retirement") willingness_points += 3;
  else if (objective === "To generate income") willingness_points += 2;
  else if (objective === "Growth") willingness_points += 1;

  if (willingness_points > 28) riskWillingness = "High";
  else if (willingness_points >= 14) riskWillingness = "Medium";
  else riskWillingness = "Low";

  // Calculating Total Risk

  var totalRisk = "";

  if (riskability === "High") {

    if (riskWillingness === "High") totalRisk = "High";
    else if (riskWillingness === "Medium") totalRisk = "Medium";
    else if (riskWillingness === "Low") totalRisk = "Low";

  } else if (riskability === "Medium") {

    if (riskWillingness === "High") totalRisk = "Medium";
    else if (riskWillingness === "Medium") totalRisk = "Medium";
    else if (riskWillingness === "Low") totalRisk = "Low";

  } else if (riskability === "Low") {

    if (riskWillingness === "High") totalRisk = "Low";
    else if (riskWillingness === "Medium") totalRisk = "Low";
    else if (riskWillingness === "Low") totalRisk = "Low";

  }



  var data = {
    "name": name,
    "email": email,
    "age": age,
    "assets": assets,
    "liabilities": liabilities,
    "cibil": cibil,
    "fixedincome": fixedincome,
    "fixedexpense": fixedexpense,
    "expectedsal": expectedSal,
    "debt_by_income": DI,
    "foir": FOIR,
    "debt_by_assets": DA,
    "reccuring": recurring,
    "withdrawprincipal": withdrawPrincipal,
    "period": period,
    "sourceOfincome": sourceOfIncome,
    "majorexpense": majorExpense,
    "stockinvest": stockInvest,
    "bondnvest": bondInvest,
    "goal": goal,
    "yearsinvested": yearsInvested,
    "overtime": overtime,
    "yearlyexpect": yearlyExpect,
    "longtermgrowth": longtermGrowth,
    "portfolio": portfolio,
    "outlookshorterm": outlookShorterm,
    "outlooklongterm": outlookLongterm,
    "objective": objective,
    "riskwillingness": riskWillingness,
    "riskability": riskability,
    "totalrisk": totalRisk

  };
  db.insert({
    name: name,
    email: email,
    age: age,
    assets: assets,
    liabilities: liabilities,
    cibil: cibil,
    fixedincome: fixedincome,
    fixedexpense: fixedexpense,
    expectedsal: expectedSal,
    debt_by_income: DI,
    foir: FOIR,
    debt_by_assets: DA,
    reccuring: recurring,
    withdrawprincipal: withdrawPrincipal,
    period: period,
    sourceofincome: sourceOfIncome,
    majorexpense: majorExpense,
    stockinvest: stockInvest,
    bondnvest: bondInvest,
    goal: goal,
    yearsinvested: yearsInvested,
    overtime: overtime,
    yearlyexpect: yearlyExpect,
    longtermgrowth: longtermGrowth,
    portfolio: portfolio,
    outlookshorterm: outlookShorterm,
    outlooklongterm: outlookLongterm,
    objective: objective,
    riskwillingness: riskWillingness,
    riskability: riskability,
    totalrisk: totalRisk
  }).into('onboarding').asCallback(function (err) {

    if (err) {
      res.status(400).json(err)
      console.log(err)
    } else {
      db("users")
      .update({onboarded:true})
      .where({email:email})
      .then(u => console.log(u))
      .catch(e => res.status(500).json(e));
      res.status(200).json(data);
    }


  })

});

app.post('/integrated', async (req, res) => {
  try {
    const {
      name,
      email,
      age,
      targetForInvestment,
      time,
      targetForGoals,
      timeForInvestment,
      targetForRetirement,
      timeToRetire,
      deductions
    } = req.body;

    var onboardingData = await db.column('fixedincome', 'fixedexpense').select().from('onboarding').where('email', '=', email);

    var fixedIncome = onboardingData[0].fixedincome;
    var fixedExpense = onboardingData[0].fixedexpense;

    var taxData = await db.column('incomefromsalary', 'incomefromhousingproperty', 'incomefrombusinessandprofession', 'incomefromcapitalgains', 'incomefromothersources', 'taxliability', 'plan', 'allocation', 'weightedreturn', 'taxsaving', 'totalbenefit').select().from('tax').where('email', '=', email);
    var incomeFromSalary = taxData[0].incomefromsalary;
    var incomeFromHousingProperty = taxData[0].incomefromhousingproperty;
    var incomeFromBusinessAndProfession = taxData[0].incomefrombusinessandprofession;
    var incomeFromCapitalGains = taxData[0].incomefromcapitalgains;
    var incomeFromOtherSources = taxData[0].incomefromothersources;
    var taxliability = taxData[0].taxliability;

    var wealthData = await db.column('targetamount', 'depositperyear', 'return', 'plan', 'weightedsd').select().from('wealth').where('email', '=', email);

    var balanceForWealth = wealthData[0].targetamount;
    var depositperyearForWealth = wealthData[0].depositperyear;
    var weightedSDForWealth = wealthData[0].weightedsd;

    var weightedReturnForWealth = "";
    if (weightedSDForWealth == "9.19") {
      weightedReturnForWealth = "10.35";
    }
    else if (weightedSDForWealth == "13.89") {
      weightedReturnForWealth = "12.70";
    }
    else if (weightedSDForWealth == "23.06") {
      weightedReturnForWealth = "15.83";
    }
    else if (weightedSDForWealth == "8.54") {
      weightedReturnForWealth = "9.68";
    }
    else if (weightedSDForWealth == "12.01") {
      weightedReturnForWealth = "11.87";
    }
    else if (weightedSDForWealth == "18.72") {
      weightedReturnForWealth = "14.00";
    }
    else if (weightedSDForWealth == "8.54") {
      weightedReturnForWealth = "8.66";
    }
    else if (weightedSDForWealth == "12.68") {
      weightedReturnForWealth = "10.92";
    }
    else if (weightedSDForWealth == "18.39") {
      weightedReturnForWealth = "13.20";
    }

    var retirementData = await db.column('targetamount', 'depositperyear', 'weightedreturn', 'plan', 'weightedsd').select().from('retirement').where('email', '=', email);

    var balanceForRetirement = retirementData[0].targetamount;
    var depositperyearForRetirement = retirementData[0].depositperyear;
    var weightedreturnForRetirement = retirementData[0].weightedreturn;

    var investmentData = await db.column('totalincome', 'totalexpenses ', 'surplus', 'margin', 'breakeven', 'marginofsafety', 'marginofsafetyrs', 'burnrate', 'investableamount', 'riskability').select().from('investment').where('email', '=', email);

    var totalIncome = investmentData[0].totalincome;
    var totalExpenses = investmentData[0].totalexpenses;
    var surplus = investmentData[0].surplus;
    var margin = investmentData[0].margin;
    var breakeven = investmentData[0].breakeven;
    var marginofsafety = investmentData[0].marginofsafety;
    var marginofsafetyrs = investmentData[0].marginofsafetyrs;
    var burnrate = investmentData[0].burnrate;
    var investableamount = investmentData[0].investableamount;
    var riskability = investmentData[0].riskability;

    var interestForWealth = parseInt(balanceForWealth) * parseInt(weightedReturnForWealth);
    var endBalanceForWealth = parseInt(balanceForWealth) + parseInt(depositperyearForWealth) + parseInt(interestForWealth);
    var interestForRetirement = parseInt(balanceForRetirement) * parseInt(weightedreturnForRetirement);
    var endBalanceForRetirement = parseInt(balanceForRetirement) + parseInt(depositperyearForRetirement) + parseInt(interestForRetirement);

    var planForInvestment = "";
    if (riskability == 'Low') {
      planForInvestment = "Low",
        allocationForInvestment = "Low"
    }
    else if (riskability == 'Medium') {
      planForInvestment = "Medium",
        allocationForInvestment = "Medium"
    }
    else if (riskability == 'High') {
      planForInvestment = "High",
        allocationForInvestment = "High"
    }

    var planForWealth = wealthData[0].plan;
    var allocationForWealth = planForWealth;
    var weightedSDForWealth = wealthData[0].weightedsd;

    var planForRetirement = retirementData[0].plan;
    var allocationForRetirement = planForRetirement;
    var weightedSDForRetirement = retirementData[0].weightedsd;

    var planForTax = taxData[0].plan;
    var allocationForTax = taxData[0].allocation;
    var weightedReturnForTax = taxData[0].weightedreturn;
    var taxSavingForTax = taxData[0].taxsaving;
    var totalBenefitForTax = taxData[0].totalbenefit;

    const data = await db.insert({
      name: name,
      email: email,
      age: age,
      fixedincome: fixedIncome,
      fixedexpense: fixedExpense,
      incomefromsalary: incomeFromSalary,
      incomefromhousingproperty: incomeFromHousingProperty,
      incomefrombusinessandprofession: incomeFromBusinessAndProfession,
      incomefromcapitalgains: incomeFromCapitalGains,
      incomefromothersources: incomeFromOtherSources,
      taxliability: taxliability,
      balanceforwealth: balanceForWealth,
      depositperyearforwealth: depositperyearForWealth,
      weightedsdforwealth: weightedSDForWealth,
      weightedreturnforwealth: weightedReturnForWealth,
      balanceforretirement: balanceForRetirement,
      depositperyearforretirement: depositperyearForRetirement,
      weightedreturnforretirement: weightedreturnForRetirement,
      totalincome: totalIncome,
      totalexpenses: totalExpenses,
      surplus: surplus,
      margin: margin,
      breakeven: breakeven,
      marginofsafety: marginofsafety,
      marginofsafetyrs: marginofsafetyrs,
      burnrate: burnrate,
      investableamount: investableamount,
      riskability: riskability,
      interestforwealth: interestForWealth,
      endbalanceforwealth: endBalanceForWealth,
      interestforretirement: interestForRetirement,
      endbalanceforretirement: endBalanceForRetirement,
      planforinvestment: planForInvestment,
      allocationforinvestment: allocationForInvestment,
      planforwealth: planForWealth,
      allocationforwealth: allocationForWealth,
      planforretirement: planForRetirement,
      allocationforretirement: allocationForRetirement,
      weightedsdforretirement: weightedSDForRetirement,
      planfortax: planForTax,
      allocationfortax: allocationForTax,
      weightedreturnfortax: weightedReturnForTax,
      taxsavingfortax: taxSavingForTax,
      totalbenefitfortax: totalBenefitForTax
    }).into('integrated').returning('*');

    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json({ "error": "Someting is wrong" });
  }
});

app.post('/investment', (req, res) => {
  var { User,
    Email,
    FixedIncome,
    VariableIncome,
    FixedExpenses,
    VariableExpenses,
    Assests,
    Liabilities,
    TargetAmount,
    Time: Time,
    IncomeStability } = req.body;

  var FixedIncomeYearly = parseInt(FixedIncome) * 12;
  var VariableIncomeYearly = parseInt(VariableIncome) * 12;
  var FixedExpensesYearly = parseInt(FixedExpenses) * 12;
  var VariableExpensesYearly = parseInt(VariableExpenses) * 12;
  var TotalIncome = parseInt(FixedIncomeYearly) + parseInt(VariableIncomeYearly);
  var TotalExpenses = parseInt(FixedExpensesYearly) + parseInt(VariableExpensesYearly);
  var Surplus = parseInt(TotalIncome) - parseInt(TotalExpenses);
  var Margin = (parseInt(TotalIncome) - parseInt(VariableExpensesYearly)) / parseInt(TotalIncome);
  var BreakEven = parseInt(FixedExpensesYearly) / Margin;
  var MarginOfSafety = (parseInt(TotalIncome) - BreakEven) / parseInt(TotalIncome);
  var MarginOfSafetyRs = MarginOfSafety * parseInt(TotalIncome);
  var BurnRate = (MarginOfSafetyRs / parseInt(FixedExpensesYearly)) * 12;
  var NetWorth = parseInt(Assests) - parseInt(Liabilities);
  var points = 0;
  var RiskAbility = "";
  var InvestableAmount = "";

  TotalIncome = parseInt(TotalIncome);

  if (TotalIncome >= 3000000) points += 4;
  else if (TotalIncome >= 2000000) points += 3;
  else if (TotalIncome >= 1000000) points += 2;
  else if (TotalIncome >= 500000) points += 1;

  Time = parseInt(Time);

  if (Time > 20) points += 4;
  else if (Time >= 10) points += 3;
  else if (Time >= 5) points += 2;
  else if (Time > 0) points += 1;

  if (IncomeStability === "Very Unstable") points += 0;
  else if (IncomeStability === "Unstable") points += 1;
  else if (IncomeStability === "Somewhat Stable") points += 2;
  else if (IncomeStability === "Stable") points += 3;
  else if (IncomeStability === "Very Stable") points += 4;

  Assests = parseInt(Assests);

  if (Assests < TotalIncome * 6) points = points + 0;
  else if (Assests < TotalIncome * 7) points = points + 1;
  else if (Assests < TotalIncome * 8) points = points + 2;
  else if (Assests < TotalIncome * 9) points = points + 3;
  else if (Assests >= TotalIncome * 9) points = points + 4;


  if (points < 6) RiskAbility = "low"
  else if (points < 11) RiskAbility = "medium"
  else if (points >= 11) RiskAbility = "high"


  if (RiskAbility === "low") InvestableAmount = (MarginOfSafetyRs * (0.60));
  else if (RiskAbility === "medium") InvestableAmount = (MarginOfSafetyRs * (0.70));
  else if (RiskAbility === "high") InvestableAmount = (MarginOfSafetyRs * (0.80));


  var TargetReturn = (((TargetAmount - InvestableAmount) / InvestableAmount) * 100);
  var Return = (Math.pow(parseInt(TargetAmount) / InvestableAmount, 1 / Time) - 1) * 100;

  var data = {
    "name": User,
    "email": Email,
    "totalincome": (Math.round(TotalIncome * 100)) / 100,
    "totalexpenses": (Math.round(TotalExpenses * 100)) / 100,
    "assests": (Math.round(Assests * 100)) / 100,
    "liabilities": (Math.round(Liabilities * 100)) / 100,
    "investableamount": (Math.round(InvestableAmount * 100)) / 100,
    "targetamount": (Math.round(TargetAmount * 100)) / 100,
    "time": Time,
    "incomestability": IncomeStability,
    "surplus": (Math.round(Surplus * 100)) / 100,
    "margin": (Math.round(Margin * 100)) / 100,
    "breakeven": (Math.round(BreakEven * 100)) / 100,
    "marginofsafety": (Math.round(MarginOfSafety * 1000)) / 1000,
    "marginofsafetyrs": (Math.round(MarginOfSafetyRs * 100)) / 100,
    "burnrate": (Math.round(BurnRate * 100)) / 100,
    "return": (Math.round(Return * 100)) / 100,
    "networth": (Math.round(NetWorth * 100)) / 100,
    "riskability": RiskAbility,
    "targetreturn": (Math.round(TargetReturn * 100)) / 100
  };


  db.insert({
    name: User,
    email: Email,
    totalincome: (Math.round(TotalIncome * 100)) / 100,
    totalexpenses: (Math.round(TotalExpenses * 100)) / 100,
    assests: (Math.round(Assests * 100)) / 100,
    liabilities: (Math.round(Liabilities * 100)) / 100,
    investableamount: (Math.round(InvestableAmount * 100)) / 100,
    targetamount: (Math.round(TargetAmount * 100)) / 100,
    time: Time,
    incomestability: IncomeStability,
    surplus: (Math.round(Surplus * 100)) / 100,
    margin: (Math.round(Margin * 100)) / 100,
    breakeven: (Math.round(BreakEven * 100)) / 100,
    marginofsafety: (Math.round(MarginOfSafety * 1000)) / 1000,
    marginofsafetyrs: (Math.round(MarginOfSafetyRs * 100)) / 100,
    burnrate: (Math.round(BurnRate * 100)) / 100,
    return: (Math.round(Return * 100)) / 100,
    networth: (Math.round(NetWorth * 100)) / 100,
    riskability: RiskAbility,
    targetreturn: (Math.round(TargetReturn * 100)) / 100
  }).into('investment').asCallback(function (err) {

    if (err) {
      res.status(400).json(err)
      console.log(err)
    } else {
      
      // calling mailing function from nodemail.js
      nodeMail.investmentplanningMail(User,Email).catch(console.error);

      res.status(200).json(data);
    }
  })
})


app.post('/investmentPortfolio/:id', async (req, res) => {
  const { id } = req.params;
  console.log()
  try {
    const {
      name,
      email,
      
    } = req.body;

   let investableamount = await db.select('investableamount').from('investment').where('email', '=', email);

    if (!investableamount.length) {
      return res.status(404).json('User not found');
    }
    investableamount = investableamount[0].investableamount;

   
    var assetClass = "Equity";
    var data ;
    for(var i=1;i<=6;i++){
      var columnAllocated = 'allocatedweight';
      var columnreturn = 'return';
      var columnsd = 'sd';
        if(i >=2){
          columnAllocated = columnAllocated + i;
          columnreturn = columnreturn + i;
          columnsd = columnsd + i;
        }

    if(i==1) assetClass = "Equity";
    else if(i==2) assetClass = "Fixed Income";
    else if(i==3) assetClass = "Real Estate";
    else if(i==4) assetClass = "Commodities";
    else if(i==5) assetClass = "Crypto";
    else assetClass = "Forex";

    var allocationpp = await db.select(db.raw('SUM('+columnAllocated+')')).from(`${id}`);
    allocationpp = allocationpp[0].sum;
    var allocation = (investableamount * allocationpp)/100;
    //var allocatedweight = await db.select(db.raw('SUM(allocatedweight)')).from('investmentportfolioequity');
   // weightedreturnavg = weightedreturnavg[0].sum;
    var weightedreturnpp =await db.select(db.raw('SUM('+columnAllocated+' * '+columnreturn+')')).from(`${id}`);
    weightedreturnpp = weightedreturnpp[0].sum/100;
    if(allocationpp ==0){
      var weightedreturn = (allocation*weightedreturnpp);
    }else{
    var weightedreturn = (allocation*weightedreturnpp)/allocationpp;
    }
    var weightedSD = await db.select(db.raw('SUM('+columnAllocated+' * '+columnsd+')')).from(`${id}`);
    weightedSD = weightedSD[0].sum/100;
    if(allocationpp ==0){
      var SD = weightedSD*100;
    }else{
      var SD = weightedSD*100/allocationpp;
    }
    
  
    // console.log(allocationpp);
    // console.log(allocation);
    // console.log(weightedreturnpp);
    // console.log(weightedreturn);
    // console.log(weightedSD);
    // console.log(SD);
   
    data = {
      name: name,
      email: email,
      assetclass: assetClass,
     allocationpp: (Math.round(allocationpp * 100)) / 100,
      allocation: (Math.round(allocation * 100)) / 100,
      weightedreturnpp: (Math.round(weightedreturnpp * 100)) / 100,
      weightedreturn: (Math.round(weightedreturn * 100)) / 100,
      sd: (Math.round(SD * 100)) / 100,
     weightedsd: (Math.round(weightedSD * 100)) / 100
    };
    db.insert({
      name: name,
      email: email,
      assetclass: assetClass,
     allocationpp: (Math.round(allocationpp * 100)) / 100,
      allocation: (Math.round(allocation * 100)) / 100,
      weightedreturnpp: (Math.round(weightedreturnpp * 100)) / 100,
      weightedreturn: (Math.round(weightedreturn * 100)) / 100,
      sd: (Math.round(SD * 100)) / 100,
     weightedsd: (Math.round(weightedSD * 100)) / 100
    }).into('investmentportfolio').asCallback(function (err) {

      if (err) {
        res.status(400).json(err)
        console.log(err)
      } else {
        // res.status(200).json(data);
       // console.log("1 row inserted");
      }
    });
  };
    
  res.status(200).json(data);
} catch (error) {
  res.status(400).json(error);
}
});

  


app.post('/Table2/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const {
      name,
      email,
      equity,
      allocatedWeight,
      Return,
      SD,
      FixedIncome,
      allocatedWeight2,
      Return2,
      SD2,
      realEstate,
      allocatedWeight3,
      return3,
      SD3,
      commodities,
      allocatedWeight4,
      return4,
      SD4,
      crypto,
      allocatedWeight5,
      return5,
      SD5,
      forex,
      allocatedWeight6,
      return6,
      SD6

    } = req.body;

  
    const data = await db.insert({
      name: name,
      email: email,
      equity: equity,
      allocatedweight: parseFloat(allocatedWeight),
      return: parseFloat(Return),
      sd: parseFloat(SD),
      fixedincome: FixedIncome,
      allocatedweight2: parseFloat(allocatedWeight2),
      return2: parseFloat(Return2),
      sd2: parseFloat(SD2),
      realestate: realEstate,
      allocatedweight3: parseFloat(allocatedWeight3),
      return3: parseFloat(return3),
      sd3: parseFloat(SD3),
      commodities: commodities,
      allocatedweight4: parseFloat(allocatedWeight4),
      return4: parseFloat(return4),
      sd4: parseFloat(SD4),
      crypto: crypto,
      allocatedweight5: parseFloat(allocatedWeight5),
      return5: parseFloat(return5),
      sd5: parseFloat(SD5),
      forex: forex,
      allocatedweight6: parseFloat(allocatedWeight6),
      return6: parseFloat(return6),
      sd6: parseFloat(SD6)

    }).into(`${id}`).returning('*');

    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});




app.post('/IsInvestmentFormSubmitted', (req, res) => {
  const { Email } = req.body;
  db.select().from('investment').then(data => {
    data.forEach((data) => {
      if (data.email === Email) {
        res.send(data);
        console.log("Match")
      }
    })
    res.status(400).json('FORM NOT SUBMITTED');
    console.log("Not match");
  })
});

app.post('/IsWealthFormSubmitted', (req, res) => {
  const { Email } = req.body;
  db.select().from('wealth').then(data => {
    data.forEach((data) => {
      if (data.email === Email) {
        res.send(data);
        console.log("Match")
      }
    })
    res.status(400).json('FORM NOT SUBMITTED');
    console.log("Not match");
  })
});

app.post('/IsRetirementFormSubmitted', (req, res) => {
  const { Email } = req.body;
  db.select().from('retirement').then(data => {
    data.forEach((data) => {
      if (data.email === Email) {
        res.send(data);
        console.log("Match")
      }
    })
    res.status(400).json('FORM NOT SUBMITTED');
    console.log("Not match");
  })
});

app.post('/IsTaxFormSubmitted', (req, res) => {
  const { Email } = req.body;
  db.select().from('tax').then(data => {
    data.forEach((data) => {
      if (data.email === Email) {
        res.send(data);
        console.log("Match")
      }
    })
    res.status(400).json('FORM NOT SUBMITTED');
    console.log("Not match");
  })
});

app.post('/retirement', async (req, res) => {
  const { name,
    email,
    targetAmount,
    time,
  } = req.body;

  var totalRisk =  await db.select('totalrisk').from('onboarding').where('email', '=', email);

    if (!totalRisk.length) {
      return res.status(404).json('User not found');
    }
    totalRisk = totalRisk[0].totalrisk;

  var Return = 0;
  var weightedSD = "";
  var weightedReturn = "";
  var plan = "";

  if (totalRisk == "Low") {
    plan = "low",
      Return = 8.95,
      weightedSD = "8.54",
      weightedReturn = "8.95"
  }
  else if (totalRisk == 'Medium') {
    plan = "medium",
      Return = 11.11,
      weightedSD = "12.68",
      weightedReturn = "11.11"
  }
  else if (totalRisk == "High") {
    plan = "high",
      Return = 13.66,
      weightedSD = "15.94",
      weightedReturn = "13.66"
  }

  var Ret = Return / 100;
  var DepositPerYear = parseInt(targetAmount) * (Ret / (Math.pow(1 + Ret, parseInt(time)) - 1));

  var data = {
    name: name,
    email: email,
    targetamount: targetAmount,
    time: time,
    totalrisk: totalRisk,
    return: Return,
    plan: plan,
    weightedsd: weightedSD,
    depositperyear: DepositPerYear.toFixed(2),
    weightedreturn: weightedReturn,
  }

  db.insert({
    name: name,
    email: email,
    targetamount: targetAmount,
    time: time,
    totalrisk: totalRisk,
    return: Return,
    plan: plan,
    weightedsd: weightedSD,
    depositperyear: DepositPerYear.toFixed(2),
    weightedreturn: weightedReturn
  }).into('retirement').asCallback(function (err) {
    if (err) {
      res.status(400).json(err)
    }
    else {
      
      
      nodeMail.retirementplanningMail(name,mail).catch(console.error);

      res.status(200).json(data);
    }
  })
});

// Retirement Portfolio

app.post('/retirementPortfolio', async (req, res) => {
  
  console.log()
  try {
    const {
      name,
      email,
      
    } = req.body;

   let values = await db.select('depositperyear','plan').from('retirement').where('email', '=', email);

    if (!values.length) {
      return res.status(404).json('User not found');
    }
    var depositperyear = values[0].depositperyear;
    var plan = values[0].plan;

   
    var assetClass = "Equity";
    var data ;
    for(var i=1;i<=4;i++){
      var columnAllocated = 'allocatedweight';
      var columnreturn = 'return';
      var columnsd = 'sd';
        if(i >=2){
          columnAllocated = columnAllocated + i;
          columnreturn = columnreturn + i;
          columnsd = columnsd + i;
        }

    if(i==1) assetClass = "Equity";
    else if(i==2) assetClass = "Fixed Income";
    else if(i==3) assetClass = "Real Estate";
    else assetClass = "Other Investments";

    var allocationpp = await db.select(db.raw('SUM('+columnAllocated+')')).from(`${plan}`);
    allocationpp = allocationpp[0].sum;
    var allocation = (depositperyear * allocationpp)/100;
    var weightedreturnpp =await db.select(db.raw('SUM('+columnAllocated+' * '+columnreturn+')')).from(`${plan}`);
    weightedreturnpp = weightedreturnpp[0].sum/100;
    if(allocationpp ==0){
      var weightedreturn = (allocation*weightedreturnpp);
    }else{
    var weightedreturn = (allocation*weightedreturnpp)/allocationpp;
    }
    var weightedSD = await db.select(db.raw('SUM('+columnAllocated+' * '+columnsd+')')).from(`${plan}`);
    weightedSD = weightedSD[0].sum/100;
    
   
    data = {
      name: name,
      email: email,
      assetclass: assetClass,
     allocationpp: (Math.round(allocationpp * 100)) / 100,
      allocation: (Math.round(allocation * 100)) / 100,
      weightedreturnpp: (Math.round(weightedreturnpp * 100)) / 100,
      weightedreturn: (Math.round(weightedreturn * 100)) / 100,
     weightedsd: (Math.round(weightedSD * 100)) / 100
    };
    db.insert({
      name: name,
      email: email,
      assetclass: assetClass,
     allocationpp: (Math.round(allocationpp * 100)) / 100,
      allocation: (Math.round(allocation * 100)) / 100,
      weightedreturnpp: (Math.round(weightedreturnpp * 100)) / 100,
      weightedreturn: (Math.round(weightedreturn * 100)) / 100,
     weightedsd: (Math.round(weightedSD * 100)) / 100
    }).into('retirementportfolio').asCallback(function (err) {

      if (err) {
        res.status(400).json(err)
        console.log(err)
      } else {
        // res.status(200).json(data);
       // console.log("1 row inserted");
      }
    });
  };
    
  res.status(200).json(data);
} catch (error) {
  res.status(400).json(error);
}
});



app.post('/Table2Retirement', async (req, res) => {
  
  try {
    const {
      name,
      email,
      tablename,
      equity,
      allocatedWeight,
      Return,
      SD,
      FixedIncome,
      allocatedWeight2,
      Return2,
      SD2,
      realEstate,
      allocatedWeight3,
      return3,
      SD3,
      OtherInvestments,
      allocatedWeight4,
      return4,
      SD4

    } = req.body;

  
    const data = await db.insert({
      name: name,
      email: email,
      equity: equity,
      allocatedweight: parseFloat(allocatedWeight),
      return: parseFloat(Return),
      sd: parseFloat(SD),
      fixedincome: FixedIncome,
      allocatedweight2: parseFloat(allocatedWeight2),
      return2: parseFloat(Return2),
      sd2: parseFloat(SD2),
      realestate: realEstate,
      allocatedweight3: parseFloat(allocatedWeight3),
      return3: parseFloat(return3),
      sd3: parseFloat(SD3),
      otherinvestment:OtherInvestments,
      allocatedweight4: parseFloat(allocatedWeight4),
      return4: parseFloat(return4),
      sd4: parseFloat(SD4)

    }).into(`${tablename}`).returning('*');

    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});




app.post('/wealth', async (req, res) => {
  const { name,
    email,
    TargetAmount,
    Time,
    PlanType
  } = req.body;

  targetAmount = parseInt(TargetAmount);
  time = parseInt(Time);
   console.log(email);
   var totalRisk =  await db.select('totalrisk').from('onboarding').where('email', '=', email);


    if (!totalRisk.length) {
      return res.status(404).json('User not found');
    }
    totalRisk = totalRisk[0].totalrisk;
    console.log(PlanType);

  // calculation of return , weightedsd and plan 
  var Return = 0;
  var weightedSD = "";
  var plan = "";

  if (time <= 5) {
    if (totalRisk === "Low") {
      plan = "shorttermlow";
      Return = 10.35;
      weightedSD = "9.19";
    } else if (totalRisk === "Medium") {
      plan = "shorttermmedium";
      Return = "12.70";
      weightedSD = "13.89";
    } else if (totalRisk === "High") {
      plan = "shorttermhigh";
      Return = 15.83;
      weightedSD = "23.06";
    }
  } else if (time <= 10) {
    if (totalRisk === "Low") {
      plan = "mediumtermlow";
      Return = 9.68;
      weightedSD = "8.54";
    } else if (totalRisk === "Medium") {
      plan = "mediumtermmedium";
      Return = 11.87;
      weightedSD = "12.01";
    } else if (totalRisk === "High") {
      plan = "mediumtermhigh";
      Return = 14.00;
      weightedSD = "18.72";
    }
  } else if (time > 10) {
    if (totalRisk === "Low") {
      plan = "longtermlow";
      Return = 8.66;
      weightedSD = "8.54";
    } else if (totalRisk === "Medium") {
      plan = "longtermmedium";
      Return = 10.92;
      weightedSD = "12.68";
    } else if (totalRisk === "High") {
      plan = "longtermhigh";
      Return = 13.20;
      weightedSD = "18.39";
    }
  }
  var Ret = Return / 100;
  //console.log(Return);
  var DepositPerYear = parseInt(targetAmount) * (Ret / (Math.pow(1 + Ret, parseInt(time)) - 1));
  //console.log("deposits"+ DepositPerYear);
  var data = {

    "targetAmount": targetAmount,
    "time": time,
    "PlanType": PlanType,
    "totalRisk": totalRisk,
    "Return": Return,
    "plan": plan,

    "weightedSD": weightedSD,
    "depositPerYear": DepositPerYear.toFixed(2)



  };

  db.insert({
    name: name,
    email: email,
    targetamount: targetAmount,
    time: time,
    plantype: PlanType,
    totalrisk: totalRisk,
    return: Return,
    plan: plan,

    weightedsd: weightedSD,
    depositperyear: DepositPerYear.toFixed(2)

  }).into('wealth').asCallback(function (err) {

    if (err) {
      res.status(400).json(err)
      console.log(err)
    } else {
     
      // calling mailing function from nodemail.js
      nodeMail.wealthplanningMail(name,email).catch(console.error);

      res.status(200).json(data);
    }
  })
})


app.post('/wealthPortfolio', async (req, res) => {
  
  console.log()
  try {
    const {
      name,
      email,
      
    } = req.body;

   let values = await db.select('depositperyear','plantype','plan').from('wealth').where('email', '=', email);

    if (!values.length) {
      return res.status(404).json('User not found');
    }
    var depositperyear = values[0].depositperyear;
    var plantype = values[0].plantype;
    var plan = values[0].plan;

    if(plan === 'longtermhigh'){
      if(plantype === 'Girl Child Plan') plan = 'longtermhigh_girl';
      else if(plantype === 'Child Education Plan') plan = 'longtermhigh_education';
      else plan = 'longtermhigh_normal';
    }else if(plan === 'longtermmedium'){
      if(plantype === 'Girl Child Plan') plan = 'longtermmedium_girl';
      else if(plantype === 'Child Education Plan') plan = 'longtermmedium_education';
      else plan = 'longtermmedium_normal';
    }else if(plan === 'longtermlow'){
      if(plantype === 'Girl Child Plan') plan = 'longtermlow_girl';
      else if(plantype === 'Child Education Plan') plan = 'longtermlow_education';
      else plan = 'longtermlow_normal';
    }

   
    var assetClass = "Equity";
    var data ;
    for(var i=1;i<=7;i++){
      var columnAllocated = 'allocatedweight';
      var columnreturn = 'return';
      var columnsd = 'sd';
        if(i >=2){
          columnAllocated = columnAllocated + i;
          columnreturn = columnreturn + i;
          columnsd = columnsd + i;
        }

    if(i==1) assetClass = "Equity";
    else if(i==2) assetClass = "Fixed Income";
    else if(i==3) assetClass = "Real Estate";
    else if(i==4) assetClass = "Commodities";
    else if(i==5) assetClass = "Crypto";
    else if(i==6) assetClass = "Forex";
    else assetClass = "Other Investments";

    var allocationpp = await db.select(db.raw('SUM('+columnAllocated+')')).from(`${plan}`);
    allocationpp = allocationpp[0].sum;
    var allocation = (depositperyear * allocationpp)/100;
    var weightedreturnpp =await db.select(db.raw('SUM('+columnAllocated+' * '+columnreturn+')')).from(`${plan}`);
    weightedreturnpp = weightedreturnpp[0].sum/100;
    if(allocationpp ==0){
      var weightedreturn = (allocation*weightedreturnpp);
    }else{
    var weightedreturn = (allocation*weightedreturnpp)/allocationpp;
    }
    var weightedSD = await db.select(db.raw('SUM('+columnAllocated+' * '+columnsd+')')).from(`${plan}`);
    weightedSD = weightedSD[0].sum/100;
    
   
    data = {
      name: name,
      email: email,
      assetclass: assetClass,
     allocationpp: (Math.round(allocationpp * 100)) / 100,
      allocation: (Math.round(allocation * 100)) / 100,
      weightedreturnpp: (Math.round(weightedreturnpp * 100)) / 100,
      weightedreturn: (Math.round(weightedreturn * 100)) / 100,
     weightedsd: (Math.round(weightedSD * 100)) / 100
    };
    db.insert({
      name: name,
      email: email,
      assetclass: assetClass,
     allocationpp: (Math.round(allocationpp * 100)) / 100,
      allocation: (Math.round(allocation * 100)) / 100,
      weightedreturnpp: (Math.round(weightedreturnpp * 100)) / 100,
      weightedreturn: (Math.round(weightedreturn * 100)) / 100,
     weightedsd: (Math.round(weightedSD * 100)) / 100
    }).into('wealthportfolio').asCallback(function (err) {

      if (err) {
        res.status(400).json(err)
        console.log(err)
      } else {
        // res.status(200).json(data);
       // console.log("1 row inserted");
      }
    });
  };
    
  res.status(200).json(data);
} catch (error) {
  res.status(400).json(error);
}
});


app.post('/Table2Wealth', async (req, res) => {
  
  try {
    const {
      name,
      email,
      tablename,
      equity,
      allocatedWeight,
      Return,
      SD,
      FixedIncome,
      allocatedWeight2,
      Return2,
      SD2,
      realEstate,
      allocatedWeight3,
      return3,
      SD3,
      commodities,
      allocatedWeight4,
      return4,
      SD4,
      crypto,
      allocatedWeight5,
      return5,
      SD5,
      forex,
      allocatedWeight6,
      return6,
      SD6,
      OtherInvestments,
      allocatedWeight7,
      return7,
      SD7

    } = req.body;

  
    const data = await db.insert({
      name: name,
      email: email,
      equity: equity,
      allocatedweight: parseFloat(allocatedWeight),
      return: parseFloat(Return),
      sd: parseFloat(SD),
      fixedincome: FixedIncome,
      allocatedweight2: parseFloat(allocatedWeight2),
      return2: parseFloat(Return2),
      sd2: parseFloat(SD2),
      realestate: realEstate,
      allocatedweight3: parseFloat(allocatedWeight3),
      return3: parseFloat(return3),
      sd3: parseFloat(SD3),
      commodities: commodities,
      allocatedweight4: parseFloat(allocatedWeight4),
      return4: parseFloat(return4),
      sd4: parseFloat(SD4),
      crypto: crypto,
      allocatedweight5: parseFloat(allocatedWeight5),
      return5: parseFloat(return5),
      sd5: parseFloat(SD5),
      forex: forex,
      allocatedweight6: parseFloat(allocatedWeight6),
      return6: parseFloat(return6),
      sd6: parseFloat(SD6),
      otherinvestment:OtherInvestments,
      allocatedweight7: parseFloat(allocatedWeight7),
      return7: parseFloat(return7),
      sd7: parseFloat(SD7)

    }).into(`${tablename}`).returning('*');

    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});




app.post('/tax', async (req, res) => {
  var { name,
    email,
    age,
    basicSalary,
    DA,
    taxableAllowances,
    perquisites,
    //Self Occupied Property SOP
    SOPFairMarketValue,
    SOPMunicipalValue,
    SOPStandardRent,
    SOPMunicipalTaxes,
    SOPInterestOnLoan,
    // for leased out property
    fairMarketValue,
    municipalValue,
    standardRent,
    municipalTaxes,
    actualRent,
    municipalTaxesbyTenant,
    interestOnLoan,
    unrealizedRent,
    arrearsOfRent,

    incomeFromBusinessAndProfession,
    // for capital gains
    assetCategory,
    holdingPeriod,
    amount,
    incomeFromOtherSources,
    lotteryIncome,
    deductions,

    //questions
    percentDisability,
    disabilityAmount,
    seriousDiseaseExpenditure,
    higherEducationLoan,
    donations,
    paidRentAmount,
    seniorCitizenAccountInterest,
    royaltyIncome,
    savingsAccountInterest
  } = req.body;

  var totalRisk =  await db.select('totalrisk').from('onboarding').where('email', '=', email);


    if (!totalRisk.length) {
      return res.status(404).json('User not found');
    }
    totalRisk = totalRisk[0].totalrisk;


  var plan = "";
  var weightedReturn = 0;
  var allocation = "";

  if (totalRisk == "Low") {
    plan = "tax_low",
      weightedReturn = 9.04,
      allocation = "Low"
  }
  else if (totalRisk == "Medium") {
    plan = "tax_medium",
      weightedReturn = 12.72,
      allocation = "Medium"
  }
  else if (totalRisk == "High") {
    plan = "tax_high",
      weightedReturn = 14.71,
      allocation = "High"
  }

  // calculation of various incomes from inputs
  var incomeFromSalary = parseInt(basicSalary) + parseInt(DA) + parseInt(taxableAllowances) + parseInt(perquisites) - 50000;

  var LOPincome = 0;
  if (parseInt(fairMarketValue) != 0) {
    var maxValue = Math.max(parseInt(fairMarketValue), parseInt(municipalValue));
    var annualLettingValue = Math.min(maxValue, parseInt(standardRent));
    var grossAnnualValue = Math.max(annualLettingValue, parseInt(actualRent));
    var NAV = grossAnnualValue - parseInt(municipalTaxes);
    var standardDeduction = 0.3 * NAV;
    var totalDeduction = standardDeduction + parseInt(interestOnLoan);
    LOPincome = NAV - totalDeduction;
  }
  var incomeFromHousingProperty = LOPincome - parseInt(SOPInterestOnLoan);

  var incomeFromCapitalGains = parseInt(amount);

  var grossIncome = incomeFromSalary + incomeFromHousingProperty + parseInt(incomeFromBusinessAndProfession) + incomeFromCapitalGains + parseInt(incomeFromOtherSources) + parseInt(lotteryIncome);

  var totalIncome = grossIncome - parseInt(deductions);

  var normalIncome = incomeFromSalary + incomeFromHousingProperty + parseInt(incomeFromBusinessAndProfession) + parseInt(incomeFromOtherSources);

  // calculation of tax slab 
  var taxSlab = 0;
  if (parseInt(age) <= 59) {
    if (totalIncome <= 250000) taxSlab = 0;
    else if (totalIncome <= 500000) taxSlab = 5;
    else if (totalIncome <= 1000000) taxSlab = 20;
    else if (totalIncome > 1000000) taxSlab = 30;
  } else if (parseInt(age) <= 79) {
    if (totalIncome <= 300000) taxSlab = 0;
    else if (totalIncome <= 500000) taxSlab = 5;
    else if (totalIncome <= 1000000) taxSlab = 20;
    else if (totalIncome > 1000000) taxSlab = 30;
  } else if (parseInt(age) >= 80) {
    if (totalIncome <= 500000) taxSlab = 0;
    else if (totalIncome <= 1000000) taxSlab = 20;
    else if (totalIncome > 1000000) taxSlab = 30;
  }

  // calculating tax on normal income

  var taxOnNormalIncome = 0;
  if (taxSlab != 0) {
    taxOnNormalIncome = (taxSlab / 100) * normalIncome;
  }

  // calculating tax on capital gains
  var taxRate = 0;
  if (assetCategory === "Stocks(Listed) and Securities(Listed and Unlisted)") {
    if (holdingPeriod <= 1) {
      taxRate = 15;
    } else {
      if (incomeFromCapitalGains <= 100000) taxRate = 0;
      else {
        taxRate = 10;
      }
    }

  } else if (assetCategory === "Immovable Property") {
    if (holdingPeriod <= 2) {
      taxRate = taxSlab;
    } else {
      if (incomeFromCapitalGains <= 100000) taxRate = 0;
      else {
        taxRate = 10;
      }
    }
  } else if (assetCategory === "Unlisted Shares") {
    if (holdingPeriod <= 2) {
      taxRate = taxSlab;
    } else {
      taxRate = 20;
    }
  } else if (assetCategory === "Movable Property") {
    if (holdingPeriod <= 3) {
      taxRate = taxSlab;
    } else {
      taxRate = 20;
    }
  } else if (assetCategory === "Debt-Oriented Mutual Funds") {
    if (holdingPeriod <= 3) {
      taxRate = taxSlab;
    } else {
      taxRate = 20;
    }
  }

  var taxOnCapitalGains = 0;
  if (taxRate != 0) {
    taxOnCapitalGains = (taxRate / 100) * incomeFromCapitalGains;
  }

  //calculating tax on lottery income
  var taxOnLotteryIncome = 0;
  if (lotteryIncome != 0) {
    taxOnLotteryIncome = 0.3 * lotteryIncome;
  }

  var taxLiability = taxOnNormalIncome + taxOnCapitalGains + taxOnLotteryIncome;

  // calculation of tax savings and total benefits

  var investedAmount = 150000;
  var taxSaving = 0;
  var returnAmount = 0;
  if (totalRisk === "Low") {
    var amountIn80C = 0.85 * investedAmount;
    var amountIn80D = 0.05 * investedAmount;
    //var amountInBonds = 0.1 * investedAmount;
    var amountIn80CCF = 0;

    if (amountIn80C < 150000) taxSaving = taxSaving + amountIn80C;
    else taxSaving = taxSaving + 150000;

    if (amountIn80CCF < 20000) taxSaving = taxSaving + amountIn80CCF;
    else taxSaving = taxSaving + 20000;

    taxSaving = (taxSaving + amountIn80D) * taxSlab;
    returnAmount = 0.0905 * investedAmount;
  } else if (totalRisk === "Medium") {
    var amountIn80C = 0.75 * investedAmount;
    var amountIn80D = 0.1 * investedAmount;
    //var amountInBonds = 0.15 * investedAmount;
    var amountIn80CCF = 0;

    if (amountIn80C < 150000) taxSaving = taxSaving + amountIn80C;
    else taxSaving = taxSaving + 150000;

    if (amountIn80CCF < 20000) taxSaving = taxSaving + amountIn80CCF;
    else taxSaving = taxSaving + 20000;

    taxSaving = (taxSaving + amountIn80D) * taxSlab;
    returnAmount = 0.1272 * investedAmount;
  } else if (totalRisk === "High") {
    var amountIn80C = 0.75 * investedAmount;
    var amountIn80D = 0.15 * investedAmount;
    //var amountInBonds = 0.1 * investedAmount;
    var amountIn80CCF = 0;

    if (amountIn80C < 150000) taxSaving = taxSaving + amountIn80C;
    else taxSaving = taxSaving + 150000;

    if (amountIn80CCF < 20000) taxSaving = taxSaving + amountIn80CCF;
    else taxSaving = taxSaving + 20000;

    taxSaving = (taxSaving + amountIn80D) * taxSlab;
    returnAmount = 0.1471 * investedAmount;
  }




  var totalBenefit = taxSaving + returnAmount * (1 - taxSlab) + parseInt(higherEducationLoan) + parseInt(donations) + parseInt(paidRentAmount) + parseInt(seniorCitizenAccountInterest);

  if (parseInt(percentDisability) < 70) {
    if (parseInt(disabilityAmount) < 75000) totalBenefit = totalBenefit + parseInt(disabilityAmount);
    else totalBenefit = totalBenefit + 75000;
  } else {
    if (parseInt(disabilityAmount) < 125000) totalBenefit = totalBenefit + parseInt(disabilityAmount);
    else totalBenefit = totalBenefit + 125000;
  }

  if (parseInt(seriousDiseaseExpenditure) < 40000) totalBenefit = totalBenefit + parseInt(seriousDiseaseExpenditure);
  else totalBenefit = totalBenefit + 40000;

  if (parseInt(royaltyIncome) < 300000) totalBenefit = totalBenefit + parseInt(royaltyIncome);
  else totalBenefit = totalBenefit + 300000;

  if (parseInt(savingsAccountInterest) < 10000) totalBenefit = totalBenefit + parseInt(savingsAccountInterest);
  else totalBenefit = totalBenefit + 10000;


  var data = {
    "name": name,
    "email": email,
    "totalRisk": totalRisk,
    "age": age,
    "percentDisability": percentDisability,
    "disabilityAmount": disabilityAmount,
    "seriousDiseaseExpenditure": seriousDiseaseExpenditure,
    "higherEducationLoan": higherEducationLoan,
    "donations": donations,
    "paidRentAmount": paidRentAmount,
    "seniorCitizenAccountInterest": seniorCitizenAccountInterest,
    "royaltyIncome": royaltyIncome,
    "savingsAccountInterest": savingsAccountInterest,
    "plan": plan,
    "allocation": allocation,
    "weightedReturn": weightedReturn,
    "incomeFromSalary": incomeFromSalary,
    "incomeFromHousingProperty": incomeFromHousingProperty,
    "incomeFromBusinessAndProfession": incomeFromBusinessAndProfession,
    "incomeFromCapitalGains": incomeFromCapitalGains,
    "incomeFromOtherSources": incomeFromOtherSources,
    "grossIncome": grossIncome,
    "totalIncome": totalIncome,
    "normalIncome": normalIncome,
    "taxSlab": taxSlab,
    "taxLiability": taxLiability,
    "taxSaving": taxSaving,
    "returnAmount": returnAmount,
    "totalBenefit": totalBenefit
  };

  db.insert({
    name: name,
    email: email,
    totalrisk: totalRisk,
    age: parseFloat(age),
    percentdisability: parseFloat(percentDisability),
    disabilityamount: parseFloat(disabilityAmount),
    seriousdiseaseexpenditure: parseFloat(seriousDiseaseExpenditure),
    highereducationloan: parseFloat(higherEducationLoan),
    donations: parseFloat(donations),
    paidrentamount: parseFloat(paidRentAmount),
    seniorcitizenaccountinterest: parseFloat(seniorCitizenAccountInterest),
    royaltyincome: parseFloat(royaltyIncome),
    savingsaccountinterest: parseFloat(savingsAccountInterest),
    plan: plan,
    allocation: parseFloat(allocation),
    weightedreturn: parseFloat(weightedReturn),
    incomefromsalary: parseFloat(incomeFromSalary),
    incomefromhousingproperty: parseFloat(incomeFromHousingProperty),
    incomefrombusinessandprofession: parseFloat(incomeFromBusinessAndProfession),
    incomefromcapitalgains: parseFloat(incomeFromCapitalGains),
    incomefromothersources: parseFloat(incomeFromOtherSources),
    grossincome: parseFloat(grossIncome),
    totalincome: parseFloat(totalIncome),
    normalincome: parseFloat(normalIncome),
    taxslab: parseFloat(taxSlab),
    taxliability: parseFloat(taxLiability),
    taxsaving: parseFloat(taxSaving),
    returnamount: parseFloat(returnAmount),
    totalbenefit: parseFloat(totalBenefit)
  }).into('tax').asCallback(function (err) {

    if (err) {
      res.status(400).json(err)
      console.log(err)
    } else {

       // calling mailing function from nodemail.js 
        nodeMail.taxplanningMail(User,Email).catch(console.error);
        res.status(200).json(data);

    }
  })
})


// tax portfolio


app.post('/taxPortfolio', async (req, res) => {
  
  console.log()
  try {
    const {
      name,
      email,
      
    } = req.body;

   let values= await db.select('plan').from('tax').where('email', '=', email);

    if (!values.length) {
      return res.status(404).json('User not found');
    }
    var plan = values[0].plan;
    //console.log(plan);
    var investedAmount = 150000;
   
    var assetClass = "Bonds";
    var data ;
    for(var i=1;i<=3;i++){
      var columnAllocated = 'allocatedweight';
      var columnreturn = 'return';
        if(i >=2){
          columnAllocated = columnAllocated + i;
          columnreturn = columnreturn + i;
        }

    if(i==1) assetClass = "Bonds";
    else if(i==2) assetClass = "Mutual Funds";
    else if(i==3) assetClass = "Other Investments";

    var allocationpp = await db.select(db.raw('SUM('+columnAllocated+')')).from(`${plan}`);
    allocationpp = allocationpp[0].sum;
    var allocation = (investedAmount * allocationpp)/100;
    var weightedreturnpp =await db.select(db.raw('SUM('+columnAllocated+' * '+columnreturn+')')).from(`${plan}`);
    weightedreturnpp = weightedreturnpp[0].sum/100;
    if(allocationpp ==0){
      var weightedreturn = (allocation*weightedreturnpp);
    }else{
    var weightedreturn = (allocation*weightedreturnpp)/allocationpp;
    }
   

   
    data = {
      name: name,
      email: email,
      assetclass: assetClass,
     allocationpp: (Math.round(allocationpp * 100)) / 100,
      allocation: (Math.round(allocation * 100)) / 100,
      weightedreturnpp: (Math.round(weightedreturnpp * 100)) / 100,
      weightedreturn: (Math.round(weightedreturn * 100)) / 100
    };
    db.insert({
      name: name,
      email: email,
      assetclass: assetClass,
     allocationpp: (Math.round(allocationpp * 100)) / 100,
      allocation: (Math.round(allocation * 100)) / 100,
      weightedreturnpp: (Math.round(weightedreturnpp * 100)) / 100,
      weightedreturn: (Math.round(weightedreturn * 100)) / 100
    }).into('taxportfolio').asCallback(function (err) {

      if (err) {
        res.status(400).json(err)
        console.log(err)
      } else {
        // res.status(200).json(data);
       // console.log("1 row inserted");
      }
    });
  };
    
  res.status(200).json(data);
} catch (error) {
  res.status(400).json(error);
}
});







app.post('/Table2Tax', async (req, res) => {
  
  try {
    const {
      name,
      email,
      tablename,
      MutualFunds,
      allocatedWeight,
      Return,
      Section,
      Bonds,
      allocatedWeight2,
      Return2,
      Section2,
      OtherInvestments,
      allocatedWeight3,
      Return3,
      Section3

    } = req.body;

  
    const data = await db.insert({
      name: name,
      email: email,
      mutualfunds: MutualFunds,
      allocatedweight: parseFloat(allocatedWeight),
      return: parseFloat(Return),
      section: Section,
      bonds: Bonds,
      allocatedweight2: parseFloat(allocatedWeight2),
      return2: parseFloat(Return2),
      section2: Section2,
      otherinvestments:OtherInvestments,
      allocatedweight3: parseFloat(allocatedWeight3),
      return3: parseFloat(Return3),
      section3: Section3,
     
    }).into(`${tablename}`).returning('*');

    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});



app.post('/estate', async (req, res) => {
  try {
    const { name,
      email,
      AssestClass,
      Return,
      Risk,
      LifeExpectancy,
      SavingAmount,
      DebtLiabilities,
      Insurance,
      Standard,
      EstateTool,
      Deprecation,
      MonthlyInflow } = req.body;

    const estateData = await db.insert({
      name: name,
      email: email,
      assestclass: AssestClass,
      return: Return,
      risk: Risk,
      lifeexpectancy: LifeExpectancy,
      savingamount: SavingAmount,
      debtliabilities: DebtLiabilities,
      insurance: Insurance,
      standard: Standard,
      estatetool: EstateTool,
      deprecation: Deprecation,
      monthlyinflow: MonthlyInflow
    }).into('estate').returning('*');

    res.status(200).json(estateData[0]);

  } catch (error) {
    res.status(400).json(error);
  }
});


// Contact Us 

app.post('/contact', async (req, res) => {
  try{
    const{
      name,
      email,
      subject,
      description
    } = req.body;

   
     
      // calling contactMail function from nodeMail.js
      nodeMail.contactMail(name,email,subject,description).catch(console.error);
   
    res.send("mail sent ");
  } catch (error) {
   res.status(400).json(error);
   console.log(error);
 }
});




const storage = multer.diskStorage({
  destination : (req, file, cb ) => {
    fs.mkdir("./Resumes", { recursive: true }, function(err) {
  if (err) {
    console.log(err)
  } else {
    console.log("New directory successfully created.")
  }
})
    cb(null,'./Resumes/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },

});
const upload = multer({ storage: storage });
app.get('/' , (req,res) => {
  res.sendFile(path.join(__dirname,"/pages/careers.js"));
});
app.post('/careers' , upload.single('upload_resume'),(req, res) => {
  console.log(req.file);
  console.log("upload Success");
  res.json({ message: "Successfully uploaded files" });
});

app.get('/profile/:email', (req, res) => {
  const { email } = req.params;
  db.select('*').from('users').where({ email })
    .then(user => {
      if (user[0].id) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
        console.log(user)
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})

app.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
   line_items: [
      {
        price: 'price_1JfjqnSCvFaRLDQmhRN5RrFd',
        quantity: 1,
      },
    ],
    payment_method_types: [
      'card',
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}/success`,
    cancel_url: `${YOUR_DOMAIN}/cancel`,
  });
  res.redirect(303, session.url)
});



app.get('/booking', (req,res) =>{
  db.select().from('booking').then(data => {
      res.send(data)
  })
})

app.post('/booking', (req, res) => {
  const{
      name,
      email,
      time,
      date,
      meetType,
      phone,
      city,
      country
  } = req.body;

 var data = {
  "name"  : name,
  "meetType"  : meetType,
  "time"  : time,
  "date"  : date,
  "email"  : email,
  "phone"  : phone,
  "city" : city,
  "country"  : country

  };


  
try{
var link = "";
Meeting({
clientId : '201263547701-auravcvj9m1g1im0qpcr3oh56sg6mgjn.apps.googleusercontent.com',
clientSecret : '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',
refreshToken : '1//04q1b9hF2Lcf-CgYIARAAGAQSNwF-L9IrG5eyiHNIRbr1-2NW1NJWbxLHzqpjm_BJ_-Sfl3K-ZyqdGAxoMX7WZTfGmdA7d5tsfRc',
date :date,
time : time,
summary : meetType,
location : city,
description : 'description'
}).then(function(result){
link = result;
console.log(result);//result it the final link


// calling bookingMail function from nodemail.js
nodeMail.bookingMail(name,email,meetType,date,time,city,country,link).catch(console.error);


res.status(200).json(data);


})



} catch (error) {
res.status(400).json(error);
console.log(error);
}
  // db.insert({
  //     fname  : fname,
  //     lname  : lname,
  //     email  : email,
  //     phone  : phone,
  //     city  : city,
  //     country  : country
  // }).into('booking').asCallback(function (err) {

  //     if(err) {
  //         res.status(400).json(err)
  //         console.log(err);
  //     }
  //     else{
  //         res.status(200).json(data);
  //     }
  // })

});



app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
})