"use client";
import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { stripePublicKey } from "@/lib/constants";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";

interface IPaymentsForm {
  variantId: number;
  qty: number;
  className?: string;
}
const PaymentForm: React.FC<IPaymentsForm> = ({
  qty,
  variantId,
  className,
}) => {
  const [clientSecret, setClientSecret] = useState("");

  const stripePromise = loadStripe(stripePublicKey);

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch(`/api/checkout/?variantId=${variantId}&qty=${qty}`)
      .then((res) => res.json())
      .then(
        (data) => data.clientSecret && setClientSecret(`${data.clientSecret}`),
      );
  }, []);

  const appearance: { theme: "stripe" | "night" | "flat" } = {
    theme: "night",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <section className={twMerge(className)}>
      <h2 className="text-3xl font-bold my-4">Confirm Payment</h2>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </section>
  );
};

const CheckoutForm = () => {
  const [message, setMessage] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret",
    );

    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) {
        toast.error("No Payment Intent Found");
        return;
      }
      switch (paymentIntent.status) {
        case "succeeded":
          setMessage("Payment succeeded!");
          break;
        case "processing":
          setMessage("Your payment is processing.");
          break;
        case "requires_payment_method":
          setMessage("Your payment was not successful, please try again.");
          break;
        default:
          setMessage("Something went wrong.");
          break;
      }
    });
  }, [stripe]);

  const handleSubmit = async () => {
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: "http://localhost:3000",
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(`${error.message}`);
    } else {
      setMessage("An unexpected error occurred.");
    }

    setIsLoading(false);
  };

  const paymentElementOptions: { layout: "tabs" | "accordion" | "auto" } = {
    layout: "tabs",
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">
          {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
        </span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
};

export default PaymentForm;
