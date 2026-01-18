const emailTemplate = ({ ownerName, gymName, softwareLogo, gymLogo }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Welcome to FitOrbit</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { margin:0; padding:0; background:#f4f6f8; font-family: 'Poppins', sans-serif; }
    a { text-decoration: none; }
    ul { padding-left: 20px; margin:0; }
    li { margin-bottom:10px; }
  </style>
</head>
<body>

  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:30px 10px;">

        <!-- Main Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 6px 20px rgba(0,0,0,0.1);">

        

          <!-- Body -->
          <tr>
            <td style="padding:30px;">

              <h2 style="color:#111827; font-size:24px; margin-bottom:15px;">Hello ${ownerName} 👋</h2>

              <p style="color:#374151; font-size:16px; line-height:1.6;">
                Welcome to <b>FitOrbit</b> – the ultimate Gym Management Software. Your gym, <b>${gymName}</b>, has been successfully registered. You can now manage memberships, trainers, schedules, and more—all from one dashboard.
              </p>

             

              <!-- Features / Highlights -->
              <h3 style="color:#111827; font-size:18px; margin-bottom:10px;">Get Started with FitOrbit</h3>
              <ul style="color:#374151; font-size:15px; line-height:1.8; margin-bottom:30px;">
                <li><b>Dashboard & Insights:</b> Track your gym’s performance, revenue, and attendance in real-time.</li>
                <li><b>Membership Management:</b> Add plans, manage subscriptions, and keep members organized.</li>
                <li><b>Trainer & Staff Management:</b> Assign roles, schedules, and monitor performance.</li>
                <li><b>Automated Notifications:</b> Engage your members with emails and reminders.</li>
                <li><b>Reports & Analytics:</b> Generate instant reports to make smarter decisions.</li>
              </ul>

              <!-- Call-to-Action Button -->
              <div style=" margin-bottom:30px;">
                <a href="https://fitorbitin.netlify.app/login"
                   style="background:#2563eb; color:#fff; padding:14px 28px; border-radius:6px; font-weight:600; font-size:16px; display:inline-block;">
                  Login to Dashboard
                </a>
              </div>

              <!-- Support Section -->
              <p style="color:#6b7280; font-size:14px; line-height:1.6;">
                Need help getting started? Our support team is here for you.  
                <br/>Contact us at <a href="mailto:support@fitorbit.com" style="color:#2563eb;">support@fitorbit.com</a>
              </p>

              <p style="color:#6b7280; font-size:14px; margin-top:30px;">
                Regards,<br/>
                <b>The FitOrbit Team</b>
              </p>

            </td>
          </tr>


            <!-- Header / Logo -->
          <tr>
            <td align="center" style="padding:25px;">
              <img src="${softwareLogo}" height="50" alt="FitOrbit Logo" style="display:block;" />
            </td>
          </tr>

          
          <!-- Footer -->
          <tr>
            <td style="padding:3px ; background:#f3f4f6; color:#9ca3af; font-size:12px;">
              &copy; ${new Date().getFullYear()} FitOrbit. All rights reserved.
            </td>
          </tr>




        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;

module.exports = emailTemplate;
