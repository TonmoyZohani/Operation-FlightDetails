import withReactContent from "sweetalert2-react-content";
import Lottie from "lottie-react";
import Swal from "sweetalert2";
import successFile from "../../assets/lottie/success.json";
import errorFile from "../../assets/lottie/error.json";
import warnFile from "../../assets/lottie/warn.json";
import useWindowSize from "../../shared/common/useWindowSize";
import { isMobile } from "../../shared/StaticData/Responsive";

const MySwal = withReactContent(Swal);

const CustomAlert = ({
  success,
  message,
  title = "",
  bookingProps = {},
  alertFor = "",
  onClose = () => {},
}) => {
  return MySwal.fire({
    html: (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          borderRadius: "20px",
        }}
      >
        <Lottie
          animationData={
            success === true
              ? successFile
              : success === false
                ? errorFile
                : success === "warning"
                  ? warnFile
                  : null
          }
          loop={false}
          autoplay={true}
          style={{
            height: isMobile ? "50px" : "100px",
            maxWidth: "90%",
          }}
        />

        <p
          style={{
            margin: "0px",
            fontSize: "1.7rem",
            textTransform: "capitalize",
            color: success ? "var(--matt-black)" : "#dc143c",
            fontWeight: 500,
          }}
        >
          {success === "warning"
            ? alertFor === "fareUpsell"
              ? title
              : "Warning!"
            : title}
        </p>

        <p
          style={{
            margin: "0px",
            fontSize: alertFor === "booking" ? "14px" : "15px",
            textTransform: "capitalize",
            color: "#888888",
            lineHeight: isMobile ? "1rem" : "1.2rem",
          }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
        {/* <p
          style={{
            margin: "0px",
            fontSize: alertFor === "booking" ? "14px" : "15px",
            textTransform: "capitalize",
            color: "#888888",
            lineHeight: isMobile ? "1rem" : "1.2rem",
          }}
        >
          {message}
        </p> */}
        {alertFor === "booking" && (
          <p
            style={{
              fontSize: "1rem",
              textTransform: "capitalize",
              margin: "30px 0",
            }}
          >
            {success ? (
              <>
                Redirecting to Queue Details.
                <b style={{ color: "var(--primary-color)" }}> 05</b> seconds
                remaining.
              </>
            ) : (
              <>
                Redirecting to Search Page.{" "}
                <b style={{ color: "var(--primary-color)" }}> 05</b> seconds
                remaining.
              </>
            )}
          </p>
        )}

        {alertFor === "issueSplit" && (
          <p
            style={{
              fontSize: "1rem",
              textTransform: "capitalize",
              margin: "30px 0",
            }}
          >
            {success ? (
              <>
                Back to Queue Details.
                <b style={{ color: "var(--primary-color)" }}> 05</b> seconds
                remaining.
              </>
            ) : (
              <>
                Back to Queue Details.{" "}
                <b style={{ color: "var(--primary-color)" }}> 05</b> seconds
                remaining.
              </>
            )}
          </p>
        )}
      </div>
    ),
    showCancelButton: success === "warning",
    confirmButtonText:
      alertFor === "fareUpsell"
        ? "Proceed Booking"
        : alertFor === "ok"
          ? "Ok"
          : "Proceed",
    buttonsStyling: false,
    showConfirmButton: true,
    ...bookingProps,
    customClass: {
      popup: "custom-popup",
      confirmButton: "custom-confirm",
      cancelButton: "custom-cancel",
    },
    didOpen: () => {
      const popup = document.querySelector(".custom-popup");
      if (popup) {
        popup.style.backgroundColor = "white";
        popup.style.color = "#4d4b4b";
        popup.style.width = "90%";
        popup.style.maxWidth =
          alertFor === "fareUpsell" || alertFor === "registration"
            ? "600px"
            : "500px";
      }

      if (alertFor === "booking" || alertFor === "issueSplit") {
        popup.style.width = "600px";

        const b = Swal.getHtmlContainer().querySelector("b");
        let countdown = 5;
        const timerInterval = setInterval(() => {
          countdown -= 1;
          b.textContent = 0 + String(countdown);
          if (countdown <= 0) {
            clearInterval(timerInterval);
            Swal.close();
            onClose();
          }
        }, 1000);
      }
    },
  });
};

export default CustomAlert;
