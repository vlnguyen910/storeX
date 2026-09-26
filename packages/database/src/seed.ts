import { queryClient } from "./client";

await queryClient`
  INSERT INTO facility_operating_hours (facility_id, day_of_week, open_time, close_time, timezone)
  SELECT facilities.id, days.day, '06:00:00', '22:00:00', 'Asia/Ho_Chi_Minh'
  FROM facilities
  CROSS JOIN generate_series(0, 6) AS days(day)
  ON CONFLICT (facility_id, day_of_week) DO NOTHING
`;

await queryClient.end();
