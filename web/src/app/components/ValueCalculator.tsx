'use client';

import { useState } from 'react';

/**
 * Value Calculator Widget for Pricing Section
 * Shows ROI calculation to justify Premium pricing
 */

export default function ValueCalculator() {
  const [hoursWaiting, setHoursWaiting] = useState(40); // Default 40 hours over 3 months
  const [hourlyValue, setHourlyValue] = useState(25); // Default $25/hour

  // Calculate time saved with Premium (2-min checks) vs Free (30-min checks)
  const daysToFindSlot = {
    free: 14, // Average 14 days with 30-min checks
    premium: 3, // Average 3 days with 2-min checks
  };

  const timeSaved = daysToFindSlot.free - daysToFindSlot.premium; // 11 days
  const moneySaved = hoursWaiting * hourlyValue; // Time value
  const premiumCost = 4.99;
  const roi = ((moneySaved - premiumCost) / premiumCost) * 100;

  return (
    <div className="mt-8 p-6 rounded-xl border border-[#333] bg-gradient-to-br from-[#111] to-[#0a0a0a]">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-[#ededed] mb-2">
          Is Premium Worth It? You Decide.
        </h3>
        <p className="text-sm text-[#888]">
          Calculate how much your time is worth while waiting for appointments
        </p>
      </div>

      {/* Input sliders */}
      <div className="space-y-6 mb-8">
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-[#ccc]">
              Hours you'd spend manually refreshing
            </label>
            <span className="text-lg font-bold text-[#3b82f6]">{hoursWaiting}h</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={hoursWaiting}
            onChange={(e) => setHoursWaiting(Number(e.target.value))}
            className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#3b82f6]"
          />
          <div className="flex justify-between text-xs text-[#666] mt-1">
            <span>10h</span>
            <span>100h</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-[#ccc]">
              What's your time worth per hour?
            </label>
            <span className="text-lg font-bold text-[#22c55e]">${hourlyValue}</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={hourlyValue}
            onChange={(e) => setHourlyValue(Number(e.target.value))}
            className="w-full h-2 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#22c55e]"
          />
          <div className="flex justify-between text-xs text-[#666] mt-1">
            <span>$10/h</span>
            <span>$100/h</span>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#222]">
          <div className="text-xs text-[#888] mb-1">Time Saved</div>
          <div className="text-2xl font-bold text-[#3b82f6]">{timeSaved} days</div>
          <div className="text-xs text-[#666] mt-1">Free: 14d → Premium: 3d</div>
        </div>
        <div className="p-4 rounded-lg bg-[#0a0a0a] border border-[#222]">
          <div className="text-xs text-[#888] mb-1">Value of Time Saved</div>
          <div className="text-2xl font-bold text-[#22c55e]">${moneySaved.toFixed(0)}</div>
          <div className="text-xs text-[#666] mt-1">{hoursWaiting}h × ${hourlyValue}/h</div>
        </div>
      </div>

      {/* ROI Summary */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-[#3b82f6]/10 to-[#22c55e]/10 border border-[#3b82f6]/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-[#ededed] mb-1">
              Return on Investment
            </div>
            <div className="text-xs text-[#888]">
              Premium costs ${premiumCost.toFixed(2)}/mo, saves ${moneySaved.toFixed(0)} in time value
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-[#22c55e]">
              {roi > 0 ? '+' : ''}{roi.toFixed(0)}%
            </div>
            <div className="text-xs text-[#888]">ROI</div>
          </div>
        </div>
      </div>

      {/* Call-out */}
      <div className="mt-6 text-center">
        <p className="text-xs text-[#666]">
          <strong className="text-[#ededed]">Bottom line:</strong> If your time is worth more than $5/hour,
          Premium pays for itself by finding your appointment {timeSaved} days faster.
        </p>
      </div>
    </div>
  );
}
