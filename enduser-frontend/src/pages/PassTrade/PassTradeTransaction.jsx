// passtrade
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../api';
import './PassTradeTransaction.css'; // CSS 파일 생성 필요

const PassTradeTransaction = () => {
  const { isAuthenticated, userId } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('buy'); // 'buy' or 'sell'
  const [transactions, setTransactions] = useState([]);

  const fetchTransactions = async (type) => {
    if (!isAuthenticated) return;
    try {
      const endpoint = type === 'buy' ? '/api/pass-trade-transactions/buy' : '/api/pass-trade-transactions/sell';
      const response = await api.get(`${endpoint}?userId=${userId}`);
      setTransactions(response.data);
    } catch (error) {
      console.error('거래 내역 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchTransactions(activeTab);
  }, [activeTab, isAuthenticated, userId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'green';
      case 'pending': return 'yellow';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  return (
    <div className="pass-trade-transaction">
      <h1>거래 내역</h1>
      <div className="tabs">
        <button className={activeTab === 'buy' ? 'active' : ''} onClick={() => setActiveTab('buy')}>구매 내역</button>
        <button className={activeTab === 'sell' ? 'active' : ''} onClick={() => setActiveTab('sell')}>판매 내역</button>
      </div>
      <div className="transaction-list">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="transaction-item">
            <span className={`transaction-type ${activeTab === 'buy' ? 'buy' : 'sell'}`}>
              {activeTab === 'buy' ? '구매' : '판매'}
            </span>
            <span>{transaction.item}</span>
            <span>{transaction.date}</span>
            <span>{transaction.amount}원</span>
            <span className={`status ${getStatusColor(transaction.status)}`}>{transaction.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PassTradeTransaction;