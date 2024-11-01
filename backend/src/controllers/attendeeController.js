const QRCode = require('qrcode');
const AWS = require('aws-sdk');
const Attendee = require('../models/Attendee');
const transporter = require('../mailer');
const path = require('path');
const { Parser } = require('json2csv');
const fs = require('fs');
const Handlebars = require('handlebars');

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const getTicketTypeText = (ticketType) => {
  switch (ticketType) {
    case 'Gold':
      return 'Gold Sponsorship';
    case 'Platinum':
      return 'Platinum Sponsorship';
    case 'Coffee':
      return 'Coffee/Snack Break';
    default:
      return 'Attendee';
  }
};

const sendEmailWithQRCode = async (attendee) => {
  // Read the Handlebars template file
  const emailTemplatePath = path.join(__dirname, '..', '..', 'data', 'EmailConfirmation.hbs');
  const source = fs.readFileSync(emailTemplatePath, 'utf8');

  // Compile the template
  const template = Handlebars.compile(source);

  // Define your data to be injected into the template
  const data = {
    name: attendee.firstName + ' ' + attendee.lastName,
    UUID: attendee._id,
    ticketType: getTicketTypeText(attendee.ticketType),
    email: attendee.email,
    phone: attendee.phone,
    qrcodeurl: attendee.qrCode
  };

  // Generate the HTML content
  const emailHtml = template(data);
  const mailOptions = {
    from: process.env.MAIL_DEFAULT_SENDER,
    to: attendee.email,
    subject: 'Your QR Code for LeTip National Convention',
    html: emailHtml,
  };

  // Throttle configuration
  const throttleDelay = 1000; // Delay in milliseconds

  // Return a promise that resolves after throttling
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return reject(error);
        }
        resolve(info);
      });
    }, throttleDelay);
  });
};

const sendEmailsWithThrottle = async (attendees) => {
  const throttleDelay = 1000; // 1 second delay between emails

  for (let i = 0; i < attendees.length; i++) {
    try {
      await sendEmailWithQRCode(attendees[i]);
      console.log(`Email sent to ${attendees[i].email}`);
    } catch (error) {
      console.error(`Error sending email to ${attendees[i].email}:`, error);
    }
    // Wait before sending the next email
    await new Promise(resolve => setTimeout(resolve, throttleDelay));
  }
};

const createAttendee = async (req, res) => {
  try {
    // Helper function to format phone numbers
    const formatPhone = (phone) => phone.replace(/\D/g, '').slice(0, 3) + '-' + phone.slice(3, 6) + '-' + phone.slice(6, 10);

    let firstAttendeeId = null;
    let attendees = [];

    // Process all attendees
    const attendeesData = Array.isArray(req.body.attendees) ? req.body.attendees : [req.body];

    for (let i = 0; i < attendeesData.length; i++) {
      const data = attendeesData[i];
      
      if (data.phone) {
        // Strip all non-numeric characters and format phone number
        data.phone = formatPhone(data.phone);
      }
      // Create attendee object
      let attendee = new Attendee(data);
      // Set the registerer for all attendees except the first one
      if (firstAttendeeId !== null) {
        attendee.registerer = firstAttendeeId;
      }

      // Save the attendee
      attendee = await attendee.save(); 
      attendees.push(attendee);

      // Save the first attendee's _id
      if (i === 0) {
        firstAttendeeId = attendee._id;
      }
    }

    // Generate QR codes and save them to S3
    const qrCodePromises = attendees.map((attendee) => {
      const qrCodeUrl = `https://letipconvention.com/attendee/${attendee._id}`;

      return new Promise((resolve, reject) => {
        QRCode.toDataURL(qrCodeUrl, async (err, url) => {
          if (err) {
            console.error('Error generating QR code:', err);
            return reject(err);
          }

          const base64Data = Buffer.from(url.replace(/^data:image\/\w+;base64,/, ""), 'base64');
          const type = url.split(';')[0].split('/')[1];

          const s3Params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `${attendee._id}.png`,
            Body: base64Data,
            ContentEncoding: 'base64',
            ContentType: `image/${type}`,
          };

          try {
            const uploadResult = await s3.upload(s3Params).promise();
            attendee.qrCode = uploadResult.Location; // Save the S3 URL to the attendee document
            await attendee.save();
            resolve(attendee); // Resolve the promise with the attendee object
          } catch (uploadError) {
            console.error('Error uploading QR code to S3:', uploadError);
            reject(uploadError);
          }
        });
      });
    });

    // Wait for all QR codes to be generated and uploaded
    const attendeesWithQRCodes = await Promise.all(qrCodePromises);

    // Send emails with throttling
    await sendEmailsWithThrottle(attendeesWithQRCodes);

    res.status(201).json({ message: 'Attendees created and emails sent successfully' });
  } catch (error) {
    console.error('Error creating attendees:', error);
    res.status(500).json({ message: 'Error creating attendees' });
  }
};

const getAttendees = async (req, res) => {
  try {
    const attendees = await Attendee.find();
    res.json(attendees);
  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};

const getAttendeeById = async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id);
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found!' });
    }
    res.json(attendee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateAttendee = async (req, res) => {
  try {
    if (req.body.phone) {
      // Strip all non-numeric characters
      req.body.phone = req.body.phone.replace(/\D/g, '');
      req.body.phone = req.body.phone.slice(0, 3) + '-' + 
                       req.body.phone.slice(3, 6) + '-' + 
                       req.body.phone.slice(6, 10);
    }
    const attendee = await Attendee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found!' });
    }
    res.json(attendee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteAttendee = async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id);

    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }

    // Delete the QR code from S3
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: `${attendee._id}.png`,
    };

    try {
      await s3.deleteObject(s3Params).promise();
      console.log(`QR code for attendee ${attendee._id} deleted successfully.`);
    } catch (err) {
      console.error('Error deleting QR code from S3:', err);
      return res.status(500).json({ error: 'Failed to delete QR code from S3' });
    }

    // Delete the attendee from the database
    await Attendee.findByIdAndDelete(attendee._id);

    res.json({ message: 'Attendee and QR code deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const checkInAttendee = async (req, res) => {
  try {
    const attendee = await Attendee.findById(req.params.id);
    if (!attendee) {
      return res.status(404).json({ error: 'Attendee not found' });
    }
    attendee.checkedIn = !attendee.checkedIn;
    await attendee.save();
    res.json(attendee);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const checkOutAllAttendees = async (req, res) => {
  try {
    const attendees = await Attendee.updateMany({}, { checkedIn: false });
    res.json({ message: 'All attendees have been checked out', attendees });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generateCSV = async (req, res) => {
  try {
    const { fields } = req.body;

    if (!fields || fields.length === 0) {
      return res.status(400).json({ error: 'No fields selected for the report' });
    }

    const attendees = await Attendee.find({}, fields.join(' ')).lean();

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(attendees);

    res.header('Content-Type', 'text/csv');
    res.attachment('AttendeeReport.csv');
    res.send(csv);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).send('Server Error');
  }
};

const getQRCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Use a case-insensitive regular expression to find the attendee
    const attendees = await Attendee.find({ email: { $regex: new RegExp(`^${email}$`, 'i') } });

    if (attendees.length === 0) {
      return res.status(404).json({ error: 'Attendee not found' });
    }

    while (attendees.length > 0) {
      const attendee = attendees.pop();
      await sendEmailWithQRCode(attendee);
    }

    res.status(200).json({ message: 'QR code email resent successfully' });
  } catch (error) {
    console.error('Error retrieving QR code:', error);
    res.status(500).json({ error: 'Server Error' });
  }
};

const gettickettypes = async (req, res) => {
  try {
    const ticketTypes = await Attendee.aggregate([
      { $group: { _id: '$ticketType', count: { $sum: 1 } } },
    ]);

    const formattedTicketTypes = ticketTypes.reduce((acc, type) => {
      acc[type._id.toLowerCase()] = type.count;
      return acc;
    }, {});

    res.json(formattedTicketTypes);
  } catch (error) {
    console.error('Error fetching ticket types:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getTicketType = (sponsorshipOpportunity) => {
  const type = sponsorshipOpportunity?.split('|')[0].toLowerCase() || '';

  if (type.includes('platinum')) {
    return 'Platinum';
  } else if (type.includes('gold')) {
    return 'Gold';
  } else if (type.includes('showboater')) {
    return 'Showboater';
  } else if (type.includes('coffee')) {
    return 'Coffee/Snack';
  } else if (type === '') {
    return 'Bronze';
  } else {
    return 'Bronze'; // Default to Bronze if none of the above
  }
};


const handleGForm = async (req, res) => {
  try {
    // Log the payload for testing
    console.log('GForm Payload:', req.body);

    // Helper function to process consent fields
    function processConsent(consentValue) {
      return consentValue === '1';
    }

    const attendees = [];

    // Process the first attendee manually
    attendees.push({
      firstName: req.body['Name (First)']?.trim() || '',
      lastName: req.body['Name (Last)'] || '',
      email: req.body['Email'] || '',
      phone: req.body['Phone']?.replace(/[^\d]/g, '') || '', // Clean phone number
      checkedIn: false,
      ticketType: getTicketType(req.body['Select Your Sponsorship Opportunity']),
      company: req.body['Company'] || '',
      category: req.body['Category'] || '',
      letipChapter: req.body['LeTip Chapter'] || '',
      foodRestrictions: req.body['List all food allergies or restrictions below:'] || '',
      profilePic: '', // No field for profilePic in the provided data
      historicalFigureLunch: req.body['If you could have lunch with any historical figure, who would it be and why?'] || '',
      Consent: processConsent(req.body['Photography & Video Consent (Consent)']),
      registerer: ''
    });

    // Process subsequent attendees
    for (let i = 2; i <= 10; i++) {
      if (req.body[`Attendee Email (${i})`]) {
        attendees.push({
          firstName: req.body[`Attendee Name (${i}) (First)`] || '',
          lastName: req.body[`Attendee Name (${i}) (Last)`] || '',
          email: req.body[`Attendee Email (${i})`] || '',
          phone: req.body[`Attendee Phone (${i})`] || '',
          checkedIn: false,
          ticketType: 'Attendee', // Default to Bronze for additional attendees
          company: req.body[`Attendee Company (${i})`] || '',
          category: req.body[`LeTip Category (${i})`] || '',
          letipChapter: req.body[`LeTip Chapter (${i})`] || '',
          foodRestrictions: req.body[`List all food allergies or restrictions below (${i}):`] || '',
          profilePic: '', // No field for profilePic in the provided data
          historicalFigureLunch: req.body[`If you could have lunch with any historical figure, who would it be and why? (${i})`] || '',
          Consent: processConsent(req.body[`Photography & Video Consent (${i}) (Consent)`]),
          registerer: req.body['Created By'] || '', // Assuming Created By is the ID of the registerer
        });
      }
    }

    console.log('Processed Attendees:', attendees);

    // Create a dummy req and res for createAttendee
    const dummyReq = { body: { attendees } };
    const dummyRes = {
      status: (code) => ({
        json: (data) => {
          // Dummy response handling
          console.log(`Response status: ${code}`, data);
        }
      })
    };

    // Call createAttendee with the dummy req and res
    await createAttendee(dummyReq, dummyRes);

    // Return a success response
    res.json({ success: true, message: 'Attendees processed and created successfully' });
  } catch (error) {
    console.error('Error processing GForm data:', error);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
};


module.exports = {
  createAttendee,
  getAttendees,
  getAttendeeById,
  updateAttendee,
  deleteAttendee,
  checkInAttendee,
  checkOutAllAttendees,
  generateCSV,
  getQRCode,
  gettickettypes,
  handleGForm,  // Add handleGForm to exports
};