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
const db = knex({
  // Enter your own database information here based on what you created
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'akshaybhopani',
    password: '',
    database: 'dcipl'
  }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());

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

app.get('/portfolioequity-data', (req, res) => {
  db.select().from('investmentportfolioequity').then(data => {
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
  const { email, name, password } = req.body;
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
      res.status(200).json(data);
    }


  })

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


  if (points < 6) RiskAbility = "Low"
  else if (points < 11) RiskAbility = "Medium"
  else if (points >= 11) RiskAbility = "High"


  if (RiskAbility === "Low") InvestableAmount = (MarginOfSafetyRs * (0.60));
  else if (RiskAbility === "Medium") InvestableAmount = (MarginOfSafetyRs * (0.70));
  else if (RiskAbility === "High") InvestableAmount = (MarginOfSafetyRs * (0.80));


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
      res.status(200).json(data);
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing


        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "mail.confluence-r.com",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: '', // generated ethereal user
            pass: '', // generated ethereal password
          },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: 'akshaybhopani@confluence-r.com', // sender address
          to: Email, // list of receivers
          subject: `Congratulations ${User}, Your Investment Portfolio Is Generated ✅`, // Subject line
          html: `<h1>Congratulations ${User}, Your Investment Portfolio Is Generated ✅</h1><h3>You can check your Report on <a href="https://dcipl.yourtechshow.com/features/investment">https://dcipl.yourtechshow.com/features/investment</a> after logging in with your Email ${Email}.</h3><p>* This is automated Email sent from DCIPL Server.`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }

      main().catch(console.error);
    }
  })
})


app.post('/investmentPortfolio', async (req, res) => {
  try {
    const {
      name,
      email,
      assetClass,
      allocation,
      weightedReturn,
      SD
    } = req.body;

    let investableamount = await db.select('investableamount').from('investment').where('email', '=', email);

    if (!investableamount.length) {
      return res.status(404).json('User not found');
    }
    investableamount = investableamount[0].investableamount;

    let weightedReturnAmount = investableamount * (weightedReturn / 100);
    let allocationAmount = investableamount * (allocation / 100);
    let weightedSD = SD * (allocation / 100);

    const data = await db.insert({
      name: name,
      email: email,
      assetclass: assetClass,
      weightedreturnamount: weightedReturnAmount,
      weightedsd: weightedSD
    }).into('investmentportfolio').returning('*');

    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json(error);
  }
});

app.post('/investmentPortfolioEquity', async (req, res) => {
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
      allocatedweight: allocatedWeight,
      return: Return,
      sd: SD,
      fixedincome: FixedIncome,
      allocatedweight2: allocatedWeight2,
      return2: Return2,
      sd2: SD2,
      realestate: realEstate,
      allocatedweight3: allocatedWeight3,
      return3: return3,
      sd3: SD3,
      commodities: commodities,
      allocatedweight4: allocatedWeight4,
      return4: return4,
      sd4: SD4,
      crypto: crypto,
      allocatedweight5: allocatedWeight5,
      return5: return5,
      sd5: SD5,
      forex: forex,
      allocatedweight6: allocatedWeight6,
      return6: return6,
      sd6: SD6
      
    }).into('investmentportfolioequity').returning('*');

    res.status(200).json(data[0]);
  } catch (error) {
    res.status(400).json(error);
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

app.post('/retirement', (req, res) => {
  const { name,
    email,
    targetAmount,
    time,
    totalRisk
  } = req.body;

  var Return = 0;
  var weightedSD = "";
  var weightedReturn = "";
  var plan = "";

  if (totalRisk == "Low") {
    plan = "Low",
      Return = 8.95,
      weightedSD = "8.54",
      weightedReturn = "8.95"
  }
  else if (totalRisk == 'Medium') {
    plan = "Medium",
      Return = 11.11,
      weightedSD = "12.68",
      weightedReturn = "11.11"
  }
  else if (totalRisk == "High") {
    plan = "High",
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
      res.status(200).json(data);
      async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing


        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: '', // generated ethereal user
            pass: '', // generated ethereal password
          },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: 'akshaybhopani@confluence-r.com', // sender address
          to: email, // list of receivers
          subject: `Congratulations ${name}, Your Retirement planning Portfolio Is Generated ✅`, // Subject line
          html: `<h1>Congratulations ${name}, Your Retirement planning Portfolio Is Generated ✅</h1><h3>You can check your Report on <a href="https://dcipl.yourtechshow.com/features/retirement">https://dcipl.yourtechshow.com/features/retirement</a> after logging in with your Email ${email}.</h3><p>* This is automated Email sent from DCIPL Server.`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }

      main().catch(console.error);
    }
  })
});

app.post('/wealth', (req, res) => {
  const { name,
    email,
    TargetAmount,
    totalRisk,
    Time
  } = req.body;

  targetAmount = parseInt(TargetAmount);
  time = parseInt(Time);

  // calculation of return , weightedsd and plan 
  var Return = 0;
  var weightedSD = "";
  var plan = "";

  if (time <= 5) {
    if (totalRisk === "Low") {
      plan = "Shortterm Low";
      Return = 10.35;
      weightedSD = "9.19";
    } else if (totalRisk === "Medium") {
      plan = "Shortterm Medium";
      Return = "12.70";
      weightedSD = "13.89";
    } else if (totalRisk === "High") {
      plan = "Shortterm High";
      Return = 15.83;
      weightedSD = "23.06";
    }
  } else if (time <= 10) {
    if (totalRisk === "Low") {
      plan = "Mediumterm Low";
      Return = 9.68;
      weightedSD = "8.54";
    } else if (totalRisk === "Medium") {
      plan = "Mediumterm Medium";
      Return = 11.87;
      weightedSD = "12.01";
    } else if (totalRisk === "High") {
      plan = "Meediumterm High";
      Return = 14.00;
      weightedSD = "18.72";
    }
  } else if (time > 10) {
    if (totalRisk === "Low") {
      plan = "Longterm Low";
      Return = 8.66;
      weightedSD = "8.54";
    } else if (totalRisk === "Medium") {
      plan = "Longterm Medium";
      Return = 10.92;
      weightedSD = "12.68";
    } else if (totalRisk === "High") {
      plan = "Longterm High";
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
      res.status(200).json(data);
      // async..await is not allowed in global scope, must use a wrapper
      async function main() {
        // Generate test SMTP service account from ethereal.email
        // Only needed if you don't have a real mail account for testing


        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: "",
          port: 465,
          secure: true, // true for 465, false for other ports
          auth: {
            user: '', // generated ethereal user
            pass: '', // generated ethereal password
          },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: 'akshaybhopani@confluence-r.com', // sender address
          to: Email, // list of receivers
          subject: `Congratulations ${User}, Your Wealth planning Portfolio Is Generated ✅`, // Subject line
          html: `<h1>Congratulations ${User}, Your Wealth planning Portfolio Is Generated ✅</h1><h3>You can check your Report on <a href="https://dcipl.yourtechshow.com/features/wealth">https://dcipl.yourtechshow.com/features/wealth</a> after logging in with your Email ${Email}.</h3><p>* This is automated Email sent from DCIPL Server.`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      }

      main().catch(console.error);
    }
  })
})


// Taking input for Income and Expense sheet
app.post('/income_and_expense', (req, res) => {
  const {
    name,
    email,
    //Options for Fixed Income 
    Salary,
    Interest_Income,
    Professional_Income,
    Rental_Income,
    Other_Income,

    //Options for variable Income
    Investment_Income,
    Part_Time_Association,
    Perquisites,
    Other_Income_Variable,

    //Options for fixed expenses
    Housing_and_Utilities,
    Daily_Expense,
    Children_Expense,
    Transportation_Expense,
    Insurance,
    Pet_Expense,
    Subscriptions,
    Internet_Expense,
    Taxes,
    Misscelanous_Expense,

    //Options for variable expenses
    Healthcare,
    Charity,
    Entertainment,
    Travel,
    Misscelanous_Variable } = req.body;

  //calculating income and expenses
  var Fixed_Income = Salary + Interest_Income + Professional_Income + Rental_Income + Other_Income;
  var Variable_Income = Investment_Income + Part_Time_Association + Perquisites + Other_Income_Variable;
  var Fixed_Expenses = Housing_and_Utilities + Daily_Expense + Children_Expense + Transportation_Expense + Insurance + Pet_Expense + Subscriptions + Internet_Expense + Taxes + Misscelanous_Expense;
  var Variable_Expenses = Healthcare + Charity + Entertainment + Travel + Misscelanous_Variable;

  //calculating total income and expense
  var Total_Income = Fixed_Income + Variable_Income;
  var Total_Expenses = Fixed_Expenses + Variable_Expenses;

  var data = {
    //for Fixed Income
    "Salary": Salary,
    "Interest_Income": Interest_Income,
    "Professional_Income": Professional_Income,
    "Rental_Income": Rental_Income,
    "Other_Income": Other_Income,
    "Fixed_Income": Fixed_Income,

    //for Variable Income
    "Investment_Income": Investment_Income,
    "Part_Time_Association": Part_Time_Association,
    "Perquisites": Perquisites,
    "Other_Income_Variable": Other_Income_Variable,
    "Variable_Income": Variable_Income,

    "Total_Income": Total_Income,

    //for Fixed Expenses
    "Housing_and_Utilities": Housing_and_Utilities,
    "Daily_Expense": Daily_Expense,
    "Children_Expense": Children_Expense,
    "Transportation_Expense": Transportation_Expense,
    "Insurance": Insurance,
    "Pet_Expense": Pet_Expense,
    "Subscriptions": Subscriptions,
    "Internet_Expense": Internet_Expense,
    "Taxes": Taxes,
    "Misscelanous_Expense": Misscelanous_Expense,
    "Fixed_Expenses": Fixed_Expenses,

    //for Variable Expenses
    "Healthcare": Healthcare,
    "Charity": Charity,
    "Entertainment": Entertainment,
    "Travel": Travel,
    "Misscelanous_variable": Misscelanous_Variable,
    "Variable_Expenses": Variable_Expenses,

    "Total_Expenses": Total_Expenses
  };

  db.insert({
    name: name,
    email: email,
    salary: Salary,
    interest_income: Interest_Income,
    professional_income: Professional_Income,
    rental_income: Rental_Income,
    other_income: Other_Income,
    fixed_income: Fixed_Income,
    investment_income: Investment_Income,
    part_time_association: Part_Time_Association,
    perquisites: Perquisites,
    other_income_variable: Other_Income_Variable,
    variable_income: Variable_Income,
    total_income: Total_Income,
    housing_and_utilities: Housing_and_Utilities,
    daily_expense: Daily_Expense,
    children_expense: Children_Expense,
    transportation_expense: Transportation_Expense,
    insurance: Insurance,
    pet_expense: Pet_Expense,
    subscriptions: Subscriptions,
    internet_expense: Internet_Expense,
    taxes: Taxes,
    misscelanous_expense: Misscelanous_Expense,
    fixed_expenses: Fixed_Expenses,
    healthcare: Healthcare,
    charity: Charity,
    entertainment: Entertainment,
    travel: Travel,
    misscelanous_variable: Misscelanous_variable,
    variable_expenses: Variable_Expenses,
    total_expenses: Total_Expenses

  }).into('income_and_expense').asCallback(function (err) {

    if (err) {
      res.status(400).json(err)
    } else {
      res.status(200).json(data)
    }
  })
})

app.post('/tax', async (req, res) => {
    var { name,
      email,
      totalRisk,
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
      disability,
      seriousDisease,
      higherEducationLoan,
      donations,
      paidRent,
      familyMemberAbove60,
      royaltyIncome,
      savingsAccount
    } = req.body;

    var plan = "";
    var weightedReturn = 0;
    var allocation = "";

    if (totalRisk == "Low") {
        plan = "Low",
        weightedReturn = 9.04,
        allocation = "Low"
    }
    else if (totalRisk == "Medium") {
        plan = "Medium",
        weightedReturn = 12.72,
        allocation = "Medium"
    }
    else if (totalRisk == "High") {
        plan = "High",
        weightedReturn = 14.71,
        allocation = "High"
    }

    // calculation of various incomes from inputs
    var incomeFromSalary = parseInt(basicSalary) + parseInt(DA) + parseInt(taxableAllowances) + parseInt(perquisites) - 50000;

    var LOPincome = 0;
    if(parseInt(fairMarketValue) != 0){
      var maxValue = Math.max(parseInt(fairMarketValue),parseInt(municipalValue));
      var annualLettingValue = Math.min(maxValue,parseInt(standardRent));
      var grossAnnualValue = Math.max(annualLettingValue,parseInt(actualRent));
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
    var taxSlab =0;
    if(parseInt(age) <= 59){
      if(totalIncome <= 250000) taxSlab = 0;
      else if(totalIncome <= 500000) taxSlab = 5;
      else if(totalIncome <= 1000000) taxSlab = 20;
      else if(totalIncome > 1000000) taxSlab = 30;
    }else if(parseInt(age) <= 79){
      if(totalIncome <= 300000) taxSlab = 0;
      else if(totalIncome <= 500000) taxSlab = 5;
      else if(totalIncome <= 1000000) taxSlab = 20;
      else if(totalIncome > 1000000) taxSlab = 30;
    }else if(parseInt(age) >= 80){
      if(totalIncome <= 500000) taxSlab = 0;
      else if(totalIncome <= 1000000) taxSlab = 20;
      else if(totalIncome > 1000000) taxSlab = 30;
    }

    // calculating tax on normal income

    var taxOnNormalIncome = 0;
    if(taxSlab != 0){
      taxOnNormalIncome = (taxSlab/100)*normalIncome;
    }

    // calculating tax on capital gains
    var taxRate =0;
    if(assetCategory === "Stocks(Listed) and Securities(Listed and Unlisted)"){
      if(holdingPeriod <= 1){
        taxRate = 15;
      }else{
        if(incomeFromCapitalGains <= 100000) taxRate = 0;
        else{
           taxRate = 10;
        }
      }
      
    }else if(assetCategory === "Immovable Property"){
      if(holdingPeriod <= 2){
        taxRate = taxSlab;
      }else{
        if(incomeFromCapitalGains <= 100000) taxRate = 0;
        else{
           taxRate = 10;
        }
      }
    }else if(assetCategory === "Unlisted Shares"){
      if(holdingPeriod <= 2){
        taxRate = taxSlab;
      }else{
           taxRate = 20;
      }
    }else if(assetCategory === "Movable Property"){
      if(holdingPeriod <= 3){
        taxRate = taxSlab;
      }else{
           taxRate = 20;
      }
    }else if(assetCategory === "Debt-Oriented Mutual Funds"){
      if(holdingPeriod <= 3){
        taxRate = taxSlab;
      }else{
           taxRate = 20;
      }
    }
    
    var taxOnCapitalGains = 0;
    if(taxRate != 0){
      taxOnCapitalGains = (taxRate/100)* incomeFromCapitalGains;
    }

    //calculating tax on lottery income
    var taxOnLotteryIncome = 0;
    if(lotteryIncome != 0){
      taxOnLotteryIncome = 0.3 * lotteryIncome;
    }

    var taxLiability = taxOnNormalIncome + taxOnCapitalGains + taxOnLotteryIncome;

    // calculation of tax savings and total benefits
    
    var investedAmount = 150000;
    var taxSaving =0;
    var returnAmount = 0;
    if(totalRisk === "Low"){
        var amountIn80C = 0.85 * investedAmount;
        var amountIn80D = 0.05 * investedAmount;
        //var amountInBonds = 0.1 * investedAmount;
        var amountIn80CCF = 0;

        if(amountIn80C < 150000) taxSaving = taxSaving + amountIn80C;
        else taxSaving = taxSaving + 150000;

        if(amountIn80CCF < 20000) taxSaving = taxSaving + amountIn80CCF;
        else taxSaving = taxSaving + 20000;

        taxSaving = (taxSaving + amountIn80D) * taxSlab;
        returnAmount = 0.0905 * investedAmount;
    }else if(totalRisk === "Medium"){
      var amountIn80C = 0.75 * investedAmount;
      var amountIn80D = 0.1 * investedAmount;
      //var amountInBonds = 0.15 * investedAmount;
      var amountIn80CCF = 0;

      if(amountIn80C < 150000) taxSaving = taxSaving + amountIn80C;
      else taxSaving = taxSaving + 150000;

      if(amountIn80CCF < 20000) taxSaving = taxSaving + amountIn80CCF;
      else taxSaving = taxSaving + 20000;

      taxSaving = (taxSaving + amountIn80D) * taxSlab;
      returnAmount = 0.1272 * investedAmount;
    }else if(totalRisk === "High"){
      var amountIn80C = 0.75 * investedAmount;
      var amountIn80D = 0.15 * investedAmount;
      //var amountInBonds = 0.1 * investedAmount;
      var amountIn80CCF = 0;

      if(amountIn80C < 150000) taxSaving = taxSaving + amountIn80C;
      else taxSaving = taxSaving + 150000;

      if(amountIn80CCF < 20000) taxSaving = taxSaving + amountIn80CCF;
      else taxSaving = taxSaving + 20000;

      taxSaving = (taxSaving + amountIn80D) * taxSlab;
      returnAmount = 0.1471 * investedAmount;
    }

    


    var totalBenefit = taxSaving + returnAmount * (1 - taxSlab) + parseInt(higherEducationLoan) + parseInt(donations) + parseInt(paidRent) + parseInt(familyMemberAbove60);

    if(parseInt(percentDisability)<70){
      if(parseInt(disability) < 75000) totalBenefit = totalBenefit + parseInt(disability);
      else totalBenefit = totalBenefit + 75000;
    }else{
      if(parseInt(disability) < 125000) totalBenefit = totalBenefit + parseInt(disability);
      else totalBenefit = totalBenefit + 125000;
    }

    if(parseInt(seriousDisease) < 40000) totalBenefit = totalBenefit +parseInt(seriousDisease);
    else totalBenefit = totalBenefit + 40000;

    if(parseInt(royaltyIncome) < 300000) totalBenefit = totalBenefit + parseInt(royaltyIncome);
    else totalBenefit = totalBenefit + 300000;

    if(parseInt(savingsAccount) < 10000) totalBenefit = totalBenefit + parseInt(savingsAccount);
    else totalBenefit = totalBenefit + 10000;


    var data = {
      "name" : name,
      "email" : email,
      "totalRisk" : totalRisk,
      "age" : age,
      "percentDisability" : percentDisability,
      "disability" : disability,
      "seriousDisease" : seriousDisease,
      "higherEducationLoan" : higherEducationLoan,
      "donations" : donations,
      "paidRent" : paidRent,
      "familyMemberAbove60" : familyMemberAbove60,
      "royaltyIncome" : royaltyIncome,
      "savingsAccount" : savingsAccount,
      "plan" : plan,
      "allocation" : allocation,
      "weightedReturn" : weightedReturn,
      "incomeFromSalary" : incomeFromSalary,
      "incomeFromHousingProperty" : incomeFromHousingProperty,
      "incomeFromBusinessAndProfession" : incomeFromBusinessAndProfession,
      "incomeFromCapitalGains" : incomeFromCapitalGains,
      "incomeFromOtherSources" : incomeFromOtherSources,
      "grossIncome" : grossIncome,
      "totalIncome" : totalIncome,
      "normalIncome" : normalIncome,
      "taxSlab" : taxSlab,
      "taxLiability" : taxLiability,
      "taxSaving" : taxSaving,
      "returnAmount" : returnAmount,
      "totalBenefit" : totalBenefit
    };

    db.insert({
      name : name,
      email : email,
      totalrisk : totalRisk,
      age : age,
      percentdisability : percentDisability,
      disability : disability,
      seriousdisease : seriousDisease,
      highereducationloan : higherEducationLoan,
      donations : donations,
      paidrent : paidRent,
      familymemberabove60 : familyMemberAbove60,
      royaltyincome : royaltyIncome,
      savingsaccount : savingsAccount,
      plan : plan,
      allocation : allocation,
      weightedreturn : weightedReturn,
      incomefromsalary : incomeFromSalary,
      incomefromhousingproperty : incomeFromHousingProperty,
      incomefrombusinessandprofession : incomeFromBusinessAndProfession,
      incomefromcapitalgains : incomeFromCapitalGains,
      incomefromothersources : incomeFromOtherSources,
      grossincome : grossIncome,
      totalincome : totalIncome,
      normalincome : normalIncome,
      taxslab : taxSlab,
      taxliability : taxLiability,
      taxsaving : taxSaving,
      returnamount : returnAmount,
      totalbenefit : totalBenefit
    }).into('tax').asCallback(function (err) {

      if (err) {
        res.status(400).json(err)
        console.log(err)
      } else {
        res.status(200).json(data);
        // async..await is not allowed in global scope, must use a wrapper
        async function main() {
          // Generate test SMTP service account from ethereal.email
          // Only needed if you don't have a real mail account for testing
  
  
          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: "mail.confluence-r.com",
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
              user: '', // generated ethereal user
              pass: '', // generated ethereal password
            },
          });
  
          // send mail with defined transport object
          let info = await transporter.sendMail({
            from: 'akshaybhopani@confluence-r.com', // sender address
            to: Email, // list of receivers
            subject: `Congratulations ${User}, Your Tax Planning Portfolio Is Generated ✅`, // Subject line
            html: `<h1>Congratulations ${User}, Your Tax Planning Portfolio Is Generated ✅</h1><h3>You can check your Report on <a href="https://dcipl.yourtechshow.com/features/tax">https://dcipl.yourtechshow.com/features/tax</a> after logging in with your Email ${Email}.</h3><p>* This is automated Email sent from DCIPL Server.`, // html body
          });
  
          console.log("Message sent: %s", info.messageId);
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
  
          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }
  
        main().catch(console.error);
      }
    })
  })
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


app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
})
