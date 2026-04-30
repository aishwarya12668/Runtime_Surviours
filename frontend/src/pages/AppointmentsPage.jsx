import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

const SLOT_TIMES = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];
const DUMMY_DOCTORS = [
  {
    _id: "dummy-1",
    name: "Dr. Kavitha Nair",
    specialization: "General Physician",
    qualification: "MBBS, MD",
    experience: "10 years",
    hospital: "Fortis Hospital, Bangalore",
    rating: "4.5/5",
  },
  {
    _id: "dummy-2",
    name: "Dr. Priya Sharma",
    specialization: "Oncologist",
    qualification: "MBBS, DM Oncology",
    experience: "18 years",
    hospital: "Manipal Comprehensive Cancer Center",
    rating: "4.9/5",
  },
  {
    _id: "dummy-3",
    name: "Dr. Rajesh Kumar",
    specialization: "Surgeon",
    qualification: "MBBS, MS",
    experience: "22 years",
    hospital: "Apollo Hospital, Bangalore",
    rating: "4.8/5",
  },
  {
    _id: "dummy-4",
    name: "Dr. Ananya Reddy",
    specialization: "Radiologist",
    qualification: "MBBS, MD Radiology",
    experience: "12 years",
    hospital: "Narayana Health City",
    rating: "4.7/5",
  },
  {
    _id: "dummy-5",
    name: "Dr. Meera Iyer",
    specialization: "Oncologist",
    qualification: "MBBS, DM Oncology",
    experience: "16 years",
    hospital: "Kidwai Memorial Institute of Oncology",
    rating: "4.8/5",
  },
  {
    _id: "dummy-6",
    name: "Dr. Suresh Patil",
    specialization: "Pathologist",
    qualification: "MBBS, MD Pathology",
    experience: "14 years",
    hospital: "BGS Gleneagles Global Hospital",
    rating: "4.6/5",
  },
];

const toInputDateTime = (dateStr, time) => `${dateStr}T${time}`;

export default function AppointmentsPage() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [localAppointments, setLocalAppointments] = useState(
    JSON.parse(localStorage.getItem("dummyAppointments") || "[]")
  );
  const [doctorId, setDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState("find");
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All Specializations");

  const load = async () => {
    try {
      const [d, a] = await Promise.all([api.get("/doctors"), api.get("/appointments")]);
      setDoctors(d.data); setAppointments(a.data);
    } catch (_error) {
      setDoctors([]);
      setAppointments([]);
    }
  };
  useEffect(() => { load(); }, []);
  useEffect(() => {
    localStorage.setItem("dummyAppointments", JSON.stringify(localAppointments));
  }, [localAppointments]);

  const allAppointments = [...appointments, ...localAppointments];

  const bookedDateTimes = new Set(
    allAppointments.map((a) => new Date(a.date).toISOString().slice(0, 16))
  );

  const isSlotTakenForPatient = (slot) => {
    if (!selectedDate) return false;
    const candidate = new Date(toInputDateTime(selectedDate, slot)).toISOString().slice(0, 16);
    return bookedDateTimes.has(candidate);
  };

  const isSlotTakenForDoctor = (slot) => {
    if (!selectedDate || !doctorId) return false;
    const candidate = new Date(toInputDateTime(selectedDate, slot)).toISOString().slice(0, 16);
    return allAppointments.some(
      (a) =>
        (a.doctorId?._id || a.doctorId) === doctorId &&
        new Date(a.date).toISOString().slice(0, 16) === candidate
    );
  };

  const book = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!doctorId || !selectedDate || !selectedSlot) {
      setMessage("Please select doctor, date and slot.");
      return;
    }

    const date = toInputDateTime(selectedDate, selectedSlot);
    if (isSlotTakenForPatient(selectedSlot)) {
      setMessage("You already have an appointment at this time. Choose a different slot.");
      return;
    }
    if (isSlotTakenForDoctor(selectedSlot)) {
      setMessage("This doctor already has an appointment in this slot. Choose another slot.");
      return;
    }

    const isDummyDoctor = doctorId.startsWith("dummy-");
    try {
      if (isDummyDoctor) {
        const appointment = {
          _id: `local-${Date.now()}`,
          date: new Date(date).toISOString(),
          doctorId: {
            _id: doctorId,
            name: selectedDoctor?.name || "Doctor",
          },
        };
        setLocalAppointments((prev) => [...prev, appointment]);
      } else {
        await api.post("/appointments", { doctorId, date });
        await load();
      }
      setMessage("Appointment booked successfully.");
      setSelectedSlot("");
    } catch (error) {
      setMessage(error?.response?.data?.message || "Booking failed. Please choose another slot.");
    }
  };

  const doctorsData = doctors.length ? doctors.map((d) => ({
    ...d,
    qualification: d.qualification || "MBBS, MD",
    experience: d.experience || "10 years",
    hospital: d.hospital || "Cancer Care Hospital, Bangalore",
    rating: d.rating || "4.7/5",
  })) : DUMMY_DOCTORS;
  const selectedDoctor = doctorsData.find((doc) => doc._id === doctorId);
  const specializations = [
    "All Specializations",
    ...Array.from(new Set(doctorsData.map((doc) => doc.specialization))),
  ];
  const filteredDoctors = doctorsData.filter((doc) => {
    const text = `${doc.name} ${doc.hospital}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    const matchesSpec =
      specialization === "All Specializations" || doc.specialization === specialization;
    return matchesSearch && matchesSpec;
  });

  return (
    <div className="page">
      <div className="container list-stack">
        <h1 className="page-title">Doctors & Appointments</h1>
        <p className="page-subtitle">Find specialists and book your appointments.</p>

        <div className="appt-tabs">
          <button className={`tab-btn ${activeTab === "find" ? "active" : ""}`} type="button" onClick={() => setActiveTab("find")}>
            Find Doctors
          </button>
          <button className={`tab-btn ${activeTab === "mine" ? "active" : ""}`} type="button" onClick={() => setActiveTab("mine")}>
            My Appointments ({allAppointments.length})
          </button>
        </div>

        {activeTab === "find" ? (
          <>
            <div className="stats-grid" style={{ gridTemplateColumns: "2fr 1fr" }}>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search doctors or hospitals..."
              />
              <select value={specialization} onChange={(e) => setSpecialization(e.target.value)}>
                {specializations.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>

            <div className="stats-grid">
              {filteredDoctors.map((d) => (
                <div key={d._id} className={`panel doctor-card ${doctorId === d._id ? "selected-doctor" : ""}`}>
                  <h3 style={{ marginTop: 0 }}>{d.name}</h3>
                  <p className="muted">{d.specialization}</p>
                  <p className="muted">{d.hospital}</p>
                  <p className="muted">{d.experience} experience</p>
                  <p className="muted">Qualification: {d.qualification}</p>
                  <p className="muted">Rating: {d.rating}</p>
                  <button
                    className="btn"
                    type="button"
                    onClick={() => {
                      setDoctorId(d._id);
                      setMessage("");
                    }}
                    style={{ width: "100%", marginTop: "0.8rem" }}
                  >
                    Book Appointment
                  </button>
                </div>
              ))}
            </div>

            <div className="panel">
              <h3 style={{ marginTop: 0 }}>Book with {selectedDoctor?.name || "selected doctor"}</h3>
              <form onSubmit={book} className="list-stack">
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().slice(0, 10)}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedSlot("");
                  }}
                  required
                />
                <div className="slot-grid">
                  {SLOT_TIMES.map((slot) => {
                    const takenByPatient = isSlotTakenForPatient(slot);
                    const takenByDoctor = isSlotTakenForDoctor(slot);
                    const selected = selectedSlot === slot;
                    const disabled = !selectedDate || takenByPatient || takenByDoctor;
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={disabled}
                        onClick={() => setSelectedSlot(slot)}
                        className={`slot-pill ${selected ? "selected" : ""}`}
                        title={takenByDoctor ? "Doctor busy for this slot" : takenByPatient ? "You already booked this time" : "Choose slot"}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
                {message && <p className="muted">{message}</p>}
                <button className="btn" type="submit">Confirm Appointment</button>
              </form>
            </div>
          </>
        ) : (
          <div className="panel">
            <h3>My Appointments ({allAppointments.length})</h3>
            <div className="list-stack">
              {allAppointments.map((a) => (
                <div key={a._id} className="panel">
                  <strong>{new Date(a.date).toLocaleString()}</strong>
                  <p className="muted">with {a.doctorId?.name || "Assigned doctor"}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <button className="floating-help" type="button" onClick={() => navigate("/chat")}>◎</button>
    </div>
  );
}
