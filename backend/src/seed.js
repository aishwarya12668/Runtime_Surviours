const dotenv = require("dotenv");
const connectDB = require("./config/db");
const Doctor = require("./models/Doctor");

dotenv.config();

const doctors = [
  { name: "Dr. Meera Shah", specialization: "Oncology", availability: ["Mon 10:00", "Wed 14:00"] },
  { name: "Dr. Aisha Khan", specialization: "Breast Surgery", availability: ["Tue 11:00", "Thu 16:00"] },
  { name: "Dr. Riya Nair", specialization: "Radiology", availability: ["Fri 09:00", "Sat 12:00"] },
];

const run = async () => {
  await connectDB();
  await Doctor.deleteMany({});
  await Doctor.insertMany(doctors);
  console.log("Seed data inserted");
  process.exit(0);
};

run();
