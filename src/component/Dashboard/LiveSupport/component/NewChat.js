import { Box, Button, Skeleton, Typography } from "@mui/material";
import Select from "react-select";
import { IoMdExpand } from "react-icons/io";
import { FiMinus } from "react-icons/fi";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  boxContainer,
  iconBox,
  labelStyle,
  titleBoxContainer,
} from "../LiveSupport";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../../context/AuthProvider";
import { useState } from "react";
import useToast from "../../../../hook/useToast";
import CustomToast from "../../../Alert/CustomToast";

const NewChat = ({ setId, setOpen }) => {
  const { jsonHeader, formDataHeader } = useAuth();
  const { openToast, message, severity, showToast, handleCloseToast } =
    useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState({
    type: "",
    subType: "",
    subject: "",
    message: "",
    allSubjects: [],
  });

  const { data: allPlatform, status } = useQuery({
    queryKey: ["allPlatform"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/support-ticket/type`,
        jsonHeader()
      );
      return data;
    },
  });

  const handleChangePlatform = (value) => {
    setSelectedPlatform({
      ...selectedPlatform,
      type: value?.value,
      subject: "",
      allSubjects: value?.subjects,
    });
  };

  const handleChangeSubType = (value) => {
    setSelectedPlatform({ ...selectedPlatform, subType: value });
  };

  const handleChangeSubject = (value) => {
    setSelectedPlatform({ ...selectedPlatform, subject: value });
  };

  const handleCreateSupport = async () => {
    setIsLoading(true);

    const { allSubjects, ...rest } = selectedPlatform;

    const formData = new FormData();

    for (const key of Object.keys(rest)) {
      formData.append(key, rest[key]);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/support-ticket`,
        formData,
        formDataHeader()
      );

      if (response?.data?.success) {
        setId(1);
        // setId(2);
      }
    } catch (e) {
      showToast(e?.response?.data?.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const { subType, ...rest } = selectedPlatform;
  const checkObj = selectedPlatform?.type === "Air" ? selectedPlatform : rest;

  const isDisabled =
    isLoading || Object.keys(rest).some((item) => !!checkObj[item] === false);

  return (
    <Box sx={boxContainer}>
      <Box>
        <Box sx={titleBoxContainer}>
          <Box>
            <Typography sx={labelStyle}>Fly Far International</Typography>
            <Typography sx={{ ...labelStyle, fontSize: "12px" }}>
              Create Your Support Chat
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
            <Box sx={{ ...iconBox, bgcolor: "var(--secondary-color)" }}>
              <IoMdExpand style={{ color: "var(--white)", fontSize: "18px" }} />
            </Box>
            <Box onClick={() => setOpen(false)} sx={iconBox}>
              <FiMinus style={{ color: "var(--white)", fontSize: "22px" }} />
            </Box>
          </Box>
        </Box>

        <Box px={2.5}>
          <Typography sx={{ ...labelStyle, color: "#4D4B4B", mt: 1 }}>
            Platform
          </Typography>
          <Select
            value={allPlatform?.data.find(
              (option) => option.value === selectedPlatform.type
            )}
            options={
              status === "success"
                ? allPlatform?.data.map((item) => ({
                    value: item?.platform,
                    label: item?.platform,
                    subjects: item?.types,
                  }))
                : Array.from({ length: 3 }).map(() => LoadingOption())
            }
            placeholder={<Typography>Select Support Platform</Typography>}
            {...selectProps}
            onChange={(value) => handleChangePlatform(value)}
            components={{ DropdownIndicator: null }}
            isLoading={status !== "success"}
          />

          {selectedPlatform?.allSubjects.length > 0 && status === "success" ? (
            <>
              <Typography sx={{ ...labelStyle, color: "#4D4B4B", mt: 1 }}>
                Type
              </Typography>
              <Select
                value={selectedPlatform?.allSubjects.find(
                  (option) => option.value === selectedPlatform.subject
                )}
                options={selectedPlatform?.allSubjects?.map((item) => ({
                  value: item?.subject,
                  label: item?.subject,
                }))}
                placeholder={<Typography>Select Type</Typography>}
                {...selectProps}
                onChange={(value) => handleChangeSubType(value?.value)}
                components={{ DropdownIndicator: null }}
                isLoading={status !== "success"}
              />
            </>
          ) : (
            ""
          )}

          <Typography sx={{ ...labelStyle, color: "#4D4B4B", mt: 1 }}>
            Subject
          </Typography>
          <input
            value={selectedPlatform.subject}
            onChange={(e) => handleChangeSubject(e.target.value)}
            type="text"
            style={inputStyle}
            placeholder="Enter Subject"
          />

          <Typography sx={{ ...labelStyle, color: "#4D4B4B", mt: 1 }}>
            Query
          </Typography>
          <textarea
            onChange={(e) =>
              setSelectedPlatform({
                ...selectedPlatform,
                message: e?.target?.value,
              })
            }
            style={{ ...inputStyle, resize: "none", height: "150px" }}
            placeholder="Write Your Query"
          />
        </Box>
      </Box>

      <Box sx={{ p: 2.5, width: "100%" }}>
        <Button
          disabled={isDisabled}
          onClick={() => handleCreateSupport()}
          sx={{
            textTransform: "capitalize",
            py: 1,
            bgcolor: "var(--primary-color)",
            ":hover": { bgcolor: "var(--primary-color)" },
            color: "white",
            width: "100%",
          }}
        >
          {isLoading ? "Please Wait ..." : "Start Chatting"}
        </Button>
      </Box>

      <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
      />
    </Box>
  );
};

const selectStyle = {
  option: (provided, state) => {
    return {
      ...provided,
      margin: "0px",
      padding: "5px 8px",
      cursor: "pointer",
      fontSize: "14px",
      backgroundColor: "none",
      textTransform: "capitalize",
      color: state?.isSelected ? "var(--secondary-color)" : "#000000de",
      fontWeight: state?.isSelected ? "500" : "400",
    };
  },

  control: (provided) => {
    return {
      ...provided,
      boxShadow: "none",
      display: "flex",
      cursor: "pointer",
      fontSize: "14px",
      padding: "0px",
      minHeight: "37px",
      backgroundColor: "#ffffff",
      marginTop: "4px",
      border: "1px solid hsla(0, 0%, 0%, 0.1)",
      "&:hover": { border: "1px solid hsla(0, 0%, 0%, 0.1)" },
      borderRadius: "4px",
    };
  },
  indicatorSeparator: () => null,
  menuList: (provided) => {
    return {
      ...provided,
      maxHeight: "150px",
      "::-webkit-scrollbar": { width: "0px", height: "0px" },
      "::-webkit-scrollbar-track": { background: "#e9f7ff" },
      "::-webkit-scrollbar-thumb": { background: "#e9f7ff" },
      padding: "0px",
    };
  },

  menu: (provided) => {
    return {
      ...provided,
      borderRadius: "4px",
      overflow: "auto",
      marginTop: "8px",
      border: "1px solid hsla(0, 0%, 0%, 0.1)",
      boxShadow: "none",
    };
  },

  singleValue: (provided) => ({ ...provided, textTransform: "capitalize" }),
};

const selectProps = {
  isSearchable: false,
  styles: selectStyle,
  inputProps: { autoComplete: "off" },
};

const inputStyle = {
  border: "1px solid var(--border)",
  height: "37px",
  width: "100%",
  borderRadius: "4px",
  padding: "3px 10px",
  backgroundColor: "white",
  outline: "none",
  marginTop: "4px",
};

const LoadingOption = () => ({
  label: (
    <Skeleton
      variant="rectangular"
      width="100%"
      height={19}
      animation="wave"
      style={{ marginBottom: 2, marginTop: 2 }}
    />
  ),
  value: "loading",
  isDisabled: true,
});

export default NewChat;
