import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../Components/firebase"; 
import "./DummyOrderSeeder.css";

export default function DummyOrderSeeder() {
  const [message, setMessage] = useState("");

  // Helper: Create dummy order
  const createDummyOrder = async (type) => {
    try {
      let orderData = {};

      if (type === "market") {
        orderData = {
          orderCreated: serverTimestamp(),
          type: "market",
          marketSpecific: {
            Carrier: "",
            trackingNumber: "",
          },
          sellerInfo: {
            sellerId: "WGuHMRLO3GckbNVLFdf3VbnJaZi1",
            sellerMarkedCompleted: false,
            sellerDispute: false,
          },
          buyerInfo: {
            buyerId: "qC6szmLNPdYFiPPYBFASOeCm4Hv2",
            buyerMarkedCompleted: false,
            buyerDispute: false,
          },
          postData: {
            postId: "0",
            title: "Hammaka Hitch Stand Combo",
            description: "Upgrade your outdoor relaxation setup with the Hammaka Hitch Stand Combo – the ultimate solution for effortless comfort anywhere! This versatile combo includes a durable hitch-mounted stand and a premium hammock, providing a secure and portable lounging experience. Crafted with high-quality materials, the stand supports your hammock safely while being easy to assemble and transport. Perfect for camping, tailgating, backyard lounging, or road trips, the Hammaka Hitch Stand Combo delivers unmatched convenience and relaxation. Lightweight yet sturdy, it’s designed to fit most vehicles with a standard hitch receiver, giving you the freedom to unwind wherever you go.",
            images: [
              "https://m.media-amazon.com/images/I/61TDUwjqKCL._UF894,1000_QL80_.jpg",
              "https://res.cloudinary.com/dmjvngk3o/image/upload/v1756576955/dzd5x758ezczi6m9f7om.jpg",
            ],
            price: "$375.99",
            condition: "new",
            shippingTime: "2-4 days",
          },
          deliveryInfo: {
            deliveryName: "Michael Brown",
            deliveryStreetAddress: "126 Marylane Drive",
            deliveryCity: "Houston",
            deliveryState: "TX",
            deliveryZipCode: "77024",
          },
          paymentInfo: {
            paymentmethod: "Card",
            lastfour: "4538",
            paymentSuccessful: true,
          },
        };
      } else if (type === "offer") {
        orderData = {
          orderCreated: serverTimestamp(),
          type: "offer",
          sellerInfo: {
            sellerId: "WGuHMRLO3GckbNVLFdf3VbnJaZi1",
            sellerMarkedCompleted: false,
            sellerDispute: false,
          },
          buyerInfo: {
            buyerId: "qC6szmLNPdYFiPPYBFASOeCm4Hv2",
            buyerMarkedCompleted: false,
            buyerDispute: false,
          },
          postData: {
            postId: "U2drlp1CDkPorUVh5555",
            title: "I can do the task required today",
            description:
              "I'm making an offer to do this task for a good price. Message me if you want more information.",
            images: [
              "https://mobilemechanicnearmehouston.com/wp-content/uploads/2021/01/dasdasdasda.jpg",
              "https://nebula.wsimg.com/43a8c9ca85ed1d08afcbe1acf5418686?AccessKeyId=38B566A353184F8DD19F&disposition=0&alloworigin=1",
            ],
            price: "$25",
          },
          paymentInfo: {
            paymentmethod: "Card",
            lastfour: "5468",
            paymentSuccessful: true,
          },
        };
      } else if (type === "directory") {
        orderData = {
          orderCreated: serverTimestamp(),
          type: "directory",
          sellerInfo: {
            sellerId: "WGuHMRLO3GckbNVLFdf3VbnJaZi1",
            sellerMarkedCompleted: false,
            sellerDispute: false,
          },
          buyerInfo: {
            buyerId: "qC6szmLNPdYFiPPYBFASOeCm4Hv2",
            buyerMarkedCompleted: false,
            buyerDispute: false,
          },
          postData: {
            postId: "2",
            title: "Frame & Body Repair Service",
            description:
              "Restore your vehicle to its original condition with our expert Frame & Body Repair Service. Whether it’s a minor dent, a major collision, or structural damage, our certified technicians use state-of-the-art equipment and proven techniques to ensure your car looks and drives like new. From precision frame alignment to flawless paint matching, we handle every repair with attention to detail and quality craftsmanship.",
            images: ["https://www.libertycollision.center/wp-content/uploads/IMG_8757-1-rotated.jpg"],
            price: "$550.00",
            serviceLocation: "Customer Address",
          },
          deliveryInfo: {
            deliveryName: "Matthew Gomez",
            deliveryStreetAddress: "1548 Willowbrook Drive",
            deliveryCity: "Dallas",
            deliveryState: "TX",
            deliveryZipCode: "75001",
          },
          paymentInfo: {
            paymentmethod: "Card",
            lastfour: "5476",
            paymentSuccessful: true,
          },
        };
      }

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
        <button onClick={() => createDummyOrder("market")}>
          Add Market Order
        </button>
        <button onClick={() => createDummyOrder("offer")}>
          Add Offer Order
        </button>
        <button onClick={() => createDummyOrder("directory")}>
          Add Directory Order
        </button>
      </div>
      {message && <p className="status-message">{message}</p>}
    </div>
  );
}
