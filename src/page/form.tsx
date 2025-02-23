import { useState } from "react";

export default function EventForm() {
  const [event, setEvent] = useState({
    event_title: "",
    date: "",
    time: "",
    end_time: "",
    location: "",
    description: "",
    recurrence: [] as string[],
  });

  const [prompt, setPrompt] = useState("");
  const [events, setEvents] = useState<{ prompt: string; data: any }[]>([]);

  const CheckBox = ({ title }: { title: string }) => {
    const isChecked = event.recurrence.includes(title);

    const handleRecurrence = () => {
      setEvent((prev) => ({
        ...prev,
        recurrence: isChecked
          ? prev.recurrence.filter((day) => day !== title)
          : [...prev.recurrence, title],
      }));
    };

    return (
      <div className="flex flex-col items-center">
        <label className="text-sm font-medium">{title}</label>
        <input
          type="checkbox"
          name={title}
          checked={isChecked}
          onChange={handleRecurrence}
          className="mt-1"
        />
      </div>
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Format recurrence data
    const recurrenceData =
      event.recurrence.length > 0
        ? [
            {
              frequency: "weekly",
              interval: 1,
              day: event.recurrence,
            },
          ]
        : [];

    // Store the new event
    const newEvent = {
      prompt,
      data: {
        ...event,
        recurrence: recurrenceData,
      },
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);

    // Reset form fields
    setEvent({
      event_title: "",
      date: "",
      time: "",
      end_time: "",
      location: "",
      description: "",
      recurrence: [],
    });
    setPrompt("");
  };

  const handleExport = () => {
    if (events.length === 0) {
      alert("No events to export!");
      return;
    }

    const formattedOutput = events
      .map((ev) => `${ev.prompt}\n${JSON.stringify(ev.data, null, 2)}\n\n`)
      .join("");

    const blob = new Blob([formattedOutput], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "events.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-[500px]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-4 pt-[50%] space-y-4"
      >
        {/* Prompt Input */}
        <input
          type="text"
          name="prompt"
          placeholder="Describe the event (e.g., 'Gym session every Saturday morning')"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        {/* Event Fields */}
        <input
          type="text"
          name="event_title"
          placeholder="Event Title"
          value={event.event_title}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          value={event.date}
          onChange={handleChange}
        />
        <input
          type="time"
          name="time"
          value={event.time}
          onChange={handleChange}
        />
        <input
          type="time"
          name="end_time"
          value={event.end_time}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={event.location}
          onChange={handleChange}
        />
        <textarea
          name="description"
          placeholder="Description"
          value={event.description}
          onChange={handleChange}
        ></textarea>

        {/* Days of Recurrence */}
        <div className="flex flex-row gap-4 w-full">
          {["MO", "TU", "WE", "TH", "FR", "SA", "SU"].map((day) => (
            <CheckBox key={day} title={day} />
          ))}
        </div>

        {/* Submit Button */}
        <button type="submit">Add Event</button>

        {/* Export Button */}
        <button type="button" onClick={handleExport}>
          Export All Events
        </button>
      </form>

      {/* Display Stored Events */}
      <div className="mt-4">
        <h2 className="text-lg font-bold">Stored Events:</h2>
        {events.length === 0 ? (
          <p>No events added yet.</p>
        ) : (
          events.map((ev, index) => (
            <div key={index} className="border p-2 my-2">
              <pre>{ev.prompt}</pre>
              <pre>{JSON.stringify(ev.data, null, 2)}</pre>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
