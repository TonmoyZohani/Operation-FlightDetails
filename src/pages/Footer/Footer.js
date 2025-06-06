import LocationOnIcon from "@mui/icons-material/LocationOn";
import {
  Box,
  Button,
  Container,
  Grid,
  SwipeableDrawer,
  Typography,
} from "@mui/material";
import moment from "moment/moment";
import { useState } from "react";
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaLinkedin,
  FaWhatsappSquare,
  FaYoutubeSquare,
} from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import Subscribe from "../../component/Subscribe/Subscribe";
// import Logo from "../../images/svg/flyfarlogo.svg";
// import LogoBlack from "../../images/svg/logoblack.svg";
import Contact from "./../../component/Contact/Contact";
import "./Footer.css";
import useWindowSize from "../../shared/common/useWindowSize";
import { isMobile } from "../../shared/StaticData/Responsive";

const linkStyle = (isActive) => ({
  fontSize: "15px",
  color: isActive ? "#ABC8D2" : "var(--gray-3)",
});

const textSm = { fontSize: "15px", color: "white" };
const links = (isActive) => ({
  ...textSm,
  cursor: "pointer",
  mb: "6px",
  color: isActive ? "#ABC8D2" : "var(--gray-3)",
});

const linkTitle = {
  fontSize: "18px",
  color: "white",
  mb: 1,
  textDecoration: "none",
};

const socialIcon = (isActive) => ({
  fontSize: "27px",
  color: "#fff",
  marginRight: "2px",
  ...(isActive ? { fill: isActive && "var(--secondary-color)" } : {}),
});

const Footer = () => {
  const { pathname } = useLocation();
  const { isMobile } = useWindowSize();
  const [open, setOpen] = useState({ name: "" });
  const [openMap, setOpenMap] = useState(false);

  const forgetPassRoute = pathname === "/" || pathname === "/forget-password";
  const notHomeRoute = pathname !== "/";

  return (
    <Box sx={{ mt: { xs: "-150px", md: "0px", lg: "0px" } }}>
      <section className={forgetPassRoute ? "footer-bgs" : "footer-bgs-alter"}>
        <Container sx={{ px: { xs: 2 }, width: "90%", margin: "0 auto" }}>
          <SubscribeArea
            forgetPassRoute={forgetPassRoute}
            open={open}
            setOpen={setOpen}
          />
          <FooterLinks
            forgetPassRoute={forgetPassRoute}
            notHomeRoute={notHomeRoute}
            open={open}
            setOpen={setOpen}
            setOpenMap={setOpenMap}
          />

          <PaymentAndSocialArea
            forgetPassRoute={forgetPassRoute}
            notHomeRoute={notHomeRoute}
          />
        </Container>
      </section>

      <SwipeableDrawer
        anchor="right"
        open={open?.name === "subscribe"}
        PaperProps={{
          sx: { width: isMobile ? "100%" : "50%", zIndex: 999999999 },
        }}
      >
        {open?.name === "subscribe" && <Subscribe setOpen={setOpen} />}
      </SwipeableDrawer>

      <SwipeableDrawer
        anchor="right"
        open={open?.name === "contact"}
        PaperProps={{ sx: { width: "50%", zIndex: 999999999 } }}
      >
        {open?.name === "contact" && <Contact setOpen={setOpen} />}
      </SwipeableDrawer>

      {openMap && (
        <SwipeableDrawer
          anchor="right"
          open={openMap}
          onClose={() => setOpenMap(false)}
          PaperProps={{ sx: { width: "50%", zIndex: 999999999 } }}
        >
          <OfficeLocationMap />
        </SwipeableDrawer>
      )}
    </Box>
  );
};

const SubscribeArea = ({ forgetPassRoute, open, setOpen }) => {
  return (
    <Box pb={10} textAlign={"center"}>
      <Typography
        sx={{
          fontSize: { xs: "28px", md: "38px" },
          color: forgetPassRoute ? "#fff" : "var(--secondary-color)",
          lineHeight: "38px",
        }}
      >
        Never Miss a Great Deal Again – Subscribe Now!
      </Typography>
      <Typography
        sx={{
          fontSize: "14px",
          color: forgetPassRoute ? "#DBEAEF" : "var(--gray-3)",
          width: { xs: "70%", md: "50%" },
          margin: "0 auto",
          textAlign: "center",
          pt: 2,
          pb: 4,
        }}
      >
        Stay connected with the competitive OTA market and grow your business
        effortlessly with real-time offers and guaranteed lowest fares on air
        tickets, hotels, and tour packages. Subscribe now to stay ahead in the
        travel industry!
      </Typography>

      <Button
        onClick={() => setOpen({ ...open, name: "subscribe" })}
        sx={{
          bgcolor: "var(--primary-color)",
          fontSize: "12px",
          color: "white",
          width: "140px",
          ":hover": { bgcolor: "var(--primary-color)" },
        }}
      >
        SUBSCRIBE
      </Button>
    </Box>
  );
};

const FooterLinks = ({
  forgetPassRoute,
  open,
  setOpen,
  notHomeRoute,
  setOpenMap,
}) => {
  const supportEmail = "support@flyfarint.com";
  const body = "Hello,\n\nI need help with...";

  const handleSendMail = () => {
    const subject = "Support Request";

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      supportEmail
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, "_blank");
  };

  const handleSendWhatsAppMessage = () => {
    // const encodedMessage = encodeURIComponent(`${body}\n`);
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const url = isMobile
      ? `https://api.whatsapp.com/send?phone=${"880 1332 553 767"}`
      : `https://web.whatsapp.com/send?phone=${"880 1332 553 767"}`;

    window.open(url, "_blank");
  };

  return (
    <Box
      sx={{
        ml: { xs: "0.5rem", md: 0 },
        borderBottom: "1px solid",
        borderColor: notHomeRoute ? "var(--border)" : "#D9D9D926",
        pb: 2,
      }}
    >
      <Grid container spacing={"30px"}>
        {addressArr.map((address, i) => (
          <Grid key={i} item md={3.2} lg={3.6} sm={12} xs={12}>
            <Typography
              sx={{
                ...linkTitle,
                color: notHomeRoute ? "var(--secondary-color)" : "white",
                pb: "9px",
              }}
            >
              {address?.title}
            </Typography>

            <Box sx={{ ...needHelpStyle }}>
              <Typography sx={{ ...linkStyle(forgetPassRoute) }}>
                {address?.address}
              </Typography>
            </Box>

            <Box sx={{ ...needHelpStyle, mt: 3 }}>
              <Typography sx={{ ...linkStyle(forgetPassRoute) }}>
                Email :
              </Typography>
              <Typography
                onClick={() => handleSendMail(address?.email)}
                sx={{
                  ...linkStyle(forgetPassRoute),
                  textUnderlineOffset: "5px",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                {address?.email}
              </Typography>
            </Box>

            <Box sx={{ ...needHelpStyle }}>
              <Typography sx={{ ...linkStyle(forgetPassRoute) }}>
                Phone :
              </Typography>
              <Typography sx={{ ...linkStyle(forgetPassRoute) }}>
                {address?.phone}
              </Typography>
            </Box>

            {/* <Box sx={{ ...needHelpStyle }}>
              <Typography sx={{ ...linkStyle(forgetPassRoute) }}>
                Whatsapp :
              </Typography>

              <a
                href={`https://wa.me/+8801332553767`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...linkStyle(forgetPassRoute),
                  textUnderlineOffset: "5px",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                {address?.whatsapp}
              </a>
            </Box> */}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 2 }}>
              <Box className="icon">
                <a
                  href="https://www.facebook.com/FlyFarInternational/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaFacebookSquare style={{ ...socialIcon(notHomeRoute) }} />
                </a>
                <a
                  href="https://www.instagram.com/fly.far.international"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaInstagramSquare style={{ ...socialIcon(notHomeRoute) }} />
                </a>
                <a
                  href="https://www.linkedin.com/company/flyfarint/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaLinkedin style={{ ...socialIcon(notHomeRoute) }} />
                </a>

                <a
                  href="https://www.youtube.com/channel/UCSaTz2O-em86jMDXxkpJpGQ"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FaYoutubeSquare style={{ ...socialIcon(notHomeRoute) }} />
                </a>

                <span
                  style={{ cursor: "pointer" }}
                  onClick={handleSendWhatsAppMessage}
                >
                  <FaWhatsappSquare style={{ ...socialIcon(notHomeRoute) }} />
                </span>
              </Box>

              <Box
                onClick={() => setOpenMap(true)}
                sx={{ ...needHelpStyle, gap: "2px", cursor: "pointer" }}
              >
                <LocationOnIcon
                  sx={{
                    fontSize: { md: "20px" },
                    color: notHomeRoute ? "var(--secondary-color)" : "white",
                  }}
                />

                <Typography
                  sx={{
                    ...linkStyle(),
                    color: forgetPassRoute ? "#fff" : "var(--gray-3)",
                    textUnderlineOffset: "5px",
                    textDecoration: "underline",
                  }}
                >
                  View Map
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}

        <Grid
          item
          lg={2.1}
          md={2.1}
          sm={4}
          xs={6}
          sx={{ color: notHomeRoute ? "var(--gray-3)" : "white" }}
        >
          <Typography
            sx={{
              ...linkTitle,
              color: notHomeRoute ? "var(--secondary-color)" : "white",
              pb: "9px",
            }}
          >
            Company
          </Typography>
          <Link style={{ textDecoration: "none" }} to="/about-us">
            <Typography sx={{ ...links(forgetPassRoute) }}>About us</Typography>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/blog">
            <Typography sx={{ ...links(forgetPassRoute) }}>Blogs</Typography>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/news">
            <Typography sx={{ ...links(forgetPassRoute) }}>News</Typography>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/career">
            <Typography sx={{ ...links(forgetPassRoute) }}>Career</Typography>
          </Link>
        </Grid>
        <Grid item lg={2.1} md={2.1} sm={4} xs={6}>
          <Typography
            sx={{
              ...linkTitle,
              color: notHomeRoute ? "var(--secondary-color)" : "white",
              pb: "9px",
            }}
          >
            Polices
          </Typography>
          <Link style={{ textDecoration: "none" }} to="/terms-and-conditions">
            <Typography sx={{ ...links(forgetPassRoute) }}>
              Terms & Conditions
            </Typography>
          </Link>

          <Link style={{ textDecoration: "none" }} to="/privacy-policy">
            <Typography sx={{ ...links(forgetPassRoute) }}>
              Privacy Policy
            </Typography>
          </Link>

          <Link
            style={{ textDecoration: "none" }}
            to="/refund-cancelation-policy"
          >
            <Typography sx={{ ...links(forgetPassRoute) }}>
              Refund Policy
            </Typography>
          </Link>

          <Link style={{ textDecoration: "none" }} to="/">
            <Typography noWrap sx={{ ...links(forgetPassRoute) }}>
              Registration Guideline
            </Typography>
          </Link>
        </Grid>
        <Grid item lg={2.1} md={2.1} sm={4} xs={6}>
          <Typography
            sx={{
              ...linkTitle,
              color: notHomeRoute ? "var(--secondary-color)" : "white",
              pb: "9px",
            }}
          >
            Support
          </Typography>

          <Link style={{ textDecoration: "none" }} to="/our-coverage">
            <Typography sx={{ ...links(forgetPassRoute) }}>Coverage</Typography>
          </Link>

          <Typography
            onClick={() => setOpen({ ...open, name: "contact" })}
            sx={{ ...links(forgetPassRoute) }}
          >
            Contact US
          </Typography>

          <Link style={{ textDecoration: "none" }} to="/faq">
            <Typography sx={{ ...links(forgetPassRoute) }}>FAQ</Typography>
          </Link>
          <Link style={{ textDecoration: "none" }} to="/payments-methods">
            <Typography sx={{ ...links(forgetPassRoute) }}>
              Payment Methods
            </Typography>
          </Link>
        </Grid>

        <Grid item lg={2.1} md={2.1} sm={12} xs={6}>
          <Box>
            <Typography
              sx={{
                ...linkTitle,
                color: notHomeRoute ? "var(--secondary-color)" : "white",
              }}
            >
              We Accept
            </Typography>
            <img
              src={`https://storage.googleapis.com/erp-document-bucket/payment.png`}
              width="100%"
              alt="payments"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

const PaymentAndSocialArea = ({ forgetPassRoute, notHomeRoute }) => {
  return (
    <Box pt={3} pb={1} sx={{ ml: { xs: "0.5rem", md: 0 } }}>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Typography
          sx={{
            ...linkTitle,
            color: notHomeRoute ? "var(--secondary-color)" : "white",
          }}
        >
          Member & Certifications{" "}
        </Typography>
        <img
          src={
            isMobile
              ? "https://storage.googleapis.com/erp-document-bucket/certificationRes.png"
              : `https://storage.googleapis.com/erp-document-bucket/certificationfull.png`
          }
          style={{ width: isMobile && "100%" }}
          alt="certificates"
        />
      </Box>

      <Box
        mt={3}
        py={3}
        textAlign={"center"}
        sx={{
          borderTop: "1px solid",
          borderColor: notHomeRoute ? "var(--border)" : "#D9D9D926",
        }}
      >
        <Typography
          sx={{
            ...textSm,
            color: forgetPassRoute ? "#ABC8D2" : "var(--gray-3)",
          }}
        >
          © {moment(new Date()).format("YYYY")} Fly Far International. All
          rights reserved. Powered by {"  "}
          <Link
            to="https://flyfar.tech/"
            target="_blank"
            style={{
              color: forgetPassRoute ? "#ABC8D2" : "var(--gray-3)",
              textDecoration: "none",
              textUnderlineOffset: "4px",
            }}
          >
            Fly Far Tech
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

const OfficeLocationMap = () => {
  return (
    <div
      className="mapouter"
      style={{
        position: "relative",
        textAlign: "right",
        width: "100%",
        height: "100vh",
      }}
    >
      <div
        className="gmap_canvas"
        style={{
          overflow: "hidden",
          background: "none",
          width: "100%",
          height: "100vh",
        }}
      >
        <iframe
          width="500"
          height="450"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps/embed/v1/place?q=Fly%20Far%20International%2C%201229%2C%20Hazi%20Abdul%20Latif%20Mansion%2C%202nd%20Floor%2C%20Ka-9%2C%20Bashundhara%20Rd%2C%20Dhaka&key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8"
          title="Fly Far International Location"
        ></iframe>
      </div>
      {/* Optional attribution link below (hidden by default) */}
      <a
        href="https://norsumediagroup.com/embed-google-map-website-free"
        target="_blank"
        rel="noopener noreferrer"
        className="gme-generated-link"
        style={{ display: "none" }}
      >
        Embed Map on Website for Free
      </a>

      {/* Inline CSS as JSX-style objects */}
      <style>
        {`
    .mapouter {
      position: relative;
      text-align: right;
    }
    .gmap_canvas {
      overflow: hidden;
      background: none !important;
    }
    .gmap_canvas iframe {
      width: 100%;
      height: 100%;
    }
    .mapouter a {
      display: block;
      font-size: 0.85em;
      text-align: center;
      padding: 5px 0;
      color: #6c757d;
      text-decoration: none;
    }
    .gme-generated-link {
      display: none !important;
    }
  `}
      </style>
    </div>
  );
};

const addressArr = [
  {
    title: "Fly Far Head Office",
    address: `Ka-9/A, Haji Abdul Latif Mansion (2nd Floor), Bashundhara R/A, 1229 Dhaka, Bangladesh`,
    email: "support@flyfarint.com",
    phone: "+880 9666 721 921",
    whatsapp: "+880 1332 553 767",
  },
];

const needHelpStyle = {
  display: "flex",
  gap: 1,
  mb: 0.75,
};

export default Footer;
