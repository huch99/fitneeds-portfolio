import React from 'react';
import { Link } from 'react-router-dom';

const PaymentForReservation = () => {
    return (
        <div>
            <p>결제 페이지</p>
            <Link to={`/reservation-complete`}>결제 완료 (예약완료) 페이지</Link>
        </div>
    );
};

export default PaymentForReservation;