import * as React from "react";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

export default function ResponsiveDateTimeRangePickers() {
  const [startDateTime, setStartDateTime] = React.useState(
    dayjs("")
  );
  const [endDateTime, setEndDateTime] = React.useState(
    dayjs("")
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateTimePicker"]}>
        <div className="bg-slate-600 flex gap-4">
          <DateTimePicker
            label="Start Date and Time"
            value={startDateTime}
            onChange={(newValue) => setStartDateTime(newValue)}
          />
          <DateTimePicker
            label="End Date and Time"
            value={endDateTime}
            onChange={(newValue) => setEndDateTime(newValue)}
          />
        </div>
      </DemoContainer>
    </LocalizationProvider>
  );
}
