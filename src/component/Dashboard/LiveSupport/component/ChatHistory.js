import {
  Box,
  Button,
  Grid,
  Skeleton,
  Typography,
  Slider,
  Tooltip,
} from "@mui/material";
import { FiMinus } from "react-icons/fi";
import { FaPaperPlane } from "react-icons/fa";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  boxContainer,
  iconBox,
  labelStyle,
  titleBoxContainer,
} from "../LiveSupport";
import moment from "moment/moment";
import { useState, useRef, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "../../../../context/AuthProvider";
import { isAudio, textToLogo } from "../../../../shared/common/functions";
import pdfIcon from "../../../../assets/png/pdf.png";
import docIcon from "../../../../assets/png/doc.png";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import DownloadIcon from "@mui/icons-material/Download";
import NotFound from "../../../NotFound/NoFound";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import DeleteIcon from "@mui/icons-material/Delete";
import StopIcon from "@mui/icons-material/Stop";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";

const ChatHistory = ({
  roomId,
  setId,
  setOpen,
  setOpenImages,
  setCrrImgIndex,
}) => {
  const recorderControls = useAudioRecorder();
  const queryClient = useQueryClient();
  const { jsonHeader, formDataHeader } = useAuth();
  const inputRef = useRef(null);
  const attachmentRef = useRef([]);
  const messagesEndRef = useRef(null);
  const [isEmpty, setIsEmpty] = useState(true);
  const [attachment, setAttachment] = useState([]);
  const [allConversation, setAllConversation] = useState([]);

  const [isRecording, setIsRecording] = useState(false);
  const [recordFile, setRecordFile] = useState(null);

  const [ticketData, setticketData] = useState({});

  const [shouldPoll, setShouldPoll] = useState(true);

  const { status: conversationStatus, error } = useQuery({
    queryKey: ["support-ticket/conversation", roomId],
    queryFn: async () => {
      const queryParams = new URLSearchParams({ page: 1, limit: 20 });

      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/support-ticket/conversation/${roomId}?${queryParams}`,
        jsonHeader()
      );

      setticketData(data?.data?.ticket);

      setAllConversation([
        ...data?.data?.data?.filter((m) => m?.textType === "text"),
      ]);

      return [...data?.data?.data?.filter((m) => m?.textType === "text")];
    },
    enabled: !!roomId,
    retry: false,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval:
      shouldPoll && attachmentRef.current.length === 0 ? 3000 : false,
  });

  const { data: allParticipant, status: participantStatus } = useQuery({
    queryKey: ["support-ticket/participant", roomId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/support-ticket/participant/${roomId}`,
        jsonHeader()
      );
      return data;
    },
    enabled: !!roomId,
    retry: false,
    refetchInterval:
      shouldPoll && attachmentRef.current.length === 0 ? 3000 : false,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();

    if (ticketData?.ticketStatus === "pending") return;

    const handleInput = () => {
      setIsEmpty(inputRef?.current.textContent.trim() === "");
    };

    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        if (!e.shiftKey) {
          e.preventDefault();
          handleSubmitMessage();
        }
      }
    };

    const handlePaste = (e) => {
      const items = Array.from(e.clipboardData.items);
      let imagePasted = false;

      items.forEach((item) => {
        if (item.type.includes("image")) {
          const file = item.getAsFile();
          if (file) {
            const newAttachment = { attachment: file };

            setAttachment((prev) => [...prev, newAttachment]);
            attachmentRef.current = [...attachmentRef.current, newAttachment];

            imagePasted = true;
          }
        }
      });

      if (imagePasted) {
        e.preventDefault();
      }
    };

    if (inputRef && ticketData?.ticketStatus === "opened") {
      inputRef?.current.addEventListener("input", handleInput);
      inputRef?.current.addEventListener("keydown", handleKeyDown);
      inputRef?.current?.addEventListener("paste", handlePaste);

      return () => {
        inputRef?.current?.removeEventListener("input", handleInput);
        inputRef?.current?.removeEventListener("keydown", handleKeyDown);
        inputRef?.current?.removeEventListener("paste", handlePaste);
      };
    }
  }, [ticketData?.ticketStatus]);

  useEffect(() => {
    const scrollToEnd = () => {
      messagesEndRef.current?.scrollIntoView();
    };

    setTimeout(scrollToEnd, 20);
  }, [allConversation.length]);

  const handleSubmitMessage = async () => {
    setShouldPoll(false);

    const convData = queryClient.getQueryData([
      "support-ticket/conversation",
      roomId,
    ]);

    const message = inputRef?.current?.innerText
      ?.replace(/\s+/g, " ")
      ?.trim("");

    if (message) {
      inputRef.current.innerText = "";
      setIsEmpty(true);
    }

    if (message?.length === 0 && attachmentRef.current?.length === 0) return;

    if (recordFile) {
      const audioFile = new File([recordFile], "recorded-audio.wav", {
        type: "audio/wav",
      });

      attachmentRef.current = [{ attachment: audioFile }];
      setRecordFile(null);
    }

    const crrUser = convData?.find((c) => c?.senderType === "user");

    const latestMessage = {
      attachments:
        attachmentRef.current?.length > 0 ? attachmentRef.current : [],
      sender: crrUser?.sender,
      senderType: "user",
      sl: allConversation[allConversation?.length - 1]?.sl + 1,
      text: message,
      textType: "text",
      isSending: true,
    };

    setAllConversation((prevConversations) => [
      ...prevConversations,
      latestMessage,
    ]);

    const formData = new FormData();
    formData.append("message", message);

    attachmentRef.current.forEach((file) => {
      formData.append("attachments", file?.attachment);
    });

    if (attachmentRef.current.length > 0) {
      setAttachment([]);
      attachmentRef.current = [];
    }

    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/support-ticket/reply/${roomId}`,
        formData,
        formDataHeader()
      );

      if (res?.data?.success) {
        setAllConversation((prevConversations) =>
          prevConversations.map((c, i, arr) => {
            if (i === arr.length - 1) {
              return { ...c, updatedAt: new Date(), isSending: false };
            }
            return c;
          })
        );
      }
    } catch (e) {
      setAllConversation((prevConversations) =>
        prevConversations.map((c, i, arr) => {
          if (i === arr.length - 1) {
            const updated = { isSending: false, isErr: true };
            return { ...c, ...updated };
          }
          return c;
        })
      );
    } finally {
      setShouldPoll(true);
    }
  };

  return (
    <Box
      sx={{
        ...boxContainer,
        position: "relative",
        "& .MuiSlider-thumb": { "::after": { height: "15px", width: "15px" } },
      }}
    >
      <Box sx={titleBoxContainer}>
        <Box>
          <Typography sx={labelStyle}>
            {ticketData?.subType || "N/A"}
            {", "}
            {ticketData?.subject || "N/A"}
          </Typography>
          <Typography
            fontSize={"12px"}
            sx={{ ...labelStyle, textTransform: "capitalize" }}
          >
            Service Status : {ticketData?.ticketStatus || "N/A"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: "10px" }}>
          <Box
            onClick={() => setId(1)}
            sx={{ ...iconBox, bgcolor: "var(--secondary-color)" }}
          >
            <ArrowBackIcon
              style={{ color: "var(--white)", fontSize: "18px" }}
            />
          </Box>

          <Box
            onClick={async () => {
              await queryClient.refetchQueries({
                queryKey: ["support-ticket/conversation", roomId],
                type: "active",
                exact: true,
              });
            }}
            sx={{ ...iconBox, bgcolor: "var(--secondary-color)" }}
          >
            <Tooltip
              title="Click to load latest messages"
              placement="bottom"
              arrow
            >
              <RotateLeftIcon
                style={{ color: "var(--white)", fontSize: "18px" }}
              />
            </Tooltip>
          </Box>

          <Box
            onClick={() => {
              setOpen(false);
              setId(1);
            }}
            sx={iconBox}
          >
            <FiMinus style={{ color: "var(--white)", fontSize: "22px" }} />
          </Box>
        </Box>
      </Box>

      <Box
        mt={
          conversationStatus === "pending" || participantStatus === "pending"
            ? 1
            : 0
        }
        sx={{ flexGrow: 1, px: 2.5, overflowY: "auto" }}
      >
        {conversationStatus === "pending" || participantStatus === "pending" ? (
          <ChatLoader />
        ) : conversationStatus === "success" &&
          participantStatus === "success" ? (
          allConversation?.map((message, i, arr) => {
            const participant =
              allParticipant?.data[message?.sender?.participantUserId];

            const messageTime = moment(message?.updatedAt).format("hh:mm A");

            const messageDateDifference = moment().diff(
              moment(message?.updatedAt).format("YYYY-MM-DD"),
              "days"
            );

            const messageDateTime =
              (messageDateDifference === 0
                ? "Today"
                : messageDateDifference === 1
                  ? "Yesterday"
                  : moment(message?.updatedAt).format("DD MMM YYYY")) +
              " " +
              messageTime;

            const msjTimeDifference = moment(arr[i + 1]?.updatedAt).diff(
              message?.updatedAt,
              "seconds"
            );

            return (
              <SingleMessage
                message={message}
                i={i}
                allConversation={allConversation}
                participant={participant}
                msjTimeDifference={msjTimeDifference}
                messageDateTime={messageDateTime}
                setCrrImgIndex={setCrrImgIndex}
                setOpenImages={setOpenImages}
              />
            );
          })
        ) : (
          <Box sx={{ height: "400px" }}>
            <NotFound label={error?.response?.data?.message} />
          </Box>
        )}

        <div ref={messagesEndRef} />
      </Box>

      {attachment?.length > 0 && (
        <Box sx={{ pt: 2, px: 2.5, bgcolor: "#DAF1FF" }}>
          {/* {attachment.some((item) =>
            item?.attachment?.type?.includes("audio")
          ) ? (
            ""
          ) : (
            <SelectedChatImage
              allImages={attachment}
              handleClose={() => {
                setAttachment([]);
                attachmentRef.current = [];
              }}
              handleRemoveImg={(imgIndex) =>
                setAttachment(attachment.filter((_, i) => i !== imgIndex))
              }
            />
          )} */}

          <SelectedChatImage
            allImages={attachment}
            handleClose={() => {
              setAttachment([]);
              attachmentRef.current = [];
            }}
            handleRemoveImg={(imgIndex) =>
              setAttachment(attachment.filter((_, i) => i !== imgIndex))
            }
          />
        </Box>
      )}

      {(conversationStatus === "success" ||
        participantStatus === "success") && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmitMessage();
          }}
        >
          <Box sx={chatBox?.container}>
            {ticketData?.ticketStatus === "opened" ? (
              <>
                <Box
                  sx={{
                    "& .audio-recorder-mic": { display: "none" },
                    "& .audio-recorder": {
                      backgroundColor: "#c2deff",
                      // borderRadius: 1,
                      // color: "var(--secondary-color)",
                      // fontSize: "14px",
                      // padding: "6.5px 10px",
                      // border: "1px solid var(--secondary-color)",
                      width: "240px",
                      // height: "45px",
                      boxShadow: "none",
                    },
                    "& .audio-recorder-options": { display: "none" },
                    "& .audio-recorder-timer ": {
                      color: "var(--secondary-color)",
                    },
                    display: isRecording ? "flex" : "none",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <Button
                    sx={playPauseBtn}
                    onClick={() => {
                      setIsRecording(false);
                      setRecordFile(null);
                      recorderControls.stopRecording();
                    }}
                  >
                    <DeleteIcon
                      sx={{ fontSize: "18px", color: "var(--secondary-color)" }}
                    />
                  </Button>

                  <Box
                    sx={{
                      backgroundColor: "#c2deff",
                      borderRadius: 1,
                      color: "var(--secondary-color)",
                      fontSize: "14px",
                      padding: "6.5px 10px",
                      border: "1px solid var(--secondary-color)",
                      width: "270px",
                      height: "45px",
                    }}
                  >
                    <AudioRecorder
                      onRecordingComplete={(blob) => {
                        if (!recordFile) {
                          setRecordFile(blob);
                        }
                      }}
                      recorderControls={recorderControls}
                      showVisualizer={true}
                      downloadOnSavePress={false}
                    />
                  </Box>

                  <Button
                    onClick={() => {
                      recorderControls.stopRecording();
                    }}
                    sx={playPauseBtn}
                  >
                    <StopIcon
                      sx={{ fontSize: "18px", color: "var(--secondary-color)" }}
                    />
                  </Button>
                </Box>

                <label
                  htmlFor="attachment"
                  style={{
                    ...flexCenter,
                    display: isRecording ? "none" : "flex",
                    height: "40px",
                    cursor: "pointer",
                  }}
                >
                  <AddIcon sx={{ color: "var(--secondary-color)" }} />
                  <input
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      if (file.type.includes("audio")) {
                        attachmentRef.current = [{ attachment: file }];
                        setAttachment(() => [{ attachment: file }]);
                        e.target.value = null;
                      } else {
                        const hasAudio = attachmentRef.current.some((item) =>
                          item?.attachment?.type?.includes("audio")
                        );

                        if (hasAudio) return;

                        attachmentRef.current = [
                          ...attachmentRef.current,
                          { attachment: file },
                        ];
                        setAttachment((prev) => [
                          ...prev,
                          { attachment: file },
                        ]);
                        e.target.value = null;
                      }
                    }}
                    id={"attachment"}
                    style={{ display: "none" }}
                    type="file"
                    name={"attachment"}
                    accept="all"
                  />
                </label>

                <Box
                  sx={{
                    display: isRecording ? "none" : "block",
                    position: "relative",
                    width: "82%",
                  }}
                >
                  <Box
                    ref={inputRef}
                    contentEditable="true"
                    translate="no"
                    sx={chatInput}
                    id="prompt-textarea"
                    data-virtualkeyboard="true"
                  />
                  {isEmpty && (
                    <Box sx={chatBox?.placeholder}>Type a message...</Box>
                  )}
                </Box>

                <Button
                  disabled={isEmpty && !!attachment.length === false}
                  sx={chatBox?.btn}
                  type="submit"
                >
                  <FaPaperPlane
                    style={{
                      ...chatBox?.icon,
                      color:
                        isEmpty && !!attachment.length === false
                          ? "#AD1811"
                          : "white",
                    }}
                  />
                </Button>
              </>
            ) : ticketData?.ticketStatus === "pending" ? (
              <Typography
                width={"100%"}
                sx={{ fontSize: "12px", color: "#3C4258", textAlign: "center" }}
              >
                Your Support Ticket is Pending. Please wait for Admin response
              </Typography>
            ) : ticketData?.ticketStatus === "pending" ? (
              <Typography
                width={"100%"}
                sx={{ fontSize: "12px", color: "#3C4258", textAlign: "center" }}
              >
                Your Support Ticket is Closed
              </Typography>
            ) : (
              ""
            )}
          </Box>
        </form>
      )}
    </Box>
  );
};

export const ChatLoader = () => {
  return [...new Array(5)].map((_, i) => (
    <Box
      key={i}
      sx={{
        display: "flex",
        justifyContent: (i + 1) % 2 === 0 ? "end" : "start",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          mb: 2,
          flexDirection: (i + 1) % 2 === 0 ? "row-reverse" : "row",
          width: "200px",
        }}
      >
        <Skeleton variant="circular" width={"30px"} height={"30px"} />
        <Box sx={{ width: "60%" }}>
          <Skeleton animation="wave" width={"100%"} height={"16px"} />

          <Box
            sx={{
              bgcolor: "#F6FAFF",
              px: 1.5,
              py: 1,
              borderRadius: "5px",
              border: "1px solid var(--border)",
              width: "100%",
            }}
          >
            <Skeleton animation="wave" width={"100%"} height={"16px"} />
            <Skeleton animation="wave" width={"100%"} height={"16px"} />
          </Box>
        </Box>
      </Box>
    </Box>
  ));
};

const SingleMessage = ({
  message,
  i,
  allConversation,
  participant,
  msjTimeDifference,
  messageDateTime,
  setOpenImages,
  setCrrImgIndex,
}) => {
  const [audioValidity, setAudioValidity] = useState({});

  const handleAudioCheck = async (audio) => {
    const validAudio = await isAudio(audio);
    return validAudio;
  };

  useEffect(() => {
    message?.attachments?.forEach((image, index) => {
      handleAudioCheck(image?.attachment).then((validAudio) => {
        setAudioValidity((prevState) => ({
          ...prevState,
          [index]: validAudio,
        }));
      });
    });
  }, [message]);

  return (
    <Box
      key={i}
      sx={{
        display: "flex",
        justifyContent: message?.senderType === "user" ? "end" : "start",
      }}
    >
      <Box
        sx={{
          display: "flex",
          gap: "10px",
          mt: 2,
          // mt: msjTimeDifference > 120 && 2,
          mb: allConversation.length - 1 === i && 2,
          flexDirection: message?.senderType === "user" ? "row-reverse" : "row",
        }}
      >
        <Box
          sx={{
            bgcolor:
              participant?.participantType === "admin"
                ? "var(--primary-color)"
                : "var(--secondary-color)",
            height: "30px",
            width: "30px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            // visibility: msjTimeDifference > 120 ? "visible" : "hidden",
          }}
        >
          <Typography sx={{ fontWeight: 500, fontSize: "12px" }}>
            {participant?.participantType === "admin"
              ? "FF"
              : textToLogo(participant?.info?.agencyName)}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: message?.senderType === "user" && "end",
          }}
        >
          <Typography
            sx={{
              fontSize: "12px",
              color: "#3C4258",
              textAlign: message?.senderType === "user" ? "end" : "start",
              // display: msjTimeDifference > 120 ? "block" : "none",
            }}
          >
            {participant?.participantType === "admin"
              ? "Fly Far International"
              : participant?.info?.agencyName}
          </Typography>
          <Box
            sx={{
              bgcolor: "#F6FAFF",
              px: 1.5,
              py: 1,
              pb: "4px",
              mt: "4px",
              borderRadius: "5px",
              border: "1px solid var(--border)",
              width: message?.attachments?.length > 0 ? "200px" : "max-content",
              maxWidth: "200px",
            }}
          >
            {message?.attachments?.length > 0 && (
              <Grid container spacing={"4px"} mt={0}>
                {message?.attachments?.map((image, index, arr) => {
                  const validAudio = audioValidity[index];

                  return (
                    <Grid
                      item
                      md={validAudio ? 12 : arr.length > 1 ? 6 : 12}
                      key={index}
                      sx={{
                        display: validAudio
                          ? "block"
                          : index > 3
                            ? "none"
                            : "block",
                      }}
                    >
                      {validAudio ? (
                        <ShowAudioFile
                          src={
                            image?.attachment instanceof File
                              ? URL.createObjectURL(image?.attachment)
                              : image?.attachment
                          }
                        />
                      ) : (
                        <Box
                          onClick={() => {
                            setCrrImgIndex(index < 3 ? index : 3);
                            setOpenImages(message?.attachments);
                          }}
                          sx={{ position: "relative", cursor: "pointer" }}
                        >
                          {isPdf(image?.attachment) ? (
                            <iframe
                              src={
                                image?.attachment instanceof File
                                  ? URL.createObjectURL(image?.attachment)
                                  : image?.attachment
                              }
                              title="PDF Preview"
                              width="100%"
                              height={arr.length > 1 ? "80px" : "160px"}
                            ></iframe>
                          ) : (
                            <img
                              style={{
                                width: "100%",
                                height: arr.length > 1 ? "80px" : "160px",
                                borderRadius: "5px",
                                objectFit: "cover",
                              }}
                              src={
                                image?.attachment instanceof File
                                  ? image?.attachment?.type.startsWith("image/")
                                    ? URL.createObjectURL(image?.attachment)
                                    : docIcon
                                  : image?.attachment
                              }
                              alt="attachment"
                              onLoad={(e) => {
                                if (image?.attachment instanceof File) {
                                  URL.revokeObjectURL(e.target.src);
                                }
                              }}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `${docIcon}`;
                              }}
                            />
                          )}

                          {index === 3 && validAudio === false && (
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                                backgroundColor: "#0b141a99",
                                width: "100%",
                                height: "80px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: "24px",
                                  color: "white",
                                }}
                              >
                                +{arr.length - 3}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      )}
                    </Grid>
                  );
                })}
              </Grid>
            )}

            {message?.textType === "text" && (
              <Typography
                wrap={true}
                sx={{
                  fontSize: "13px",
                  color: "var(--secondary-color)",
                  wordWrap: "break-word",
                  whiteSpace: "pre-wrap",
                  overflowWrap: "break-word",
                }}
              >
                {message?.text}
              </Typography>
            )}

            <Typography
              sx={{
                fontSize: "11px",
                color: "#89AFDD",
                mt: 1,
                textAlign: "right",
              }}
            >
              {message?.isSending ? (
                "Sending.."
              ) : message?.isErr ? (
                <span style={{ color: "red" }}>Sending Failed</span>
              ) : (
                messageDateTime
              )}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export const SelectedChatImage = ({
  allImages,
  handleClose,
  handleRemoveImg,
}) => {
  const [crrImg, setCrrImg] = useState(0);
  const [hoverImg, setHoverImg] = useState(null);

  const imgStyle = {
    width: "80%",
    height: "200px",
    objectFit: "contain",
    borderRadius: "5px",
  };

  const hasAudio = allImages?.some((item) =>
    item?.attachment?.type?.includes("audio")
  );

  return (
    <Box sx={{ position: "relative" }}>
      <CloseIcon
        onClick={handleClose}
        sx={{
          color: "var(--secondary-color)",
          position: "absolute",
          right: -10,
          cursor: "pointer",
        }}
      />

      {hasAudio ? (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
          <ShowAudioFile src={URL.createObjectURL(allImages[0]?.attachment)} />
        </Box>
      ) : (
        <>
          <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
            {isPdf(
              allImages[crrImg]?.attachment ?? allImages[0]?.attachment
            ) ? (
              <iframe
                src={URL.createObjectURL(
                  allImages[crrImg]?.attachment ?? allImages[0]?.attachment
                )}
                title="PDF Preview"
                style={imgStyle}
              ></iframe>
            ) : (
              <img
                style={imgStyle}
                src={
                  allImages[crrImg]?.attachment?.type.startsWith("image/")
                    ? URL.createObjectURL(
                        allImages[crrImg]?.attachment ??
                          allImages[0]?.attachment
                      )
                    : docIcon
                }
                alt="attachment"
              />
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {allImages.map((item, i) => {
              return (
                <Box
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCrrImg(i);
                  }}
                  onMouseEnter={() => setHoverImg(i)}
                  onMouseLeave={() => setHoverImg(null)}
                  sx={{
                    border: "1px solid var(--border)",
                    width: "50px",
                    height: "50px",
                    borderRadius: "5px",
                    position: "relative",
                    cursor: "pointer",
                    p: "4px",
                  }}
                >
                  <img
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "5px",
                    }}
                    src={
                      isPdf(item?.attachment)
                        ? pdfIcon
                        : item?.attachment?.type.startsWith("image/")
                          ? URL.createObjectURL(item?.attachment)
                          : docIcon
                    }
                    alt="attachment"
                  />

                  {hoverImg === i && (
                    <Box
                      sx={{
                        border: "1px solid var(--border)",
                        position: "absolute",
                        top: 0,
                        left: 0,
                        backgroundColor: "#0b141a99",
                        width: "50px",
                        height: "50px",
                        borderRadius: "5px",
                        textAlign: "end",
                      }}
                    >
                      <CloseIcon
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImg(hoverImg);
                        }}
                        sx={{ color: "white", fontSize: "18px" }}
                      />
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
};

const ShowAudioFile = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setProgress((current / duration) * 100);
  };

  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleProgressChange = (_, value) => {
    const newTime = (value / 100) * duration;
    audioRef.current.currentTime = newTime;
    setProgress(value);
  };

  const handleSpeedChange = () => {
    const updatedSpeed = playbackSpeed === 2 ? 0.5 : playbackSpeed + 0.25;
    setPlaybackSpeed(updatedSpeed);
    audioRef.current.playbackRate = updatedSpeed;
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", "audio-file.mp3");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading audio file:", error);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent={"space-between"}
        alignItems="center"
        width="100%"
        sx={{ gap: "2px" }}
      >
        <audio
          ref={audioRef}
          src={src}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => {
            audioRef.current.currentTime = 0;
            setProgress(0);
            setIsPlaying(false);
          }}
        />

        <Button sx={{ ...audioBtn, mr: 1 }} onClick={handleSpeedChange}>
          {`${playbackSpeed}x`}
        </Button>

        <Slider
          value={progress}
          color="none"
          onChange={handleProgressChange}
          size="small"
          sx={{ width: "80px", color: "var(--secondary-color)" }}
        />
        <Button sx={{ ...audioBtn, width: "20px" }} onClick={togglePlayPause}>
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </Button>

        <Typography
          variant="caption"
          style={{ fontSize: "11px", textAlign: "center" }}
        >
          {formatTime(duration - audioRef.current?.currentTime || 0)}
        </Typography>

        <Button
          onClick={handleDownload}
          sx={{ ...audioBtn, width: "20px" }}
          component="a"
          href={src}
          target="_blank"
          download="audio-file.mp3"
        >
          <DownloadIcon />
        </Button>

        {/* 
        <Button sx={{ ...audioBtn, width: "20px" }} onClick={handleDownload}>
          <DownloadIcon />
        </Button> */}
      </Box>
    </Box>
  );
};

const flexCenter = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const chatBox = {
  container: {
    height: "max-content",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "10px",
    bgcolor: "#DAF1FF",
    p: 2.5,
    borderRadius: "0 0 18px 18px",
  },
  input: {
    width: "100%",
    borderRadius: 1,
    bgcolor: "#f9f9f9",
    outline: "none",
    minHeight: 40,
    maxHeight: 100,
    overflowY: "auto",
    color: "#2C609F",
    fontSize: "14px",
    padding: "10px",
  },
  placeholder: {
    position: "absolute",
    top: "48%",
    left: "12px",
    transform: "translateY(-50%)",
    color: "gray",
    pointerEvents: "none",
    fontSize: "14px",
  },
  btn: {
    ...flexCenter,
    bgcolor: "var(--primary-color)",
    minWidth: "40px",
    height: "40px",
    borderRadius: "50%",
    ":hover": { bgcolor: "var(--primary-color)" },
    padding: "0",
  },
  icon: { color: "var(--white)", fontSize: "20px", marginLeft: "-4px" },
};

const chatInput = {
  width: "100%",
  borderRadius: 1,
  bgcolor: "#c2deff",
  outline: "none",
  minHeight: 40,
  maxHeight: 100,
  overflowY: "auto",
  color: "var(--secondary-color)",
  fontSize: "14px",
  padding: "10px",
  border: "1px solid var(--secondary-color)",
};

export const isPdf = (url) => {
  if (!url) return false;

  if (url instanceof File) {
    return url.type === "application/pdf";
  }

  if (typeof url === "string") {
    return url.endsWith(".pdf") || url.includes(".pdf");
  }

  return false;
};

const audioBtn = {
  minWidth: "20px",
  color: "#3C4258",
  fontSize: "11px",
  height: "20px",
  width: "15px",
  p: 0,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  lineHeight: "0",
  textTransform: "capitalize",
};

const playPauseBtn = {
  ...chatBox.btn,
  minWidth: "30px",
  height: "30px",
  bgcolor: "#c2deff",
  ":hover": { bgcolor: "#c2deff" },
};

export default ChatHistory;
