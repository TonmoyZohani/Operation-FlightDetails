import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  // Select,
  Typography,
} from "@mui/material";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const MobileHeader = ({
  title,
  subTitle,
  labelType = "title",
  labelValue,
  options = [],
  isLoading = false,
  onSearch = () => {},
  onChange = () => {},
  onInputChange = () => {},
  inputValue = "",
}) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: "100%",
        height: "120px",
        bgcolor: "var(--secondary-color)",
        position: "sticky",
        top: 0,
        zIndex: 100,
        display: {
          xs: "block",
          lg: "none",
        },
        mb: 2,
        px: "5px",
      }}
    >
      <Box
        sx={{
          width: "90%",
          height: "100%",
          mx: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <ArrowBackIosIcon
          onClick={() => navigate(-1)}
          sx={{ fontSize: "1.5rem", color: "#FFFFFF" }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: "17px", color: "var(--white)" }}>
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: "12px",
              color: "var(--gray)",
              mt: "4px",
              textTransform: "capitalize",
            }}
          >
            {subTitle}
          </Typography>
        </Box>
        <SearchIcon
          onClick={() => navigate("/dashboard/searchs")}
          sx={{ fontSize: "25px", color: "var(--white)" }}
        />
      </Box>

      <Box
        sx={{
          width: "90%",
          position: "absolute",
          bottom: "-20px",
          left: "5%",
        }}
      >
        {labelType === "title" ? (
          <Box
            sx={{
              borderRadius: "4px",
              bgcolor: "var(--primary-color)",
              px: "16px",
              display: "flex",
              alignItems: "center",
              height: "42px",
            }}
          >
            <Typography
              sx={{
                color: "white",
                textTransform: "uppercase",
                fontSize: "14px",
              }}
            >
              {labelValue}
            </Typography>
          </Box>
        ) : labelType === "search" ? (
          <form onSubmit={onSearch}>
            <Box sx={{ position: "relative" }}>
              <input
                name="searchInput"
                autoComplete="off"
                placeholder="Search..."
                className="search"
                value={inputValue}
                style={{
                  paddingLeft: "15px",
                  width: "100%",
                  outline: "none",
                  border: "none",
                  fontSize: "12px",
                  height: "40px",
                  borderRadius: "3px",
                  textTransform: "uppercase",
                  // backgroundColor: "var(--primary-color)",
                }}
                onChange={onInputChange}
              />
              <IconButton
                type="submit"
                sx={{
                  position: "absolute",
                  right: 0,
                  top: "50%",
                  transform: "translateY(-50%)",
                  borderRadius: "0 3px 3px 0",
                  height: "100%",
                  zIndex: 10,
                  bgcolor: inputValue ? "var(--black)" : "",
                  ":hover": {
                    bgcolor: inputValue ? "var(--black)" : "",
                  },
                }}
              >
                {isLoading ? (
                  <CircularProgress
                    size={15}
                    sx={{ color: inputValue ? "white" : "#4678A6" }}
                  />
                ) : (
                  <FaSearch
                    style={{
                      color: inputValue ? "white" : "#4678A6",
                      fontSize: "15px",
                    }}
                  />
                )}
              </IconButton>
            </Box>
          </form>
        ) : (
          <Box
            sx={{
              ".MuiOutlinedInput-notchedOutline": { border: "none" },
            }}
          >
            {/* <Select
              value={labelValue}
              onChange={onChange}
              displayEmpty
              inputProps={{ "aria-label": "Select Type" }}
              sx={{
                bgcolor: "var(--primary-color)",
                color: "white",
                textAlign: "left",
                height: "40px",
                textTransform: "uppercase",
                fontSize: "14px",
                width: "100%",
                "&:focus": {
                  outline: "none",
                },
                "& .MuiSelect-icon": {
                  color: "white",
                },
              }}
              MenuProps={{
                disableScrollLock: true,
                PaperProps: { sx: { maxHeight: "200px", overflowY: "auto" } },
              }}
            >
              {options.map((option, i) => (
                <MenuItem
                  key={i}
                  value={option}
                  sx={{ textTransform: "capitalize" }}
                >
                  {option}
                </MenuItem>
              ))}
                </Select> */}

            <Select
              options={options}
              value={labelValue}
              onChange={
                onChange
                //     (select) =>
                // navigate(
                //   `/dashboard/generalreport/${select?.value
                //     ?.split(" ")
                //     ?.join("-")}`
                // )
              }
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  backgroundColor: "var(--primary-color)",
                  color: "white",
                  boxShadow: "none",
                  border: "none",
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: "#fff",
                  fontSize: "12px",
                }),
                option: (provided, state) => ({
                  ...provided,
                  color: state.isSelected ? "white" : "#555",
                  fontSize: "12px",
                }),
                menuList: (provided) => ({
                  ...provided,
                  maxHeight: "150px",
                  overflowY: "auto",
                  "::-webkit-scrollbar": {
                    width: "2px !important",
                  },
                }),
              }}
              isSearchable={false}
              components={{
                IndicatorSeparator: null,
                DropdownIndicator: null,
              }}
            ></Select>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MobileHeader;
