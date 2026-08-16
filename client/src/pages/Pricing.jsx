import React, { useState } from "react";
import { FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, scale } from "motion/react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";
import axios from "axios";
function Pricing() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [loadingPlan, setLoadingPlan] = useState(null);
  const dispatch = useDispatch();
  const plans = [
    {
      id: "free",
      name: "Free",
      price: "₹0",
      credits: 100,
      description: "Start practicing AI-powered mock interviews at no cost.",
      features: [
        "100 AI Interview Credits",
        "Basic Performance Report",
        "Voice Interview Access",
        "Limited History Tracking",
      ],
      default: true,
    },
    {
      id: "basic",
      name: "Starter Pack",
      price: "₹99",
      credits: 200,
      description:
        "Perfect for regular practice and improving interview performance.",
      features: [
        "200 AI Interview Credits",
        "Detailed Feedback",
        "Performance Analytics",
        "Full Interview History",
      ],
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "₹449",
      credits: 1000,
      description:
        "Best value for serious job seekers preparing for multiple interviews.",
      features: [
        "1000 AI Interview Credits",
        "Advanced AI Feedback",
        "Skill Trend Analysis",
        "Priority AI Processing",
      ],
      badge: "Best Value",
    },
  ];

  return (
    <div className="min-h-screen bg-canvas grid-bg py-14 px-4 sm:px-6 relative">
      <div className="absolute inset-x-0 top-0 h-96 halo pointer-events-none" />
      <div className="relative max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <button
            onClick={() => navigate("/")}
            className="w-11 h-11 shrink-0 rounded-xl bg-panel border border-line text-ash hover:text-ember hover:border-ember transition-colors flex items-center justify-center"
          >
            <FaArrowLeft />
          </button>
          <span className="eyebrow">Billing — Credits</span>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6 mb-10">
          <div>
            <h1 className="display text-4xl sm:text-5xl font-semibold text-chalk">
              Choose your <span className="text-grad-ember">plan</span>
            </h1>
            <p className="text-ash mt-4 text-base max-w-xl leading-relaxed">
              Flexible pricing to match your interview preparation goals.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan, index) => {
            const isSelected = selectedPlan === plan.id;

            const handlePayment = async (plan) => {
              try {
                setLoadingPlan(plan.id);
                const amount =
                  plan.id === "basic" ? 99 : plan.id === "pro" ? 449 : 0;
                const result = await axios.post(
                  serverUrl + "/api/payment/order",
                  {
                    planId: plan.id,
                    amount: amount,
                    credits: plan.credits,
                  },
                  { withCredentials: true },
                );
                const options = {
                  key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                  amount: result.data.amount,
                  currency: "INR",
                  name: "Intervix",
                  description: `${plan.name} - ${plan.credits} Credits`,
                  order_id: result.data.id,

                  handler: async function (response) {
                    const verifypay = await axios.post(
                      serverUrl + "/api/payment/verify",
                      response,
                      { withCredentials: true },
                    );
                    dispatch(setUserData(verifypay.data.user));

                    alert("Payment Successful 🎉 Credits Added!");
                    navigate("/");
                  },
                  theme: {
                    color: "#ff5a1f",
                  },
                };

                const rzp = new window.Razorpay(options);
                rzp.open();

                setLoadingPlan(null);
              } catch (error) {
                console.log(error);
                setLoadingPlan(null);
              }
            };

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.1 }}
                whileHover={!plan.default && { y: -6 }}
                onClick={() => !plan.default && setSelectedPlan(plan.id)}
                className={`relative rounded-2xl p-8 flex flex-col transition-colors duration-300 border bg-panel
                  ${
                    isSelected
                      ? "border-ember glow-ember"
                      : "border-line hover:border-line2"
                  }
                  ${plan.default ? "cursor-default" : "cursor-pointer"}
                `}
              >
                <div className="flex items-start justify-between mb-6">
                  {plan.badge && (
                    <span className="btn-ember text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full">
                      {plan.badge}
                    </span>
                  )}
                  {plan.default && (
                    <span className="border border-line text-dim text-[10px] font-mono uppercase tracking-widest px-3 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </div>

                <h3 className="font-display text-xl font-semibold text-chalk">
                  {plan.name}
                </h3>

                <div className="mt-5 flex items-end gap-3">
                  <span className="display text-4xl font-semibold text-chalk">
                    {plan.price}
                  </span>
                  <span className="font-mono text-xs text-ember mb-1.5">
                    {plan.credits} Credits
                  </span>
                </div>

                <p className="text-ash mt-5 text-sm leading-relaxed">
                  {plan.description}
                </p>

                <div className="h-px bg-line my-6" />

                <div className="space-y-3.5 text-left">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <FaCheckCircle className="text-ember text-xs shrink-0" />
                      <span className="text-ash text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {!plan.default && (
                  <button
                    disabled={loadingPlan === plan.id}
                    onClick={(e) => {
                      if (!isSelected) {
                        setSelectedPlan(plan.id);
                      } else {
                        handlePayment(plan);
                      }
                    }}
                    className={`w-full mt-8 h-12 rounded-xl font-semibold transition-colors ${
                      isSelected
                        ? "btn-ember"
                        : "border border-line text-chalk hover:border-ember hover:text-ember"
                    }`}
                  >
                    {loadingPlan === plan.id
                      ? "Processing..."
                      : isSelected
                        ? "Proceed to Pay"
                        : "Select Plan"}
                  </button>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Pricing;
