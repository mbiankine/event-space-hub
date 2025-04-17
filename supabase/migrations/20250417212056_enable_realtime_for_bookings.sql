
-- Enable REPLICA IDENTITY FULL for bookings to capture the full row data for realtime
ALTER TABLE bookings REPLICA IDENTITY FULL;

-- Add the bookings table to the supabase_realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE bookings;
