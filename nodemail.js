const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'meredith.trantow91@ethereal.email', // generated ethereal user
      pass: 'W83x7yeTdahKMe6XHJ', // generated ethereal password
    },
  });

    
   

   // for bookings page
   const bookingMail = async function main(name,email,meetType,date,time,city,country,link){
    
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: 'meredith.trantow91@ethereal.email', // sender address
      to: 'dcandcoworld@gmail.com', // list of receivers
      subject: `Mail from : ${name},  Email : ${email}`, // Subject line
      html: `<h1> Meeting type : ${meetType} </h1><h3> Date and Time : ${date}  ${time}</h3><h3>Location : ${city}, ${country}</h3><h3>Meeting link : <a>${link}</a></h3>`, // html body
    });
    
    // send mail with defined transport object
    let info2 = await transporter.sendMail({
      from: 'meredith.trantow91@ethereal.email', // sender address
      to: email, // list of receivers
      subject: `Meeting credentials from DCIKIGAI`, // Subject line
      html: `<h1> Meeting type : ${meetType} </h1><h3> Date and Time : ${date}  ${time}</h3><h3>Location : ${city}, ${country}</h3><h3>Meeting link : <a>${link}</a></h3>`, // html body
    });
    
    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
     console.log("Message sent: %s", info2.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    };


    // for contact us page
    const contactMail = async function main(name,email,subject,description) {
        
        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: 'akshaybhopani@confluence-r.com', // sender address
          to: 'dcandcoworld@gmail.com', // list of receivers
          subject: `Mail from : ${name},  Email : ${email}`, // Subject line
          html: `<h1> Subject : ${subject} </h1><h3> Description : ${description} </h3>`, // html body
        });
   
        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
   
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      };


      // for tax Planning portfolio
      
      const taxplanningMail = async function main(User,Email) {
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
      };


      // for wealth planning portfolio

      const wealthplanningMail = async function main(name,email) {
        

        // send mail with defined transport object
        let info = await transporter.sendMail({
          from: 'akshaybhopani@confluence-r.com', // sender address
          to: email, // list of receivers
          subject: `Congratulations ${name}, Your Wealth planning Portfolio Is Generated ✅`, // Subject line
          html: `<h1>Congratulations ${name}, Your Wealth planning Portfolio Is Generated ✅</h1><h3>You can check your Report on <a href="https://dcipl.yourtechshow.com/features/wealth">https://dcipl.yourtechshow.com/features/wealth</a> after logging in with your Email ${email}.</h3><p>* This is automated Email sent from DCIPL Server.`, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
      };



      //for retirement planning portfolio
      const retirementplanningMail = async function main(name,email) {
        

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
      };


      // for investment portfolio
      const investmentplanningMail = async function main(User,Email) {
        
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
      };



      exports.bookingMail = bookingMail;
      exports.contactMail = contactMail;
      exports.taxplanningMail = taxplanningMail;
      exports.wealthplanningMail = wealthplanningMail;
      exports.retirementplanningMail = retirementplanningMail;
      exports.investmentplanningMail = investmentplanningMail;
      
    



