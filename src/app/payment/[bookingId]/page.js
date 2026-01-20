"use client";

import { useParams, useRouter } from "next/navigation";
import { confirmPayment } from "@/services/bookingService";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function PaymentPage() {
  const { bookingId } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleConfirmPayment = async () => {
    try {
      setLoading(true);

      await confirmPayment({
        bookingId,
        paymentId: "test_payment_id",
      });

      alert("Payment successful!");
      router.push("/events");
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-4 rounded-lg border p-6">
        <h1 className="text-2xl font-bold text-center">
          Test Payment
        </h1>

        <p className="text-center text-muted-foreground">
          This is a simulated payment.
        </p>

        <Button
          className="w-full"
          onClick={handleConfirmPayment}
          disabled={loading}
        >
          {loading ? "Processing..." : "Confirm Payment"}
        </Button>
      </div>
    </div>
  );
}
