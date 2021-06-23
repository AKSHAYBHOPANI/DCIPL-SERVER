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
    host: 'localhost',
    user: 'postgres',
    password: 'Arch@1',
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


app.post('/investment', (req, res) => {
  const { User, 
        Email, 
        TotalIncome,
        TotalExpenses,
        Assests,
        Liabilities,
        InvestableAmount,
        TargetAmount,
        Time: Time,
        IncomeStability } = req.body;

  var Surplus = parseInt(TotalIncome)-parseInt(TotalExpenses);
  var Margin = (parseInt(TotalIncome)-parseInt(TotalExpenses))/parseInt(TotalIncome);
  var BreakEven = Margin/Margin;
  var MarginOfSafety = parseInt(TotalIncome)-BreakEven;
  var MarginOfSafetyRs = MarginOfSafety*parseInt(TotalIncome);
  var BurnRate = (parseInt(TotalExpenses)/MarginOfSafetyRs)*12;
  var Return = (parseInt(TargetAmount)-parseInt(InvestableAmount))/InvestableAmount;
  var NetWorth = parseInt(Assests)-parseInt(Liabilities);
  var points = 0;
  var RiskAbility = "";


  if (parseInt(TotalIncome) < 500000) {
    var points= points +0;
  } else if(parseInt(TotalIncome) < 1000000) {
    var points= points +1;
  } else if(parseInt(TotalIncome) < 2000000) {
    var points= points +2;
  } else if(parseInt(TotalIncome) < 3000000) {
    var points= points +3;
  } else if(parseInt(TotalIncome) > 4000000) {
    var points= +4;
  }
 

   if (parseInt(Time) < 1) {
    var points= points+0;
  } else if(parseInt(Time) < 5) {
    var points= points+1;
  } else if(parseInt(Time) < 10) {
    var points= points+2;
  } else if(parseInt(Time) < 20) {
    var points= points+3;
  } else if(parseInt(Time) > 20) {
    var points= points+4;
  }


   if (IncomeStability==="Very Unstable") {
    var points= points+0;
  } else if(IncomeStability==="Unstable") {
    var points= points+1;
  } else if(IncomeStability==="Somewhat Stable") {
    var points= points+2;
  } else if(IncomeStability==="Stable") {
    var points= points+3;
  } else if(IncomeStability==="Very Stable") {
    var points= points+4;
  }


   if (parseInt(Assests) < (parseInt(TotalIncome)*6)) {
    var points= points+0;
  } else if(parseInt(Assests) < (parseInt(TotalIncome)*7)) {
    var points= points+1;
  } else if(parseInt(Assests) < (parseInt(TotalIncome)*8)) {
    var points= points+2;
  } else if(parseInt(Assests) < (parseInt(TotalIncome)*9)) {
    var points= points+3;
  } else if(parseInt(Assests) > (parseInt(TotalIncome)*10)) {
    var points= points+4;
  }
 

  if (points < 6) {
    var RiskAbility="Low"
  } else if (points < 11) {
    var RiskAbility="Medium"
  } else if (points => 16) {
    var RiskAbility="High"
  }


  var data = {
        "name": User,
        "email": Email,
        "totalincome": TotalIncome,
        "totalexpenses": TotalExpenses,
        "assests": Assests,
        "liabilities": Liabilities,
        "investableamount": InvestableAmount,
        "targetamount": TargetAmount,
        "time": Time,
        "incomestability": IncomeStability,
        "surplus": Surplus,
        "margin": Margin,
        "breakeven":BreakEven,
        "marginofsafety":MarginOfSafety,
        "marginofsafetyrs":MarginOfSafetyRs,
        "burnrate":BurnRate,
        "return": Return,
        "networth":NetWorth,
        "riskability": RiskAbility
  };


  db.insert({
        name: User,
        email: Email,
        totalincome: TotalIncome,
        totalexpenses: TotalExpenses,
        assests: Assests,
        liabilities: Liabilities,
        investableamount: InvestableAmount,
        targetamount: TargetAmount,
        time: Time,
        incomestability: IncomeStability,
        surplus: Surplus,
        margin: Margin,
        breakeven:BreakEven,
        marginofsafety:MarginOfSafety,
        marginofsafetyrs:MarginOfSafetyRs,
        burnrate:BurnRate,
        return: Return,
        networth:NetWorth,
        riskability: RiskAbility
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
    host: "YOUR_SMTP_SERVER_HERE",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'YOUR_EMAIL_HERE', // generated ethereal user
      pass: 'YOUR_PASSWORD_HERE', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'akshaybhopani@confluence-r.com', // sender address
    to: Email, // list of receivers
    subject: `Congratulations ${User}, Your Investment Portfolio Is Generated ✅`, // Subject line
    html: `<h1>Congratulations ${User}, Your Investment Portfolio Is Generated ✅</h1><h3>You can check your Report on <a>https://dcipl.yourtechshow.com/features/investment</a> after logging in with your Email ${Email}.</h3><p>* This is automated Email sent from DCIPL Server.`, // html body
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

app.post('/IsInvestmentFormSubmitted', (req, res) => {
  const { Email } = req.body;
  var i = ""
  db.select().from('investment').then(data => {
console.log(data)
    for (i = 0; i < data.length; i++) {
    if (data[i].email===Email) {
      res.send(data[i]);
    } else {
      res.sendStatus(400);
      break;
    }}
    res.header("Access-Control-Allow-Origin", "*").sendStatus(200);
  })
});

app.post('/retirement', (req, res) => {
  const { name, email, age, RetirementAge,
    lifeExpectancy,
    income,

    expense,
    savings,
    assetClass,
    Return,
    timeHorizon,
    lifePeriodpostRtmt,
    antcptedExpPostRtmt,
    fundspostRtmt,
    years,

    inflationRate, cii, FinancialRisk, Standard } = req.body;
  var incomeRange = Math.round(parseInt(income) / 5000) * 5000;



  var data = {
    "age": age,
    "RetirementAge": RetirementAge,
    "lifeExpectancy": lifeExpectancy,
    "income": income,
    "incomeRange": incomeRange,
    "expense": expense,
    "savings": savings,
    "assestClass": assetClass,
    "Return": Return,
    "timeHorizon": timeHorizon,
    "lifePeriodpostRtmt": lifePeriodpostRtmt,
    "antcptedExpPostRtmt": antcptedExpPostRtmt,
    "fundspostRtmt": fundspostRtmt,
    "years": years,
    "inflationRate": inflationRate,
    "cii": cii,
    "FinancialRisk": FinancialRisk,
    "Standard": Standard


  };

  db.insert({
    name: name,
    email: email,
    age: age,
    retirementage: RetirementAge,
    lifeexpectancy: lifeExpectancy,
    income: income,
    incomerange: incomeRange,
    expense: expense,
    savings: savings,
    assestclass: assetClass,
    return: Return,
    timehorizon: timeHorizon,
    lifeperiodpostrtmt: lifePeriodpostRtmt,
    antcptedexppostrtmt: antcptedExpPostRtmt,
    fundspostrtmt: fundspostRtmt,
    years: years,
    inflationrate: inflationRate,
    cii: cii,
    financialrisk: FinancialRisk,
    standard: Standard
  }).into('retirement').asCallback(function (err) {

    if (err) {
      res.status(400).json(err)
    } else {
      res.status(200).json(data)
    }
  })




})





// Taking input for Income and Expense sheet
app.post('/income_and_expense',(req, res) => {
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
    Misscelanous_Variable  } = req.body;

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
      "Salary" : Salary,
      "Interest_Income" : Interest_Income,
      "Professional_Income" : Professional_Income,
      "Rental_Income" : Rental_Income,
      "Other_Income" : Other_Income,
      "Fixed_Income" : Fixed_Income,

      //for Variable Income
      "Investment_Income" : Investment_Income,
      "Part_Time_Association" : Part_Time_Association,
      "Perquisites" : Perquisites,
      "Other_Income_Variable" : Other_Income_Variable,
      "Variable_Income" : Variable_Income,

      "Total_Income" : Total_Income,

      //for Fixed Expenses
      "Housing_and_Utilities" : Housing_and_Utilities,
      "Daily_Expense" : Daily_Expense,
      "Children_Expense" : Children_Expense,
      "Transportation_Expense" : Transportation_Expense,
      "Insurance" : Insurance,
      "Pet_Expense" : Pet_Expense,
      "Subscriptions" : Subscriptions,
      "Internet_Expense" : Internet_Expense,
      "Taxes" : Taxes,
      "Misscelanous_Expense" : Misscelanous_Expense,
      "Fixed_Expenses" : Fixed_Expenses,

      //for Variable Expenses
      "Healthcare" : Healthcare,
      "Charity" : Charity,
      "Entertainment" : Entertainment,
      "Travel" : Travel,
      "Misscelanous_variable" : Misscelanous_Variable,
      "Variable_Expenses" : Variable_Expenses,

      "Total_Expenses" : Total_Expenses
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


app.post('/tax', (req, res) => {
  const { name, email, TotalIncome,
    Exemption,
    TaxBracket,
    Perquisites,
    Allowances,
    Insurance,
    MonthlyInflow,
    TaxDeductions,
    DeductionLimit } = req.body;
  var Income = parseInt(TotalIncome, 10);

  var data = {
    "TotalIncome": Income,
    "Exemption": Exemption,
    "TaxBracket": TaxBracket,
    "Perquisites": Perquisites,
    "Allowances": Allowances,
    "Insurance": Insurance,
    "MonthlyInflow": MonthlyInflow,
    "TaxDeductions": TaxDeductions,
    "DeductionLimit": DeductionLimit
  };

  db.insert({
    name: name,
    email: email,
    totalincome: Income,
    exemption: Exemption,
    taxbracket: TaxBracket,
    perquisites: Perquisites,
    allowances: Allowances,
    insurance: Insurance,
    monthlyinflow: MonthlyInflow,
    deductionlimit: DeductionLimit
  }).into('tax').asCallback(function (err) {

    if (err) {
      res.status(400).json(err)
    } else {
      res.status(200).json(data)
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

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({ id })
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})



app.listen(PORT, () => {
  console.log(`app is running on port ${PORT}`);
})