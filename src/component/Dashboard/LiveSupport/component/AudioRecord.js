import { Box } from "@mui/material";
import { useState } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

const AudioRecord = () => {
  const recorderControls = useAudioRecorder();

  const [recordFile, setRecordFile] = useState(null);

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    setRecordFile(audio);
  };

  return (
    <Box sx={{ "& .audio-recorder .audio-recorder-mic": { display: "none" } }}>
      <AudioRecorder
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={recorderControls}
        showVisualizer={true}
      />
      <button onClick={recorderControls.startRecording}>Start recording</button>
      <button onClick={recorderControls.stopRecording}>Stop recording</button>
      <button onClick={recorderControls.togglePauseResume}>
        pause recording
      </button>
      <button onClick={() => setRecordFile(null)}>delete recording</button>

      {recordFile && <audio controls src={recordFile.src} />}
    </Box>
  );
};

export default AudioRecord;
