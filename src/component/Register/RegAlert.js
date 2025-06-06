import withReactContent from "sweetalert2-react-content";
import Lottie from "lottie-react";
import Swal from "sweetalert2";

import successFile from "../../assets/lottie/success.json";
import errorFile from "../../assets/lottie/error.json";
import warnFile from "../../assets/lottie/warn.json";
import { isMobile } from "../../shared/StaticData/Responsive";

const MySwal = withReactContent(Swal);

const RegAlert = ({
  success,
  message,
  title = "",
  alertFor = "",
  cancelBtnText,
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
          {title}
        </p>

        <p
          style={{
            margin: "0px",
            fontSize: "15px",
            textTransform: "capitalize",
            color: "#888888",
            lineHeight: isMobile ? "1rem" : "1.2rem",
          }}
          dangerouslySetInnerHTML={{ __html: message }}
        />
      </div>
    ),
    showCancelButton: alertFor === "partner" || alertFor === "delete",
    cancelButtonText: alertFor === "partner" ? cancelBtnText : "Cancel",
    confirmButtonText:
      alertFor === "partner" ? "Proceed to Next Step" : "Proceed",
    showConfirmButton: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    buttonsStyling: false,
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
        popup.style.maxWidth = "550px";
      }
    },
  });
};

export default RegAlert;
