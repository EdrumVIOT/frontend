import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosInstance';
import "../../css/OTPVerification.css";

const GuestOrderOTP = () => {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Enter phone, Step 2: Enter OTP

  const cartId = localStorage.getItem('cart_id');

  const sendOtp = async () => {
    if (!phoneNumber.trim()) {
      alert('Утасны дугаараа оруулна уу.');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/store/guestOrderReq', {
        phoneNumber: phoneNumber.trim(),
      });
      setStep(2);
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.message || 'OTP илгээхэд алдаа гарлаа.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    if (!otp.trim() || otp.length !== 6) {
      setError('OTP 6 оронтой тоо байх ёстой.');
      return;
    }

    if (!cartId) {
      alert('Cart ID олдсонгүй.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axiosInstance.post('/store/verifyGuestOrder', {
        phoneNumber: phoneNumber.trim(),
        otp: otp.trim(),
        cartId,
        action: 'verify',
      });

      alert('Захиалга амжилттай баталгаажлаа!');
      navigate('/order-success'); 
    } catch (err) {
      console.error(err);
      setError('Баталгаажуулахад алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="otp-container">
      <div className="otp-box">
        {step === 1 && (
          <>
            <h2>Захиалгаа баталгаажуулна уу</h2>
            <p className="subtitle">Утасны дугаараа оруулна уу.</p>
            <input
              type="tel"
              className="input"
              placeholder="Утасны дугаар"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <button className="verify-btn" onClick={sendOtp} disabled={loading}>
              {loading ? 'Илгээж байна...' : 'OTP илгээх'}
            </button>
          </>
        )}

        {step === 2 && (
          <form onSubmit={verifyOtp}>
            <h2>OTP баталгаажуулалт</h2>
            <p className="subtitle">Таны дугаар: {phoneNumber}</p>

            <input
              type="text"
              className="input otp-input"
              placeholder="OTP код оруулна уу"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength={6}
              inputMode="numeric"
              pattern="\d*"
            />

            {error && <p className="error" style={{ color: 'red' }}>{error}</p>}

            <button type="submit" className="verify-btn" disabled={loading}>
              {loading ? 'Баталгаажуулж байна...' : 'Баталгаажуулах'}
            </button>

            <div className="register-text">
              Код ирсэнгүй юу?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  sendOtp();
                }}
              >
                Дахин илгээх
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default GuestOrderOTP;
