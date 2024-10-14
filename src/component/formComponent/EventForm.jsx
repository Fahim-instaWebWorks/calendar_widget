import React from "react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import { Input, Select, Textarea } from "@mobiscroll/react";
import { Box, Button, IconButton, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import FirstComponent from "./FirstComponent";
import SecondComponent from "./SecondComponent";
import ThirdComponent from "./ThirdComponent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CloseIcon from "@mui/icons-material/Close";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function addDurationToDateTime(dateString, duration) {
  // Convert the date string to a Date object
  let date = new Date(dateString);

  // Split the duration into hours and minutes
  const [hours, minutes] = duration.split(':').map(Number);

  // Add the duration to the date object
  date.setHours(date.getHours() + hours);
  date.setMinutes(date.getMinutes() + minutes);

  // Format the date back to a string (keeping the original format)
  const modifiedDate = date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"
  
  return modifiedDate;
}

// Example usage:
const result = addDurationToDateTime("2024-10-07T14:00", "2:30");
console.log(result); // This will print the modified date-time string


const EventForm = ({ myEvents,setEvents, setOpen, onClose,clickedEvent,selectedDate,setSelectedDate }) => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const todayDate = new Date()
  const [formData, setFormData] = useState({
    id:`job${myEvents.length+1}`,
    title: "",
    startTime: "",
    endTime: "",
    duration: "",
    associateWith: "",
    Type_of_Activity: "",
    resource: 0,
    scheduleFor:'',
    scheduleWith:[],
    location: "",
    priority: "",
    ringAlarm: "",
    occurrence: "once",
    start: todayDate,
    end: "",
    noEndDate: false,
    color: "#d1891f",
    Banner:false,
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // Handlers for Next and Back buttons
  const handleNext = () => {
    if (value < 2) setValue(value + 1); // Increment to next tab
  };

  const handleBack = () => {
    if (value > 0) setValue(value - 1); // Decrement to previous tab
  };

  const handleInputChange = (field, value) => {
    if (field === "resource") {
      value = parseInt(value, 10); // Convert the input to an integer
    }

    if(field === "scheduleWith"){
      setFormData((prev) => ({
        ...prev,
        [field]: Array.isArray(value) ? [...value] : value,  // Spread array values for multiple selections
      }));
    }
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form Data Submitted:", formData);
    // Add your submit logic here (e.g., send data to the backend)
    setEvents((prev) => [...prev, formData]);
    setOpen(false);
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 600,
        bgcolor: "background.paper",
        border: "2px solid #000",
        boxShadow: 24,
        p: 2,
        borderRadius: 5,
      }}
    >
      <Box height={15}>
        <IconButton
          aria-label="close"
          onClick={() => {
            onClose();
            setOpen(false);
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          aria-label="simple tabs example"
        >
          <Tab label="General" />
          <Tab label="Details" />
          <Tab label="Reccurence" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <FirstComponent
          formData={formData}
          handleInputChange={handleInputChange}
          selectedDate={selectedDate}
        />
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button size="small" disabled>
            Back
          </Button>{" "}
          {/* Back is disabled on first tab */}
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleNext}
          >
            Next
          </Button>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        {/* <SecondComponent /> */}
        <Typography variant="h6">Description</Typography>
        {/* <ReactQuill
          theme="snow"
          style={{ height: 250, marginBottom: 80 }}
          value={formData.quillContent}
          onChange={(content) => handleInputChange("quillContent", content)}
        /> */}
        <TextField multiline rows={10} fullWidth onChange={(content) => handleInputChange("quillContent", content)}/>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleNext}
          >
            Next
          </Button>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ThirdComponent
          formData={formData}
          handleInputChange={handleInputChange}
        />
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleBack}
          >
            Back
          </Button>
          <Button
            size="small"
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
          >
            Submit
          </Button>{" "}
          {/* Next is disabled on the last tab */}
        </Box>
      </TabPanel>
    </Box>
  );
};

export default EventForm;
