const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex')
const PORT = process.env.PORT || 8000;
const db = knex({
  // Enter your own database information here based on what you created
  client: 'pg',
  connection: {
<<<<<<< HEAD
    host : 'localhost',
    user : 'postgres',
    password : 'Arch@1',
    database : 'dcipl'
=======
    host : '127.0.0.1',
    user : 'yourqyac',
    password : 'FtoD4h0kz5Nr',
    database : 'yourqyac_dcipl'
>>>>>>> cb9468b015328547233124d60ce7701403d3b404
  }
});

const app = express();

app.use(cors())
app.use(bodyParser.json());


app.get('/', (req, res)=> {
  res.send(db.users);
})

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
 const { name, email, FixedIncome, OtherIncome, MedianIncome,
        TotalExpenses,
        SavingsIncome,
        Age,
        RetirementAge,
        AssestClass,
        Return,
        Risk, Time, FinancialRisk, Standard, RiskWillingness, Liquidity } = req.body;
 var Income = parseInt(FixedIncome,10) + parseInt(OtherIncome, 10);
 
 var data = { "TotalIncome": Income,
        "MedianIncome": MedianIncome,
        "TotalExpenses": TotalExpenses,
        "SavingsIncome": SavingsIncome,
        "Age": Age,
        "RetirementAge": RetirementAge,
        "AssestClass": AssestClass,
        "Return": Return,
        "Risk": Risk,
        "Time": Time,
        "FinancialRisk": FinancialRisk,
        "Standard": Standard,
        "RiskWillingness": RiskWillingness,
        "Liquidity": Liquidity
      };

db.insert({
        name: name,
        email: email,
        totalincome: Income,
        medianincome: MedianIncome,
        totalexpenses: TotalExpenses,
        savingsincome: SavingsIncome,
        age: Age,
        retirementage: RetirementAge,
        assestclass: AssestClass,
        return: Return,
        risk: Risk,
        time: Time,
        financialrisk: FinancialRisk,
        standard: Standard,
        riskwillingness: RiskWillingness,
        liquidity: Liquidity
 }).into('investment').asCallback(function(err) {

    if (err) {
       res.status(400).json(err)
    } else {
     res.status(200).json(data)
    }
})



  
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params;
  db.select('*').from('users').where({id})
    .then(user => {
      if (user.length) {
        res.json(user[0])
      } else {
        res.status(400).json('Not found')
      }
    })
    .catch(err => res.status(400).json('error getting user'))
})




app.listen(PORT, ()=> {
  console.log(`app is running on port ${PORT}`);
})
