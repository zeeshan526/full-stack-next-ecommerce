"use client";
import {
  MailIcon,
  PhoneIcon,
  LocationMarkerIcon,
} from "@heroicons/react/outline";
import { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { userName, email, message } = formData;

    if (!userName || !email || !message) {
      toast.error("All fields are required");
      return;
    }
    const data = { userName, email, message };
    try {
      await axios.post("/api/contact", data);
      toast.success("Thank you! Your message has been sent. We'll be in touch shortly.");
      setFormData({ userName: "", email: "", message: "" });
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Failed to save contact informationt"
      );
    }
  };

  return (
    <div className="flex flex-col items-center p-8 bg-gray-50 text-gray-800 space-y-12">
      <h1 className="text-3xl font-bold text-center text-orange-500">
        Contact Us
      </h1>
      <section className="max-w-lg text-center space-y-6">
        <p className="text-lg">
          We’d love to hear from you! Whether you have a question about our
          products, feedback, or need assistance, our team is here to help.
        </p>
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 items-center justify-center">
          <div className="flex items-center space-x-2">
            <MailIcon className="w-6 h-6 text-gray-600" />
            <p>support@trevixa.com</p>
          </div>
          <div className="flex items-center space-x-2">
            <PhoneIcon className="w-6 h-6 text-gray-600" />
            <p>+1 234 567 8900</p>
          </div>
          <div className="flex items-center space-x-2">
            <LocationMarkerIcon className="w-6 h-6 text-gray-600" />
            <p>123 Your Street, City, Country</p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4 text-gray-700 text-center">
          Send Us a Message
        </h2>
        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
            required
          />
          <input
            type="email"
            placeholder="Your Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
            required
          />
          <textarea
            placeholder="Your Message"
            rows="4"
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
            required
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition duration-300"
          >
            Send Message
          </button>
        </form>
      </section>

      <section className="text-center space-y-4">
        <p className="text-gray-600">Follow us on social media:</p>
        <div className="flex space-x-6 justify-center text-gray-600">
          <a href="#" className="hover:text-orange-500">
            <FaFacebookF className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-orange-500">
            <FaTwitter className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-orange-500">
            <FaInstagram className="w-6 h-6" />
          </a>
          <a href="#" className="hover:text-orange-500">
            <FaLinkedinIn className="w-6 h-6" />
          </a>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
