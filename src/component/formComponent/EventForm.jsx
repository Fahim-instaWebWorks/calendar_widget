import React from "react";
import "@mobiscroll/react/dist/css/mobiscroll.min.css";
import { Input, Select, Textarea } from "@mobiscroll/react";
import {
  Box,
  Button,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import FirstComponent from "./FirstComponent";
import SecondComponent from "./SecondComponent";
import ThirdComponent from "./ThirdComponent";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { transformFormSubmission } from "../handleDataFormatting";
const ZOHO = window.ZOHO;

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
  const [hours, minutes] = duration.split(":").map(Number);

  // Add the duration to the date object
  date.setHours(date.getHours() + hours);
  date.setMinutes(date.getMinutes() + minutes);

  // Format the date back to a string (keeping the original format)
  const modifiedDate = date.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:MM"

  return modifiedDate;
}

function getLocalDateTime() {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed, so add 1
  const day = String(today.getDate()).padStart(2, "0");
  const hours = String(today.getHours()).padStart(2, "0"); // Local hours
  const minutes = String(today.getMinutes()).padStart(2, "0"); // Local minutes

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

const EventForm = ({
  myEvents,
  setEvents,
  setOpen,
  onClose,
  activityType,
  setActivityType,
  selectedDate,
  setSelectedDate,
  formData,
  setFormData,
  handleInputChange,
}) => {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const todayDate = getLocalDateTime();
  dayjs.extend(utc);
  dayjs.extend(timezone);
  console.log({ myEvents });
  // const [formData, setFormData] = useState({
  //   id: newEvent?.id || "",
  //   title: newEvent?.title || "",
  //   startTime: "",
  //   endTime: "",
  //   duration: parseInt(newEvent?.duration) || 0,
  //   associateWith: newEvent?.associateWith || "",
  //   Type_of_Activity: newEvent?.Type_of_Activity?.toLowerCase() || "",
  //   resource: newEvent?.resource || 0,
  //   scheduleFor: newEvent?.scheduleFor || "",
  //   scheduleWith: newEvent?.scheduleWith || [],
  //   location: newEvent?.location || "",
  //   priority: newEvent?.priority?.toLowerCase() || "",
  //   Remind_At: newEvent?.ringAlarm || "",
  //   occurrence: newEvent?.occurrence || "once",
  //   start: newEvent?.start || todayDate,
  //   end: newEvent?.end || "",
  //   noEndDate: false,
  //   color: newEvent?.color || "#d1891f",
  //   Banner: newEvent?.Banner || false,
  //   Description: newEvent?.Description || "",
  // });

  console.log({ formData });

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

  const handleClose = () => {
    setFormData({
      id: "",
      title: "",
      startTime: "",
      endTime: "",
      duration: 0,
      associateWith: null,
      Type_of_Activity: "",
      resource: 0,
      scheduleFor: "",
      scheduleWith: [],
      location: "",
      priority: "",
      Remind_At: "",
      occurrence: "once",
      start: "",
      end: "",
      noEndDate: false,
      color: "#d1891f",
      Banner: false,
      Description: "",
    });
    onClose();
    setOpen(false);
  };

  const handleSubmit = () => {
    console.log("Form Data Submitted:", formData);
    // Add your submit logic here (e.g., send data to the backend)
    // setEvents((prev) => [...prev, formData]);
    if (formData.id !== "") {
      const transformedData = transformFormSubmission(formData);
      var config = {
        Entity: "Events",
        APIData: transformedData,
        Trigger: ["workflow"],
      };
      ZOHO.CRM.API.updateRecord(config).then(function (data) {
        console.log("tazwer", data);
        if (data.data[0].code === "SUCCESS") {
          alert("Event Updated Successfully");
          setEvents((prevEvents) =>
            prevEvents.map((event) =>
              event.id === formData.id ? formData : event
            )
          );
          setFormData({
            id: "",
            title: "",
            startTime: "",
            endTime: "",
            duration: 0,
            associateWith: null,
            Type_of_Activity: "",
            resource: 0,
            scheduleFor: "",
            scheduleWith: [],
            location: "",
            priority: "",
            Remind_At: "",
            occurrence: "once",
            start: "",
            end: "",
            noEndDate: false,
            color: "#d1891f",
            Banner: false,
            Description: "",
          });
          setOpen(false);
        }
      });
    } else {
      const transformedData = transformFormSubmission(formData);
      console.log({ transformedData });
      ZOHO.CRM.API.insertRecord({
        Entity: "Events",
        APIData: transformedData,
        Trigger: ["workflow"],
      })
        .then((data) => {
          if (
            data.data &&
            data.data.length > 0 &&
            data.data[0].code === "SUCCESS"
          ) {
            alert("Event Created Successfully");
            handleInputChange("id", data?.data[0].details?.id);

            setEvents((prev) => [...prev, formData]);
            setFormData({
              id: "",
              title: "",
              startTime: "",
              endTime: "",
              duration: 0,
              associateWith: null,
              Type_of_Activity: "",
              resource: 0,
              scheduleFor: "",
              scheduleWith: [],
              location: "",
              priority: "",
              Remind_At: "",
              occurrence: "once",
              start: "",
              end: "",
              noEndDate: false,
              color: "#d1891f",
              Banner: false,
              Description: "",
            });
            setOpen(false);
          }
        })
        .catch((error) => {
          console.error("Error submitting the form:", error);
        });
    }
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
          onClick={() => handleClose()}
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
          activityType={activityType}
          setActivityType={setActivityType}
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
        <TextField
          multiline
          rows={10}
          fullWidth
          defaultValue={formData.Description}
          // value={formData.Description}
          onChange={(e) => handleInputChange("Description", e.target.value)}
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
