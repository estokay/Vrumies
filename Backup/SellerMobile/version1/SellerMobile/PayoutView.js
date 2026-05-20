// src/Pages/Seller/PayoutView.js
import React from "react";
import { FaArrowLeft } from "react-icons/fa";

import useGetSellerBalances from "../../Hooks/useGetSellerBalances";
import useGetUsername from "../../Hooks/useGetUsername";
import useGetUserEmail from "../../Hooks/useGetUserEmail";

import "./PayoutView.css";

export default function PayoutView({ userId, onBack }) {
  const { available, sent } = useGetSellerBalances();
  const username = useGetUsername(userId);
  const { email } = useGetUserEmail(userId);

  return (
    <div className="spm-payout-view">

      <button onClick={onBack} className="spm-back-link">
        <FaArrowLeft /> Back to Orders
      </button>

      <div className="spm-payout-header">
        <h2>PAYOUTS</h2>
        <p className="spm-fee-banner">
          ⚠️ 5% seller fee applies to all orders
        </p>
      </div>

      <div className="spm-balance-grid">
        <div className="spm-balance-card available">
          <span>Processing</span>
          <div className="spm-amount">
            ${(available ?? 0).toFixed(2)}
          </div>
        </div>

        <div className="spm-balance-card sent">
          <span>Disbursed</span>
          <div className="spm-amount">
            ${(sent ?? 0).toFixed(2)}
          </div>
        </div>
      </div>

      <div className="spm-user-info">
        <p>Seller: <strong>{username}</strong></p>
        <p>Payout Email: <strong>{email}</strong></p>
      </div>
    </div>
  );
}