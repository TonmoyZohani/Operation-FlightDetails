import Lottie from "lottie-react";
import scanFile from "../../assets/lottie/scanFile.json";

const FileUploadLoader = () => {
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
        animationData={scanFile}
        loop={true}
        autoplay={true}
        style={{ height: 200 }}
      />
    </div>
  );
};

export default FileUploadLoader;
