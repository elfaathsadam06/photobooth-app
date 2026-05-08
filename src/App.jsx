import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import html2canvas from "html2canvas";

import sticker from "./assets/star.png";
import shutterSound from "./assets/shutter.mp3";

import whiteFrame from "./assets/frames/white.png";
import blackFrame from "./assets/frames/black.png";
import kawaiiFrame from "./assets/frames/kawaii.png";
import retroFrame from "./assets/frames/retro.png";

function App() {
  const webcamRef = useRef(null);
  const stripRef = useRef(null);

  const [photos, setPhotos] = useState([]);
  const [countdown, setCountdown] = useState(null);
  const [currentShot, setCurrentShot] = useState(0);
  const [isCapturing, setIsCapturing] = useState(false);

  const [filter, setFilter] = useState("none");

  // FRAME DIPILIH SETELAH FOTO SELESAI
  const [selectedFrame, setSelectedFrame] =
    useState("white");

  const TOTAL_PHOTOS = 4;

  // =========================
  // FRAME CONFIG
  // =========================

  const frameData = {
    white: {
      image: whiteFrame,
      width: "260px",
      top: "26px",
      photoWidth: "170px",
      photoHeight: "130px",
      gap: "18px",
      rounded: "18px",
    },

    black: {
      image: blackFrame,
      width: "260px",
      top: "26px",
      photoWidth: "165px",
      photoHeight: "120px",
      gap: "22px",
      rounded: "6px",
    },

    kawaii: {
      image: kawaiiFrame,
      width: "260px",
      top: "32px",
      photoWidth: "165px",
      photoHeight: "125px",
      gap: "20px",
      rounded: "16px",
    },

    retro: {
      image: retroFrame,
      width: "260px",
      top: "30px",
      photoWidth: "160px",
      photoHeight: "118px",
      gap: "22px",
      rounded: "4px",
    },
  };

  const currentFrame = frameData[selectedFrame];

  // =========================
  // SHUTTER SOUND
  // =========================

  const playShutter = () => {
    const audio = new Audio(shutterSound);
    audio.play();
  };

  // =========================
  // START PHOTOBOOTH
  // =========================

  const startPhotobooth = () => {
    setPhotos([]);
    setCurrentShot(1);
    setIsCapturing(true);
    setCountdown(3);
  };

  // =========================
  // COUNTDOWN
  // =========================

  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      capturePhoto();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // =========================
  // CAPTURE PHOTO
  // =========================

  const capturePhoto = () => {
    playShutter();

    const imageSrc =
      webcamRef.current.getScreenshot();

    setPhotos((prev) => [...prev, imageSrc]);

    if (currentShot < TOTAL_PHOTOS) {
      setCurrentShot((prev) => prev + 1);
      setCountdown(3);
    } else {
      setCountdown(null);
      setIsCapturing(false);
    }
  };

  // =========================
  // DOWNLOAD
  // =========================

  const downloadStrip = async () => {
    const canvas = await html2canvas(
      stripRef.current
    );

    const link =
      document.createElement("a");

    link.download = "photostrip.png";
    link.href = canvas.toDataURL();

    link.click();
  };

  // =========================
  // FILTER
  // =========================

  const getFilterStyle = () => {
    switch (filter) {
      case "bw":
        return "grayscale(100%)";

      case "vintage":
        return "sepia(70%)";

      case "kawaii":
        return "brightness(110%) saturate(140%)";

      default:
        return "none";
    }
  };

  return (
    <div className="min-h-screen bg-pink-100 flex flex-col items-center p-4">

      {/* TITLE */}

      <h1 className="text-3xl md:text-5xl font-bold text-pink-600 mb-6 text-center">
        Korean Photobooth
      </h1>

      {/* FILTER */}

      <div className="flex gap-2 flex-wrap justify-center mb-4">

        <button
          onClick={() => setFilter("none")}
          className={`px-4 py-2 rounded-xl shadow ${
            filter === "none"
              ? "bg-pink-500 text-white"
              : "bg-white"
          }`}
        >
          Normal
        </button>

        <button
          onClick={() => setFilter("bw")}
          className={`px-4 py-2 rounded-xl shadow ${
            filter === "bw"
              ? "bg-pink-500 text-white"
              : "bg-white"
          }`}
        >
          B&W
        </button>

        <button
          onClick={() => setFilter("vintage")}
          className={`px-4 py-2 rounded-xl shadow ${
            filter === "vintage"
              ? "bg-pink-500 text-white"
              : "bg-white"
          }`}
        >
          Vintage
        </button>

        <button
          onClick={() => setFilter("kawaii")}
          className={`px-4 py-2 rounded-xl shadow ${
            filter === "kawaii"
              ? "bg-pink-500 text-white"
              : "bg-white"
          }`}
        >
          Kawaii
        </button>

      </div>

      {/* WEBCAM */}

      <div className="relative">

        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          className="w-[320px] md:w-[400px] rounded-3xl shadow-xl"
          style={{
            filter: getFilterStyle(),
          }}
        />

        {/* COUNTDOWN */}

        {countdown !== null && (

          <div className="absolute inset-0 flex items-center justify-center">

            <span className="text-white text-8xl font-bold drop-shadow-lg animate-pulse">
              {countdown}
            </span>

          </div>

        )}

      </div>

      {/* BUTTON */}

      <button
        onClick={startPhotobooth}
        disabled={isCapturing}
        className="mt-6 bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-2xl text-lg shadow-lg transition hover:scale-105"
      >
        {isCapturing
          ? `Taking ${currentShot}/${TOTAL_PHOTOS}`
          : "Start Photobooth"}
      </button>

      {/* FRAME PILIH SETELAH FOTO */}

      {photos.length === TOTAL_PHOTOS && (

        <div className="flex gap-2 flex-wrap justify-center mt-8">

          <button
            onClick={() => setSelectedFrame("white")}
            className={`px-4 py-2 rounded-xl shadow ${
              selectedFrame === "white"
                ? "bg-pink-500 text-white"
                : "bg-white"
            }`}
          >
            White
          </button>

          <button
            onClick={() => setSelectedFrame("black")}
            className={`px-4 py-2 rounded-xl shadow ${
              selectedFrame === "black"
                ? "bg-black text-white"
                : "bg-white"
            }`}
          >
            Black
          </button>

          <button
            onClick={() => setSelectedFrame("kawaii")}
            className={`px-4 py-2 rounded-xl shadow ${
              selectedFrame === "kawaii"
                ? "bg-yellow-400 text-white"
                : "bg-white"
            }`}
          >
            Kawaii
          </button>

          <button
            onClick={() => setSelectedFrame("retro")}
            className={`px-4 py-2 rounded-xl shadow ${
              selectedFrame === "retro"
                ? "bg-orange-500 text-white"
                : "bg-white"
            }`}
          >
            Retro
          </button>

        </div>

      )}

      {/* PHOTOSTRIP */}

      {photos.length > 0 && (

        <div
          ref={stripRef}
          className="relative mt-10"
          style={{
            width: currentFrame.width,
          }}
        >

          {/* PHOTO AREA */}

          <div
            className="
              absolute
              left-1/2
              -translate-x-1/2
              z-10
              flex
              flex-col
            "
            style={{
              top: currentFrame.top,
              gap: currentFrame.gap,
            }}
          >

            {photos.map((photo, index) => (

              <img
                key={index}
                src={photo}
                alt={`Photo ${index + 1}`}
                style={{
                  width:
                    currentFrame.photoWidth,
                  height:
                    currentFrame.photoHeight,
                  borderRadius:
                    currentFrame.rounded,
                  filter: getFilterStyle(),
                }}
                className="object-cover"
              />

            ))}

          </div>

          {/* FRAME */}

          <img
            src={currentFrame.image}
            alt="frame"
            className="
              relative
              z-20
              w-full
              pointer-events-none
              select-none
            "
          />

          {/* STICKER */}

          <img
            src={sticker}
            alt="sticker"
            className="
              absolute
              top-0
              right-0
              w-10
              z-30
            "
          />

        </div>

      )}

      {/* DOWNLOAD */}

      {photos.length === TOTAL_PHOTOS && (

        <button
          onClick={downloadStrip}
          className="mt-8 bg-black text-white px-6 py-3 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          Download Photostrip
        </button>

      )}

    </div>
  );
}

export default App;