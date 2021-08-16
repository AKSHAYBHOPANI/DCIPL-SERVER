const knex = require('knex')({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '12345',
      database : 'dc'
    }
  });
  const pg = require('knex')({
    client: 'pg',
    connection: process.env.PG_CONNECTION_STRING,
    searchPath: ['knex', 'public'],
  });
 // let investableamount = db.select('investableamount').from('investment').where('email', '=', 'v.mbc@gmail.com');

   // investableamount = investableamount[0].investableamount;
   console.log(knex.select(db.raw('SUM(time)')).from('investment'));
     //console.log(db('investmentportfolioequity').sum('allocatedweight'))
    //console.log(knex('investment').sum('time'))
    let result = await db.select(db.raw('SUM(time)')).from('investment');
    result = result[0].sum; 
    console.log(result);
   //var result = db.select(db.raw('SUM(time)'))
   //.from('investment')
   //.then(function(todos){
     //result = todos[0].sum;
     //console.log(result);
    // return todos[0].sum;
   //})
   "knex": "^0.21.21",
    "nodemailer": "^6.6.2",
    "pg": "^8.7.1"
   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 