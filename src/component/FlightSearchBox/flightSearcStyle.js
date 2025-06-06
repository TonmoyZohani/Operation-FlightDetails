export const styles = {
  dialogBox: {
    backgroundColor: "#FFF",
    padding: "5px 10px 15px 10px",
    overflow: "hidden",
    width: "300px",
    zIndex: "999",
    borderEndEndRadius: "5px",
    borderEndStartRadius: "5px",
  },
  boxContainer: {
    display: "flex",
    alignItems: "center",
    p: "5px",
    py: "15px",
    borderBottom: "1px solid #5D95D7",
    width: "100%",
  },
  boxContent: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    width: "65%",
  },
  counterContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "35%",
  },
  textContainer: {
    display: "flex",
    flexDirection: "column",
  },
  secondaryText: {
    color: "var(--secondary-color)",
    fontSize: "13px",
  },
  primaryText: {
    color: "var(--primary-color)",
    paddingTop: "6px",
  },
  icon: {
    fontSize: "22px",
    color: "#5D95D7",
  },
  counterIcon: {
    color: "var(--secondary-color)",
    cursor: "pointer",
  },
  counterIconActive: {
    color: "var(--secondary-color)",
    cursor: "pointer",
  },
  counterIconInactive: {
    color: "#5D95D7",
    cursor: "not-allowed",
  },
  button: {
    width: "100%",
    color: "white",
    textTransform: "none",
    backgroundColor: "var(--secondary-color)",
    marginTop: "15px",
  },
};

export const travelerStyles = {
  counterContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "36%",
  },
  icon: {
    fontSize: "26px",
    color: "#5D95D7",
  },
  counterIcon: {
    color: "var(--secondary-color)",
    cursor: "pointer",
  },
  counterIconActive: {
    color: "var(--secondary-color)",
    cursor: "pointer",
  },
  counterIconInactive: {
    color: "#5D95D7",
    cursor: "not-allowed",
  },
  button: {
    color: "white",
    textTransform: "none",
    backgroundColor: "var(--secondary-color)",
    marginTop: "15px",
  },
};

export const inputStyle = {
  width: "90%",
  height: "40px",
  borderRadius: "4px",
  outline: "none",
  border: "none",
  paddingLeft: "20px",
  position: "absolute",
  bottom: "-20px",
  backgroundColor: "var(--primary-color)",
  color: "white",
};

export const buttonClass = {
  width: "100%",
  height: "40px",
  borderRadius: "5px",
  bgcolor: "#FAFAFA",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  px: "6px",
  mt: "10px",
  typography: {
    fontSize: "12px",
    color: "var(--secondary-color)",
    fontWeight: "500",
  },
  typography2: {
    fontSize: "12px",
    color: "var(--primary-color)",
    fontWeight: "500",
  },
};
