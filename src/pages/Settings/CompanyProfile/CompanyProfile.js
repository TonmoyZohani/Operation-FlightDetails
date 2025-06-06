import { Box, Button, Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { Rings } from "react-loader-spinner";
import { useOutletContext } from "react-router-dom";
import ServerError from "../../../component/Error/ServerError";
import MobileHeader from "../../../component/MobileHeader/MobileHeader";
import { useAuth } from "../../../context/AuthProvider";
import { convertCamelToTitle } from "../../../shared/common/functions";
import PageTitle from "../../../shared/common/PageTitle";
import { hasValueAbleAgentUpdateData } from "../../../utils/hasValueableAgentUpdateData";
import CompanyAgencyDocs from "./components/CompanyAgencyDocs";
import CompanyAgencyInfo from "./components/CompanyAgencyInfo";
import CompanyConcernInfo from "./components/CompanyConcernInfo";
import CompanyGeneralInfo from "./components/CompanyGeneralInfo";
import CompanyOwnerDocs from "./components/CompanyOwnerDocs";
import UpdateRequest from "./components/UpdateRequest";
// import NewPartnerRequest from "./components/NewPartnerRequest";

const CompanyProfile = () => {
  const isUpdatedDataEmpty = (updatedData) =>
    isEmptyObject(updatedData?.agencyInformation?.documents) &&
    isEmptyObject(updatedData?.agencyInformation?.certificates) &&
    isEmptyObject(updatedData?.ownerDocuments) &&
    isEmptyObject(updatedData?.concernPerson) &&
    Array.isArray(updatedData?.partners) &&
    updatedData?.partners.length === 0 &&
    (!updatedData?.whatsappNumber || updatedData?.whatsappNumber.trim() === "");

  const isEmptyObject = (obj) => {
    return obj && Object.keys(obj).length === 0 && obj.constructor === Object;
  };

  const [allTabsBase, setAllTabBase] = useState([
    "General Information",
    "Owner Documents",
    "Agency Information",
    "Agency Documents",
    "Concern Information",
  ]);
  const [activeTab, setActiveTab] = useState("GeneralInformation");
  const { jsonHeader } = useAuth();
  const [agentProfile, setAgentProfile] = useState(null);
  const { agentData } = useOutletContext();

  const {
    data: companyInformation,
    status,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["companyInformation"],
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/v2/agent-account/profile`,
        jsonHeader()
      );
      setAgentProfile(data?.data);

      const result = isUpdatedDataEmpty(data?.data?.updatedData) ? true : false;

      if (!result && !allTabsBase.includes("Update Request")) {
        setAllTabBase((prevTabs) => [...prevTabs, "Update Request"]);
      }

      return data?.data;
    },
  });

  /**
   *       `${agencyType === "limited" ? "Directors" : agencyType === "proprietorship" ? "Proprietor" : "Partner"} Documents`,
   *
   *
   */
  const hasUpdateRequest = hasValueAbleAgentUpdateData(
    agentProfile?.unverifiedAgent
  );

  const hasNewRequestPartner =
    agentProfile?.newRequestPartner &&
    agentProfile?.newRequestPartner?.length > 0
      ? true
      : false;

  const allTabs =
    hasUpdateRequest || hasNewRequestPartner
      ? [...allTabsBase, "Update Request"]
      : allTabsBase;

  return status === "pending" && !agentProfile ? (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="80vh"
      bgcolor="var(--white)"
    >
      <Rings
        visible={true}
        height="100"
        width="100"
        color="#dc143c"
        ariaLabel="rings-loading"
        wrapperStyle={{}}
        wrapperClass=""
        animationDuration={0.1}
      />
    </Box>
  ) : (
    status === "success" && agentProfile && (
      <Box sx={{ borderRadius: "10px" }}>
        <PageTitle title={"Company Profile"} />
        {isError ? (
          <Box
            sx={{
              bgcolor: "white",
              height: "calc(93vh - 150px)",
              borderRadius: "5px",
            }}
          >
            <ServerError message={error?.response?.data?.message} />
          </Box>
        ) : (
          <Box>
            <MobileHeader
              title={"Company Profile"}
              subTitle={convertCamelToTitle(activeTab)}
              labelValue={activeTab}
              labelType={"select"}
              options={allTabs?.map((tab) => tab?.replace(/\s+/g, ""))}
              onChange={(e) => setActiveTab(e.target.value)}
            />
            <Box
              sx={{
                p: {
                  xs: 3,
                },
                bgcolor: "white",
                width: {
                  xs: "90%",
                  lg: "100%",
                },
                mx: "auto",
                mt: {
                  xs: 5,
                  lg: 0,
                },
              }}
            >
              <Box sx={{ display: "flex", gap: "15px" }}>
                <Box
                  sx={{
                    height: "40px",
                    width: "40px",
                    bgcolor: "var(--primary-color)",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "20px",
                    color: "white",
                  }}
                >
                  {
                    agentProfile?.currentData?.agencyInformation?.agencyName?.split(
                      ""
                    )[0]
                  }
                </Box>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "1.2rem",
                      fontWeight: "500",
                      lineHeight: "1",
                    }}
                  >
                    {agentProfile?.currentData?.agencyInformation?.agencyName}
                  </Typography>
                  <Typography>
                    {" "}
                    {agentProfile?.currentData?.nationality}
                  </Typography>
                </Box>
              </Box>

              {/* Tab bar */}
              <Grid
                container
                sx={{
                  mt: 2,
                  display: {
                    xs: "none",
                    lg: "flex",
                  },
                }}
              >
                <Grid item xs={0} lg={12}>
                  <Box
                    sx={{
                      bgcolor: "#F0F2F5",
                      borderRadius: "30px",
                      display: "flex",
                    }}
                  >
                    {allTabs?.map((tab, i) => {
                      return (
                        <Button
                          key={i}
                          onClick={() => {
                            setActiveTab(tab.replace(/\s+/g, ""));
                          }}
                          sx={{
                            bgcolor:
                              activeTab === tab.replace(/\s+/g, "")
                                ? "var(--secondary-color)"
                                : "none",
                            ":hover": {
                              bgcolor:
                                activeTab === tab.replace(/\s+/g, "")
                                  ? "var(--secondary-color)"
                                  : "transparent",
                            },
                            borderRadius: "30px",
                            textTransform: "capitalize",
                            width: "100%",
                            color:
                              activeTab === tab.replace(/\s+/g, "")
                                ? "white"
                                : "var(--dark-gray)",
                            fontSize: "13px",
                            display:
                              (companyInformation?.agencyInformation
                                ?.agencyType === "limited" ||
                                companyInformation?.agencyInformation
                                  ?.agencyType === "proprietorship") &&
                              tab === "Owner Information"
                                ? "none"
                                : "block",
                          }}
                        >
                          {tab === "Owner Documents"
                            ? `${
                                companyInformation?.currentData
                                  ?.agencyInformation?.agencyType === "limited"
                                  ? "Directors"
                                  : companyInformation?.currentData
                                        ?.agencyInformation?.agencyType ===
                                      "proprietorship"
                                    ? "Proprietor"
                                    : "Partner"
                              } Documents`
                            : tab}
                        </Button>
                      );
                    })}
                  </Box>
                </Grid>
              </Grid>

              {/* Content */}
              {activeTab === "GeneralInformation" && (
                <CompanyGeneralInfo
                  agentProfile={agentProfile}
                  setAgentProfile={setAgentProfile}
                  refetch={refetch}
                  isEditable={
                    agentData?.userAccess?.companyProfile?.operations
                      ?.updateCompanyProfile
                  }
                />
              )}
              {activeTab === "OwnerDocuments" && (
                <CompanyOwnerDocs
                  agentProfile={agentProfile}
                  setAgentProfile={setAgentProfile}
                  refetch={refetch}
                  isEditable={
                    agentData?.userAccess?.companyProfile?.operations
                      ?.updateCompanyProfile
                  }
                />
              )}
              {activeTab === "AgencyInformation" && (
                <CompanyAgencyInfo
                  agentProfile={agentProfile}
                  refetch={refetch}
                  setAgentProfile={setAgentProfile}
                  isEditable={
                    agentData?.userAccess?.companyProfile?.operations
                      ?.updateCompanyProfile
                  }
                />
              )}
              {activeTab === "AgencyDocuments" && (
                <CompanyAgencyDocs
                  agentProfile={agentProfile}
                  refetch={refetch}
                  isEditable={
                    agentData?.userAccess?.companyProfile?.operations
                      ?.updateCompanyProfile
                  }
                />
              )}
              {activeTab === "ConcernInformation" && (
                <CompanyConcernInfo
                  agentProfile={agentProfile}
                  refetch={refetch}
                  isEditable={
                    agentData?.userAccess?.companyProfile?.operations
                      ?.updateCompanyProfile
                  }
                />
              )}
              {activeTab === "UpdateRequest" && (
                <UpdateRequest
                  currentData={agentProfile?.currentData}
                  updatedData={agentProfile?.updatedData}
                />
              )}
            </Box>
          </Box>
        )}
      </Box>
    )
  );
};

export default CompanyProfile;
