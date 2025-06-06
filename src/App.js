import { Box } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { onMessage } from "firebase/messaging";
import React, { Suspense, useEffect } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";
import "./App.css";
import Authentication from "./component/Accounts/Authentication.js";
import DepositDetails from "./component/Accounts/Deposit/DepositDetails.js";
import NoInternet from "./component/Alert/NoInternet.js";
import SharePnrRetrive from "./component/AllBookings/SharePnrRetrive.js";
import Loader from "./component/Loader/Loader.js";
import Logout from "./component/Logout/Logout.js";
import AddBankAccount from "./component/Manage/AddBankAccount.js";
import ClientProfile from "./component/Manage/ClientProfile.js";
import MyBankAccount from "./component/Manage/MyBankAccount.js";
import UserProfile from "./component/Manage/UserProfile.js";
import { useAuth } from "./context/AuthProvider.js";
import { getMessagingInstance } from "./firebase.config.js";
import useOnlineStatus from "./hook/useOnlineStatus.js";
import SecondLayout from "./layout/SecondLayout.js";
import ActivityLog from "./pages/ActivityLog/ActivityLog.js";
import Ancillaries from "./pages/Ancillaries/Ancillaries.js";
import BalanceTransferDetails from "./pages/BalanceTransfer/BalanceTransferDetails.js";
import BookingDetails from "./pages/Bookings/AirBookings/BookingDetails.js";
import PostBookingOperations from "./pages/Bookings/AirBookings/PostBookingOperations.js";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage.js";
import NoticeDetails from "./pages/Notice/NoticeDetails.js";
import PaymentSuccess from "./pages/PaymentSuccess/PaymentSuccess.js";
import SearchHistoryReport from "./pages/Report/SearchHistoryReport.js";
import AddMarkup from "./pages/Settings/AddMarkup/AddMarkup.js";
import AddSMTP from "./pages/Settings/AddSMTP/AddSMTP.js";
import EmailConfiguration from "./pages/Settings/EmailConfiguration/EmailConfiguration.js";
import MarkupSetting from "./pages/Settings/MarkupSetting/MarkupSetting.js";
import AddStaff from "./pages/Staff/AddStaff.js";
import StaffAccess from "./pages/Staff/StaffAccess.js";
import StaffDetails from "./pages/Staff/StaffDetails.js";
import StaffOperations from "./pages/Staff/StaffOperations.js";
import SingleWing from "./pages/Wings/SingleWing.js";
import WingAccess from "./pages/Wings/WingAccess.js";
import WingManagement from "./pages/Wings/WingManagement.js";
import ProtectedRoute from "./ProtectedRoute.js";
import TestLogin from "./TestLogin.js";
import Test from "./Test.js";
import UniversalSearchBox from "./component/UniversalSearchBox/UniversalSearchBox.js";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ProfileConfiguration from "./component/Settings/UserProfile/ProfileConfiguration.js";

// page added lazy loading
const TourDetails = React.lazy(() => import("./pages/Tour/TourDetails.js"));
const TourAfterSearchPage = React.lazy(
  () => import("./pages/Tour/TourAfterSearchPage.js")
);

const VisaAfterSearchPage = React.lazy(
  () => import("./pages/Visa/VisaAfterSearchPage.js")
);
const HotelDetails = React.lazy(() => import("./pages/Hotel/HotelDetails.js"));
const HotelAfterSearchPage = React.lazy(
  () => import("./pages/Hotel/HotelAfterSearchPage.js")
);
const Career = React.lazy(() => import("./pages/Career/Career.js"));
const BlogDetails = React.lazy(
  () => import("./pages/BlogDetails/BlogDetails.js")
);
const NewsDetails = React.lazy(
  () => import("./pages/NewsDetails/NewsDetails.js")
);
const News = React.lazy(() => import("./pages/News/News.js"));
const Blog = React.lazy(() => import("./pages/Blog/Blog.js"));
const Aboutus = React.lazy(() => import("./pages/Aboutus/Aboutus.js"));
const PaymentMethod = React.lazy(
  () => import("./pages/PaymentMethod/PaymentMethod.js")
);
const Coverage = React.lazy(() => import("./pages/Coverage/Coverage.js"));
const Wings = React.lazy(() => import("./pages/Wings/Wings.js"));
const FAQ = React.lazy(() => import("./pages/FAQ/FAQ.js"));
const RefundCancelationPolicy = React.lazy(
  () => import("./pages/RefundCancelationPolicy/RefundCancelationPolicy.js")
);
const PrivacyPolicy = React.lazy(
  () => import("./pages/PrivacyPolicy/PrivacyPolicy.js")
);

const Home = React.lazy(() => import("./pages/Home/Home"));

const TermsAndConditions = React.lazy(
  () => import("./pages/TermsAndConditions/TermsAndConditions.js")
);
const DashboardHome = React.lazy(
  () => import("./component/Dashboard/DashboardHome")
);
const DashStatistics = React.lazy(
  () => import("./component/Dashboard/DashStatistics")
);
const OperationCalendar = React.lazy(
  () => import("./component/Dashboard/OperationCalendar.js")
);

const DashBranch = React.lazy(
  () => import("./component/Dashboard/DashboardBranch.js")
);
const RecentSearch = React.lazy(
  () => import("./component/SearchPage/RecentSearch")
);
const OnewayAfterSearch = React.lazy(
  () => import("./component/FlightAfterSearch/FlightAfterSearch.js")
);
const SplitAfterSearch = React.lazy(
  () => import("./pages/SplitAfterSearch/SplitAfterSearch.js")
);
const AirTicket = React.lazy(
  () => import("./component/AllBookings/AirTicket.js")
);
const Deposit = React.lazy(
  () => import("./component/Accounts/Deposit/Deposit.js")
);
const BalanceTransfer = React.lazy(
  () => import("./pages/BalanceTransfer/BalanceTransfer.js")
);
const AddBalanceTransfer = React.lazy(
  () => import("./pages/BalanceTransfer/AddBalanceTransfer.js")
);
const CompanyProfile = React.lazy(
  () => import("./pages/Settings/CompanyProfile/CompanyProfile.js")
);
const AddDeposit = React.lazy(
  () => import("./component/Accounts/Deposit/AddDeposit.js")
);
const AirBooking = React.lazy(
  () => import("./component/AirBooking/AirBooking.js")
);

const AddBranch = React.lazy(() => import("./component/Branch/AddBranch.js"));
const StaffManagement = React.lazy(
  () => import("./pages/Staff/StaffManagement.js")
);
const PendingOperation = React.lazy(
  () => import("./pages/PendingOperation/PendingOperation.js")
);
const SalesReport = React.lazy(
  () => import("./component/AllReports/SalesReport.js")
);

const GeneralReport = React.lazy(
  () => import("./component/AllReports/GeneralReport.js")
);

const Support = React.lazy(() => import("./pages/Support/Support.js"));
const SupportChatHistory = React.lazy(
  () => import("./pages/Support/SupportChatHistory.js")
);
const OTPcontrol = React.lazy(() => import("./pages/OTPcontrol/OTPcontrol.js"));
const DeviceControl = React.lazy(
  () => import("./pages/DeviceControl/DeviceControl.js")
);
const AddClient = React.lazy(
  () => import("./component/Manage/AddClient/AddClient.js")
);
const PartiallyDueTicket = React.lazy(
  () => import("./component/AllBookings/PartiallyDueTicket.js")
);
const BkashPayment = React.lazy(
  () => import("./pages/BkashPayment/BkashPayment.js")
);

function App() {
  const queryClient = useQueryClient();
  // const { openToast, message, severity, showToast, handleCloseToast } =
  //   useToast();
  const token = secureLocalStorage.getItem("token");
  const isOnline = useOnlineStatus();
  const { agentToken } = useAuth();
  const loginAgentToken = secureLocalStorage.getItem("agent-token");

  // useEffect(() => {
  //   if (!messaging) {
  //     console.error("Firebase Messaging is not supported in this browser.");
  //     return;
  //   }

  //   const unsubscribe = onMessage(messaging, (payload) => {
  //     // Invalidate cache for notifications stats
  //     queryClient.invalidateQueries(["user/notifications/stats"]);

  //     console.log(payload);

  //     if (payload?.notification?.body) {
  //     }
  //   });

  //   // Cleanup subscription on unmount
  //   return () => unsubscribe();
  // }, [queryClient]);

  useEffect(() => {
    let unsubscribe;
    let isUserInteracted = false;
    let queuedUtterance = null;

    const waitForVoices = () => {
      return new Promise((resolve) => {
        const voices = speechSynthesis.getVoices();
        if (voices.length) {
          resolve(voices);
        } else {
          speechSynthesis.onvoiceschanged = () => {
            resolve(speechSynthesis.getVoices());
          };
        }
      });
    };

    const tryToSpeak = (utterance) => {
      if (isUserInteracted) {
        speechSynthesis.speak(utterance);
      } else {
        queuedUtterance = utterance;
      }
    };

    const onUserInteraction = () => {
      isUserInteracted = true;

      if (queuedUtterance) {
        speechSynthesis.speak(queuedUtterance);
        queuedUtterance = null;
      }

      window.removeEventListener("mousemove", onUserInteraction);
    };

    window.addEventListener("mousemove", onUserInteraction);

    const setupMessaging = async () => {
      const voices = await waitForVoices();
      const messaging = await getMessagingInstance();

      if (!messaging) {
        console.error("Firebase Messaging is not supported in this browser.");
        return;
      }

      unsubscribe = onMessage(messaging, (payload) => {
        queryClient.invalidateQueries(["user/notifications/stats"]);

        const body = payload?.data?.speak;
        if (body) {
          const utterance = new SpeechSynthesisUtterance(body);
          utterance.lang = "en-US";
          utterance.rate = 0.7;

          const femaleVoice = voices.find(
            (voice) =>
              voice.lang.startsWith("en") &&
              /female|woman/.test(voice.name.toLowerCase())
          );

          if (femaleVoice) {
            utterance.voice = femaleVoice;
          }

          tryToSpeak(utterance);
        }
      });
    };

    setupMessaging();

    return () => {
      if (unsubscribe) unsubscribe();
      window.removeEventListener("mousemove", onUserInteraction);
    };
  }, []);

  if (isOnline === false) {
    return <NoInternet isOnline={isOnline} />;
  }

  return (
    <Box>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route
              path="/"
              element={
                process.env.NODE_ENV === "production" && !token ? (
                  <TestLogin />
                ) : (
                  <Home />
                )
              }
            />

            <Route path="/forget-password" element={<Home />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute token={agentToken || loginAgentToken}>
                  <DashboardHome />
                </ProtectedRoute>
              }
            >
              <Route
                path="/dashboard/operation-calendar"
                element={<OperationCalendar />}
              />
              <Route path="/dashboard/live" element={<DashStatistics />} />
              {/* <Route path="/dashboard/live" element={<DashLive />} /> */}
              <Route
                path="/dashboard/branchDashboard"
                element={<DashBranch />}
              />
              <Route path="/dashboard/searchs" element={<RecentSearch />} />
              {/* AirTickets Route */}
              <Route path="/dashboard/booking/airtickets">
                <Route index element={<AirTicket />} />
                <Route path=":id" element={<AirTicket />} />
                <Route path=":id/:bookingId" element={<BookingDetails />} />
                <Route
                  path=":id/:bookingId/:status"
                  element={<PostBookingOperations />}
                />
              </Route>
              <Route
                path="/dashboard/booking/air-tickets/partiallyDueTicket"
                element={<PartiallyDueTicket />}
              />
              {/* ancillaries Route */}
              <Route path="/dashboard/booking/ancillaries">
                <Route index element={<Ancillaries />} />
                <Route path=":id" element={<Ancillaries />} />
              </Route>
              <Route
                path="/dashboard/booking/allpnrimport/share-pnr-retrive"
                element={<SharePnrRetrive />}
              />
              <Route
                path="/dashboard/wingManagement/:id"
                element={<SingleWing />}
              />
              <Route path="/dashboard/wingManagement/status/:id">
                <Route index element={<WingManagement />} />
                <Route path=":access" element={<WingAccess />} />
              </Route>
              <Route
                path="/dashboard/wingmanagement/add-Branch"
                element={<AddBranch />}
              />
              <Route
                path="/dashboard/wingManagement/update-branch/:id"
                element={<AddBranch />}
              />
              <Route path="/dashboard/pendingOperation">
                <Route index element={<PendingOperation />} />
                <Route path=":id" element={<PendingOperation />} />
              </Route>
              <Route
                path="/dashboard/flightaftersearch"
                element={<OnewayAfterSearch />}
              />
              <Route
                path="/dashboard/split-after-search"
                element={<SplitAfterSearch />}
              />
              <Route path="/dashboard/deposits">
                <Route index element={<Deposit />} />
                <Route path=":id" element={<Deposit />} />
              </Route>
              <Route path="/dashboard/add-Deposit">
                <Route index element={<AddDeposit />} />
                <Route path=":id" element={<AddDeposit />} />
              </Route>
              <Route
                path="/dashboard/depositDetails"
                element={<DepositDetails />}
              />
              <Route
                path="/dashboard/balanceTransfer"
                element={<BalanceTransfer />}
              />
              <Route
                path="/dashboard/balanceTransfer/:id"
                element={<BalanceTransferDetails />}
              />
              <Route
                path="/dashboard/balanceTransfer/add"
                element={<AddBalanceTransfer />}
              />
              {/* Staff */}
              <Route
                path="/dashboard/staffmanagement/add-staff"
                element={<AddStaff />}
              />
              <Route
                path="/dashboard/staffmanagement/update-staff/:id"
                element={<AddStaff />}
              />
              <Route path="/dashboard/staffManagement">
                <Route index element={<StaffManagement />} />
                <Route path=":id" element={<StaffManagement />} />
                <Route path="staff-access/:id" element={<StaffAccess />} />
                <Route
                  path="staff-access/:id/:status"
                  element={<StaffOperations />}
                />
                {/* Added StaffAccess route */}
              </Route>
              <Route
                path="/dashboard/staffManagement/staffDetails"
                element={<StaffDetails />}
              />
              {/* Dashboard Settings */}
              <Route path="/dashboard/addSMTP" element={<AddSMTP />} />
              <Route
                path="/dashboard/emailConfiguration"
                element={<EmailConfiguration />}
              />
              <Route path="/dashboard/addMarkup" element={<AddMarkup />} />
              <Route
                path="/dashboard/markupSetting"
                element={<MarkupSetting />}
              />
              {/* Bank Account */}
              <Route path="/dashboard/bankAccount">
                <Route index element={<MyBankAccount />} />
                <Route path=":id" element={<MyBankAccount />} />
              </Route>
              <Route
                path="/dashboard/addBankAccount"
                element={<AddBankAccount />}
              />
              <Route path="/dashboard/salesreport" element={<SalesReport />} />
              <Route
                path="/dashboard/searchreport"
                element={<SearchHistoryReport />}
              />
              <Route path="/dashboard/generalreport">
                <Route index element={<GeneralReport />} />
                <Route path=":id" element={<GeneralReport />} />
              </Route>
              <Route
                path="/dashboard/companyProfile"
                element={<CompanyProfile />}
              />
              <Route path="/dashboard/userProfile" element={<UserProfile />} />
              <Route
                path="/dashboard/userProfile/profileConfig"
                element={<ProfileConfiguration />}
              />
              <Route
                path="/dashboard/twoFactorAuthentication"
                element={<Authentication />}
              />

              <Route path="/dashboard/addClient" element={<AddClient />} />
              <Route
                path="/dashboard/UniversalSearchBox"
                element={<UniversalSearchBox />}
              />
              <Route
                path="/dashboard/clientProfile"
                element={<ClientProfile />}
              >
                <Route path=":id" element={<ClientProfile />} />
              </Route>
              <Route path="/dashboard/activityLog" element={<ActivityLog />}>
                <Route path=":id" element={<ActivityLog />} />
                <Route path=":id/:selectedId" element={<ActivityLog />} />
              </Route>
              <Route path="/dashboard/airbooking" element={<AirBooking />} />
              {/* <Route
                path="/dashboard/airbooking/add-ancillaries"
                element={<AncillariesInfo />}
              /> */}
              {/* <Route path="/dashboard/airbooking/booking-information"> */}
              {/* <Route index element={<AirBooking/>} />
              <Route path="/dashboard/airbooking/add-ancillaries" element={<AncillariesInfo/>} />
              </Route> */}
              <Route
                path="/dashboard/search/hotelAfterSearch"
                element={<HotelAfterSearchPage />}
              />
              <Route
                path="/dashboard/search/hotelDetails"
                element={<HotelDetails />}
              />
              <Route
                path="/dashboard/search/visaAfterSearch"
                element={<VisaAfterSearchPage />}
              />
              <Route
                path="/dashboard/search/tourAfterSearch"
                element={<TourAfterSearchPage />}
              />
              <Route
                path="/dashboard/search/tourDetails"
                element={<TourDetails />}
              />
              <Route
                path="/dashboard/notice-details"
                element={<NoticeDetails />}
              />
              <Route path="/dashboard/support/:id" element={<Support />} />
              <Route
                path="/dashboard/support-chat-history"
                element={<SupportChatHistory />}
              />
              <Route
                path="/dashboard/otp-configurations"
                element={<OTPcontrol />}
              />
              <Route
                path="/dashboard/device-control"
                element={<DeviceControl />}
              />

              <Route path="/dashboard/*" element={<NotFoundPage />}></Route>
            </Route>
            <Route path="/payment-successfully" element={<PaymentSuccess />} />

            <Route path="/" element={<SecondLayout />}>
              <Route
                path="/terms-and-conditions"
                element={<TermsAndConditions />}
              />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route
                path="/refund-cancelation-policy"
                element={<RefundCancelationPolicy />}
              />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/wings" element={<Wings />} />
              <Route path="/our-coverage" element={<Coverage />} />
              <Route path="/payments-methods" element={<PaymentMethod />} />
              <Route path="/about-us" element={<Aboutus />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetails />} />
              <Route path="/news" element={<News />} />
              <Route path="/news/:slug" element={<NewsDetails />} />
              <Route path="/career" element={<Career />} />
              <Route path="/test" element={<Test />} />
            </Route>
            <Route path="/bkash-payment" element={<BkashPayment />} />
            <Route path="/logout" element={<Logout />}></Route>
            <Route path="*" element={<NotFoundPage to="/" replace />} />
          </Routes>
        </Suspense>
      </Router>
      {/* <CustomToast
        open={openToast}
        onClose={handleCloseToast}
        message={message}
        severity={severity}
        type="notification"
      /> */}
    </Box>
  );
}

export default App;
