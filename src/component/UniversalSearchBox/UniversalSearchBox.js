import {
  Box,
  CircularProgress,
  ClickAwayListener,
  Collapse,
  IconButton,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";
import NotFound from "../NotFound/NoFound";
import BookingCard from "./BookingCard";
import DepositCard from "./DepositCard";
import MobileHeader from "../MobileHeader/MobileHeader";
import useWindowSize from "../../shared/common/useWindowSize";

const UniversalSearchBox = ({ agentData }) => {
  const { jsonHeader } = useAuth();
  const { isMobile } = useWindowSize();
  const [searchValue, setSearchValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchValue(inputValue);
  };

  const handleClickAway = () => {
    setOpen(false);
    setSearchValue("");
    setInputValue("");
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["search", searchValue],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v1/user/universal-search/${searchValue}`,
        jsonHeader()
      );

      if (data?.data?.length === 1) {
        setOpen(false);
        data?.data?.forEach((item) => {
          if (item?.type?.toLowerCase() === "booking") {
            navigate(
              `/dashboard/booking/airtickets/${item?.data?.status}/${item?.data?.id}`,
              {
                state: { agentData: agentData?.userAccess },
              }
            );
            return;
          } else if (item?.type?.toLowerCase() === "deposit") {
            navigate("/dashboard/depositDetails", {
              state: {
                id: item?.data?.id,
                depositType: item?.data?.depositType,
              },
            });
            return;
          } else if (item?.type?.toLowerCase() === "ledger") {
            if (item?.data?.transactionType?.toLowerCase() === "deposit") {
              navigate("/dashboard/depositDetails", {
                state: {
                  id: item?.data?.ledgerRecord?.id,
                  depositType: item?.data?.ledgerRecord?.type,
                },
              });
              return;
            } else {
              navigate(
                `/dashboard/booking/airtickets/${item?.data?.status ?? "all"}/${item?.data?.ledgerRecord?.id}`,
                {
                  state: { agentData: agentData?.userAccess },
                }
              );
              return;
            }
          }
        });
      } else if (data?.data?.length === 0) {
        setOpen(true);
      } else {
        setOpen(true);
      }
      return data?.data;
    },
    enabled: !!searchValue,
    cacheTime: 0,
    staleTime: 0,
  });

  useEffect(() => {
    if (!inputValue) {
      setOpen(false);
      setSearchValue("");
    }
  }, [inputValue]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box sx={{ position: "relative" }}>
        {isMobile && (
          <MobileHeader
            title={"Search"}
            labelType="search"
            labelValue={""}
            inputValue={inputValue}
            onInputChange={handleInputChange}
            onSearch={handleSearch}
            isLoading={isLoading}
          />
        )}
        {!isMobile && (
          <Box
            sx={{
              position: "relative",
              bgcolor: "#F3F3F3",
              border: "1px solid var(--border)",
              borderRadius: "3px",
            }}
          >
            <form onSubmit={handleSearch}>
              <input
                name="searhInput"
                autoComplete="off"
                placeholder="Search By PNR/Name/Ticket No/Ref No"
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
                }}
                onChange={(e) => setInputValue(e.target.value)}
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
            </form>
          </Box>
        )}
        <Collapse
          in={
            (data?.length === 0 && inputValue && open) ||
            (open && data?.length > 1 && inputValue)
          }
        >
          <Box
            sx={{
              position: "absolute",
              top: "105%",
              left: "0",
              border: isMobile ? "" : "1px solid var(--border)",
              width: isMobile ? "90%" : "100%",
              height: isMobile ? "80vh" : "305px",
              bgcolor: "var(--white)",
              boxShadow: isMobile
                ? "none"
                : "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              borderRadius: "5px",
              zIndex: 100,
              py: 2,
              px: 2.5,
              overflowY: "auto",
              mt: isMobile && 1,
              ml: isMobile && "5%",
            }}
          >
            {!isLoading && data?.length > 0 ? (
              data?.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    borderBottom: "1px solid var(--border)",
                    py: 2,
                    pt: index === 0 ? 0 : 2,
                  }}
                >
                  {item?.type?.toLowerCase() === "booking" && (
                    <BookingCard
                      item={item}
                      agentData={agentData}
                      setOpen={setOpen}
                      inputValue={inputValue}
                    />
                  )}
                  {item?.type?.toLowerCase() === "deposit" && (
                    <DepositCard item={item} />
                  )}
                </Box>
              ))
            ) : (
              <NotFound
                label="No Search Data Found Based On Search Key"
                message=""
                fontSize="0.85rem"
              />
            )}
          </Box>
        </Collapse>
      </Box>
    </ClickAwayListener>
  );
};

export default UniversalSearchBox;
