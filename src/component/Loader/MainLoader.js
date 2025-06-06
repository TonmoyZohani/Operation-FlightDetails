import Lottie from "lottie-react";
import loaderFile from "../../assets/lottie/loaderFile.json";

const MainLoader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100%",
        width: "100%",
      }}
    >
      <Lottie
        animationData={loaderFile}
        loop={true}
        autoplay={true}
        style={{ height: 200 }}
      />
    </div>
  );
};

export default MainLoader;
