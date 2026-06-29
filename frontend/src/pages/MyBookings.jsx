import React, { useEffect, useState } from "react";
import Loading from "../components/Loading";
import timeFormat from "../lib/timeFormat";
import { dateFormat } from "../lib/dateFormat";
import { useAppContext } from "../context/AppContext";
import { Link } from "react-router-dom";
import { TicketIcon, Download } from "lucide-react";

const MyBookings = () => {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, token, user, image_base_url } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/user/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) setBookings(data.bookings);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  useEffect(() => { if (user) getMyBookings(); }, [user]);

  const downloadTicket = async (bookingId) => {
    try {
      const response = await axios.get(`/api/booking/ticket/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `CineMine_Ticket_${bookingId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading ticket:', error);
    }
  };

  const validBookings = bookings.filter(item => item.show && item.show.movie);

  if (isLoading) return <Loading />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap');

        .mb-root {
          min-height: 100vh;
          background: #060608;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          padding: 100px 24px 100px;
          position: relative;
          overflow-x: hidden;
        }

        @media (min-width: 768px) { .mb-root { padding: 120px 64px 100px; } }
        @media (min-width: 1024px) { .mb-root { padding: 120px 120px 100px; } }

        .mb-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 32px 32px;
          pointer-events: none;
          z-index: 0;
        }

        .mb-glow-tl {
          position: fixed; top: -180px; left: -120px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(229,9,20,0.07) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }

        .mb-glow-br {
          position: fixed; bottom: -160px; right: -80px;
          width: 500px; height: 500px;
          background: radial-gradient(circle, rgba(229,9,20,0.05) 0%, transparent 65%);
          pointer-events: none; z-index: 0;
        }

        .mb-inner {
          position: relative;
          z-index: 1;
          max-width: 860px;
          margin: 0 auto;
        }

        /* Header */
        .mb-eyebrow {
          font-size: 10px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #e50914;
          font-weight: 500;
          margin-bottom: 10px;
          opacity: 0;
          animation: fadeUp 0.4s 0.05s forwards;
        }

        .mb-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(44px, 7vw, 80px);
          line-height: 0.9;
          letter-spacing: 2px;
          margin: 0 0 6px;
          opacity: 0;
          animation: fadeUp 0.4s 0.1s forwards;
        }

        .mb-count {
          font-size: 13px;
          color: rgba(255,255,255,0.25);
          font-weight: 300;
          margin-bottom: 48px;
          opacity: 0;
          animation: fadeUp 0.4s 0.15s forwards;
        }

        /* Ticket card */
        .ticket {
          display: flex;
          flex-direction: column;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 20px;
          opacity: 0;
          animation: fadeUp 0.45s forwards;
          position: relative;
          transition: border-color 0.2s;
        }

        .ticket:hover { border-color: rgba(255,255,255,0.13); }

        /* Left red accent */
        .ticket::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          background: #e50914;
        }

        @media (min-width: 640px) {
          .ticket { flex-direction: row; }
        }

        /* Poster */
        .ticket-poster {
          width: 100%;
          height: 180px;
          object-fit: cover;
          object-position: center top;
          flex-shrink: 0;
          filter: brightness(0.85);
          transition: filter 0.3s;
        }

        .ticket:hover .ticket-poster { filter: brightness(1); }

        @media (min-width: 640px) {
          .ticket-poster { width: 130px; height: auto; }
        }

        @media (min-width: 768px) {
          .ticket-poster { width: 160px; }
        }

        /* Main info */
        .ticket-info {
          flex: 1;
          padding: 20px 22px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          min-width: 0;
          border-right: 1px solid rgba(255,255,255,0.06);
        }

        .ticket-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          letter-spacing: 1.5px;
          color: #fff;
          line-height: 1;
          margin-bottom: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ticket-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          font-weight: 300;
        }

        .ticket-dot {
          width: 3px; height: 3px;
          border-radius: 50%;
          background: rgba(255,255,255,0.2);
          flex-shrink: 0;
        }

        /* Seat pills */
        .seat-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-top: 14px;
        }

        .seat-pill {
          padding: 3px 10px;
          border: 1px solid rgba(229,9,20,0.3);
          border-radius: 2px;
          font-size: 11px;
          color: rgba(255,255,255,0.55);
          font-family: 'Bebas Neue', sans-serif;
          letter-spacing: 1px;
          background: rgba(229,9,20,0.05);
        }

        /* Perforated divider */
        .ticket-perforated {
          display: none;
          width: 1px;
          background: repeating-linear-gradient(
            to bottom,
            rgba(255,255,255,0.08) 0px,
            rgba(255,255,255,0.08) 6px,
            transparent 6px,
            transparent 12px
          );
          flex-shrink: 0;
          position: relative;
        }

        .ticket-perforated::before,
        .ticket-perforated::after {
          content: '';
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 14px; height: 14px;
          border-radius: 50%;
          background: #060608;
          border: 1px solid rgba(255,255,255,0.07);
        }

        .ticket-perforated::before { top: -7px; }
        .ticket-perforated::after { bottom: -7px; }

        @media (min-width: 640px) { .ticket-perforated { display: block; } }

        /* Right price section */
        .ticket-price-section {
          padding: 20px 24px;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-shrink: 0;
          border-top: 1px solid rgba(255,255,255,0.06);
        }

        @media (min-width: 640px) {
          .ticket-price-section {
            flex-direction: column;
            align-items: flex-end;
            justify-content: center;
            border-top: none;
            min-width: 140px;
          }
        }

        .ticket-amount {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          letter-spacing: 2px;
          color: #fff;
          line-height: 1;
        }

        .ticket-amount span { color: #e50914; font-size: 18px; vertical-align: top; margin-top: 4px; display: inline-block; }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 12px;
          border-radius: 2px;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .status-paid {
          background: rgba(46,184,106,0.1);
          border: 1px solid rgba(46,184,106,0.25);
          color: #2eb86a;
        }

        .status-unpaid {
          background: rgba(229,9,20,0.1);
          border: 1px solid rgba(229,9,20,0.3);
          color: #e50914;
        }

        .status-dot {
          width: 5px; height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .btn-pay {
          display: inline-flex;
          align-items: center;
          padding: 9px 20px;
          background: #e50914;
          border-radius: 2px;
          color: #fff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 2px;
          cursor: pointer;
          transition: background 0.2s;
          text-decoration: none;
          white-space: nowrap;
          margin-top: 4px;
        }

        .btn-pay:hover { background: #c40812; }

        .btn-download {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: rgba(46,184,106,0.1);
          border: 1px solid rgba(46,184,106,0.3);
          border-radius: 2px;
          color: #2eb86a;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px;
          letter-spacing: 1.5px;
          cursor: pointer;
          transition: all 0.2s;
          text-decoration: none;
          margin-top: 8px;
        }

        .btn-download:hover { background: rgba(46,184,106,0.2); border-color: #2eb86a; }

        /* Empty state */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 40vh;
          gap: 14px;
          text-align: center;
          opacity: 0;
          animation: fadeUp 0.4s 0.2s forwards;
        }

        .empty-icon-wrap {
          width: 64px; height: 64px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.15);
          margin-bottom: 6px;
        }

        .empty-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 32px;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.45);
        }

        .empty-sub {
          font-size: 14px;
          color: rgba(255,255,255,0.2);
          font-weight: 300;
        }

        .btn-browse {
          margin-top: 8px;
          padding: 12px 32px;
          background: transparent;
          border: 1px solid rgba(229,9,20,0.4);
          border-radius: 2px;
          color: #e50914;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 16px;
          letter-spacing: 3px;
          cursor: pointer;
          transition: background 0.2s;
          text-decoration: none;
          display: inline-block;
        }

        .btn-browse:hover { background: rgba(229,9,20,0.08); }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div className="mb-root">
        <div className="mb-glow-tl" />
        <div className="mb-glow-br" />

        <div className="mb-inner">
          {/* Header */}
          <p className="mb-eyebrow">Your History</p>
          <h1 className="mb-title">My<br />Bookings.</h1>
          <p className="mb-count">
            {validBookings.length} {validBookings.length === 1 ? 'booking' : 'bookings'} found
          </p>

          {validBookings.length > 0 ? (
            <div>
              {validBookings.map((item, index) => (
                <div
                  className="ticket"
                  key={index}
                  style={{ animationDelay: `${0.2 + index * 0.07}s` }}
                >
                  {/* Poster */}
                  <img
                    src={item.show.movie.poster_image || image_base_url + item.show.movie.poster_path}
                    alt={item.show.movie.title}
                    className="ticket-poster"
                  />

                  {/* Info */}
                  <div className="ticket-info">
                    <p className="ticket-title">{item.show.movie.title}</p>

                    <div className="ticket-meta">
                      <span>{timeFormat(item.show.movie.duration || item.show.movie.runtime)}</span>
                      <div className="ticket-dot" />
                      <span>{dateFormat(item.show.showDateTime)}</span>
                    </div>

                    <div className="ticket-meta" style={{ marginTop: 6 }}>
                      <span>{item.bookedSeats.length} {item.bookedSeats.length === 1 ? 'ticket' : 'tickets'}</span>
                    </div>

                    {/* Seat pills */}
                    <div className="seat-pills">
                      {item.bookedSeats.map((seat, i) => (
                        <span className="seat-pill" key={i}>{seat}</span>
                      ))}
                    </div>
                  </div>

                  {/* Perforated divider */}
                  <div className="ticket-perforated" />

                  {/* Price + status */}
                  <div className="ticket-price-section">
                    <p className="ticket-amount">
                      <span>{currency}</span>{item.amount}
                    </p>

                    {item.isPaid ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div className="status-badge status-paid">
                          <div className="status-dot" />
                          Confirmed
                        </div>
                        <button onClick={() => downloadTicket(item.id)} className="btn-download">
                          <Download size={14} />
                          Ticket
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                        <div className="status-badge status-unpaid">
                          <div className="status-dot" />
                          Unpaid
                        </div>
                        <Link to={item.paymentLink} className="btn-pay">Pay Now</Link>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon-wrap">
                <TicketIcon style={{ width: 28, height: 28 }} />
              </div>
              <p className="empty-title">No Bookings Yet</p>
              <p className="empty-sub">Your confirmed tickets will appear here</p>
              <Link to="/movies" className="btn-browse">Browse Films</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyBookings;