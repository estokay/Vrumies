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
      } else if (type === "event") {
        orderData = {
          orderCreated: serverTimestamp(),
          type: "event",
          eventSpecific: {
            ticketFile: "",
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
            postId: "U2drlp1CDkPorUVh280K",
            title: "Cars & Cofee Meetup",
            description:
              "Start your weekend engines and fuel your passion for automobiles at the Cars & Coffee Meetup! Join fellow car enthusiasts for a casual, fun-filled morning where exotic cars, classic rides, and everything in between come together. Enjoy a relaxed atmosphere with coffee, great conversation, and the chance to show off your ride or admire others. Whether you're a seasoned collector, a weekend hobbyist, or simply a car fan, this meetup is the perfect way to connect with like-minded enthusiasts.",
            images: [
              "https://www.nrgpark.com/wp-content/uploads/event-super-car-show.webp",
              "https://res.cloudinary.com/dmjvngk3o/image/upload/v1756576955/edojkhhabccqlflsvlbp.jpg",
            ],
            price: "$25",
            eventDateTime: {
              type: "firestore/timestamp/1.0",
              seconds: 1767203940,
              nanoseconds: 0,
            },
          },
          deliveryInfo: {
            deliveryName: "",
            deliveryStreetAddress: "",
            deliveryCity: "",
            deliveryState: "",
            deliveryZipCode: "",
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
        <button onClick={() => createDummyOrder("event")}>
          Add Event Order
        </button>
        <button onClick={() => createDummyOrder("directory")}>
          Add Directory Order
        </button>
      </div>
      {message && <p className="status-message">{message}</p>}
    </div>
  );
}
