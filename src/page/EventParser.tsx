import React, { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Box,
} from "@mui/material";

interface EventData {
  event_title: string;
  date: string;
  time: string;
  end_time: string;
  location: string;
  description: string;
  recurrence: string | { frequency: string; interval: number; day: string[] }[];
}

const parseEvent = (text: string): EventData => {
  let event: EventData = {
    event_title: "",
    date: "",
    time: "",
    end_time: "",
    location: "",
    description: "",
    recurrence: "none",
  };

  // Extract time range (9 AM - 10 AM, 3PM, etc.)
  let timeMatch = text.match(
    /(\d{1,2}(?::\d{2})?\s?[ap]m)(?:\s?-\s?(\d{1,2}(?::\d{2})?\s?[ap]m))?/i
  );
  if (timeMatch) {
    event.time = convertTo24Hr(timeMatch[1]);
    if (timeMatch[2]) event.end_time = convertTo24Hr(timeMatch[2]);
  }

  // Extract date or relative time
  let dateMatch = text.match(
    /\b(?:next|this)?\s?(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|tomorrow|today|(\w+\s\d{1,2}))/i
  );
  if (dateMatch) event.date = parseDate(dateMatch[0]);

  // Extract recurrence (every day, every Saturday, etc.)
  let recurrenceMatch = text.match(
    /every\s(day|week|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i
  );
  if (recurrenceMatch) {
    event.recurrence = [
      {
        frequency: recurrenceMatch[1] === "day" ? "daily" : "weekly",
        interval: 1,
        day:
          recurrenceMatch[1] === "day"
            ? ["MO", "TU", "WE", "TH", "FR"]
            : [recurrenceMatch[1].substring(0, 2).toUpperCase()],
      },
    ];
  }

  // Extract location (using "in", "at", or "on" as hints)
  let locationMatch = text.match(/\b(?:in|at|on)\s([A-Za-z0-9\s\.,-]+)/i);
  if (locationMatch) event.location = locationMatch[1].trim();

  // Extract event title (everything before time or date is likely the title)
  let titleMatch = text.match(/^(.+?)(?:\s\d{1,2}[ap]m|\snext|\sin|\sat)/i);
  if (titleMatch) event.event_title = titleMatch[1].trim();

  return event;
};

// Convert 12-hour format to 24-hour time
const convertTo24Hr = (time: string): string => {
  let match = time.match(/(\d{1,2})(?::(\d{2}))?\s?([ap]m)/i);
  if (!match) return "";
  let hours = parseInt(match[1]);
  let minutes = match[2] ? match[2] : "00";
  let period = match[3].toLowerCase();
  if (period === "pm" && hours !== 12) hours += 12;
  if (period === "am" && hours === 12) hours = 0;
  return `${String(hours).padStart(2, "0")}:${minutes}`;
};

// Convert relative date ("next Monday", "tomorrow") into YYYY-MM-DD
const parseDate = (dateText: string): string => {
  let today = new Date();
  let dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  if (dateText.toLowerCase() === "tomorrow") {
    today.setDate(today.getDate() + 1);
  } else if (dayOfWeek.includes(dateText)) {
    let targetDay = dayOfWeek.indexOf(dateText);
    let diff = (targetDay + 7 - today.getDay()) % 7 || 7;
    today.setDate(today.getDate() + diff);
  } else {
    return new Date(dateText).toISOString().split("T")[0];
  }

  return today.toISOString().split("T")[0];
};

const EventParser: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [eventData, setEventData] = useState<EventData | null>(null);

  const handleParse = () => {
    setEventData(parseEvent(inputText));
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 5 }}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            Event Parser
          </Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            placeholder="Enter event description (e.g., Dentist appointment at 3 PM next Wednesday)"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" onClick={handleParse}>
            Parse Event
          </Button>
          {eventData && (
            <pre
              style={{
                marginTop: "20px",
                backgroundColor: "#f0f0f0",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              {JSON.stringify(eventData, null, 2)}
            </pre>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default EventParser;
