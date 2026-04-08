// src/pages/transactions/TransactionDetailPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TransactionDetails from './TransactionDetail';

const TransactionDetailPage = () => {
  const { hash } = useParams();
  const navigate = useNavigate();

const handleClose = () => {
  navigate(-1);
};

  // Redirect if no hash
  if (!hash) {
    navigate('/transactions');
    return null;
  }

  return (
    <TransactionDetails
      txHash={hash}
      onClose={handleClose}
    />
  );
};

export default TransactionDetailPage;