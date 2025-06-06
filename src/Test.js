import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import KeyboardVoiceIcon from "@mui/icons-material/KeyboardVoice";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";

const Test = () => {
  const recorderControls = useAudioRecorder();
  const [recordFile, setRecordFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [pausedBlob, setPausedBlob] = useState(null);

  // Handles the Play/Pause action
  const handlePlayPause = () => {
    // if (isRecording) {
    //   // Pause recording: Stop the recorder and save the blob
    //   recorderControls.stopRecording();
    //   setIsRecording(false);
    //   setPausedBlob(recordFile);
    // } else {
    //   // Resume recording: Start a new recording session
    //   setIsRecording(true);
    //   recorderControls.startRecording();
    //   setPausedBlob(null); // Clear the paused blob
    // }

    recorderControls.togglePauseResume();

  };

 
  // Handle when the recording is complete
  const handleStopRecording = (blob) => {
    setIsRecording(false);
    setRecordFile(URL.createObjectURL(blob)); // Save the file as a URL
  };

  // Handle deleting the recording
  const handleDelete = () => {
    setRecordFile(null);
    setIsRecording(false);
    recorderControls.stopRecording();
    setPausedBlob(null); // Clear paused blob
  };

 

  return (
    <div>
      <Box
        sx={{
          "& .audio-recorder-mic": { display: "none" },
          "& .audio-recorder": {
            backgroundColor: "#c2deff",
            borderRadius: 1,
            color: "var(--secondary-color)",
            fontSize: "14px",
            padding: "6.5px 10px",
            border: "1px solid var(--secondary-color)",
            width: "270px",
            height: "45px",
          },
          "& .audio-recorder-timer": { color: "var(--secondary-color)" },
          display: isRecording ? "flex" : "none",
          gap: "10px",
          alignItems: "center",
        }}
      >
        <Button sx={{}} onClick={handleDelete}>
          <DeleteIcon
            sx={{ fontSize: "18px", color: "var(--secondary-color)" }}
          />
        </Button>

        <AudioRecorder
          onRecordingComplete={handleStopRecording} // Store the blob when recording is complete
          recorderControls={recorderControls}
          showVisualizer={true}
          downloadOnSavePress={false}
          isPaused={recorderControls.isPaused}
        />

        <Button sx={{}} onClick={handlePlayPause}>
          <KeyboardVoiceIcon
            sx={{ fontSize: "18px", color: "var(--secondary-color)" }}
          />
        </Button>
      </Box>

      {/* Button to start recording */}
      <Button
        onClick={() => {
          setIsRecording(true);
          setRecordFile(null);
          recorderControls.startRecording();
        }}
      >
        Start
      </Button>

      {/* If recording is paused, show the audio from the paused state */}
      {pausedBlob && (
        <audio controls>
          <source src={URL.createObjectURL(pausedBlob)} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default Test;
