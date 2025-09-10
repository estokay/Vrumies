import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../Components/firebase"; // adjust if your firebase config path is different
import "./DummyOrderSeeder.css";

export default function DummyOrderSeeder() {
  const [message, setMessage] = useState("");

  const buyerInfo = {
    name: "John Doe",
    email: "john@example.com",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zip: "10001",
  };

  // Helper: create dummy order
  const createDummyOrder = async (type) => {
    try {
      let postData = {};

      if (type === "event") {
        postData = {
          type: "event",
          title: "Music Concert",
          image: "https://via.placeholder.com/200",
          sellerId: "seller123",
          sellerName: "Event Organizer",
          sellerLocation: "Los Angeles, CA",
          ticketFile: "https://example.com/ticket.pdf",
          ticketFileName: "concert_ticket.pdf",
        };
      } else if (type === "market") {
        postData = {
          type: "market",
          title: "Vintage Camera",
          image: "https://via.placeholder.com/200",
          sellerId: "seller456",
          sellerName: "Camera Shop",
          sellerLocation: "Chicago, IL",
          carrier: "UPS",
          trackingNumber: "1Z999999999",
        };
      } else if (type === "directory") {
        postData = {
          type: "directory",
          title: "Car Wash Service",
          image: "https://via.placeholder.com/200",
          sellerId: "seller789",
          sellerName: "Clean Cars LLC",
          sellerLocation: "Miami, FL",
          description: "Full-service car wash and detailing.",
        };
      }

      const orderData = {
        type: postData.type,
        buyerInfo,
        postData,
        price: 49.99,
        paymentMethod: "Credit Card",
        status: 1,
        timestamp: serverTimestamp(),
      };

      await addDoc(collection(db, "Orders"), orderData);

      setMessage(`✅ ${type} order created successfully!`);
    } catch (error) {
      console.error("Error creating dummy order:", error);
      setMessage("❌ Failed to create order. Check console.");
    }
  };

  return (
    <div className="dummy-seeder">
      <h2>Create Dummy Orders</h2>
      <div className="button-group">
        <button onClick={() => createDummyOrder("event")}>Add Event Order</button>
        <button onClick={() => createDummyOrder("market")}>Add Market Order</button>
        <button onClick={() => createDummyOrder("directory")}>Add Directory Order</button>
      </div>
      {message && <p className="status-message">{message}</p>}
    </div>
  );
}
