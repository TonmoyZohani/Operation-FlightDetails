import { Box } from "@mui/material";

const MarqueeShow = () => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Box
        sx={{
          height: "35px",
          backgroundColor: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0px 10px 0px 33px",
          width: "100%",
          borderRadius: "3px",
        }}
      >
        {/* <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "2%",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="19"
            height="18"
            viewBox="0 0 19 18"
            fill="none"
          >
            <path
              d="M9.14673 0C4.13598 0 0.0742188 4.0293 0.0742188 9C0.0742188 13.9707 4.13598 18 9.14673 18C14.1575 18 18.2192 13.9707 18.2192 9C18.2192 4.0293 14.1575 0 9.14673 0ZM10.054 13.5H8.23948V11.7H10.054V13.5ZM10.054 9.9H8.23948L7.78586 4.5H10.5076L10.054 9.9Z"
              fill="var(--secondary-color)"
            />
          </svg>
        </Box> */}
        <marquee
          style={{
            fontSize: "13px",
            margin: "0",
            width: "100%",
          }}
        >
          প্রিয় ট্রেড পার্টনার, আমাদের সাথে হোয়াটসঅ্যাপ এ যোগাযোগ করতে উপরে
          থাকা হোয়াটসঅ্যাপ বাটনটিতে ক্লিক করুন, অথবা +৮৮০ ১৭৫৫ ৫৭২ ০৯৮ এবং +৮৮০
          ১৭৫৫ ৫৭২
        </marquee>
      </Box>
    </Box>
  );
};

export default MarqueeShow;
