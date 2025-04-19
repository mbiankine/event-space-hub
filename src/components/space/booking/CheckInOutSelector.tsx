
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CheckInOutSelectorProps {
  checkInTime: string;
  checkOutTime: string;
  onCheckInChange: (time: string) => void;
  onCheckOutChange: (time: string) => void;
  disabled?: boolean;
}

export function CheckInOutSelector({
  checkInTime,
  checkOutTime,
  onCheckInChange,
  onCheckOutChange,
  disabled = false
}: CheckInOutSelectorProps) {
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Check-in</Label>
          <Select
            value={checkInTime}
            onValueChange={onCheckInChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Horário de check-in" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={`checkin-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Check-out</Label>
          <Select
            value={checkOutTime}
            onValueChange={onCheckOutChange}
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue placeholder="Horário de check-out" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={`checkout-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
