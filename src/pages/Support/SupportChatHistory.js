import { Box, Button, Grid, Typography } from "@mui/material";
import { FaPaperPlane } from "react-icons/fa";
import AddIcon from "@mui/icons-material/Add";
import moment from "moment/moment";
import { useState, useRef, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import PageTitle from "../../shared/common/PageTitle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import { iconBox } from "../../component/Dashboard/LiveSupport/LiveSupport";
import {
  chatBox,
  ChatLoader,
  SelectedChatImage,
} from "../../component/Dashboard/LiveSupport/component/ChatHistory";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthProvider";
import axios from "axios";
import { textToLogo } from "../../shared/common/functions";
const SupportChatHistory = () => {
  const location = useLocation();
  const queryClient = useQueryClient();
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { jsonHeader, formDataHeader } = useAuth();
  const navigate = useNavigate();
  const { title, roomId } = location?.state;
  const attachmentRef = useRef([]);
  const [isEmpty, setIsEmpty] = useState(true);
  const [attachment, setAttachment] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allConversation, setAllConversation] = useState([]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();

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

    inputRef?.current.addEventListener("input", handleInput);
    inputRef?.current.addEventListener("keydown", handleKeyDown);

    return () => {
      inputRef?.current?.removeEventListener("input", handleInput);
      inputRef?.current?.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const { status: conversationStatus, isFetching } = useQuery({
    queryKey: ["support/ticket/conversation", roomId],
    queryFn: async () => {
      const queryParams = new URLSearchParams({ page: 1, limit: 20 });

      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/support-ticket/conversation/${roomId}?${queryParams}`,
        jsonHeader()
      );

      setAllConversation([
        ...data?.data?.filter((m) => m?.textType === "text")?.reverse(),
      ]);

      return [...data?.data?.filter((m) => m?.textType === "text")?.reverse()];
    },
    enabled: !!roomId,
    retry: false,
  });

  const { data: allParticipant, status: participantStatus } = useQuery({
    queryKey: ["support/ticket/participant", roomId],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/support-ticket/participant/${roomId}`,
        jsonHeader()
      );
      return data;
    },
    enabled: !!roomId,
    retry: false,
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [allConversation]);

  const handleSubmitMessage = async () => {
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

    setIsLoading(true);

    const crrUser = convData?.find((c) => c?.senderType === "user");

    const latestMessage = {
      attachments: attachment?.length > 0 ? attachment : [],
      sender: crrUser?.sender,
      senderType: "user",
      sl: allConversation[allConversation?.length - 1]?.sl + 1,
      text: message,
      textType: "text",
      updatedAt: new Date(),
    };

    setAllConversation([...allConversation, latestMessage]);

    const formData = new FormData();
    formData.append("message", message);
    attachment.forEach((file) => {
      formData.append("attachments", file);
    });

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/support-ticket/reply/${roomId}`,
        formData,
        formDataHeader()
      );

      setAttachment([]);

      if (data?.success) {
        queryClient.invalidateQueries({
          queryKey: ["support-ticket/conversation", roomId],
        });
      }
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box>
      <PageTitle title={"Support Management"} type={"dataGrid"} />

      <Box sx={{ height: "calc(100vh - 220px)" }}>
        <Box
          sx={{
            p: 2.5,
            bgcolor: "white",
            borderRadius: "5px",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box sx={{ flexGrow: 1, height: "400px", overflowY: "auto" }}>
            {conversationStatus === "pending" ||
            participantStatus === "pending" ? (
              <ChatLoader />
            ) : conversationStatus === "success" &&
              participantStatus === "success" ? (
              allConversation?.map((message, i, arr) => {
                const participant =
                  allParticipant?.data[message?.sender?.participantUserId];

                const messageTime = moment(message?.updatedAt).format(
                  "hh:mm A"
                );

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
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent:
                        message?.senderType === "user" ? "end" : "start",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        gap: "10px",
                        mb: 2,
                        flexDirection:
                          message?.senderType === "user"
                            ? "row-reverse"
                            : "row",
                      }}
                    >
                      <Box
                        sx={{
                          bgcolor:
                            participant?.participantType === "admin"
                              ? "var(--primary-color)"
                              : "var(--secondary-color)",
                          height: "40px",
                          width: "40px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "white",
                          visibility:
                            msjTimeDifference > 120 ? "visible" : "hidden",
                        }}
                      >
                        <Typography sx={{ fontWeight: 500, fontSize: "20px" }}>
                          {/* {participant?.participantType === "admin"
                            ? textToLogo("Fly Far International")
                            : textToLogo(participant?.info?.agencyName)} */}
                        </Typography>
                      </Box>

                      <Box>
                        <Typography
                          sx={{
                            fontSize: "12px",
                            color: "#3C4258",
                            textAlign:
                              message?.senderType === "user" ? "end" : "start",
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
                            width:
                              message?.attachments?.length > 0
                                ? "200px"
                                : "max-content",
                            maxWidth: "200px",
                          }}
                        >
                          {message?.attachments?.length > 0 && (
                            <Grid container spacing={"4px"} mt={0}>
                              {message?.attachments?.map((image, i, arr) => {
                                return (
                                  <Grid
                                    item
                                    md={arr.length > 1 ? 6 : 12}
                                    key={i}
                                    sx={{
                                      display: i > 3 ? "none" : "block",
                                    }}
                                  >
                                    <Box
                                      sx={{
                                        position: "relative",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {isPdf(image?.attachment) ? (
                                        <iframe
                                          key={i}
                                          src={
                                            image?.attachment instanceof File
                                              ? URL.createObjectURL(
                                                  image.attachment
                                                )
                                              : image.attachment
                                          }
                                          title="PDF Preview"
                                          width="100%"
                                          height={
                                            arr.length > 1 ? "80px" : "160px"
                                          }
                                        ></iframe>
                                      ) : (
                                        <img
                                          key={i}
                                          style={{
                                            width: "100%",
                                            height:
                                              arr.length > 1 ? "80px" : "160px",
                                            borderRadius: "5px",
                                            objectFit: "cover",
                                          }}
                                          src={
                                            image?.attachment instanceof File
                                              ? URL.createObjectURL(
                                                  image.attachment
                                                )
                                              : image?.attachment
                                          }
                                          alt="attachment"
                                          onLoad={(e) => {
                                            if (
                                              image?.attachment instanceof File
                                            ) {
                                              URL.revokeObjectURL(e.target.src);
                                            }
                                          }}
                                        />
                                      )}
                                      {i === 3 && (
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
                                  </Grid>
                                );
                              })}
                            </Grid>
                          )}

                          {message?.textType === "text" && (
                            <Typography
                              wrap
                              sx={{
                                fontSize: "13px",
                                color: "var(--secondary-color)",
                                wordWrap: "break-word",
                                whiteSpace: "pre-wrap",
                                overflowWrap: "break-word",
                              }}
                            >
                              {message?.text} {}
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
                            {/* {(isLoading || isFetching) && i === arr.length - 1
                                      ? "Sending..."
                                      : messageDateTime}{" "} */}
                            {/* <span style={{ color: "var(--primary-color)" }}>
                                            Edited{" "}
                                          </span> */}
                            {messageDateTime}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                );
              })
            ) : (
              "An error occurred"
            )}

            <div ref={messagesEndRef} />
          </Box>

          {attachment?.length > 0 && (
            <Box sx={{ pt: 2, px: 2.5, bgcolor: "#DAF1FF" }}>
              <SelectedChatImage
                allImages={attachment}
                handleClose={() => setAttachment([])}
                handleRemoveImg={(imgIndex) =>
                  setAttachment(attachment.filter((_, i) => i !== imgIndex))
                }
              />
            </Box>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitMessage();
            }}
          >
            <Box sx={{ ...chatBox?.container, borderRadius: "0" }}>
              <label
                htmlFor="attachment"
                style={{ ...flexCenter, height: "40px", cursor: "pointer" }}
              >
                <AddIcon sx={{ color: "var(--secondary-color)" }} />
                <input
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      attachmentRef.current = [
                        ...attachmentRef.current,
                        { attachment: file },
                      ];
                      setAttachment((prev) => [...prev, { attachment: file }]);
                      e.target.value = null;
                    }
                  }}
                  id={"attachment"}
                  style={{ display: "none" }}
                  type="file"
                  name={"attachment"}
                  accept=".jpg,.jpeg,.png,.pdf,.webp"
                />
              </label>

              <Box sx={{ position: "relative", width: "90%" }}>
                <Box
                  ref={inputRef}
                  contentEditable="true"
                  translate="no"
                  sx={chatBox?.input}
                  id="prompt-textarea"
                  data-virtualkeyboard="true"
                />
                {isEmpty && (
                  <Box sx={chatBox?.placeholder}>Type a message...</Box>
                )}
              </Box>
              <Button
                // disabled={!message}
                // onClick={() => handleSubmitMessage()}
                sx={chatBox?.btn}
                type="submit"
              >
                <FaPaperPlane style={{ ...chatBox?.icon, color: "white" }} />
              </Button>
            </Box>
          </form>
        </Box>
      </Box>
    </Box>
  );
};

const isPdf = (url) => {
  if (!url) return false;

  if (url instanceof File) {
    return url.type === "application/pdf";
  }

  if (typeof url === "string") {
    return url.endsWith(".pdf") || url.includes(".pdf");
  }

  return false;
};

const flexCenter = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default SupportChatHistory;
