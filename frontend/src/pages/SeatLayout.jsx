import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import Loading from "../components/Loading";
import { ArrowRightIcon, ClockIcon } from "lucide-react";
import isoTimeFormat from "../lib/isoTimeFormat";
import toast from "react-hot-toast";
import { useAppContext } from "../context/AppContext";

const SeatLayout = () => {
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const { axios, user, token, image_base_url } = useAppContext();

  const groupRows = [
    ["A", "B"],
    ["C", "D"],
    ["E", "F"],
    ["G", "H"],
    ["I", "J"],
  ];

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}/`);
      if (data.success) setShow(data);
    } catch (error) { console.log(error); }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) return toast("Please select a showtime first");
    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5)
      return toast("Max 5 seats per booking");
    if (occupiedSeats.includes(seatId)) return toast("Seat already booked");
    setSelectedSeats(prev =>
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const getOccupiedSeats = async () => {
    try {
      const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`);
      if (data.success) setOccupiedSeats(data.occupiedSeats);
      else toast.error(data.message);
    } catch (error) { console.log(error); }
  };

  const bookTickets = async () => {
    try {
      if (!user) return toast.error("Please login to proceed");
      if (!selectedTime || !selectedSeats.length) return toast.error("Please select a time and seats");
      const { data } = await axios.post("/api/booking/create",
        { showId: selectedTime.showId, selectedSeats },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) window.location.href = data.url;
      else toast.error(data.message);
    } catch (error) { toast.error(error.message); }
  };

  useEffect(() => { getShow(); }, []);
  useEffect(() => { if (selectedTime) getOccupiedSeats(); }, [selectedTime]);

  const renderSeats = (row, count = 9) => (
    <div key={row} className="seat-row">
      <span className="row-label">{row}</span>
      <div className="seats-wrap">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          const isSelected = selectedSeats.includes(seatId);
          const isOccupied = occupiedSeats.includes(seatId);
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`seat ${isSelected ? "seat-selected" : ""} ${isOccupied ? "seat-occupied" : ""}`}
              title={seatId}
              aria-label={`Seat ${seatId}${isOccupied ? " (occupied)" : ""}`}
            >
              <span className="seat-label">{i + 1}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  if (!show) return <Loading />;

  const totalPrice = selectedSeats.length * (show.movie?.ticketPrice || 12);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .sl-root {
          min-height: 100vh;
          background: #060608;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          position: relative;
          overflow-x: hidden;
        }

        .sl-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
          z-index: 0;
        }

        .sl-glow-tl {
          position: fixed; top: -180px; left: -120px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(229,9,20,0.07) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }

        .sl-glow-br {
          position: fixed; bottom: -160px; right: -80px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(229,9,20,0.05) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }

        /* Layout */
        .sl-layout {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 0;
          min-height: 100vh;
          padding-top: 88px;
        }

        @media (min-width: 900px) {
          .sl-layout {
            flex-direction: row;
            align-items: flex-start;
            gap: 0;
            padding: 88px 0 0;
          }
        }

        /* ── Sidebar ── */
        .sl-sidebar {
          width: 100%;
          background: rgba(255,255,255,0.02);
          border-bottom: 1px solid rgba(255,255,255,0.06);
          padding: 28px 24px;
        }

        @media (min-width: 900px) {
          .sl-sidebar {
            width: 240px;
            min-width: 240px;
            min-height: calc(100vh - 88px);
            border-bottom: none;
            border-right: 1px solid rgba(255,255,255,0.06);
            padding: 40px 0 40px;
            position: sticky;
            top: 88px;
            align-self: flex-start;
          }
        }

        .sidebar-movie {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 0 24px 28px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          margin-bottom: 28px;
        }

        @media (min-width: 900px) {
          .sidebar-movie { flex-direction: column; align-items: flex-start; }
        }

        .sidebar-poster {
          width: 48px;
          aspect-ratio: 2/3;
          border-radius: 3px;
          object-fit: cover;
          border: 1px solid rgba(255,255,255,0.08);
          flex-shrink: 0;
        }

        @media (min-width: 900px) { .sidebar-poster { width: 100%; border-radius: 0; border: none; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 0; margin-bottom: 0; } }

        .sidebar-movie-info {}
        .sidebar-movie-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 1.5px;
          color: #fff;
          line-height: 1;
          margin-bottom: 4px;
        }

        .sidebar-movie-date {
          font-size: 11px;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          font-weight: 300;
        }

        .sidebar-section-label {
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: #e50914;
          font-weight: 500;
          padding: 0 24px;
          margin-bottom: 12px;
        }

        .time-list { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 24px; }

        @media (min-width: 900px) { .time-list { flex-direction: column; gap: 2px; } }

        .time-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 3px;
          cursor: pointer;
          font-size: 13px;
          color: rgba(255,255,255,0.45);
          font-weight: 300;
          border: 1px solid rgba(255,255,255,0.07);
          transition: all 0.18s;
          background: transparent;
          font-family: 'DM Sans', sans-serif;
        }

        @media (min-width: 900px) {
          .time-item {
            border-radius: 0;
            border: none;
            border-left: 2px solid transparent;
            padding: 10px 22px;
            width: 100%;
          }
        }

        .time-item:hover { color: #fff; background: rgba(255,255,255,0.04); }

        .time-item.active {
          color: #fff;
          background: rgba(229,9,20,0.1);
          border-color: #e50914;
        }

        /* Summary card in sidebar */
        .sidebar-summary {
          margin-top: 32px;
          padding: 0 24px;
          display: none;
        }

        @media (min-width: 900px) { .sidebar-summary { display: block; } }

        .summary-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 4px;
          padding: 16px;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: rgba(255,255,255,0.4);
          margin-bottom: 10px;
          font-weight: 300;
        }

        .summary-row span:last-child { color: rgba(255,255,255,0.75); }
        .summary-total {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding-top: 10px;
          display: flex;
          justify-content: space-between;
          font-size: 14px;
          font-weight: 500;
          margin-top: 4px;
        }

        .summary-total span:last-child { color: #e50914; }

        /* ── Main area ── */
        .sl-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 40px 16px 100px;
        }

        @media (min-width: 600px) { .sl-main { padding: 48px 32px 100px; } }

        /* Screen */
        .screen-wrap {
          width: 100%;
          max-width: 640px;
          margin-bottom: 8px;
          position: relative;
        }

        .screen-bar {
          width: 82%;
          height: 4px;
          background: linear-gradient(90deg, transparent, rgba(229,9,20,0.6), rgba(255,255,255,0.3), rgba(229,9,20,0.6), transparent);
          border-radius: 4px;
          margin: 0 auto 6px;
          box-shadow: 0 0 24px rgba(229,9,20,0.3), 0 0 4px rgba(255,255,255,0.2);
        }

        .screen-label {
          text-align: center;
          font-size: 10px;
          letter-spacing: 5px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.18);
          margin-bottom: 36px;
        }

        /* Legend */
        .legend {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 11px;
          color: rgba(255,255,255,0.35);
          letter-spacing: 0.5px;
        }

        .legend-dot {
          width: 16px; height: 16px;
          border-radius: 3px;
          border: 1px solid;
        }

        .legend-dot-available { border-color: rgba(229,9,20,0.5); background: transparent; }
        .legend-dot-selected { border-color: #e50914; background: #e50914; }
        .legend-dot-occupied { border-color: rgba(255,255,255,0.1); background: rgba(255,255,255,0.05); }

        /* Seat grid */
        .seats-grid {
          width: 100%;
          max-width: 640px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .seat-section-gap { height: 20px; }

        .seat-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .row-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          letter-spacing: 1px;
          color: rgba(255,255,255,0.2);
          width: 16px;
          text-align: center;
          flex-shrink: 0;
        }

        .seats-wrap {
          display: flex;
          gap: 5px;
          flex-wrap: nowrap;
        }

        .seat {
          width: 28px; height: 28px;
          border-radius: 3px 3px 5px 5px;
          border: 1px solid rgba(229,9,20,0.4);
          background: rgba(229,9,20,0.04);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s;
          position: relative;
          flex-shrink: 0;
        }

        @media (min-width: 480px) { .seat { width: 32px; height: 32px; } }

        .seat:hover:not(.seat-occupied) {
          background: rgba(229,9,20,0.18);
          border-color: #e50914;
          transform: translateY(-2px);
        }

        .seat-selected {
          background: #e50914 !important;
          border-color: #e50914 !important;
        }

        .seat-selected .seat-label { color: #fff; }

        .seat-occupied {
          background: rgba(255,255,255,0.03) !important;
          border-color: rgba(255,255,255,0.08) !important;
          cursor: not-allowed;
          opacity: 0.4;
        }

        .seat-label {
          font-size: 8px;
          color: rgba(255,255,255,0.3);
          font-weight: 500;
          pointer-events: none;
        }

        @media (min-width: 480px) { .seat-label { font-size: 9px; } }

        .seat-selected .seat-label { color: #fff; }

        /* Bottom checkout bar */
        .checkout-bar {
          position: fixed;
          bottom: 0; left: 0; right: 0;
          background: rgba(6,6,8,0.95);
          border-top: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(12px);
          padding: 16px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          z-index: 50;
          flex-wrap: wrap;
        }

        @media (min-width: 600px) { .checkout-bar { padding: 16px 40px; } }

        .checkout-info {}

        .checkout-seats {
          font-size: 13px;
          color: rgba(255,255,255,0.4);
          font-weight: 300;
          margin-bottom: 2px;
        }

        .checkout-seats strong { color: #fff; font-weight: 500; }

        .checkout-price {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 2px;
          color: #fff;
          line-height: 1;
        }

        .checkout-price span { color: #e50914; }

        .btn-checkout {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 14px 28px;
          background: #e50914;
          border: none;
          border-radius: 3px;
          color: #fff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 17px;
          letter-spacing: 3px;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .btn-checkout:hover { background: #c40812; }
        .btn-checkout:active { transform: scale(0.98); }
        .btn-checkout:disabled { opacity: 0.4; cursor: not-allowed; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fade-in { animation: fadeUp 0.4s forwards; }
      `}</style>

      <div className="sl-root">
        <div className="sl-glow-tl" />
        <div className="sl-glow-br" />

        <div className="sl-layout">

          {/* ── Sidebar ── */}
          <aside className="sl-sidebar">
            {/* Movie info */}
            <div className="sidebar-movie">
              {(show.movie?.poster_image || show.movie?.poster_path) && (
                <img
                  src={show.movie.poster_image || image_base_url + show.movie.poster_path}
                  alt={show.movie.title}
                  className="sidebar-poster"
                />
              )}
              <div className="sidebar-movie-info">
                <p className="sidebar-movie-title">{show.movie?.title}</p>
                <p className="sidebar-movie-date">{date}</p>
              </div>
            </div>

            {/* Times */}
            <p className="sidebar-section-label">Showtimes</p>
            <div className="time-list">
              {show.dateTime[date]?.map((item) => (
                <button
                  key={item.time}
                  onClick={() => { setSelectedTime(item); setSelectedSeats([]); }}
                  className={`time-item${selectedTime?.time === item.time ? " active" : ""}`}
                >
                  <ClockIcon style={{ width: 14, height: 14 }} />
                  {isoTimeFormat(item.time)}
                </button>
              ))}
            </div>

            {/* Summary (desktop only) */}
            <div className="sidebar-summary">
              <div className="summary-card">
                <div className="summary-row">
                  <span>Seats selected</span>
                  <span>{selectedSeats.length || "—"}</span>
                </div>
                <div className="summary-row">
                  <span>Showtime</span>
                  <span>{selectedTime ? isoTimeFormat(selectedTime.time) : "—"}</span>
                </div>
                <div className="summary-row">
                  <span>Price / seat</span>
                  <span>₹{show.dateTime[date]?.map(item => item.showPrice)}</span>
                </div>
                <div className="summary-total">
                  <span>Total</span>
                  <span>₹{selectedSeats.length * (show.dateTime[date]?.map(item => item.showPrice))}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* ── Main ── */}
          <main className="sl-main">

            {/* Screen */}
            <div className="screen-wrap">
              <div className="screen-bar" />
              <p className="screen-label">Screen · All Eyes This Way</p>
            </div>

            {/* Legend */}
            <div className="legend">
              <div className="legend-item">
                <div className="legend-dot legend-dot-available" />
                Available
              </div>
              <div className="legend-item">
                <div className="legend-dot legend-dot-selected" />
                Selected
              </div>
              <div className="legend-item">
                <div className="legend-dot legend-dot-occupied" />
                Occupied
              </div>
            </div>

            {/* Seats */}
            <div className="seats-grid fade-in">
              {/* Front rows A–B */}
              {groupRows[0].map(row => renderSeats(row))}

              <div className="seat-section-gap" />

              {/* Remaining groups in 2-col layout on mobile, single col on desktop */}
              {groupRows.slice(1).map((group, idx) => (
                <React.Fragment key={idx}>
                  {group.map(row => renderSeats(row))}
                  {idx < groupRows.length - 2 && <div className="seat-section-gap" />}
                </React.Fragment>
              ))}
            </div>
          </main>
        </div>

        {/* ── Checkout bar ── */}
        <div className="checkout-bar">
          <div className="checkout-info">
            <p className="checkout-seats">
              {selectedSeats.length > 0
                ? <><strong>{selectedSeats.join(", ")}</strong></>
                : "No seats selected"}
            </p>
            <p className="checkout-price">
              ₹{selectedSeats.length * (show.dateTime[date]?.map(item => item.showPrice))}<span> total</span>
            </p>
          </div>
          <button
            className="btn-checkout"
            onClick={bookTickets}
            disabled={!selectedSeats.length || !selectedTime}
          >
            Proceed
            <ArrowRightIcon strokeWidth={2.5} style={{ width: 16, height: 16 }} />
          </button>
        </div>
      </div>
    </>
  );
};

export default SeatLayout;