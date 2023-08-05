import nodemailer from "nodemailer";
import { Cart } from "@prisma/client";

export interface EmailType {
  from: string;
  to: string;
  subject: string;
  html: string;
}

async function sendEmail(mailOptions: EmailType) {
  const SMTP_HOST = process.env.SMTP_HOST;
  const SMTP_PORT = process.env.SMTP_PORT;
  const SMTP_USER = process.env.SMTP_USER;
  const SMTP_PASS = process.env.SMTP_PASS;
  const STATUS = process.env.STATUS;

  const emailConfig = {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: STATUS === "DEVELOPMENT" ? false : true,
    },
  };

  const transporter = nodemailer.createTransport(emailConfig);
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err.message);
      return false;
    }
    console.log("Email sent: %s", info.response);
  });
}

const bookingStatusEmailTemplate = (cart: Cart) => {
  return `<!doctype html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>Simple Transactional Email</title>
      <style>
        /* -------------------------------------
            GLOBAL RESETS
        ------------------------------------- */
        
        /*All the styling goes here*/
        
        img {
          border: none;
          -ms-interpolation-mode: bicubic;
          max-width: 100%; 
        }
  
        body {
          background-color: #f6f6f6;
          font-family: sans-serif;
          -webkit-font-smoothing: antialiased;
          font-size: 14px;
          line-height: 1.4;
          margin: 0;
          padding: 0;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%; 
        }
  
        table {
          border-collapse: separate;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          width: 100%; }
          table td {
            font-family: sans-serif;
            font-size: 14px;
            vertical-align: top; 
        }
  
        /* -------------------------------------
            BODY & CONTAINER
        ------------------------------------- */
  
        .body {
          background-color: #f6f6f6;
          width: 100%; 
        }
  
        /* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
        .container {
          display: block;
          margin: 0 auto !important;
          /* makes it centered */
          max-width: 580px;
          padding: 10px;
          width: 580px; 
        }
  
        /* This should also be a block element, so that it will fill 100% of the .container */
        .content {
          box-sizing: border-box;
          display: block;
          margin: 0 auto;
          max-width: 580px;
          padding: 10px; 
        }
  
        /* -------------------------------------
            HEADER, FOOTER, MAIN
        ------------------------------------- */
        .main {
          background: #ffffff;
          border-radius: 3px;
          width: 100%; 
        }
  
        .wrapper {
          box-sizing: border-box;
          padding: 20px; 
        }
  
        .content-block {
          padding-bottom: 10px;
          padding-top: 10px;
        }
  
        .footer {
          clear: both;
          margin-top: 10px;
          text-align: center;
          width: 100%; 
        }
          .footer td,
          .footer p,
          .footer span,
          .footer a {
            color: #999999;
            font-size: 12px;
            text-align: center; 
        }
  
        /* -------------------------------------
            TYPOGRAPHY
        ------------------------------------- */
        h1,
        h2,
        h3,
        h4 {
          color: #000000;
          font-family: sans-serif;
          font-weight: 400;
          line-height: 1.4;
          margin: 0;
          margin-bottom: 30px; 
        }
  
        h1 {
          font-size: 35px;
          font-weight: 300;
          text-align: center;
          text-transform: capitalize; 
        }
  
        p,
        ul,
        ol {
          font-family: sans-serif;
          font-size: 14px;
          font-weight: normal;
          margin: 0;
          margin-bottom: 15px; 
        }
          p li,
          ul li,
          ol li {
            list-style-position: inside;
            margin-left: 5px; 
        }
  
        a {
          color: #3498db;
          text-decoration: underline; 
        }
  
        /* -------------------------------------
            BUTTONS
        ------------------------------------- */
        .btn {
          box-sizing: border-box;
          width: 100%; }
          .btn > tbody > tr > td {
            padding-bottom: 15px; }
          .btn table {
            width: auto; 
        }
          .btn table td {
            background-color: #ffffff;
            border-radius: 5px;
            text-align: center; 
        }
          .btn a {
            background-color: #ffffff;
            border: solid 1px #3498db;
            border-radius: 5px;
            box-sizing: border-box;
            color: #3498db;
            cursor: pointer;
            display: inline-block;
            font-size: 14px;
            font-weight: bold;
            margin: 0;
            padding: 12px 25px;
            text-decoration: none;
            text-transform: capitalize; 
        }
  
        .btn-primary table td {
          background-color: #3498db; 
        }
  
        .btn-primary a {
          background-color: #3498db;
          border-color: #3498db;
          color: #ffffff; 
        }
  
        /* -------------------------------------
            OTHER STYLES THAT MIGHT BE USEFUL
        ------------------------------------- */
        .last {
          margin-bottom: 0; 
        }
  
        .first {
          margin-top: 0; 
        }
  
        .align-center {
          text-align: center; 
        }
  
        .align-right {
          text-align: right; 
        }
  
        .align-left {
          text-align: left; 
        }
  
        .clear {
          clear: both; 
        }
  
        .mt0 {
          margin-top: 0; 
        }
  
        .mb0 {
          margin-bottom: 0; 
        }
  
        .preheader {
          color: transparent;
          display: none;
          height: 0;
          max-height: 0;
          max-width: 0;
          opacity: 0;
          overflow: hidden;
          mso-hide: all;
          visibility: hidden;
          width: 0; 
        }
  
        .powered-by a {
          text-decoration: none; 
        }
  
        hr {
          border: 0;
          border-bottom: 1px solid #f6f6f6;
          margin: 20px 0; 
        }
  
        /* -------------------------------------
            RESPONSIVE AND MOBILE FRIENDLY STYLES
        ------------------------------------- */
        @media only screen and (max-width: 620px) {
          table.body h1 {
            font-size: 28px !important;
            margin-bottom: 10px !important; 
          }
          table.body p,
          table.body ul,
          table.body ol,
          table.body td,
          table.body span,
          table.body a {
            font-size: 16px !important; 
          }
          table.body .wrapper,
          table.body .article {
            padding: 10px !important; 
          }
          table.body .content {
            padding: 0 !important; 
          }
          table.body .container {
            padding: 0 !important;
            width: 100% !important; 
          }
          table.body .main {
            border-left-width: 0 !important;
            border-radius: 0 !important;
            border-right-width: 0 !important; 
          }
          table.body .btn table {
            width: 100% !important; 
          }
          table.body .btn a {
            width: 100% !important; 
          }
          table.body .img-responsive {
            height: auto !important;
            max-width: 100% !important;
            width: auto !important; 
          }
        }
  
        /* -------------------------------------
            PRESERVE THESE STYLES IN THE HEAD
        ------------------------------------- */
        @media all {
          .ExternalClass {
            width: 100%; 
          }
          .ExternalClass,
          .ExternalClass p,
          .ExternalClass span,
          .ExternalClass font,
          .ExternalClass td,
          .ExternalClass div {
            line-height: 100%; 
          }
          .apple-link a {
            color: inherit !important;
            font-family: inherit !important;
            font-size: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
            text-decoration: none !important; 
          }
          #MessageViewBody a {
            color: inherit;
            text-decoration: none;
            font-size: inherit;
            font-family: inherit;
            font-weight: inherit;
            line-height: inherit;
          }
          .btn-primary table td:hover {
            background-color: #34495e !important; 
          }
          .btn-primary a:hover {
            background-color: #34495e !important;
            border-color: #34495e !important; 
          } 
        }
  
      </style>
    </head>
    <body>
      <span class="preheader">This is preheader text. Some clients will show this text as a preview.</span>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body">
        <tr>
          <td>&nbsp;</td>
          <td class="container">
            <div class="content">
  
              <!-- START CENTERED WHITE CONTAINER -->
              <table role="presentation" class="main">
  
                <!-- START MAIN CONTENT AREA -->
                <tr>
                  <td class="wrapper">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p>Hi ${cart.name},</p>
                          <p>Your booking status has been update to ${cart.status?.toLocaleLowerCase()}, you can see the detail of your order from the link bellow.</p>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" class="btn btn-primary">
                            <tbody>
                              <tr>
                                <td align="left">
                                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                                    <tbody>
                                      <tr>
                                        <td> <a href=${
                                          "https://oseanasnorkelingadventure.com/booked-status?bookingId=" +
                                          cart.bookingId +
                                          "&phone=" +
                                          cart.phone
                                        } target="_blank">Call To Action</a> </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <p>Thanks for your order! Prease contact us if want more information.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
  
              <!-- END MAIN CONTENT AREA -->
              </table>
              <!-- END CENTERED WHITE CONTAINER -->
  
              <!-- START FOOTER -->
              <div class="footer">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td class="content-block">
                      <span class="apple-link">Oseana, Bali</span>
                    </td>
                  </tr>
                </table>
              </div>
              <!-- END FOOTER -->
  
            </div>
          </td>
          <td>&nbsp;</td>
        </tr>
      </table>
    </body>
  </html>`;
};

const resetPasswordEmailTemplate = (companyName: string, url: string) =>
  `<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\r\n<html xmlns=\"http://www.w3.org/1999/xhtml\">\r\n  <head>\r\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\r\n    <meta name=\"x-apple-disable-message-reformatting\" />\r\n    <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\" />\r\n    <meta name=\"color-scheme\" content=\"light dark\" />\r\n    <meta name=\"supported-color-schemes\" content=\"light dark\" />\r\n    <title></title>\r\n    <style type=\"text/css\" rel=\"stylesheet\" media=\"all\">\r\n    /* Base ------------------------------ */\r\n    \r\n    @import url(\"https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap\");\r\n    body {\r\n      width: 100% !important;\r\n      height: 100%;\r\n      margin: 0;\r\n      -webkit-text-size-adjust: none;\r\n    }\r\n    \r\n    a {\r\n      color: #3869D4;\r\n    }\r\n    \r\n    a img {\r\n      border: none;\r\n    }\r\n    \r\n    td {\r\n      word-break: break-word;\r\n    }\r\n    \r\n    .preheader {\r\n      display: none !important;\r\n      visibility: hidden;\r\n      mso-hide: all;\r\n      font-size: 1px;\r\n      line-height: 1px;\r\n      max-height: 0;\r\n      max-width: 0;\r\n      opacity: 0;\r\n      overflow: hidden;\r\n    }\r\n    /* Type ------------------------------ */\r\n    \r\n    body,\r\n    td,\r\n    th {\r\n      font-family: \"Nunito Sans\", Helvetica, Arial, sans-serif;\r\n    }\r\n    \r\n    h1 {\r\n      margin-top: 0;\r\n      color: #333333;\r\n      font-size: 22px;\r\n      font-weight: bold;\r\n      text-align: left;\r\n    }\r\n    \r\n    h2 {\r\n      margin-top: 0;\r\n      color: #333333;\r\n      font-size: 16px;\r\n      font-weight: bold;\r\n      text-align: left;\r\n    }\r\n    \r\n    h3 {\r\n      margin-top: 0;\r\n      color: #333333;\r\n      font-size: 14px;\r\n      font-weight: bold;\r\n      text-align: left;\r\n    }\r\n    \r\n    td,\r\n    th {\r\n      font-size: 16px;\r\n    }\r\n    \r\n    p,\r\n    ul,\r\n    ol,\r\n    blockquote {\r\n      margin: .4em 0 1.1875em;\r\n      font-size: 16px;\r\n      line-height: 1.625;\r\n    }\r\n    \r\n    p.sub {\r\n      font-size: 13px;\r\n    }\r\n    /* Utilities ------------------------------ */\r\n    \r\n    .align-right {\r\n      text-align: right;\r\n    }\r\n    \r\n    .align-left {\r\n      text-align: left;\r\n    }\r\n    \r\n    .align-center {\r\n      text-align: center;\r\n    }\r\n    \r\n    .u-margin-bottom-none {\r\n      margin-bottom: 0;\r\n    }\r\n    /* Buttons ------------------------------ */\r\n    \r\n    .button {\r\n      background-color: #3869D4;\r\n      border-top: 10px solid #3869D4;\r\n      border-right: 18px solid #3869D4;\r\n      border-bottom: 10px solid #3869D4;\r\n      border-left: 18px solid #3869D4;\r\n      display: inline-block;\r\n      color: #FFF;\r\n      text-decoration: none;\r\n      border-radius: 3px;\r\n      box-shadow: 0 2px 3px rgba(0, 0, 0, 0.16);\r\n      -webkit-text-size-adjust: none;\r\n      box-sizing: border-box;\r\n    }\r\n    \r\n    .button--green {\r\n      background-color: #22BC66;\r\n      border-top: 10px solid #22BC66;\r\n      border-right: 18px solid #22BC66;\r\n      border-bottom: 10px solid #22BC66;\r\n      border-left: 18px solid #22BC66;\r\n    }\r\n    \r\n    .button--red {\r\n      background-color: #FF6136;\r\n      border-top: 10px solid #FF6136;\r\n      border-right: 18px solid #FF6136;\r\n      border-bottom: 10px solid #FF6136;\r\n      border-left: 18px solid #FF6136;\r\n    }\r\n    \r\n    @media only screen and (max-width: 500px) {\r\n      .button {\r\n        width: 100% !important;\r\n        text-align: center !important;\r\n      }\r\n    }\r\n    /* Attribute list ------------------------------ */\r\n    \r\n    .attributes {\r\n      margin: 0 0 21px;\r\n    }\r\n    \r\n    .attributes_content {\r\n      background-color: #F4F4F7;\r\n      padding: 16px;\r\n    }\r\n    \r\n    .attributes_item {\r\n      padding: 0;\r\n    }\r\n    /* Related Items ------------------------------ */\r\n    \r\n    .related {\r\n      width: 100%;\r\n      margin: 0;\r\n      padding: 25px 0 0 0;\r\n      -premailer-width: 100%;\r\n      -premailer-cellpadding: 0;\r\n      -premailer-cellspacing: 0;\r\n    }\r\n    \r\n    .related_item {\r\n      padding: 10px 0;\r\n      color: #CBCCCF;\r\n      font-size: 15px;\r\n      line-height: 18px;\r\n    }\r\n    \r\n    .related_item-title {\r\n      display: block;\r\n      margin: .5em 0 0;\r\n    }\r\n    \r\n    .related_item-thumb {\r\n      display: block;\r\n      padding-bottom: 10px;\r\n    }\r\n    \r\n    .related_heading {\r\n      border-top: 1px solid #CBCCCF;\r\n      text-align: center;\r\n      padding: 25px 0 10px;\r\n    }\r\n    /* Discount Code ------------------------------ */\r\n    \r\n    .discount {\r\n      width: 100%;\r\n      margin: 0;\r\n      padding: 24px;\r\n      -premailer-width: 100%;\r\n      -premailer-cellpadding: 0;\r\n      -premailer-cellspacing: 0;\r\n      background-color: #F4F4F7;\r\n      border: 2px dashed #CBCCCF;\r\n    }\r\n    \r\n    .discount_heading {\r\n      text-align: center;\r\n    }\r\n    \r\n    .discount_body {\r\n      text-align: center;\r\n      font-size: 15px;\r\n    }\r\n    /* Social Icons ------------------------------ */\r\n    \r\n    .social {\r\n      width: auto;\r\n    }\r\n    \r\n    .social td {\r\n      padding: 0;\r\n      width: auto;\r\n    }\r\n    \r\n    .social_icon {\r\n      height: 20px;\r\n      margin: 0 8px 10px 8px;\r\n      padding: 0;\r\n    }\r\n    /* Data table ------------------------------ */\r\n    \r\n    .purchase {\r\n      width: 100%;\r\n      margin: 0;\r\n      padding: 35px 0;\r\n      -premailer-width: 100%;\r\n      -premailer-cellpadding: 0;\r\n      -premailer-cellspacing: 0;\r\n    }\r\n    \r\n    .purchase_content {\r\n      width: 100%;\r\n      margin: 0;\r\n      padding: 25px 0 0 0;\r\n      -premailer-width: 100%;\r\n      -premailer-cellpadding: 0;\r\n      -premailer-cellspacing: 0;\r\n    }\r\n    \r\n    .purchase_item {\r\n      padding: 10px 0;\r\n      color: #51545E;\r\n      font-size: 15px;\r\n      line-height: 18px;\r\n    }\r\n    \r\n    .purchase_heading {\r\n      padding-bottom: 8px;\r\n      border-bottom: 1px solid #EAEAEC;\r\n    }\r\n    \r\n    .purchase_heading p {\r\n      margin: 0;\r\n      color: #85878E;\r\n      font-size: 12px;\r\n    }\r\n    \r\n    .purchase_footer {\r\n      padding-top: 15px;\r\n      border-top: 1px solid #EAEAEC;\r\n    }\r\n    \r\n    .purchase_total {\r\n      margin: 0;\r\n      text-align: right;\r\n      font-weight: bold;\r\n      color: #333333;\r\n    }\r\n    \r\n    .purchase_total--label {\r\n      padding: 0 15px 0 0;\r\n    }\r\n    \r\n    body {\r\n      background-color: #F2F4F6;\r\n      color: #51545E;\r\n    }\r\n    \r\n    p {\r\n      color: #51545E;\r\n    }\r\n    \r\n    .email-wrapper {\r\n      width: 100%;\r\n      margin: 0;\r\n      padding: 0;\r\n      -premailer-width: 100%;\r\n      -premailer-cellpadding: 0;\r\n      -premailer-cellspacing: 0;\r\n      background-color: #F2F4F6;\r\n    }\r\n    \r\n    .email-content {\r\n      width: 100%;\r\n      margin: 0;\r\n      padding: 0;\r\n      -premailer-width: 100%;\r\n      -premailer-cellpadding: 0;\r\n      -premailer-cellspacing: 0;\r\n    }\r\n    /* Masthead ----------------------- */\r\n    \r\n    .email-masthead {\r\n      padding: 25px 0;\r\n      text-align: center;\r\n    }\r\n    \r\n    .email-masthead_logo {\r\n      width: 94px;\r\n    }\r\n    \r\n    .email-masthead_name {\r\n      font-size: 16px;\r\n      font-weight: bold;\r\n      color: #A8AAAF;\r\n      text-decoration: none;\r\n      text-shadow: 0 1px 0 white;\r\n    }\r\n    /* Body ------------------------------ */\r\n    \r\n    .email-body {\r\n      width: 100%;\r\n      margin: 0;\r\n      padding: 0;\r\n      -premailer-width: 100%;\r\n      -premailer-cellpadding: 0;\r\n      -premailer-cellspacing: 0;\r\n    }\r\n    \r\n    .email-body_inner {\r\n      width: 570px;\r\n      margin: 0 auto;\r\n      padding: 0;\r\n      -premailer-width: 570px;\r\n      -premailer-cellpadding: 0;\r\n      -premailer-cellspacing: 0;\r\n      background-color: #FFFFFF;\r\n    }\r\n    \r\n    .email-footer {\r\n      width: 570px;\r\n      margin: 0 auto;\r\n      padding: 0;\r\n      -premailer-width: 570px;\r\n      -premailer-cellpadding: 0;\r\n      -premailer-cellspacing: 0;\r\n      text-align: center;\r\n    }\r\n    \r\n    .email-footer p {\r\n      color: #A8AAAF;\r\n    }\r\n    \r\n    .body-action {\r\n      width: 100%;\r\n      margin: 30px auto;\r\n      padding: 0;\r\n      -premailer-width: 100%;\r\n      -premailer-cellpadding: 0;\r\n      -premailer-cellspacing: 0;\r\n      text-align: center;\r\n    }\r\n    \r\n    .body-sub {\r\n      margin-top: 25px;\r\n      padding-top: 25px;\r\n      border-top: 1px solid #EAEAEC;\r\n    }\r\n    \r\n    .content-cell {\r\n      padding: 45px;\r\n    }\r\n    /*Media Queries ------------------------------ */\r\n    \r\n    @media only screen and (max-width: 600px) {\r\n      .email-body_inner,\r\n      .email-footer {\r\n        width: 100% !important;\r\n      }\r\n    }\r\n    \r\n    @media (prefers-color-scheme: dark) {\r\n      body,\r\n      .email-body,\r\n      .email-body_inner,\r\n      .email-content,\r\n      .email-wrapper,\r\n      .email-masthead,\r\n      .email-footer {\r\n        background-color: #333333 !important;\r\n        color: #FFF !important;\r\n      }\r\n      p,\r\n      ul,\r\n      ol,\r\n      blockquote,\r\n      h1,\r\n      h2,\r\n      h3,\r\n      span,\r\n      .purchase_item {\r\n        color: #FFF !important;\r\n      }\r\n      .attributes_content,\r\n      .discount {\r\n        background-color: #222 !important;\r\n      }\r\n      .email-masthead_name {\r\n        text-shadow: none !important;\r\n      }\r\n    }\r\n    \r\n    :root {\r\n      color-scheme: light dark;\r\n      supported-color-schemes: light dark;\r\n    }\r\n    </style>\r\n    <!--[if mso]>\r\n    <style type=\"text/css\">\r\n      .f-fallback  {\r\n        font-family: Arial, sans-serif;\r\n      }\r\n    </style>\r\n  <![endif]-->\r\n  </head>\r\n  <body>\r\n    <span class=\"preheader\">Use this link to reset your password. The link is only valid for 24 hours.</span>\r\n    <table class=\"email-wrapper\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\">\r\n      <tr>\r\n        <td align=\"center\">\r\n          <table class=\"email-content\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\">\r\n            <tr>\r\n              <td class=\"email-masthead\">\r\n                <a href=\"https://example.com\" class=\"f-fallback email-masthead_name\">\r\n              ${companyName}\r\n              </a>\r\n              </td>\r\n            </tr>\r\n            <!-- Email Body -->\r\n            <tr>\r\n              <td class=\"email-body\" width=\"570\" cellpadding=\"0\" cellspacing=\"0\">\r\n                <table class=\"email-body_inner\" align=\"center\" width=\"570\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\">\r\n                  <!-- Body content -->\r\n                  <tr>\r\n                    <td class=\"content-cell\">\r\n                      <div class=\"f-fallback\">\r\n                        <h1>Hi Prohita Admin,</h1>\r\n                        <p>You recently requested to reset your password for your ${companyName} account. Use the button below to reset it. <strong>This password reset is only valid for the next 24 hours.</strong></p>\r\n                        <!-- Action -->\r\n                        <table class=\"body-action\" align=\"center\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\">\r\n                          <tr>\r\n                            <td align=\"center\">\r\n                              <!-- Border based button\r\n           https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design -->\r\n                              <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" role=\"presentation\">\r\n                                <tr>\r\n                                  <td align=\"center\">\r\n                                    <a href=${url} class=\"f-fallback button button--green\" target=\"_blank\">Reset your password</a>\r\n                                  </td>\r\n                                </tr>\r\n                              </table>\r\n                            </td>\r\n                          </tr>\r\n                        </table>\r\n                        <p>For security, this request was received from a web server application. If you did not request a password reset, please ignore this email or <a href=\"https://wa.me/081945795745\">contact support</a> if you have questions.</p>\r\n                        <p>Thanks,\r\n                          <br>The ${companyName} team</p>\r\n                        <!-- Sub copy -->\r\n                        <table class=\"body-sub\" role=\"presentation\">\r\n                          <tr>\r\n                            <td>\r\n                              <p class=\"f-fallback sub\">If you’re having trouble with the button above, copy and paste the URL below into your web browser.</p>\r\n                              <p class=\"f-fallback sub\">${url}</p>\r\n                            </td>\r\n                          </tr>\r\n                        </table>\r\n                      </div>\r\n                    </td>\r\n                  </tr>\r\n                </table>\r\n              </td>\r\n            </tr>\r\n            <tr>\r\n              <td>\r\n                <table class=\"email-footer\" align=\"center\" width=\"570\" cellpadding=\"0\" cellspacing=\"0\" role=\"presentation\">\r\n                  <tr>\r\n                    <td class=\"content-cell\" align=\"center\">\r\n                      <p class=\"f-fallback sub align-center\">\r\n                        ${companyName} \r\n                        <br>1234 Street Rd.\r\n                        <br>Suite 1234\r\n                      </p>\r\n                    </td>\r\n                  </tr>\r\n                </table>\r\n              </td>\r\n            </tr>\r\n          </table>\r\n        </td>\r\n      </tr>\r\n    </table>\r\n  </body>\r\n</html>`;

export { sendEmail, resetPasswordEmailTemplate, bookingStatusEmailTemplate };
