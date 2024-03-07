"use client";
import React, { useEffect, useState } from "react";
import {
  StripeElementsOptions,
  StripePaymentElementOptions,
  loadStripe,
} from "@stripe/stripe-js";
import {
  AddressElement,
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { stripePublicKey, url } from "@/lib/constants";
import toast from "react-hot-toast";
import { twMerge } from "tailwind-merge";
import { LuLoader2 } from "react-icons/lu";

interface IPaymentsForm {
  variantId?: number;
  qty?: number;
  className?: string;
  cart?: boolean;
}
const PaymentForm: React.FC<IPaymentsForm> = ({
  qty,
  variantId,
  className,
  cart,
}) => {
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const stripePromise = loadStripe(stripePublicKey);
  const createPaymentIntent = async () => {
    setLoading(true);

    const query = cart ? `cart=true` : `variantId=${variantId}&qty=${qty}`;
    const res = await fetch(`/api/checkout/?${query}`);
    const data = await res.json();
    if (data.clientSecret) setClientSecret(`${data.clientSecret}`);

    setLoading(false);
  };

  useEffect(() => {
    createPaymentIntent();
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
      <h1 className="text-3xl font-bold my-4">Confirm Payment</h1>
      {!clientSecret && (
        <>
          <button
            className={twMerge(
              "h-10 border border-border p-1 w-40 rounded transition-all duration-300 mb-12",
              !loading && "hover:bg-border",
            )}
            onClick={createPaymentIntent}
            disabled={loading}
          >
            {loading ? (
              <LuLoader2 className="animate-spin mx-auto" />
            ) : (
              "Make Payment"
            )}
          </button>
        </>
      )}
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const sResult = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        return_url: url + "/dashboard",
      },
    });
    console.log(sResult);
    const error = sResult.error;

    if (error) {
      if (
        error &&
        (error.type === "card_error" || error.type === "validation_error")
      ) {
        toast.error(`${error && error.message}`);
      } else {
        toast.error(error?.message || "Something Wrong");
      }
    } else {
      if (sResult.paymentIntent.status === "succeeded")
        toast.success("Payment Succeeded");
      else toast.error(sResult.paymentIntent.status);
    }

    setIsLoading(false);
  };

  const paymentElementOptions: StripePaymentElementOptions = {
    layout: "accordion",
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)} className="flex flex-col">
      <AddressElement options={{ mode: "shipping" }} />
      <hr className="border-border my-8" />
      <PaymentElement options={paymentElementOptions} />
      <button
        disabled={isLoading || !stripe || !elements}
        className="my-6 ml-auto p-2 bg-primary w-32 rounded font-bold text-lg shadow-lg h-12"
        type="submit"
      >
        {isLoading ? (
          <LuLoader2 className="mx-auto animate-spin stroke-2" />
        ) : (
          "Pay now"
        )}
      </button>
    </form>
  );
};

export default PaymentForm;
